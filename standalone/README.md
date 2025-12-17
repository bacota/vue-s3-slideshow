# S3 Image Gallery - Standalone Version

This is a standalone single-page application (SPA) that requires **no build tools, no Node.js, and no npm**. Simply open the `index.html` file in a web browser!

## Quick Start

1. **Download** the `index.html` file
2. **Open** it in any modern web browser (Chrome, Firefox, Safari, Edge)
3. The application will automatically fetch and display images from the S3 bucket `tabs.14strings.com`

That's it! No installation, no dependencies, no build process required.

## Features

- ✅ **Zero Dependencies**: Everything is self-contained in a single HTML file
- ✅ **No Build Required**: Open directly in browser
- ✅ **Modern Vue 3**: Uses Vue 3 from CDN for reactive UI
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **S3 Integration**: Fetches images and metadata from S3 bucket
- ✅ **Auto-play Mode**: Toggle automatic slideshow
- ✅ **Error Handling**: Graceful error messages and retry functionality

## Configuration

### Change S3 Bucket

To use a different S3 bucket, edit the JavaScript section in `index.html`:

```javascript
const BUCKET_NAME = 'your-bucket-name.example.com';
const BUCKET_URL = `https://${BUCKET_NAME}`;
```

### Enable Demo Mode

To test the application with sample images (useful when S3 is not accessible), set:

```javascript
const USE_DEMO_MODE = true;
```

### Adjust Auto-play Speed

To change the slideshow speed, modify:

```javascript
const AUTO_PLAY_DELAY = 3000; // Time in milliseconds
```

## Requirements

- Modern web browser with JavaScript enabled
- Internet connection (to load Vue from CDN and fetch images from S3)

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## How It Works

1. **Vue 3 from CDN**: Loads Vue.js directly from `unpkg.com`
2. **S3 Integration**: Makes HTTP requests to the public S3 bucket
3. **XML Parsing**: Parses the S3 bucket listing XML response
4. **Metadata Extraction**: Fetches object metadata using HEAD requests
5. **Reactive UI**: Uses Vue 3 Composition API for state management

## Deployment

### Option 1: Local File

Simply distribute the `index.html` file. Users can open it directly from their computer.

### Option 2: Web Server

Upload `index.html` to any web server or hosting service:

- **GitHub Pages**: Create a repository and push the file
- **Netlify**: Drag and drop the file
- **AWS S3**: Upload to an S3 bucket configured for static hosting
- **Any HTTP Server**: Apache, Nginx, etc.

### Option 3: Simple HTTP Server

For local testing:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if available)
npx http-server
```

Then open `http://localhost:8000` in your browser.

## Troubleshooting

### CORS Errors

If you see CORS errors, the S3 bucket needs to have CORS enabled. Contact the bucket owner to configure CORS policy.

### Images Not Loading

1. Check browser console for errors
2. Verify the S3 bucket is publicly accessible
3. Try enabling demo mode to test with sample images

### Blank Page

1. Ensure JavaScript is enabled in your browser
2. Check browser console for errors
3. Try opening in a different browser

## Customization

All styles are embedded in the `<style>` section. You can customize:

- Colors (search for `#646cff`, `#764ba2`, etc.)
- Layout dimensions (`.image-wrapper { height: 500px }`)
- Fonts and typography
- Animations and transitions

## Security Note

This application makes client-side requests to public S3 buckets. No credentials are required or exposed. All requests are made directly from the user's browser.

## License

MIT
