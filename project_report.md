# Project Report: Rakta by FitSloth

This report outlines the core functionality and mission of the Rakta web application.

## Mission

The mission of Rakta is to **reframe blood donation as an integral part of a proactive and healthy lifestyle**. 

Instead of viewing donation as an occasional, disconnected event, Rakta empowers users—particularly athletes and health-conscious individuals—to treat it as a measurable and manageable aspect of their personal fitness journey. By providing data-driven insights into physiological recovery, donation eligibility, and overall wellness, the application aims to reduce uncertainty, increase donor engagement, and build a supportive community that celebrates the positive impact of donating blood.

## What the Webapp Does

Rakta is a comprehensive health and wellness platform designed for blood donors. It combines detailed donation tracking with advanced health metric analysis and social engagement features to provide a holistic view of a user's health and their impact as a donor.

### Key Features

#### Core Donation Features
- **Donation Logging:** Users can log detailed information about their blood donations, including type (e.g., Whole Blood, Platelets), volume, and pre-donation health stats like hemoglobin, blood pressure, and pulse rate.
- **Eligibility Tracking:** The app automatically calculates and displays when a user will be eligible to donate again based on their last donation type, removing guesswork.
- **Donation History & Export:** Provides a complete history of all past donations, which can be exported to a CSV file for personal records.
- **Location Finder:** An interactive map allows users to find nearby donation centers, view their hours, and see community activity at each location.

#### Health & Performance Analysis
- **Proprietary Readiness Score:** Rakta calculates a daily "Readiness Score" from 0-100. This score provides a simple, actionable measure of the user's recovery status, taking into account:
    - **RBC (Red Blood Cell) Recovery:** Modeled based on time since the last donation.
    - **Iron Store Recovery:** Modeled based on time, gender, and recent iron intake.
    - **Lifestyle Factors:** A score based on sleep quality, training load, and heart rate variability (HRV).
- **Health Data Integration:** Users can connect their accounts with third-party health platforms (e.g., Garmin, Apple Health, Oura) to automatically sync daily metrics like sleep, resting heart rate, and workout data.
- **AI-Powered Insights:** The application features an AI coach ("Dr. Sloth") that analyzes the user's daily stats and provides a personalized, actionable insight to help them optimize their health and donation schedule.
- **Manual Health Logging:** Users can manually log subjective feelings, sleep hours, and supplement intake (e.g., Iron, Vitamin C).

#### Social & Community Engagement
- **Donation Feed:** A public social feed where users can create posts about their donation experiences, share reviews of donation centers, and encourage others.
- **Community Interaction:** Users can "like" posts on the feed and follow other users to build a supportive community.
- **Gamification:** The platform includes a badge and achievement system to reward users for milestones like donation streaks, total volume donated, and community engagement.
