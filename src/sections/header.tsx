'use client';

import React, { JSX } from 'react';
import Image from 'next/image';

import Hexagons from '@/components/hexagons';

import './_scss/header.scss';

import packageJson from '../../package.json';

export default function Header(): JSX.Element {
    return (<header id="header">
        <Hexagons/>
        <Image className="logo" alt="Omega Logo" width="1400" height="500" src="vector/omega.svg"/>
        <p>
            Welcome to my corner of the web — currently running v{packageJson.version}<br/>Have a look around, get to know me, and
            explore some of the things I enjoy. If you&#39;d like to know more about what I do professionally, you can
            take a look at my <a href="#resume">resume</a>. And if you&#39;d like to get in touch, you&#39;ll find my
            contact details at the  bottom.
        </p>
        <Image className="chevron" src="vector/chevron-animated.svg" alt="Chevron" width="128" height="128"/>
    </header>);
}