'use client';

export default function Collaborators() {
    const orgs = ['NCC', 'NSS', 'YMCA'];

    return (
        <section style={{ padding: '4rem 2rem 8rem', background: 'white' }}>
            <div className="container">
                <h2 style={{ fontSize: '2rem', marginBottom: '3rem', fontFamily: 'var(--font-heading)' }}>
                    Our Collaborators
                </h2>

                <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {orgs.map(org => (
                        <div key={org} style={{
                            width: '300px',
                            height: '250px',
                            borderRadius: '24px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: '#e5e5e5', // Light gray like in design
                            background: 'white'
                        }}>
                            {org}
                        </div>
                    ))}
                </div>

                {/* Dots */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '2rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ccc' }} />
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'black' }} />
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ccc' }} />
                </div>
            </div>
        </section>
    );
}
