import React, { JSX } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import BlogClient from '@/components/blog-client';
import Footer from '@/components/footer';
import { API_URL } from '@/lib/api';

import Toggle from "@/components/toggle";
import type { Blog, Gallery } from '@/types/all';

import '../../_scss/_page.scss';
import '../../_scss/diy.scss';

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const diy = await getDIY(id);

    if (!diy) {
        return {
            title: 'Ωmega - Travels',
        };
    }

    return {
        title: 'Ωmega - ' + diy.title,
        description: diy.subtitle ?? '',
    };
}

async function getDIY(id: string): Promise<Blog | null> {
    const response = await fetch(API_URL + '/diy/' + id, {
        next: { revalidate: 300 },
    });

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error('Failed to fetch diy project');
    }

    return response.json();
}

export default async function DIYPage({ params }: Props): Promise<JSX.Element> {
    const { id } = await params;
    const diy = await getDIY(id);

    if (!diy) {
        return notFound();
    }

    return (
        <main>
            <Toggle/>
            <div className="content-column">
                <h1>{diy.title}</h1>
                <em>Published at: {new Intl.DateTimeFormat('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                }).format(new Date(diy.published_at))}
                </em>
                <BlogClient
                    source={diy.body}
                    galleries={diy.galleries as Gallery[]}
                />
            </div>

            <Footer />
        </main>
    );
}