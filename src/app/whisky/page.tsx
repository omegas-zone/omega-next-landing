import React, { JSX } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Footer from '@/components/footer';
import Tastings from '@/components/tastings';
import Toggle from '@/components/toggle';
import { API_URL } from '@/lib/api';

import type { Tasting } from '@/types/all';

import '../_scss/_page.scss';
import '../_scss/whisky.scss';

export const metadata: Metadata = {
    title: 'Ωmega - Whisky',
    description: 'My whisky tastings.',
};

async function getTastings(): Promise<Tasting[] | null> {
    const response = await fetch(API_URL + '/whisky', {
        next: { revalidate: 300 },
    });

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error('Failed to fetch tastings');
    }

    const json = await response.json();

    return json.data;
}

export default async function Whisky(): Promise<JSX.Element> {
    const tastings = await getTastings();

    if (!tastings) {
        return notFound();
    }

    if (tastings.length === 0) {
        return (
            <main>
                <Toggle />
                <div className="content-column">
                    <h1>Whisky</h1>
                    <p>No tastings available</p>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main>
            <Toggle />
            <div className="content-column">
                <h1>My Tastings</h1>
                <p>
                    My recommendation to get inspired
                    is <a href="https://www.thewhiskyexchange.com/inspiration">Whisky 101</a>.
                </p>
                <Tastings tastings={tastings} />
            </div>
            <Footer />
        </main>
    );
}