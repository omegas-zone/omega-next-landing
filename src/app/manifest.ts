import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Ωmega",
        short_name: "Ωmega",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#222222",
        theme_color: "#6c6eec",
        icons: [
            {
                "src": "/vector/omega-small.svg",
                "sizes": "any",
                "type": "image/svg+xml"
            }
        ]
    };
}