// Demo script to test the API endpoint with mock data
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 12001; // Using different port for demo

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Serve demo page at root (before static middleware)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'demo.html'));
});

app.use(express.static('public'));

// Mock API endpoint with sample data
app.post('/api/suggestions', async (req, res) => {
  try {
    const { latitude, longitude, locationName } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock suggestions based on general location
    const mockSuggestions = {
      food: [
        {
          name: "Local Artisan Bakery",
          description: "Fresh-baked breads, pastries, and coffee made with locally sourced ingredients.",
          reason: "Perfect spot for a morning coffee and pastry with authentic local flavors."
        },
        {
          name: "Riverside Seafood Grill",
          description: "Waterfront dining featuring fresh catch of the day and regional specialties.",
          reason: "Enjoy delicious seafood while taking in beautiful water views."
        },
        {
          name: "Mountain View Pizzeria",
          description: "Wood-fired pizzas with creative toppings and craft beer selection.",
          reason: "Great casual dining with friends and family in a cozy atmosphere."
        },
        {
          name: "Heritage Tea House",
          description: "Traditional tea service with homemade scones and local honey.",
          reason: "Experience local tea culture and relax in a peaceful setting."
        },
        {
          name: "Street Food Market",
          description: "Diverse food vendors offering international cuisine and local favorites.",
          reason: "Sample multiple cuisines in one location and discover new flavors."
        }
      ],
      tourist: [
        {
          name: "Historic Downtown District",
          description: "Charming cobblestone streets lined with 19th-century architecture and boutique shops.",
          reason: "Perfect for leisurely strolls and learning about local history."
        },
        {
          name: "Scenic Overlook Point",
          description: "Panoramic views of the surrounding landscape, especially beautiful at sunset.",
          reason: "Ideal spot for photography and taking in the natural beauty of the area."
        },
        {
          name: "Local Art Museum",
          description: "Features rotating exhibitions of regional artists and permanent historical collections.",
          reason: "Discover the cultural heritage and artistic talent of the region."
        },
        {
          name: "Botanical Gardens",
          description: "Beautifully maintained gardens showcasing native plants and seasonal displays.",
          reason: "Peaceful environment perfect for nature lovers and photography enthusiasts."
        },
        {
          name: "Heritage Walking Trail",
          description: "Self-guided trail highlighting significant historical landmarks and natural features.",
          reason: "Learn about local history while enjoying outdoor exercise and fresh air."
        }
      ],
      activities: [
        {
          name: "Kayak Rental Adventure",
          description: "Paddle through calm waters with equipment rental and basic instruction provided.",
          reason: "Great way to explore waterways and get some exercise while enjoying nature."
        },
        {
          name: "Local Brewery Tour",
          description: "Behind-the-scenes look at craft brewing process with tastings included.",
          reason: "Learn about local brewing traditions and sample unique craft beers."
        },
        {
          name: "Farmers Market Experience",
          description: "Weekly market featuring local produce, crafts, and live entertainment.",
          reason: "Support local vendors and discover fresh, seasonal products from the area."
        },
        {
          name: "Hiking Trail Network",
          description: "Well-marked trails of varying difficulty levels through scenic natural areas.",
          reason: "Perfect for outdoor enthusiasts looking to explore local wilderness."
        },
        {
          name: "Live Music Venue",
          description: "Intimate setting featuring local musicians and touring acts across various genres.",
          reason: "Experience the local music scene and discover new artists in a cozy atmosphere."
        }
      ],
      shopping: [
        {
          name: "Artisan Craft Market",
          description: "Local artisans selling handmade jewelry, pottery, textiles, and unique gifts.",
          reason: "Find one-of-a-kind items while supporting local craftspeople and artists."
        },
        {
          name: "Vintage Boutique District",
          description: "Collection of vintage clothing stores and antique shops in historic buildings.",
          reason: "Discover unique fashion pieces and collectibles with character and history."
        },
        {
          name: "Local Farmers Co-op",
          description: "Community-owned store featuring organic produce, local goods, and eco-friendly products.",
          reason: "Support sustainable practices while shopping for fresh, local products."
        },
        {
          name: "Bookstore & Coffee Corner",
          description: "Independent bookstore with rare finds, local authors, and cozy reading nooks.",
          reason: "Browse unique books while enjoying artisanal coffee in a literary atmosphere."
        }
      ],
      nightlife: [
        {
          name: "Rooftop Cocktail Lounge",
          description: "Sophisticated bar with craft cocktails and panoramic city views.",
          reason: "Perfect for evening drinks with friends while enjoying stunning sunset views."
        },
        {
          name: "Jazz & Blues Club",
          description: "Intimate venue featuring live jazz performances and classic cocktails.",
          reason: "Experience authentic live music in a classic, atmospheric setting."
        },
        {
          name: "Local Pub & Taphouse",
          description: "Friendly neighborhood pub with local beers, pub games, and community atmosphere.",
          reason: "Meet locals and enjoy regional craft beers in a welcoming environment."
        },
        {
          name: "Night Market Food Court",
          description: "Evening food market with diverse vendors, live music, and outdoor seating.",
          reason: "Sample various cuisines while enjoying the vibrant evening atmosphere."
        }
      ],
      family: [
        {
          name: "Adventure Playground",
          description: "Large playground with climbing structures, slides, and interactive play areas.",
          reason: "Safe, fun environment where kids can play and parents can relax."
        },
        {
          name: "Mini Golf & Ice Cream",
          description: "Family-friendly mini golf course with themed holes and ice cream parlor.",
          reason: "Classic family fun activity that everyone can enjoy together."
        },
        {
          name: "Children's Discovery Center",
          description: "Interactive museum with hands-on exhibits designed for curious young minds.",
          reason: "Educational entertainment that makes learning fun for kids of all ages."
        },
        {
          name: "Family Bike Trail",
          description: "Safe, paved trail perfect for family cycling with bike rental available.",
          reason: "Healthy outdoor activity that families can enjoy together at their own pace."
        }
      ]
    };

    res.json({
      success: true,
      location: {
        latitude,
        longitude,
        name: locationName || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
      },
      suggestions: mockSuggestions
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
  res.json({ status: 'OK (Demo Mode)', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Demo server running on port ${PORT}`);
  console.log(`Access the demo at: http://localhost:${PORT}`);
});