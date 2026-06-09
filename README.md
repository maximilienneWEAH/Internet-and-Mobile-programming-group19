# NetPulse 📶

**NetPulse** is a Quality of Experience (QoE) Network Monitoring Platform designed to measure, analyze, and visualize mobile network performance from the user's perspective. The platform enables subscribers, mobile operators, and regulatory authorities to monitor network quality using key QoE metrics such as latency, throughput, packet loss, and overall user satisfaction.

## 🚀 Features

### Subscriber Features

* User registration and authentication
* Submit network performance reports
* Run network quality tests
* View personal QoE history
* Track network performance over time

### Mobile Operator Features

* Monitor subscriber network experience
* View operator-specific QoE analytics
* Analyze regional network performance
* Access performance reports and trends

### Regulatory Dashboard

* Compare mobile operators
* Monitor national network quality indicators
* Generate QoE performance reports
* Identify underperforming regions and operators

### Analytics Features

* Real-time QoE monitoring
* Operator comparison dashboards
* Regional performance analysis
* Interactive charts and visualizations
* Historical data tracking

---

## 🏗️ System Architecture

```text
Subscriber App
      │
      ▼
NetPulse Platform
      │
 ┌────┴────┐
 │         │
 ▼         ▼
Operator   Regulator
Dashboard  Dashboard
```

---

## 🛠️ Technology Stack

### Frontend

* React
* TypeScript
* Tailwind CSS
* Lucide React Icons

### Backend

* Node.js
* Express.js
* REST API

### Database

* JSON-based storage (Development)
* MongoDB/MySQL (Future Production Deployment)

### Visualization

* Custom Analytics Dashboard
* Charts and Performance Metrics

---

## 📊 QoE Metrics Monitored

The platform evaluates network quality using:

* Latency (ms)
* Download Speed (Mbps)
* Upload Speed (Mbps)
* Packet Loss (%)
* Network Availability
* Overall QoE Score

---

## 📂 Project Structure

```text
NetPulse/
│
├── src/
│   ├── components/
│   ├── assets/
│   ├── App.tsx
│   ├── main.tsx
│   └── types.ts
│
├── server.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/maximilienneWEAH/Internet-and-Mobile-programming-group19.git
```

Navigate to the project folder:

```bash
cd Internet-and-Mobile-programming-group19
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Start the backend server:

```bash
npm run server
```

---

## 🎯 Project Objectives

* Improve visibility of mobile network performance.
* Measure user-perceived network quality.
* Support telecom operators in network optimization.
* Assist regulators in monitoring service quality.
* Provide data-driven insights for improving customer experience.

---

## 👥 Development Team

**Group 19 – Internet and Mobile Programming**

Faculty of Engineering and Technology

University Project – 2026

---

## 📄 License

This project is developed for academic and research purposes.

© 2026 NetPulse Team. All Rights Reserved.
