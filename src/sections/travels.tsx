import React, { JSX } from 'react';
import Link from 'next/link';

import Map from '@/components/map';
import { API_URL } from '@/lib/api';

import type { Blog } from '@/types/all';

import './_scss/travels.scss';

async function getTravels(): Promise<Blog[] | null> {
    const response = await fetch(API_URL + '/travels', {
        next: { revalidate: 300 },
    });

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error('Failed to fetch travels');
    }

    return response.json();
}

export default async function Travels(): Promise<JSX.Element> {
    const travels = (await getTravels()) || [];

    const totalImages: number = travels.reduce(
        (total: number, travel: Blog) => total + (travel.image_count || 0),
        0
    );

    return (<section id="travels">
        <Map />
        <div className="banner-grid">
            <h2 className="travels">
                Travel Blogs
            </h2>
            <p>
                This is a list of all my travels in descending order. I&#39;m still trying to cut back on the amount of
                images, the total amount of images is currently {totalImages}.
            </p>
            {travels.map((travel: Blog, index: number) => (
                <Link key={index} href={'/travels/' + travel.slug} className="banner">
                    {travel.title}
                </Link>)
            )}
        </div>
    </section>);
}