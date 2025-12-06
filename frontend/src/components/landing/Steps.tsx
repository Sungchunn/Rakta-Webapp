'use client';

// Wavy SVG path or CSS implementation
// In the design, it's a complex wave connecting steps 1, 2, 3 and a heart in the middle.
// I will implement a responsive approximation.

export default function Steps() {
    return (
        <section style={{ padding: '6rem 2rem', background: 'white', position: 'relative', overflow: 'hidden' }}>
            <div className="container">
                <h2 style={{ fontSize: '2rem', marginBottom: '5rem', fontFamily: 'var(--font-heading)' }}>
                    How to get Blood?
                </h2>

                {/* Graphic Area */}
                {/* This is complex to do purely in CSS, using absolute positioning for the nodes. */}
                <div style={{ position: 'relative', maxWidth: '1000px', margin: '0 auto', height: '600px' }}>

                    {/* Step 1 - Top Center */}
                    <StepNode number="1" text="Lorem Ipsum is simply dummy text of the printing" top="0%" left="50%" transform="translateX(-50%)" />

                    {/* Step 2 - Bottom Left */}
                    <StepNode number="2" text="Lorem Ipsum is simply dummy text." top="50%" left="10%" />

                    {/* Step 3 - Bottom Right */}
                    <StepNode number="3" text="Lorem Ipsum is simply dummy text." top="50%" right="10%" />

                    {/* Heart in Middle Bottom */}
                    <div style={{
                        position: 'absolute',
                        top: '60%',
                        left: '50%',
                        transform: 'translate(-50%, 0)',
                        color: '#660a1e', // Dark red
                        fontSize: '5rem'
                    }}>
                        ♥
                    </div>

                    {/* Wavy Line SVG - Simplified approximation */}
                    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
                        <path d="M500 150 Q 200 400 150 500 T 500 600 T 850 500" fill="none" stroke="#8B0000" strokeWidth="2" strokeDasharray="5,5" />
                        {/* Note: SVG coordinates need to be responsive or ViewBox based. This is a rough placeholder to show intent. */}
                    </svg>
                </div>
            </div>
        </section>
    );
}

function StepNode({ number, text, top, left, right, transform = '' }: any) {
    return (
        <div style={{ position: 'absolute', top, left, right, transform, zIndex: 2, textAlign: 'center', width: '250px' }}>
            <div style={{
                position: 'relative',
                background: 'white',
                borderRadius: '50%',
                width: '180px',
                height: '180px',
                margin: '0 auto 1rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ position: 'absolute', top: -10, left: -20, fontSize: '3rem', fontWeight: 'bold' }}>
                    <div style={{ width: '60px', height: '60px', border: '3px solid black', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
                        {number}
                    </div>
                </div>
                {/* Icon Placeholder - Pen/Paper */}
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>{text}</p>
        </div>
    )
}
