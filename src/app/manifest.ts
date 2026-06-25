import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vandanam — Online Puja & Chadhava',
    short_name: 'Vandanam',
    description: 'Connect with divine spirituality through our trusted online platform for authentic temple pujas, chadhava, and astrology services.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fdfbf7', // mandir-bg
    theme_color: '#f97316', // saffron-500
    icons: [
      {
        src: '/icon.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
