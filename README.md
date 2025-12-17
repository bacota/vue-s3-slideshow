# S3 Image Gallery - Vue Slideshow

A modern Vue.js application that fetches and displays images from a publicly accessible AWS S3 bucket in an interactive slideshow format.

## Features

- 🖼️ **S3 Integration**: Fetches images directly from the `tabs.14strings.com` S3 bucket
- 📝 **Dynamic Captions**: Displays captions from S3 object metadata (`caption` key)
- 🎨 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🎬 **Auto-play Mode**: Toggle automatic slideshow playback
- 🖱️ **Navigation Controls**: Navigate using previous/next buttons or thumbnail navigation
- 🌓 **Dark/Light Mode**: Automatically adapts to system color scheme preference
- ⚠️ **Error Handling**: Gracefully handles missing images, metadata, and network errors

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next-generation frontend build tool
- **AWS SDK for JavaScript (v3)** - S3 client for fetching images and metadata

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

Create a production build:

```bash
npm run build
```

The optimized files will be generated in the `dist/` directory.

## Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Deployment

### Deploy to Netlify

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

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel --prod
```

### Deploy to GitHub Pages

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

3. Deploy the `dist/` folder to GitHub Pages using your preferred method (GitHub Actions, manual push, etc.)

### Deploy to AWS S3 + CloudFront

1. Build the project:
```bash
npm run build
```

2. Upload the `dist/` folder contents to an S3 bucket configured for static website hosting

3. (Optional) Set up CloudFront distribution for CDN delivery

## Configuration

### Changing the S3 Bucket

To use a different S3 bucket, update the `BUCKET_NAME` constant in `src/services/s3Service.js`:

```javascript
const BUCKET_NAME = 'your-bucket-name.example.com';
```

### Adjusting Auto-play Speed

To change the slideshow auto-play interval, modify the `AUTO_PLAY_DELAY` constant in `src/components/Slideshow.vue`:

```javascript
const AUTO_PLAY_DELAY = 3000; // Time in milliseconds
```

## Project Structure

```
vue-s3-slideshow/
├── public/               # Static assets
├── src/
│   ├── components/
│   │   └── Slideshow.vue # Main slideshow component
│   ├── services/
│   │   └── s3Service.js  # S3 integration service
│   ├── App.vue           # Root component
│   ├── main.js           # Application entry point
│   └── style.css         # Global styles
├── index.html            # HTML template
├── package.json          # Project dependencies
├── vite.config.js        # Vite configuration
└── README.md             # This file
```

## How It Works

1. **Fetching Images**: The application uses the AWS SDK for JavaScript to make a `ListObjectsV2` request to the S3 bucket
2. **Filtering**: Only files with image extensions (jpg, jpeg, png, gif, webp, bmp) are included
3. **Metadata Retrieval**: For each image, a `HeadObject` request fetches the object metadata
4. **Caption Extraction**: The `caption` metadata key is used for image captions (falls back to filename if not available)
5. **Display**: Images are displayed in a responsive slideshow with navigation controls

## Error Handling

The application includes comprehensive error handling:

- **Network Errors**: Displays a retry button if the initial fetch fails
- **Missing Metadata**: Uses filename as fallback when caption metadata is unavailable
- **Image Load Errors**: Shows a placeholder image if an image fails to load
- **Empty Bucket**: Displays a friendly message when no images are found

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on the GitHub repository.

