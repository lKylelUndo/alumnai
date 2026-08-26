import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'AlumnAI',
        short_name: 'AlumnAI',
        description: 'AlumnAI is a platform for alumni to connect with each other and with their alma mater.',
        start_url: '/',
        display: 'standalone',
        background_color: '#1A216D',
        theme_color: '#1A216D',
        icons: [
            {
                src: '/icons/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/icons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/icons/maskable-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
    ],
  }
}