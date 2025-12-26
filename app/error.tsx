'use client';

import Hero from '@/components/sections/Hero';

export default function Error() {
    return (
        <Hero
            title="System Error"
            hintText="Something went wrong"
            linkHref="/"
            linkText="Reboot"
        />
    );
}
