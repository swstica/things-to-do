const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 12000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to get location-based suggestions
app.post('/api/suggestions', async (req, res) => {
  try {
    const { latitude, longitude, locationName } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // Create a prompt for OpenAI
    const prompt = `I'm currently at coordinates ${latitude}, ${longitude}${locationName ? ` (${locationName})` : ''}. 

Please suggest fun things to do in this area and categorize them into exactly these three categories:
1. Food & Dining
2. Tourist Places & Attractions  
3. Activities & Entertainment

For each category, provide 5-7 specific suggestions with:
- Name of the place/activity
- Brief description (1-2 sentences)
- Why it's worth visiting/doing

Format your response as a JSON object with this exact structure:
{
  "food": [
    {
      "name": "Restaurant/Food Place Name",
      "description": "Brief description of what makes this place special",
      "reason": "Why you should visit"
    }
  ],
  "tourist": [
    {
      "name": "Tourist Attraction Name", 
      "description": "Brief description of the attraction",
      "reason": "Why it's worth visiting"
    }
  ],
  "activities": [
    {
      "name": "Activity Name",
      "description": "Brief description of the activity", 
      "reason": "Why you should try it"
    }
  ]
}

Please ensure the response is valid JSON and focuses on places/activities that are actually accessible from the given coordinates.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful local guide who knows about interesting places and activities around any location. Always respond with valid JSON in the exact format requested."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const responseText = completion.choices[0].message.content;
    
    // Try to parse the JSON response
    let suggestions;
    try {
      suggestions = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      // Fallback response if JSON parsing fails
      suggestions = {
        food: [
          {
            name: "Local Restaurant Discovery",
            description: "Explore nearby restaurants and cafes in your area",
            reason: "Great way to taste local cuisine and discover hidden gems"
          }
        ],
        tourist: [
          {
            name: "Area Exploration",
            description: "Discover local landmarks and points of interest",
            reason: "Learn about the history and culture of your location"
          }
        ],
        activities: [
          {
            name: "Local Activities",
            description: "Find fun things to do in your current area",
            reason: "Make the most of your time and discover new experiences"
          }
        ]
      };
    }

    res.json({
      success: true,
      location: {
        latitude,
        longitude,
        name: locationName
      },
      suggestions
    });

  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({ 
      error: 'Failed to get suggestions',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access the app at: http://localhost:${PORT}`);
});