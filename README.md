# 🌍 Local Activity Finder

A location-based web application that detects your location and suggests fun activities categorized by **Food & Dining**, **Tourist Places**, and **Activities** using OpenAI's GPT API.

![Demo](https://img.shields.io/badge/Demo-Available-green)
![Node.js](https://img.shields.io/badge/Node.js-18+-blue)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5--turbo-orange)

## ✨ Features

- 📍 **Automatic Location Detection** - Uses browser geolocation API
- 🤖 **AI-Powered Suggestions** - OpenAI GPT-3.5-turbo generates personalized recommendations
- 🍽️ **Food & Dining** - Restaurants, cafes, and local cuisine
- 🏛️ **Tourist Places** - Attractions, landmarks, and points of interest
- 🎯 **Activities** - Entertainment, outdoor activities, and experiences
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🎭 **Demo Mode** - Try the app with sample data without API setup

## 🚀 Quick Start

### Option 1: Demo Mode (No Setup Required)
```bash
npm install
npm run demo
```
Visit: http://localhost:12001

### Option 2: Full Version (Requires OpenAI API Key)
```bash
npm install
node setup.js  # Interactive setup for OpenAI API key
npm start
```
Visit: http://localhost:12000

## 📋 Prerequisites

- Node.js 18 or higher
- OpenAI API account (for full version)
- Modern web browser with geolocation support

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd local-activity-finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Choose your setup:**

   **For Demo Mode:**
   ```bash
   npm run demo
   ```

   **For Full Version:**
   ```bash
   node setup.js
   npm start
   ```

## ⚙️ Configuration

### OpenAI API Setup

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Run the interactive setup:
   ```bash
   node setup.js
   ```
3. Or manually create `.env` file:
   ```env
   OPENAI_API_KEY=your_api_key_here
   ```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes (for full version) |
| `PORT` | Server port (default: 12000) | No |

## 🎯 Usage

1. **Open the application** in your web browser
2. **Allow location access** when prompted
3. **Browse categories** using the tab buttons
4. **Get new suggestions** using the refresh button
5. **Explore recommendations** tailored to your location

## 📁 Project Structure

```
local-activity-finder/
├── server.js          # Main Express server with OpenAI integration
├── demo.js            # Demo server with mock data
├── setup.js           # Interactive OpenAI API key setup
├── test-setup.js      # Setup verification script
├── public/            # Frontend files
│   ├── index.html     # Main application
│   ├── demo.html      # Demo version
│   ├── styles.css     # Styling
│   ├── script.js      # Main JavaScript
│   └── demo-script.js # Demo JavaScript
├── package.json       # Dependencies and scripts
├── .env.example       # Environment template
└── README.md          # This file
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server (port 12000) |
| `npm run demo` | Start demo server (port 12001) |
| `npm run dev` | Start development server with auto-reload |
| `npm run test-setup` | Verify setup and configuration |

## 🌐 API Endpoints

### Production Server (port 12000)
- `GET /` - Main application
- `GET /api/health` - Health check
- `POST /api/suggestions` - Get AI-powered suggestions

### Demo Server (port 12001)
- `GET /` - Demo application
- `GET /api/health` - Health check (demo mode)
- `POST /api/suggestions` - Get mock suggestions

## 🎨 Customization

### Adding New Categories
1. Update the category buttons in `public/index.html`
2. Add corresponding icons and styling in `public/styles.css`
3. Update the suggestion logic in `server.js`

### Modifying AI Prompts
Edit the prompt templates in `server.js` to customize the AI responses:
```javascript
const prompt = `Find 5 ${category} recommendations near ${location}...`;
```

## 🐛 Troubleshooting

### Common Issues

**"Location access denied"**
- Enable location services in your browser
- Try the demo version which uses fallback location

**"OpenAI API quota exceeded"**
- Check your OpenAI account billing
- Use demo mode while setting up billing

**"Port already in use"**
- Kill existing processes: `pkill -f node`
- Use different port: `PORT=3001 npm start`

### Getting Help

1. Run `npm run test-setup` to diagnose issues
2. Use demo mode to test functionality without API setup
3. Check your OpenAI account billing status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **OpenAI** for the GPT-3.5-turbo API
- **Font Awesome** for the beautiful icons
- **OpenHands** for development assistance

---