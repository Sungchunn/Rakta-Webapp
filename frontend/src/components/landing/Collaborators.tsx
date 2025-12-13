'use client';

export default function Collaborators() {
    const orgs = ['NCC', 'NSS', 'YMCA', 'Red Cross', 'Local Health'];

    return (
        <section style={{ padding: '4rem 2rem 8rem', background: 'transparent', position: 'relative', zIndex: 1 }}>
            <div className="container">
                <h2 style={{ 
                    fontSize: '2rem', 
                    marginBottom: '1rem', 
                    fontFamily: 'var(--font-heading)',
                    textAlign: 'center'
                }}>
                    Partner Network
                </h2>
                <p style={{
                    textAlign: 'center',
                    color: '#999',
                    fontSize: '1rem',
                    marginBottom: '3rem',
                    maxWidth: '600px',
                    margin: '0 auto 3rem'
                }}>
                    Working with 50+ donation centers and health organizations nationwide
                </p>

                <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {orgs.slice(0, 3).map(org => (
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
                            color: '#e5e5e5',
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
