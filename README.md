# S3 Image Gallery - Slideshow

A modern JavaScript application built with Vite that fetches and displays images from a publicly accessible AWS S3 bucket in an interactive slideshow format. Features tree shaking optimization for minimal bundle size.

## Features

- 🖼️ **S3 Integration**: Fetches images directly from the `tabs.14strings.com/roster` S3 folder
- 📝 **Dynamic Captions**: Displays captions from S3 object metadata (`caption` key)
- 🎨 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🎬 **Auto-play Mode**: Toggle automatic slideshow playback
- 🖱️ **Navigation Controls**: Navigate using previous/next buttons or thumbnail navigation
- 🌓 **Dark/Light Mode**: Automatically adapts to system color scheme preference
- ⚠️ **Error Handling**: Gracefully handles missing images, metadata, and network errors
- ⚡ **Optimized Build**: Uses Vite with tree shaking for minimal bundle size
- 🔒 **Secure**: HTML escaping to prevent XSS vulnerabilities

## Tech Stack

- **Vite** - Next-generation frontend build tool with tree shaking
- **AWS SDK for JavaScript v3** - Official AWS SDK for S3 operations
- **ES Modules** - Modern JavaScript module system
- **Vanilla JavaScript** - No frameworks, pure JavaScript

## Prerequisites

- Node.js (version 16 or higher)
- npm (version 8 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/bacota/vue-s3-slideshow.git
cd vue-s3-slideshow
```

2. Install dependencies:
```bash
npm install
```

## Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

## Build for Production

Create an optimized production build with tree shaking:

```bash
npm run build
```

The optimized files will be generated in the `dist/` directory. The build process:
- Minifies JavaScript using esbuild
- Applies tree shaking to remove unused code
- Splits code into optimized chunks (s3-service, ui)
- Generates compressed assets with gzip estimation

## Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
vue-s3-slideshow/
├── src/
│   ├── config.js              # Configuration constants
│   ├── main.js                # Application entry point
│   ├── services/
│   │   └── s3Service.js       # S3 API integration
│   ├── ui/
│   │   ├── renderer.js        # UI rendering logic
│   │   └── state.js           # State management
│   └── utils/
│       └── helpers.js         # Utility functions
├── index.html                 # HTML template
├── vite.config.js             # Vite configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## Configuration

### Change S3 Bucket

Edit `src/config.js`:

```javascript
export const BUCKET_NAME = 'your-bucket-name.example.com';
```

### Change S3 Folder

Edit `src/config.js`:

```javascript
export const S3_FOLDER = 'your-folder-name';
```

### Adjust Auto-play Speed

Edit `src/config.js`:

```javascript
export const AUTO_PLAY_DELAY = 5000; // Time in milliseconds
```

### Enable Demo Mode

For testing without S3 access, edit `src/config.js`:

```javascript
export const USE_DEMO_MODE = true;
```

## How It Works

1. **Vite Build System**: Uses Vite for fast development and optimized production builds
2. **AWS SDK Integration**: Uses official AWS SDK for JavaScript v3 to interact with S3
3. **ListObjectsV2Command**: Makes ListObjectsV2 API calls with `Prefix` parameter for server-side filtering
4. **Tree Shaking**: Automatically removes unused AWS SDK code for smaller bundles
5. **Code Splitting**: Separates code into chunks (s3-service with AWS SDK, ui) for efficient loading
6. **ES Modules**: Modern module system with named exports/imports
7. **Metadata Extraction**: Uses HeadObjectCommand to fetch object metadata with fallback to HTTP HEAD requests
8. **Image Filtering**: Only includes files with image extensions

## Deployment

### Build the Project

```bash
npm run build
```

### Deploy Options

#### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### GitHub Pages

1. Build the project: `npm run build`
2. Deploy the `dist/` folder to GitHub Pages

#### AWS S3 + CloudFront

1. Build the project: `npm run build`
2. Upload `dist/` contents to an S3 bucket configured for static website hosting
3. (Optional) Set up CloudFront distribution

## Performance

The optimized build provides:
- **AWS SDK Tree Shaking**: Vite automatically removes unused AWS SDK modules
- **Code Splitting**: Separates AWS SDK into dedicated chunk for efficient loading
- **Minification**: Reduces file size with esbuild
- **Server-side Filtering**: AWS SDK ListObjectsV2Command with Prefix parameter
- **Bundle Size**: ~215KB for S3 service (including AWS SDK), ~7KB for UI components (total gzipped: ~68KB)

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## S3 Bucket Requirements

For the application to work properly, the S3 bucket must:

1. **Allow public read access** to objects
2. **Enable bucket listing** (ListBucket permission)
3. **Have CORS enabled** with appropriate headers

## Security

✅ HTML escaping implemented for all user-controlled content
✅ XSS prevention using `escapeHtml()` helper function
✅ No sensitive credentials in code
✅ Uses public HTTP requests only

## License

MIT
