# FairShift

**A decent work platform for employee-intensive organisations.**
Built for Prompt Wars 2026 (Prompt Wars × SRM ACM Student Chapter) · Theme: **SDG 8 – Decent Work and Economic Growth**

Live prototype: https://claude.ai/artifact/VBwcYjYtFFyk42Tfs7dQxN

---

## The problem

Construction companies, colleges, hospitals and factories still run their workforce on paper registers, spreadsheets and WhatsApp groups. That leaves workers unsure how their pay was calculated, afraid to complain, and without any record of the skills they have earned. Employers only find out about burnout, safety hazards and resignations after they have become serious.

## The solution

FairShift gives workers a simple, multilingual app and gives employers a dashboard, both built on the same data. Work becomes fairer, safer and more transparent for workers, and employers get early warning of problems.

## Features

| Feature | Worker side | Employer side |
|---|---|---|
| **Attendance and shift tracking** | Scan a QR code to check in and out. Regular and overtime hours are split automatically. | Daily attendance and a weekly trend chart |
| **Transparent payslip** | Itemised earnings and deductions with a plain-language explanation. A Listen button reads it aloud. | n/a |
| **Grievance and safety reporting** | Report by text or voice, optionally hiding the name, and track status | Complaint manager with Open, In progress and Resolved status |
| **Anonymous feedback** | Star rating and comment by topic, with no identity stored | Theme scores and recent anonymous comments |
| **Fatigue alerts** | A rest alert when hours exceed 60 in 7 days or there is no rest day for 7 days | Count of flagged employees and per-person flags |
| **Skill passport** | Verified training, certificates and experience that move with the worker | n/a |
| **Employer dashboard** | n/a | KPIs, attendance chart, feedback themes, complaints and a team wellbeing table with a leave-risk score |
| **Multilingual and voice support** | English, தமிழ் (Tamil) and हिन्दी (Hindi), voice input and read-aloud | Dashboard in English |

## Two industries, one engine

The industry switch in the header swaps the data, rates, feedback topics and certificates. The logic stays the same.

| | Construction site | College |
|---|---|---|
| Check-in point | Site gate QR | Department QR |
| Sample role | Mason | Lab assistant |
| Safety reports | Scaffold, harness, helmet hazards | Lab extraction, chemical handling |
| Feedback topics | Supervisor, safety gear, pay on time | Department head, workload, facilities |
| Skill passport | Working at Height, Scaffolding, First Aid | Lab Safety, Chemical Handling, Records System |

The same approach extends to hospitals, factories and schools by changing the configuration only.

## How to run

It is a single static file with no build step and no dependencies.

1. Download `fairshift.html` (or rename it to `index.html`).
2. Open it in any modern browser, or host it on any static host.
3. Use the header controls to switch industry, language and role (Worker or Employer).

## Suggested demo flow

1. **Worker, Construction:** check in, then check out and see the overtime split.
2. Open **Payslip** and tap **Listen**. Switch the language to Tamil and compare.
3. Open **Today** and see the rest alert (73 hours in 7 days).
4. Open **Report**, file a safety hazard with "Hide my name" ticked, and note its status.
5. Open **Feedback** and submit an anonymous rating.
6. Switch to **Employer** to see the new report, change its status, and see the updated feedback themes and leave-risk table.
7. Switch the industry to **College** and repeat to show the same engine at work.

## Business rules in the prototype

- **Payslip:** basic = days × 8 hours × hourly rate. Overtime is paid at 1.5×. Provident fund is 12% of basic. ESI is 0.75% of gross.
- **Fatigue flag:** more than 60 hours in 7 days, or 7 consecutive working days.
- **Leave-risk score (0–100):** +30 for more than 60 weekly hours, +25 for attendance below 85%, +30 for mood of 2 or lower, +15 for 6 or more consecutive days.

## Inclusivity and low-end device support

- Large tap targets, icon-plus-label navigation and a one-hand bottom tab bar
- Regional language UI and read-aloud for low-literacy users
- Voice input where the browser supports it
- No frameworks or heavy libraries, so it loads quickly on basic smartphones
- Light and dark modes and visible keyboard focus

## Tech

HTML, CSS and vanilla JavaScript in one file. Uses the Web Speech API for voice input and read-aloud, and Google Fonts (Noto Sans, Noto Sans Tamil, Noto Sans Devanagari) for regional scripts.

## Testing

The tests run the real app script in a sandbox with a stubbed DOM, so they cover the shipped code and need no dependencies.

```
npm test        # Node 18+
```

They check payslip maths, fatigue and leave-risk rules, input sanitising, rate limiting, XSS safety of rendered output, that anonymous reports and feedback never store identity, and that every UI string exists in English, Tamil and Hindi. A GitHub Actions workflow (`.github/workflows/test.yml`) runs them on every push.

## Security

- All user text is escaped before rendering, and a Content Security Policy blocks external scripts, frames and network calls.
- Input is stripped of control characters and capped at 500 characters.
- Submissions are limited to 5 per minute (client-side in the prototype; a real backend must enforce this server-side).
- Anonymous reports and feedback store no name, and the employer view shows "Anonymous".
- No cookies, trackers or third-party scripts. The only external request is Google Fonts.

## Accessibility

Skip link, labelled controls, `aria-pressed` and `aria-current` states, screen-reader announcements for sent reports, text alternatives for charts, focus kept in place after updates, 44px tap targets, and light and dark themes.

## Limitations of the prototype

- Data is held in memory and resets on refresh.
- QR check-in and the 10.5-hour shift are simulated.
- The employer dashboard and skill names are in English only.
- Voice features depend on browser support and may be blocked in embedded pages.
- Anonymity is a demonstration. A real deployment needs tokenised reporting and server-side enforcement.

## Roadmap

1. Backend and database (for example Postgres or Firebase) with role-based access
2. Real QR and geofence check-in with anti-spoofing
3. SMS, WhatsApp or OTP login for workers on basic phones
4. Tokenised anonymous reporting so even admins cannot trace the reporter
5. Offline-first mode (PWA) for sites with poor connectivity
6. Verifiable skill credentials issued by training bodies
7. Translated employer dashboard and more regional languages
8. Payroll and HR system integrations

## SDG 8 alignment

- **8.5:** Decent work and equal pay for work of equal value, through transparent payslips and overtime tracking
- **8.8:** Safe and secure working environments, through hazard reporting and fatigue alerts
- **8.6 and 8.3:** Skill passport that supports employability and formal job mobility

## Team

Add team name and members here.
