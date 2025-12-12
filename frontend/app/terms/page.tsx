import { promises as fs } from 'fs';
import path from 'path';
import { TermsPageClient } from './client';

export default async function TermsPage() {
    // Navigate up from 'frontend' to root, then to assets
    const termsPath = path.join(process.cwd(), '../assets/Term_and_Condition.txt');
    let termsContent = '';

    try {
        termsContent = await fs.readFile(termsPath, 'utf-8');
    } catch (error) {
        console.error("Error reading terms file:", error);
        termsContent = "Error loading Terms and Conditions. Please contact support.";
    }

    return (
        <TermsPageClient content={termsContent} />
    );
}
