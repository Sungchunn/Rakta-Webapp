"use client";

import styles from './MilestoneCard.module.css';

interface MilestoneCardProps {
    title: string;
    description: string;
    date: string;
}

export default function MilestoneCard({ title, description, date }: MilestoneCardProps) {
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `FitSloth Milestone: ${title}`,
                text: `I just achieved ${title} on FitSloth! ${description}`,
                url: window.location.href,
            }).catch(console.error);
        } else {
            alert('Sharing is not supported on this browser, but you can take a screenshot!');
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.badge}>🏆</div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
            <p className={styles.date}>Achieved on {date}</p>
            <button onClick={handleShare} className="btn btn-secondary">
                Share Achievement
            </button>
        </div>
    );
}
