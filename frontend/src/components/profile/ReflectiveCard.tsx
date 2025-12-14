"use client";

import React, { useEffect, useRef, useState } from 'react';
import './ReflectiveCard.css';
import { Droplets, Activity, Lock, Users, Heart } from 'lucide-react';

interface ReflectiveCardProps {
    firstName: string;
    lastName: string;
    bloodType?: string;
    donationCount: number;
    followerCount: number;
    followingCount: number;
    blurStrength?: number;
    color?: string;
    metalness?: number;
    roughness?: number;
    overlayColor?: string;
    displacementStrength?: number;
    noiseScale?: number;
    specularConstant?: number;
    grayscale?: number;
    glassDistortion?: number;
    className?: string;
    style?: React.CSSProperties;
}

const BLOOD_TYPE_LABELS: Record<string, string> = {
    'A_POSITIVE': 'A+',
    'A_NEGATIVE': 'A-',
    'B_POSITIVE': 'B+',
    'B_NEGATIVE': 'B-',
    'AB_POSITIVE': 'AB+',
    'AB_NEGATIVE': 'AB-',
    'O_POSITIVE': 'O+',
    'O_NEGATIVE': 'O-',
};

const ReflectiveCard: React.FC<ReflectiveCardProps> = ({
    firstName,
    lastName,
    bloodType,
    donationCount,
    followerCount,
    followingCount,
    blurStrength = 12,
    color = 'white',
    metalness = 1,
    roughness = 0.4,
    overlayColor = 'rgba(255, 255, 255, 0.1)',
    displacementStrength = 20,
    noiseScale = 1,
    specularConstant = 1.2,
    grayscale = 1,
    glassDistortion = 0,
    className = '',
    style = {}
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [streamActive, setStreamActive] = useState(false);

    useEffect(() => {
        let stream: MediaStream | null = null;

        const startWebcam = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                        facingMode: 'user'
                    }
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setStreamActive(true);
                }
            } catch (err) {
                console.error('Error accessing webcam:', err);
            }
        };

        startWebcam();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const baseFrequency = 0.03 / Math.max(0.1, noiseScale);
    const saturation = 1 - Math.max(0, Math.min(1, grayscale));
    const formattedBloodType = bloodType ? BLOOD_TYPE_LABELS[bloodType] || bloodType : null;

    const cssVariables = {
        '--blur-strength': `${blurStrength}px`,
        '--metalness': metalness,
        '--roughness': roughness,
        '--overlay-color': overlayColor,
        '--text-color': color,
        '--saturation': saturation
    } as React.CSSProperties;

    return (
        <div className={`reflective-card-container ${className}`} style={{ ...style, ...cssVariables }}>
            <svg className="reflective-svg-filters" aria-hidden="true">
                <defs>
                    <filter id="metallic-displacement" x="-20%" y="-20%" width="140%" height="140%">
                        <feTurbulence type="turbulence" baseFrequency={baseFrequency} numOctaves="2" result="noise" />
                        <feColorMatrix in="noise" type="luminanceToAlpha" result="noiseAlpha" />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="noise"
                            scale={displacementStrength}
                            xChannelSelector="R"
                            yChannelSelector="G"
                            result="rippled"
                        />
                        <feSpecularLighting
                            in="noiseAlpha"
                            surfaceScale={displacementStrength}
                            specularConstant={specularConstant}
                            specularExponent="20"
                            lightingColor="#ffffff"
                            result="light"
                        >
                            <fePointLight x="0" y="0" z="300" />
                        </feSpecularLighting>
                        <feComposite in="light" in2="rippled" operator="in" result="light-effect" />
                        <feBlend in="light-effect" in2="rippled" mode="screen" result="metallic-result" />
                        <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                            result="solidAlpha"
                        />
                        <feMorphology in="solidAlpha" operator="erode" radius="45" result="erodedAlpha" />
                        <feGaussianBlur in="erodedAlpha" stdDeviation="10" result="blurredMap" />
                        <feComponentTransfer in="blurredMap" result="glassMap">
                            <feFuncA type="linear" slope="0.5" intercept="0" />
                        </feComponentTransfer>
                        <feDisplacementMap
                            in="metallic-result"
                            in2="glassMap"
                            scale={glassDistortion}
                            xChannelSelector="A"
                            yChannelSelector="A"
                            result="final"
                        />
                    </filter>
                </defs>
            </svg>

            <video ref={videoRef} autoPlay playsInline muted className="reflective-video" />

            <div className="reflective-noise" />
            <div className="reflective-sheen" />
            <div className="reflective-border" />

            <div className="reflective-content">
                <div className="card-header">
                    <div className="security-badge">
                        {formattedBloodType ? (
                            <>
                                <Droplets size={14} className="security-icon" />
                                <span>{formattedBloodType} DONOR</span>
                            </>
                        ) : (
                            <>
                                <Lock size={14} className="security-icon" />
                                <span>RAKTA MEMBER</span>
                            </>
                        )}
                    </div>
                    <Activity className="status-icon" size={20} />
                </div>

                <div className="card-body">
                    <div className="user-info">
                        <h2 className="user-name">{firstName} {lastName}</h2>
                        <p className="user-role">BLOOD DONOR</p>
                    </div>
                </div>

                <div className="card-footer">
                    <div className="stats-row">
                        <div className="stat-item">
                            <Heart size={14} className="stat-icon donations" />
                            <span className="stat-value">{donationCount}</span>
                            <span className="stat-label">Donations</span>
                        </div>
                        <div className="stat-item">
                            <Users size={14} className="stat-icon" />
                            <span className="stat-value">{followerCount}</span>
                            <span className="stat-label">Followers</span>
                        </div>
                        <div className="stat-item">
                            <Users size={14} className="stat-icon" />
                            <span className="stat-value">{followingCount}</span>
                            <span className="stat-label">Following</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReflectiveCard;
