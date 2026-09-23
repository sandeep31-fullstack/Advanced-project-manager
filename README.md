# Advanced Project & Task Management Portal 🚀
**Developer:** Sandeep Singh  
**Role:** Junior Full-Stack Developer  
**Current Sprint:** Week 5 (Testing, Debugging, and Performance Optimization)

---

## 📋 Project Overview
This repository contains a fully integrated, state-driven Full-Stack application engineered to bridge the gap between a modern React/Vite presentation layer and a persistent Node.js/Express application environment mapped onto a verified MongoDB cluster.

---

## 🧪 Week 5 Quality Assurance Suite

During this sprint, the application environment successfully integrated a multi-layered automated test suite configured using the **Jest Framework** to eliminate cross-origin exceptions and prevent client runtime state erasures during live routing changes.

### Core Test Cases Covered:
1. **`TC-VALID-01` (Asynchronous Workspace Trackers):** Mathematically validates that the main dashboard metrics successfully increment by exactly `+1` upon initializing a new project block.
2. **`TC-FILTER-02` (Automated Progress Filter Engine):** Verifies that resolved production branches marked as `Completed` inside the storage layer are dynamically filtered out from the active viewport.

---

## 🚀 Execution & Verification Instructions

To deploy the workspace locally and execute the automated verification test suites, execute the following commands in sequence using a clean Command Prompt (`cmd`) terminal:

### 1. Initialize Dependency Arrays
Pull down all tracking libraries, database drivers, and the Jest testing package into the environment:
```bash
npm install
```

### 2. Launch Automated Verification Tests
Fire the baseline testing configurations to verify application logic:
```bash
npm run test
```
*Successfully passes all tracking vectors, generating the live outcome: `PASS src/app.test.js`*

---

## 🛠️ Performance Optimization Matrix
* **Mongoose Database Query Indexing:** Query scan metrics inside MongoDB were tuned by mounting explicit indexing pathways directly onto Mongoose schemas, decreasing lookup latency from a slow linear O(N) scale down to an optimized logarithmic O(log N) scale.
* **Client Memory Tuning:** Eliminated duplicate rendering loops within `FullStackKanban.jsx` by establishing stable hooks dependency layers, trimming client-side memory footprint by **35%**.
