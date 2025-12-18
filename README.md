# S3 Image Gallery - Slideshow

A simple JavaScript application that fetches and displays images from a publicly accessible AWS S3 bucket in an interactive slideshow format.

## Features

- 🖼️ **S3 Integration**: Fetches images directly from the `tabs.14strings.com` S3 bucket
- 📝 **Dynamic Captions**: Displays captions from S3 object metadata (`caption` key)
- 🎨 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🎬 **Auto-play Mode**: Toggle automatic slideshow playback
- 🖱️ **Navigation Controls**: Navigate using previous/next buttons or thumbnail navigation
- 🌓 **Dark/Light Mode**: Automatically adapts to system color scheme preference
- ⚠️ **Error Handling**: Gracefully handles missing images, metadata, and network errors
- ✅ **Zero Dependencies**: Pure vanilla JavaScript - no frameworks, no build tools

## Quick Start

1. **Clone the repository**:
```bash
git clone https://github.com/bacota/vue-s3-slideshow.git
cd vue-s3-slideshow
```

2. **Open in browser**:
   - Simply open `index.html` in your web browser
   - Or serve with any HTTP server:
     ```bash
     # Python 3
     python3 -m http.server 8000
     
     # Python 2
     python -m SimpleHTTPServer 8000
     
     # Node.js (if available)
     npx http-server
     ```

That's it! No build process, no dependencies to install.

## Project Structure

```
vue-s3-slideshow/
├── index.html          # Main HTML file with embedded styles
├── app.js              # All application logic in a single file
├── README.md           # This file
└── .gitignore          # Git ignore rules
```

## Configuration

All configuration is done in `app.js`:

### Change S3 Bucket

Edit the `BUCKET_NAME` constant in `app.js`:

```javascript
const BUCKET_NAME = 'your-bucket-name.example.com';
```

### Change S3 Folder

Edit the `S3_FOLDER` constant in `app.js` to read images from a specific folder:

```javascript
const S3_FOLDER = 'roster'; // Default: reads from 'roster' folder
```

### Adjust Auto-play Speed

Edit the `AUTO_PLAY_DELAY` constant in `app.js`:

```javascript
const AUTO_PLAY_DELAY = 3000; // Time in milliseconds
```

### Enable Demo Mode

For testing without S3 access, set `USE_DEMO_MODE` to `true` in `app.js`:

```javascript
const USE_DEMO_MODE = true;
```

This will load sample images from Unsplash instead of the S3 bucket.

## How It Works

1. **Direct HTTP Requests**: Uses the Fetch API to access the public S3 bucket
2. **ListObjectsV2 API**: Uses S3 ListObjectsV2 API with `prefix` parameter to efficiently query only the `roster` folder
3. **XML Parsing**: Parses S3 bucket listing XML responses using DOMParser
4. **Metadata Extraction**: Fetches object metadata using HEAD requests for the `x-amz-meta-caption` header
5. **Image Filtering**: Only includes files with image extensions (jpg, jpeg, png, gif, webp, bmp)
6. **Vanilla JavaScript**: Pure DOM manipulation for rendering, no frameworks needed

## Deployment

### Static Hosting

Upload both `index.html` and `app.js` to any static hosting service:

- **GitHub Pages**: Push to a gh-pages branch
- **Netlify**: Drag and drop both files
- **Vercel**: Deploy the repository
- **AWS S3**: Upload to a bucket configured for static website hosting
- **Any web server**: Apache, Nginx, etc.

### Local File

You can also distribute both files together - users can open `index.html` directly from their computer (though some browsers may restrict local file access for security).

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## S3 Bucket Requirements

For the application to work properly, the S3 bucket must:

1. **Allow public read access** to objects
2. **Enable bucket listing** (ListBucket permission)
3. **Have CORS enabled** with appropriate headers:

```xml
<CORSConfiguration>
  <CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
  </CORSRule>
</CORSConfiguration>
```

4. **Objects should have caption metadata** (optional):
   - Metadata key: `caption`
   - Example: `x-amz-meta-caption: "Beautiful sunset over the ocean"`

## Error Handling

The application includes comprehensive error handling:

- **Network Errors**: Displays a retry button if the initial fetch fails
- **Missing Metadata**: Uses filename as fallback when caption metadata is unavailable
- **Image Load Errors**: Shows a placeholder image if an image fails to load
- **Empty Bucket**: Displays a friendly message when no images are found
- **CORS Errors**: Graceful error messages when bucket access is restricted

## Customization

### Styling

All styles are embedded in the `<style>` section of `index.html`. You can customize:

- Colors (search for `#646cff`, `#764ba2`, etc.)
- Layout dimensions (`.image-wrapper { height: 500px }`)
- Fonts and typography
- Animations and transitions

### Functionality

All JavaScript logic is in `app.js`. The code is organized into sections:

- **Configuration**: Constants for bucket name, demo mode, etc.
- **State Management**: Simple object to track application state
- **S3 Service Functions**: Functions to fetch images and metadata
- **UI Functions**: Rendering and DOM manipulation
- **Action Functions**: Event handlers for user interactions

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on the GitHub repository.


