# Prompts Used to Build the AI Career Intelligence & Real-Time Interview Platform

This document contains all the major prompts and requirement specifications used to design, build, and refine the **CohortIQ AI Career Intelligence & Real-Time AI Interviewer Platform**.

---

## 1. Visual Aesthetics & Navbar Cleanup Prompt

```text
Change orange color to grey and "Resume. Practice. Get Hired." word add some animation and changing color theme.

Navbar Cleanup:
- Remove FAQ and Pricing from top navigation.
- Keep navbar clean and focused on main product.
- Re-align remaining navigation items naturally.
- Remove unnecessary frequently asked questions section from interview experience.
```

---

## 2. Full-Page AI Interview Setup Redesign Prompt

```text
Redesign the "Start AI Interview" experience so that the system first understands the user and then generates a personalized interview using AI.

Convert the current centered popup/modal into a FULL-PAGE responsive Interview Setup screen.
Do NOT use a popup, modal, or small floating box.

Remove ALL sample / hardcoded user data from the UI (Alex Sharma, Madhav, Demo User, fake resumes/skills).
Dynamically use the authenticated user's actual profile data. If unavailable, show "Complete your profile to get better AI recommendations."

Interview Types:
- 🎓 Placement
- 💼 HR
- 💻 Technical
- 🧩 Coding & DSA
- ✨ AI Recommended
```

---

## 3. AI Career Intelligence & AI Resume System Prompt

```text
REDESIGN AND UPGRADE THE "AI RESUME" FEATURE OF MY WEBSITE.

Make AI Resume feel like an intelligent AI Career & Resume Advisor rather than a traditional ATS checker.

User Flow:
CREATE ACCOUNT → UPLOAD CV / RESUME → AI ANALYZES RESUME → EXTRACT USER INFORMATION → USER CONFIRMS / EDITS INFORMATION → SELECT TARGET ROLE → AI CREATES PERSONALIZED CAREER PROFILE

Extracted Information:
- Name, Education, Degree, College/University, Graduation Year
- Programming Languages, Frameworks, Databases, Cloud, AI/ML, Tools
- Internships, Work Experience, Roles, Responsibilities, Achievements
- Project Names, Descriptions, Technologies Used, User Role, Key Features, Challenges, Impact
- Certifications, Leadership, Extracurricular Activities

Features to Include:
1. AI Resume Score (0-100 breakdown by Skills, Experience, Projects, Education, Role Relevance)
2. Target Role Selection (Software Developer, Frontend, Backend, Full Stack, Data Analyst, AI/ML Engineer, DevOps, UI/UX, or Custom Role)
3. Market-Based Skill Gap Analysis (✓ Has, ⚠ Needs Improvement, ✕ Missing)
4. What Should You Learn Next? (Prioritized skill recommendations with learning effort)
5. Personalized 90-Day Career Roadmap (Days 0–30 Foundation, Days 31–60 Skill Building, Days 61–90 Job Readiness)
6. CV-Based Company & Opportunity Matching with Match Score %
7. Delete Resume Data feature to start fresh when uploading a new resume
8. Data Source Labels showing what info AI used for recommendations
```

---

## 4. Central AI Career Dashboard Prompt

```text
DASHBOARD
Add a clean "Dashboard" option to the top navigation.
Dashboard should be the user's central career workspace and show:
- Resume status
- AI Resume Score
- Target Role
- Current Skills
- Skill Gap Overview
- Interview progress
- Recent interview performance
- AI Career Recommendations
- Career opportunities
- 90-Day Learning Roadmap preview

Keep the dashboard professional, clean, and minimal using modern design (rounded-3xl cards, clean typography, smooth subtle gradients).
```

---

## 5. Personalized Real-Time AI Interviewer (CV + Interview Data Analysis) Prompt

```text
# Personalized AI Interview — CV + Interview Data Analysis

Add a new AI-powered interview preparation and analysis system to my existing AI Interview website.

The AI interviewer should NOT start asking random or generic questions.
Before the interview begins, the AI should analyze the candidate's CV/resume and all available interview information to create a personalized interview strategy.

1. Collect Candidate Information:
   - CV / Resume (PDF, DOCX, TXT)
   - Name, Target Job Role, Experience Level, Skills, Preferred Interview Type
   - Optional Job Description & Custom Notes

2. Create a Personalized Interview Plan:
   - Identify skills to test, projects worth discussing, potential weak/strong areas.
   - Reveal questions ONE AT A TIME.

3. Generate Questions From CV & Verify Claims:
   - Reference candidate's specific projects & listed technologies in questions.
   - Example: "I noticed you mentioned building an AI chatbot using LangChain. Can you walk me through how you designed the architecture?"
   - Verify CV claims: Probe deeper if answer is vague ("What specifically made it scalable?").

4. Dynamic Interview Loop:
   - AI asks 1 question → User answers by Voice or Text → AI evaluates answer in real-time → AI adapts next question.
   - Strong answer → Increase difficulty (System design, edge cases, trade-offs).
   - Weak answer → Ask simpler clarifying question on fundamentals.
   - New topic mentioned → Follow new path gracefully.
   - Maintain interview memory (Avoid repeating questions).

5. Real-Time Answer Analysis:
   - Evaluate Understanding, Technical Correctness, Depth, Relevance, Communication, Confidence, and CV Consistency.

6. Final Interview Analysis & Hiring Report:
   - Overall Score (0-100) & Grade
   - Technical Knowledge, Problem Solving, Communication
   - CV Credibility & Consistency Score
   - Project Knowledge Score
   - Role Fit Score
   - Strengths, Weaknesses, Recommended Learning Areas, and Final Hiring Recommendation.
```

---

## 6. Core Product Architectural Goal

```text
The platform operates under one unified engine:

UNDERSTAND THE USER (CV / Profile)
       ↓
UNDERSTAND THEIR TARGET ROLE & JOB DESCRIPTION
       ↓
ANALYZE THEIR SKILLS & IDENTIFY SKILL GAPS
       ↓
TELL THEM WHAT TO LEARN (What's Next)
       ↓
CREATE A PERSONALIZED 90-DAY PLAN
       ↓
PREPARE THEM THROUGH REAL-TIME CV-AWARE AI INTERVIEWS
       ↓
EVALUATE CREDIBILITY, ROLE FIT & GENERATE HIRING REPORT
```
