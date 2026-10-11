import React, { JSX } from 'react';
import { Metadata } from 'next';

import Header from '@/sections/header';
import Music from '@/sections/music';
import Travels from '@/sections/travels';
import Whisky from '@/sections/whisky';
import DIY from '@/sections/diy';
import Resume from '@/sections/resume';
import Footer  from '@/sections/footer';
import Nav from '@/components/nav';
import Toggle from '@/components/toggle';

import './_scss/_page.scss';
import './_scss/landing.scss';

export const metadata: Metadata = {
    title: 'Ωmega',
    description: 'Ω - My landing page including all of my hobbies and my resume',
    keywords: 'omega,water,phlegmatic,music,techno,ambient,minimal,lounge,psytrance,blog,weblog,template,cv.html,css,menu,responsive,travel,travels,travelblog,tutorials,diy,swimmer,yupsie',
    authors: [{name: 'Omega'}],
};

export default async function Home(): Promise<JSX.Element> {
    return (<main className="landing-page">
        <Header/>
        <Toggle/>
        <Nav/>
        <Music/>
        <Travels/>
        <Whisky/>
        <DIY/>
        <Resume/>
        <Footer/>
    </main>);
}
