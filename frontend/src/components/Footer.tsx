import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-card text-card-foreground py-16 border-t border-border">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* Brand */}
                <div className="flex flex-col gap-6">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-primary">
                        <path d="M12 21.5C16.1421 21.5 19.5 18.1421 19.5 14C19.5 10.5 12 2.5 12 2.5C12 2.5 4.5 10.5 4.5 14C4.5 18.1421 7.85786 21.5 12 21.5Z" fill="currentColor" />
                    </svg>
                    <p className="text-sm text-muted-foreground">Subscribe to our newsletter</p>
                    <div className="flex gap-2">
                        <Input type="email" placeholder="Email address" className="bg-background border-border" />
                        <Button size="icon" variant="secondary">
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Links Column 1 */}
                <div>
                    <h4 className="font-semibold mb-4 text-foreground/80">Services</h4>
                    <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                        <li>Email Marketing</li>
                        <li>Campaigns</li>
                        <li>Branding</li>
                        <li>Offline</li>
                    </ul>
                </div>

                {/* Links Column 2 */}
                <div>
                    <h4 className="font-semibold mb-4 text-foreground/80">About</h4>
                    <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                        <li>Our Story</li>
                        <li>Benefits</li>
                        <li>Team</li>
                        <li>Careers</li>
                    </ul>
                </div>

                {/* Links Column 3 */}
                <div>
                    <h4 className="font-semibold mb-4 text-foreground/80">Help</h4>
                    <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                        <li>FAQs</li>
                        <li>Contact Us</li>
                    </ul>
                </div>
            </div>

            {/* CTA */}
            <div className="container mx-auto px-6 mt-12 pt-8 text-center border-t border-border/40">
                <p className="mb-4 text-muted-foreground">Ready to get started?</p>
                <Link href="/donate">
                    <Button variant="default" size="lg" className="bg-primary text-primary-foreground font-bold shadow-[0_0_15px_rgba(255,0,51,0.4)] hover:shadow-[0_0_25px_rgba(255,0,51,0.6)] transition-all">
                        Donate Now
                    </Button>
                </Link>
            </div>


            <div className="container mx-auto px-6 mt-12 pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between text-xs text-muted-foreground/60">
                <div className="flex gap-8">
                    <span>Terms & Conditions</span>
                    <span>Privacy Policy</span>
                </div>

                <div className="flex gap-4 mt-4 md:mt-0">
                    {/* Social Icons Placeholder */}
                    <span>FB</span>
                    <span>TW</span>
                    <span>IG</span>
                </div>
            </div>
        </footer>
    );
}
