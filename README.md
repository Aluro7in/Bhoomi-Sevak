<div align="center">

# **🌍 BHOOMI-SEVAK**

**AI-Native Web Portal for Land Records & Citizen Services**

> *"Empowering citizens with transparent, intelligent, and accessible land record management."*

<br/>

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-Runtime-fbf0df?style=for-the-badge&logo=bun&logoColor=black)
![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)
![AI](https://img.shields.io/badge/AI-Powered-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)

</div>

---

## **📑 Table of Contents**

| | Section | | Section |
| :---: | :--- | :---: | :--- |
| 🎯 | [Overview](#-overview) | 🏗️ | [Architecture](#️-architecture) |
| ✨ | [Key Features](#-key-features) | 🧱 | [Tech Stack](#-tech-stack) |
| 📁 | [Project Structure](#-project-structure) | 🚀 | [Getting Started](#-getting-started) |
| 🧠 | [AI & Comparison Engine](#-ai--comparison-engine) | 🛡️ | [Privacy & Security](#️-privacy--security) |

---

## **🎯 Overview**

**Bhoomi-Sevak** is a Progressive Web App (PWA) designed to act as a modern, AI-assisted bridge between citizens and complex land record systems. Moving beyond the traditional mobile-only approach, Bhoomi-Sevak offers a highly accessible web portal with offline capabilities, voice search, and intelligent document comparison.

It replaces bureaucratic friction with a transparent, user-centric interface for searching cadastral maps, tracking mutations, and understanding land data.

---

## **🏗️ Architecture**

Bhoomi-Sevak utilizes a robust, modular architecture separating the server domain, app entry, and citizen-facing services.

```mermaid
flowchart TD
    %% Citizen Actor
    C(("🧑 Citizen")) -->|opens| BA

    %% App Entry
    subgraph Entry["🌐 App Entry and Portal"]
        BA["Browser app<br/>(main.tsx)"]
        AS["App shell<br/>(App.tsx)"]
        SC["Services catalog"]
        AST["App state<br/>(AppContext.tsx)"]
        PP["Public portal<br/>(PublicPortal.tsx)"]
        OC[("Offline cache<br/>(offlineCache.ts)")]

        BA -->|renders| AS
        AS -->|uses| AST
        AS -->|renders| PP
        SC -->|navigates via| AST
        AST -->|saves data| OC
    end

    %% Server Domain
    subgraph Server["🖥️ Server Domain Modules"]
        LD["Land data<br/>(data.ts)"]
        HS["HTTP server<br/>(server.ts)"]
        AI["AI services<br/>(ai.ts)"]
        RC["Record comparison"]
        
        AI -->|imports| RC
    end

    %% Citizen Services
    subgraph Citizen["🧑‍🤝‍🧑 Citizen Services"]
        VS["Voice search"]
        BL["Document locker<br/>(BhulekhLocker.tsx)"]
        MT["Mutation tracker"]
        DI["Document intelligence"]
    end

    %% Land Records
    subgraph Records["🗺️ Land Records and Maps"]
        CM["Cadastral map"]
        LRD["Land record detail"]
        LDash["Land dashboard<br/>(MeriZameenHome.tsx)"]
    end

    %% Connections
    AST -->|searches via| Server
    AST -->|renders| Citizen
    AS -->|renders| Records

    %% Styling
    style C fill:#6C5CE7,color:#fff,stroke:#fff
    style Entry fill:#0984E3,color:#fff
    style Server fill:#2D3436,color:#fff
    style Citizen fill:#00B894,color:#fff
    style Records fill:#FDCB6E,color:#000
```

---

## **✨ Key Features**

### **🧑‍🤝‍🧑 Citizen Services**
*   **🎙️ Voice Search:** Query land records using natural speech, breaking down literacy and typing barriers.
*   **📁 Document Locker (`BhulekhLocker.tsx`):** A secure digital vault for citizens to store and retrieve their land documents.
*   **🔄 Mutation Tracker:** Real-time status updates on land mutation applications.
*   **🧠 Document Intelligence:** AI-driven extraction of key data points from uploaded land documents.

### **🗺️ Land Records & Maps**
*   **🗺️ Cadastral Map:** Interactive mapping of land parcels and boundaries.
*   **📄 Land Record Detail:** Deep-dive view of RoR (Record of Rights) data.
*   **📊 Land Dashboard (`MeriZameenHome.tsx`):** A unified, personalized dashboard for citizens to view all their land holdings at a glance.

### **⚙️ System Capabilities**
*   **📴 Offline-First Caching:** Utilizes `offlineCache.ts` and Service Workers (`sw.js`) so users can access previously viewed records without an internet connection.
*   **⚖️ Record Comparison:** Automatically detects and highlights discrepancies between old and new land records.

---

## **🧱 Tech Stack**

<div align="center">

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-000000?style=flat-square&logo=bun&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)

</div>

<br/>

| &nbsp; | **Layer** | **Technology** | **Purpose** |
| :---: | :--- | :--- | :--- |
| ⚛️ | **Frontend** | **React + TypeScript** | Component-driven UI with strict type safety |
| ⚡ | **Build Tool** | **Vite** | Lightning-fast HMR and optimized production builds |
| 📦 | **Runtime/Pkg** | **Bun** | Ultra-fast package manager and script runner (`bun.lock`) |
| 🛰️ | **Backend** | **Node/Bun Server** | Custom HTTP server (`server.ts`) for API and AI routing |
| 📱 | **PWA** | **Service Worker** (`sw.js`) | Offline caching and native-like installation |
| 🤖 | **AI Layer** | **Gemini/Custom AI** | Document parsing and intelligent record comparison |

---

## **📁 Project Structure**

```text
bhoomi-sevak/
│
├── 📂 public/                 # Static assets & PWA Service Worker
│   ├── 🖼️ images/             # Logos, icons, and static UI graphics
│   └── ⚙️ sw.js               # Service Worker for offline caching
│
├── 📂 server/                 # Server domain logic
│   ├── 🤖 ai.ts               # AI service integration (Gemini, etc.)
│   ├── ⚖️ comparisonEngine.ts # Logic for diffing land records
│   └── 🗄️ data.ts             # Land data models & mock DB
│
├── 📂 src/                    # React Frontend Application
│   ├── 🧩 components/         # Reusable UI (MeriZameenHome, BhulekhLocker, etc.)
│   ├── 🌐 context/            # React Context (AppContext.tsx for global state)
│   ├── 🛠️ utils/              # Helper functions
│   ├── 🎨 App.tsx             # App shell & routing layout
│   ├── 🚀 main.tsx            # React DOM entry point
│   ├── 📝 types.ts            # Global TypeScript interfaces
│   └── 🎨 index.css           # Global styles
│
├── 🔑 .env.example            # Environment variables template
├── 📦 bun.lock                # Bun lockfile
├── 📄 index.html              # Vite HTML entry
├── 📜 package.json            # Dependencies & scripts
├── ⚙️ server.ts               # HTTP Server entry point
├── 🔧 tsconfig.json           # TypeScript configuration
└── 🚀 vite.config.ts          # Vite bundler configuration
```

---

## **🚀 Getting Started**

### **① Prerequisites**
Ensure you have **Bun** (recommended) or **Node.js** installed.

```bash
# Install Bun (if you haven't already)
curl -fsSL https://bun.sh/install | bash
```

### **② Clone & Install**
```bash
git clone https://github.com/Aluro7in/bhoomi-sevak.git
cd bhoomi-sevak

# Install dependencies using Bun
bun install
```

### **③ Environment Setup**
Copy the example environment file and add your API keys.
```bash
cp .env.example .env
```
*(Edit `.env` to include your Gemini API key or other required secrets)*

### **④ Run the App**
```bash
# Start the Vite frontend
bun run dev

# In a separate terminal, start the backend server
bun run server.ts
```

### **⑤ Build for Production**
```bash
bun run build
```

---

## **🧠 AI & Comparison Engine**

Bhoomi-Sevak uses a hybrid AI approach. 

1.  **Document Intelligence (`ai.ts`)**: Extracts text and structured data from uploaded PDFs/images using vision models.
2.  **Comparison Engine (`comparisonEngine.ts`)**: Compares historic land records with newly fetched data to identify discrepancies (e.g., boundary changes, ownership transfers) and flags them for the citizen.
3.  **Offline Cache (`offlineCache.ts`)**: Ensures that AI-generated summaries of land records are saved locally via the Service Worker so citizens in low-connectivity areas can still read them.

---

## **🛡️ Privacy & Security**

> ⚠️ **Data Sensitivity**
> Land records contain PII (Personally Identifiable Information).

*   **Local-First Processing:** Where possible, record comparisons are done locally or via secure server endpoints.
*   **No Unencrypted AI Egress:** Sensitive data is stripped of direct identifiers before being sent to LLM providers.
*   **Offline Safety:** Cached data in the browser is secured via standard web storage practices and can be manually cleared by the user via the UI.

---

<div align="center">

## **🌍 BHOOMI-SEVAK**

*Transparent Land Records for Every Citizen.*

[![Report Bug](https://img.shields.io/badge/🐞_Report_Bug-FF6B6B?style=for-the-badge)](../../issues)
[![Request Feature](https://img.shields.io/badge/✨_Request_Feature-6C5CE7?style=for-the-badge)](../../issues)

<sub>Built with ⚡ Bun, React, and a mission for transparent governance.</sub>

</div>
