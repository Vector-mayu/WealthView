# 🚀 WealthView — AI-Powered Finance Dashboard

> A modern, interactive finance dashboard built to demonstrate strong frontend architecture, clean UI thinking, and real-world product mindset.

---

## 💡 Project Overview

This project was developed as part of a **Frontend Finance Dashboard Assessment**.

The goal was to design and build a clean, intuitive interface that allows users to:

* Track financial activity
* Analyze spending patterns
* Interact with structured data

While the assignment did not require production-level complexity, this project goes **beyond the baseline** by introducing scalable architecture, AI integration, and real product thinking.

---

## 🎯 What Was Required (Assessment Scope)

The assignment required:

### 1. Dashboard Overview

* Financial summary (Balance, Income, Expenses)
* Time-based visualization
* Category-based visualization

### 2. Transactions Section

* List of transactions (date, amount, category, type)
* Filtering, sorting, or search

### 3. Role-Based UI

* Viewer vs Admin behavior simulation

### 4. Insights Section

* Basic financial insights (spending trends, comparisons)

### 5. State Management

* Handle transactions, filters, and role efficiently

### 6. UI/UX Expectations

* Clean design
* Responsive layout
* Graceful handling of empty states

---

## ✅ What I Built

### 📊 Dashboard

* Real-time financial summary (Balance, Income, Expenses, Savings Rate)
* Interactive charts (trend + category breakdown)
* Recent transactions preview
* Dynamic financial quote system (placed intentionally in header)

---

### 💳 Transactions System

* Full CRUD functionality (Add / Edit / Delete)
* Advanced filtering (search, category, type)
* Sorting support
* CSV & JSON import capability
* Role-based controls (Admin vs Viewer)

---

### 🧠 Insights Engine

* Savings rate calculation
* Top spending category detection
* Monthly financial comparison
* Daily average spending
* Expense-to-income ratio
* Smart financial observations

---

### 🤖 WealthAI (AI Financial Coach)

* Context-aware chatbot powered by Gemini API
* Understands user financial data
* Multi-turn conversation support
* Quick prompts for user guidance
* Error handling + loading states

> This feature was **not required** but added to simulate real-world product value.

---

## ⚙️ Tech Stack

* **Frontend:** React (Vite)
* **State Management:** Redux Toolkit
* **Styling:** Tailwind CSS
* **Charts:** Recharts
* **Icons:** Lucide React
* **AI Integration:** Gemini API

---

## 🏗 Architecture Approach

### 🔹 State Separation (Key Decision)

* `transactionSlice` → handles all financial data + filters
* `uiSlice` → handles theme, role, navigation, UI state

This separation ensures:

* Scalability
* Maintainability
* Clean data flow

---

### 📁 Folder Structure

```
src/
├── components/
├── pages/
├── store/
├── utils/
├── App.jsx
├── main.jsx
├── index.css
```

---

## 🎨 UI & UX Decisions

* Clean, minimal design with focus on readability
* Fully responsive layout
* Dark mode support
* Floating AI chatbot (real-app inspired UX)
* Sidebar with profile image for personalization
* Graceful empty-state handling

---

## ✨ Extra Features (Beyond Requirements)

* AI-powered financial assistant
* Data import (CSV / JSON)
* Dark mode toggle
* Advanced filtering system
* Smart insights engine
* Custom design system using Tailwind

---

## 🛠 Challenges & How I Solved Them

### ❌ Issue: AI responses were incomplete

**Solution:** Combined multi-part API responses properly

---

### ❌ Issue: Gemini API errors

**Solution:** Switched to stable model (`gemini-2.5-flash`)

---

### ❌ Issue: Tailwind styles not applying

**Solution:** Used JIT-safe syntax (`[20px]`) and restarted build

---

## 🧠 Key Learnings

* Structuring scalable frontend architecture
* Managing global vs UI state effectively
* Debugging real-world UI issues
* Integrating AI into frontend workflows
* Designing with product thinking, not just features

---

## 🚀 Why This Is More Than Just a Project

This is not just a dashboard — it is a **product foundation**.

It includes:

* Scalable architecture
* Real-world feature set
* AI integration
* Clean UX thinking

It demonstrates how a simple assignment can evolve into a **production-ready SaaS idea**.

---

## 📈 Scalability Potential

This project can evolve into:

* Full-stack app (Node.js + Database)
* User authentication system
* Real financial data integrations (bank APIs)
* Advanced analytics & forecasting
* Multi-user SaaS platform

---

## 💰 Business Model Idea

### 🔹 Target Users:

* Individuals tracking finances
* Freelancers
* Small business owners

### 🔹 Monetization:

* Freemium model (basic dashboard free)
* Premium insights & AI coaching
* Subscription plans
* Financial recommendations & integrations

---

## 🚀 Getting Started

```bash
git clone https://github.com/Vector-mayu/WealthView.git
cd wealthview
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file:

```
VITE_GEMINI_API_KEY=your_api_key_here
```

---

## 🌐 Live Demo

> (Add your deployed link here)

---

## 🧑‍💻 Author

**Mayuresh Dandekar**

---

## 🙌 Final Note

This project reflects not just implementation skills, but **how I think as a developer** — focusing on clarity, scalability, and real-world usability.

---
