# The Faux Critic - Complete Clean Installation

A conceptual art website that generates absurdist institutional critiques for uploaded images, featuring AI-powered image analysis, automatic auctions, 3D gallery views, and art market simulation.

## 📦 Complete File List

This package contains everything you need:

```
faux-critic-clean/
├── app.js              # Main React application (70KB)
├── stylegallery.css    # All styles (17KB)
├── server.js           # Express backend API (2.9KB)
├── index.html          # HTML entry point (659 bytes)
├── package.json        # Node dependencies (272 bytes)
├── archive.json        # Empty archive file (auto-generated)
└── README.md           # This file
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

### 3. Open in Browser
Navigate to: `http://localhost:3000`

## 📋 Dependencies

```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5"
}
```

## 🎨 Features

### Core Features
- **AI Image Analysis**: Upload any image → Claude Vision API analyzes it → generates contextually relevant pretentious critique
- **3D Gallery View**: Perspective gallery with three walls (left, back, right)
- **Archive System**: Save artworks to permanent collection
- **Auction System**: List works for automatic bidding with fake AI bidders
- **Art Market**: Purchase replacement artworks with dynamic pricing
- **Sell/Swap System**: Manage purchased art with market valuation

### Technical Details
- React 18 (via CDN)
- Babel standalone for JSX transpilation
- Express backend with file-based storage
- Claude Sonnet 4 API for image analysis
- No database required (JSON file storage)

## 🔧 API Configuration

The app uses the Anthropic API for image analysis. The API endpoint is configured in `app.js`:

```javascript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [...]
  })
});
```

**Note**: API authentication is handled on the backend in the Claude.ai environment. For local development, you'll need to add your own API key handling.

## 📁 File Descriptions

### app.js (70KB)
Complete React application with all features:
- Image upload and drag-drop
- AI-powered critique generation
- Archive management (grid + gallery views)
- Auction system with automatic bidding
- Art market with 20 artworks
- Purchased art management with sell/swap
- Dynamic market valuation system

### stylegallery.css (17KB)
Clean, minimal gallery aesthetic:
- Responsive design
- 3D perspective gallery
- Modal overlays
- Animation keyframes
- Mobile-friendly breakpoints

### server.js (2.9KB)
Express API with endpoints:
- `GET /api/archive` - Load all archived works
- `POST /api/archive` - Save new work
- `DELETE /api/archive/:id` - Delete specific work
- `DELETE /api/archive/clear` - Clear entire archive

### index.html (659 bytes)
Minimal HTML with:
- React 18 CDN
- Babel standalone for JSX
- CSS and JS includes
- Single root div

### package.json (272 bytes)
Node dependencies and scripts:
- `npm start` - Start server
- Express + CORS

### archive.json (auto-generated)
JSON array storing archived artworks:
```json
[
  {
    "id": "1234567890",
    "timestamp": "2024-12-03T...",
    "image": "data:image/jpeg;base64,...",
    "critique": { title, artist, year, medium, ... }
  }
]
```

## 🎮 Usage Flow

1. **Upload Image** → AI analyzes → generates critique
2. **Save to Archive** → appears on gallery wall
3. **Select Works** → configure auction prices
4. **Run Auction** → fake bidders place bids automatically
5. **View Summary** → see total revenue
6. **Empty Slots** → click + icon to open art market
7. **Purchase Art** → fills empty slot
8. **Manage Collection** → click purchased art to sell/swap

## 🏗️ Architecture

### Frontend (React)
- State management with hooks
- Component-based UI
- Babel transpilation in browser
- No build step required

### Backend (Express)
- RESTful API
- File-based storage
- CORS enabled
- Static file serving

### Storage
- JSON file for persistence
- Base64 image encoding
- Automatic cleanup (max 1000 entries)

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port 3000 is in use
lsof -i :3000

# Use different port
PORT=3001 npm start
```

### Archive not loading
- Check `archive.json` exists and contains valid JSON
- Default: empty array `[]`
- Server creates it automatically if missing

### Images not displaying
- Check base64 encoding is complete
- Verify image size < 50MB (server limit)
- Check browser console for errors

### API errors
- Ensure API endpoint is accessible
- Check CORS configuration
- Verify request/response format

## 📝 Notes

- **No Build Step**: Uses CDN React + Babel standalone
- **No Database**: JSON file storage for simplicity
- **API Key**: Handled by Claude.ai backend (for local dev, add your own)
- **File Size**: Keep images reasonable (<10MB recommended)
- **Browser Support**: Modern browsers with ES6+ support

## 🎯 Key Functions

### AI Image Analysis
```javascript
generateRandomCritique(imageData)
```
Sends image to Claude Vision API, returns contextual critique.

### Market Valuation
```javascript
calculateArtworkValue(artPiece)
```
Calculates resale value based on artist prestige (0.8x - 1.8x multiplier).

### Archive Management
```javascript
loadArchive()        // Syncs gallery walls with archive
saveToArchive()      // Saves and redirects to gallery
```

### Auction System
```javascript
startAuction()       // Begins automatic bidding
generateBid()        // Creates fake bidder names and bids
```

## 📄 License

This is a conceptual art project. Use freely.

## 🤝 Contributing

This is a complete working version. Fork and modify as needed.

## 🔗 Links

- Original concept: Architecture thesis "The Live Image"
- Framework: React 18
- API: Anthropic Claude Sonnet 4
- Deployment: Railway (production) / Local (development)

---

**Version**: 1.0.0  
**Last Updated**: December 3, 2024  
**Status**: Production Ready ✅
