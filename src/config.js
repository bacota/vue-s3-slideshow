// Configuration constants
export const BUCKET_NAME = 'tabs.14strings.com';
export const BUCKET_URL = `https://${BUCKET_NAME}`;
export const S3_FOLDER = 'roster';
export const USE_DEMO_MODE = false;
export const AUTO_PLAY_DELAY = 3000;

// Demo images for testing
export const DEMO_IMAGES = [
    {
        key: 'roster/player-1.jpg',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
        caption: 'Player 1',
        size: 245678,
        lastModified: new Date('2024-01-15'),
    },
    {
        key: 'roster/player-2.jpg',
        url: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=1200',
        caption: 'Player 2',
        size: 312456,
        lastModified: new Date('2024-01-16'),
    },
    {
        key: 'roster/player-3.jpg',
        url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200',
        caption: 'Player 3',
        size: 287931,
        lastModified: new Date('2024-01-17'),
    },
];
