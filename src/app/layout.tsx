import React, { JSX } from 'react';
import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
    title: 'Ωmega',
    description: 'Ω - My music',
    keywords: 'omega,water,phlegmatic,music,techno,ambient,minimal,lounge,blog,weblog,template,cv.html,css,menu,responsive,travel,travels,travelblog,tutorials,diy,yupsie',
    authors: [{ name: 'Omega' }],
};
export const viewport: Viewport = {
    colorScheme: 'light dark',
    themeColor: '#6c6eec',
    width: 'device-width',
    initialScale: 1,
};

const themeScript = `
(function () {
    try {
        const storedTheme = localStorage.getItem('theme');

        if (storedTheme === 'light' || storedTheme === 'dark') {
            document.documentElement.style.colorScheme = storedTheme;
        } else {
            const theme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';

            document.documentElement.style.colorScheme = theme;
        }
    } catch (_) {}
})();
`;

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>): JSX.Element {
    return (<html lang="en" suppressHydrationWarning>
        <head>
            <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        </head>
        <body>
            {children}
            <div style={{minHeight: '50px'}}>
                <Analytics/>
                <SpeedInsights/>
            </div>
        </body>
    </html>);
}