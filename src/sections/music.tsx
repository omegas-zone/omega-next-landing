import React, { JSX } from 'react';
import Image from 'next/image';

import Tracks from '@/components/tracks';

import './_scss/music.scss';

export default function Music(): JSX.Element {
    return (<section id="music">
        <h2>Top 10</h2>
        <audio></audio>
        <Image src="/images/cover.jpg" alt="" width={320} height={320} className="cover"/>
        <p>
            Here you can listen to my personal top 10, as well as a live set that I have performed on a small
            festival. To find the full list of tracks, check out <a href="/music">this page</a>.
        </p>
        <Tracks currentSection={0} showTitle={false} />
    </section>);
}