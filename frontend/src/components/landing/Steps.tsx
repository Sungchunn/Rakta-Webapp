'use client';

export default function Steps() {
    return (
        <section style={{ padding: '6rem 2rem', background: 'transparent', position: 'relative', overflow: 'hidden', zIndex: 1 }}>
            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '8rem', fontFamily: 'var(--font-heading)', color: 'black' }}>
                    How to get Blood?
                </h2>

                {/* Graphic Area */}
                <div style={{ position: 'relative', maxWidth: '1000px', margin: '0 auto', height: '600px' }}>

                    {/* SVG Line Background */}
                    <svg
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, overflow: 'visible' }}
                        viewBox="0 0 1000 600"
                        preserveAspectRatio="none"
                    >
                        {/* 
                            Path Logic:
                            Start near Node 1 (Top Center: 500, 100)
                            Curve to Node 2 (Left Bottom: 200, 400)
                            Curve through Heart (Center Bottom: 500, 500) - Doing a heartbeat spike
                            Curve to Node 3 (Right Bottom: 800, 400)
                        */}
                        <path
                            d="M 420 150 
                               Q 200 150 200 350
                               Q 200 500 350 500
                               L 400 500
                               L 420 420 L 440 550 L 460 480 L 480 520 
                               L 520 520
                               L 540 450 L 560 580 L 580 480 L 600 520
                               L 650 520
                               Q 800 520 800 350
                               "
                            fill="none"
                            stroke="#8B0025"
                            strokeWidth="3"
                        />
                    </svg>

                    {/* Step 1 - Top Center */}
                    {/* Adjusted position to match the start of the line approximation */}
                    <StepNode
                        number="1"
                        text="Lorem Ipsum is simply dummy text."
                        top="50px"
                        left="50%"
                        transform="translateX(-50%)"
                    />

                    {/* Step 2 - Left */}
                    <StepNode
                        number="2"
                        text="Lorem Ipsum is simply dummy text."
                        top="250px"
                        left="10%"
                    />

                    {/* Step 3 - Right */}
                    <StepNode
                        number="3"
                        text="Lorem Ipsum is simply dummy text."
                        top="250px"
                        right="10%"
                    />

                    {/* Heart in Middle Bottom */}
                    <div style={{
                        position: 'absolute',
                        top: '460px', /* aligned with the heartbeat spikes roughly */
                        left: '50%',
                        transform: 'translate(-50%, 0)',
                        zIndex: 3
                    }}>
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="#660a1e">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </div>

                </div>
            </div>
        </section>
    );
}

function StepNode({ number, text, top, left, right, transform = '' }: any) {
    return (
        <div style={{ position: 'absolute', top, left, right, transform, zIndex: 10, textAlign: 'center', width: '280px' }}>
            {/* Main Circle */}
            <div style={{
                position: 'relative',
                background: 'white',
                borderRadius: '50%',
                width: '160px',
                height: '160px',
                margin: '0 auto 1.5rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* Number Badge */}
                <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'white',
                    border: '3px solid black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'black',
                    zIndex: 2,
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                }}>
                    {number}
                </div>

                {/* Icon - Pencil/Edit */}
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
            </div>
            <p style={{ fontSize: '1rem', color: '#666', maxWidth: '200px', margin: '0 auto', lineHeight: '1.5' }}>{text}</p>
        </div>
    )
}
