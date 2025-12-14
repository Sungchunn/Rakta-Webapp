'use client';

import Link from 'next/link';

export default function Navbar() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/35 backdrop-blur-md">
            <div className="mx-auto max-w-6xl px-6 h-16 grid grid-cols-3 items-center">
                {/* Left */}
                <div className="justify-self-center">
                    <Link
                        href="/"
                        className="text-sm font-semibold text-white/85 hover:text-white transition"
                    >
                        Home
                    </Link>
                </div>

                {/* Center (Find a Center) */}
                <div className="justify-self-center">
                    <Link
                        href="/locations"
                        className="text-sm font-semibold text-white hover:text-white transition"
                    >
                        Find a Center
                    </Link>
                </div>

                {/* Right */}
                <div className="justify-self-center">
                    <Link
                        href="/login"
                        className="text-sm font-semibold text-white/85 hover:text-white transition"
                    >
                        Log in
                    </Link>
                </div>
            </div>
        </header>
    );
}
