'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Navbar() {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    if (isAuthPage) return null;

    return (
        <nav className="flex justify-between items-center py-4 px-6 border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-40">
            <Link href="/" className="hover:opacity-80 transition-opacity">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                    <path d="M12 21.5C16.1421 21.5 19.5 18.1421 19.5 14C19.5 10.5 12 2.5 12 2.5C12 2.5 4.5 10.5 4.5 14C4.5 18.1421 7.85786 21.5 12 21.5Z" fill="currentColor" />
                </svg>
            </Link>

            <div className="hidden md:flex gap-8 items-center text-sm font-medium text-muted-foreground">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <Link href="#" className="hover:text-primary transition-colors">About Us</Link>
                <Link href="/donate" className="hover:text-primary transition-colors">Find Blood</Link>
            </div>

            <div className="flex gap-4 items-center">
                {/* Replaced 'Register Now' text with nothing or button if needed, adhering to clean UI */}
                <Link href="/login">
                    <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-[0_0_10px_rgba(255,0,51,0.3)]">
                        Log In
                    </Button>
                </Link>
            </div>
        </nav>
    );
}
