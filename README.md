# S3 Image Gallery - Vue Slideshow

A modern Vue.js application that fetches and displays images from a publicly accessible AWS S3 bucket in an interactive slideshow format.

## 🚀 Two Versions Available

### 1. **Standalone Version** (No Node.js Required) ⭐ RECOMMENDED
- **Location**: `standalone/index.html`
- **Requirements**: Just a web browser
- **Setup**: Open `index.html` in any browser
- **Perfect for**: Quick deployment, simple hosting, no build process

### 2. **Development Version** (With Build Tools)
- **Location**: Root directory
- **Requirements**: Node.js and npm
- **Setup**: `npm install` then `npm run dev`
- **Perfect for**: Custom development, advanced features, npm ecosystem

---

## Standalone Version (Zero Dependencies)

### Quick Start
1. Open `standalone/index.html` in your web browser
2. That's it! No installation needed.

### Features
- ✅ Single HTML file - no dependencies
- ✅ Works offline (after first load)
- ✅ Vue 3 loaded from CDN
- ✅ Full slideshow functionality

**See [standalone/README.md](standalone/README.md) for detailed documentation.**

---

## Development Version (Build Tools)

### Features

- 🖼️ **S3 Integration**: Fetches images directly from the `tabs.14strings.com` S3 bucket
- 📝 **Dynamic Captions**: Displays captions from S3 object metadata (`caption` key)
- 🎨 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🎬 **Auto-play Mode**: Toggle automatic slideshow playback
- 🖱️ **Navigation Controls**: Navigate using previous/next buttons or thumbnail navigation
- 🌓 **Dark/Light Mode**: Automatically adapts to system color scheme preference
- ⚠️ **Error Handling**: Gracefully handles missing images, metadata, and network errors

### Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next-generation frontend build tool

### Prerequisites

- Node.js (version 16 or higher)
- npm (version 8 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bacota/vue-s3-slideshow.git
cd vue-s3-slideshow
```

2. Install dependencies:
```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Build for Production

Create a production build:

```bash
npm run build
```

The optimized files will be generated in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Deployment

### Standalone Version

Simply upload `standalone/index.html` to:
- GitHub Pages
- Netlify (drag & drop)
- Any web server
- AWS S3 static hosting
- Or distribute as a file

### Development Version

#### Deploy to Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build the project:
```bash
npm run build
```

3. Deploy:
```bash
netlify deploy --prod --dir=dist
```

#### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel --prod
```

#### Deploy to GitHub Pages

1. Update `vite.config.js` to set the base path:
```js
export default defineConfig({
  plugins: [vue()],
  base: '/vue-s3-slideshow/'
})
```

2. Build the project:
```bash
npm run build
```

3. Deploy the `dist/` folder to GitHub Pages

#### Deploy to AWS S3 + CloudFront

1. Build the project:
```bash
npm run build
```

2. Upload the `dist/` folder contents to an S3 bucket configured for static website hosting

3. (Optional) Set up CloudFront distribution for CDN delivery

## Configuration

### Changing the S3 Bucket

**Standalone version:** Edit `standalone/index.html` and change:
```javascript
const BUCKET_NAME = 'your-bucket-name.example.com';
```

**Development version:** Edit `src/services/s3Service.js` and change:
```javascript
const BUCKET_NAME = 'your-bucket-name.example.com';
```

### Adjusting Auto-play Speed

**Standalone version:** Edit `standalone/index.html` and change:
```javascript
const AUTO_PLAY_DELAY = 3000; // Time in milliseconds
```

**Development version:** Edit `src/components/Slideshow.vue` and change:
```javascript
const AUTO_PLAY_DELAY = 3000; // Time in milliseconds
```

## Project Structure

```
vue-s3-slideshow/
├── standalone/           # Standalone single-file version
│   ├── index.html       # Complete SPA in one file
│   └── README.md        # Standalone documentation
├── src/                 # Development version source
│   ├── components/
│   │   └── Slideshow.vue
│   ├── services/
│   │   └── s3Service.js
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── public/              # Static assets
├── index.html           # HTML template (dev version)
├── package.json         # Project dependencies
├── vite.config.js       # Vite configuration
└── README.md            # This file
```

## How It Works

1. **Fetching Images**: Makes HTTP requests to fetch the S3 bucket listing
2. **Filtering**: Only files with image extensions (jpg, jpeg, png, gif, webp, bmp) are included
3. **Metadata Retrieval**: For each image, a HEAD request fetches the object metadata
4. **Caption Extraction**: The `caption` metadata key is used for image captions (falls back to filename if not available)
5. **Display**: Images are displayed in a responsive slideshow with navigation controls

## Error Handling

The application includes comprehensive error handling:

- **Network Errors**: Displays a retry button if the initial fetch fails
- **Missing Metadata**: Uses filename as fallback when caption metadata is unavailable
- **Image Load Errors**: Shows a placeholder image if an image fails to load
- **Empty Bucket**: Displays a friendly message when no images are found
- **CORS Errors**: Graceful error messages when bucket access is restricted

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

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on the GitHub repository.

