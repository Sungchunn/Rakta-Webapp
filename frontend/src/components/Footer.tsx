import Link from "next/link";
import styles from './Navbar.module.css'; // Reusing logo style if needed or creating new

export default function Footer() {
    return (
        <footer style={{ background: '#1c1f26', color: 'white', padding: '4rem 2rem' }}>
            <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem' }}>

                {/* Brand */}
                <div style={{ maxWidth: '300px' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="white"><path d="M12 21.5C16.1421 21.5 19.5 18.1421 19.5 14C19.5 10.5 12 2.5 12 2.5C12 2.5 4.5 10.5 4.5 14C4.5 18.1421 7.85786 21.5 12 21.5Z" /></svg>
                    </div>
                    <p style={{ marginBottom: '2rem', fontSize: '1rem', color: '#ccc' }}>Subscribe to our newsletter</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input type="email" placeholder="Email address" style={{ background: '#2a2d35', border: 'none', padding: '0.75rem 1rem', borderRadius: '8px', color: 'white', outline: 'none', width: '100%' }} />
                        <button style={{ background: '#ffcccb', borderRadius: '8px', width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" stroke="black" strokeWidth="2" fill="none"><path d="M9 18l6-6-6-6" /></svg>
                        </button>
                    </div>
                </div>

                {/* Links Column 1 */}
                <div>
                    <h4 style={{ marginBottom: '1.5rem', opacity: 0.8 }}>Services</h4>
                    <ul style={{ listStyle: 'none', opacity: 0.6, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                        <li>Email Marketing</li>
                        <li>Campaigns</li>
                        <li>Branding</li>
                        <li>Offline</li>
                    </ul>
                </div>

                {/* Links Column 2 */}
                <div>
                    <h4 style={{ marginBottom: '1.5rem', opacity: 0.8 }}>About</h4>
                    <ul style={{ listStyle: 'none', opacity: 0.6, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                        <li>Our Story</li>
                        <li>Benefits</li>
                        <li>Team</li>
                        <li>Careers</li>
                    </ul>
                </div>

                {/* Links Column 3 */}
                <div>
                    <h4 style={{ marginBottom: '1.5rem', opacity: 0.8 }}>Help</h4>
                    <ul style={{ listStyle: 'none', opacity: 0.6, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                        <li>FAQs</li>
                        <li>Contact Us</li>
                    </ul>
                </div>

                {/* CTA */}
                <div style={{ textAlign: 'right' }}>
                    <p style={{ marginBottom: '1rem' }}>Ready to get started?</p>
                    <Link href="/donate">
                        <button style={{ background: 'white', color: 'black', padding: '0.75rem 2rem', borderRadius: '4px', fontWeight: 'bold' }}>
                            Donate
                        </button>
                    </Link>
                </div>
            </div>

            <div className="container" style={{ borderTop: '1px solid #333', marginTop: '3rem', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.6 }}>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <span>Terms & Conditions</span>
                    <span>Privacy Policy</span>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    {/* Social Icons Placeholder */}
                    <span>FB</span>
                    <span>TW</span>
                    <span>IG</span>
                </div>
            </div>
        </footer>
    );
}
