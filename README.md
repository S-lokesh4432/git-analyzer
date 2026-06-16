# GitAnalyzer v1.0 🚀

GitAnalyzer is a fully decoupled, cloud-native DevOps tool designed to automate repository tracking and update logs. By offloading heavy computing and processing tasks to an asynchronous microservice mesh, the platform quickly generates structured, professional release changelogs using Generative AI without tying up local computing resources.

---

## 🌐 Live Deployment Links
* **Production Frontend UI:** [https://git-analyzer-alpha.vercel.app](https://git-analyzer-alpha.vercel.app)
* **Production Backend API:** [https://git-analyzer-g5k4.onrender.com](https://git-analyzer-g5k4.onrender.com)

---

## 🏗️ System Architecture & Data Flow

The application operates as a globally accessible, event-driven pipeline moving entirely away from restrictive local host dependencies:

[Client / Mobile Browser]
│
▼ (User submits Git URL)
┌───────────┐
│  Vercel   │ ──► React Frontend Layout (SPA)
└─────┬─────┘
│ (Asynchronous REST API Call)
▼
┌───────────┐
│  Render   │ ──► Spring Boot API Gateway (Manages DB ledger metadata)
└─────┬─────┘
│ (Secure Webhook Call HTTP POST Payload)
▼
┌───────────┐
│  Railway  │ ──► n8n Workflow Engine ──► GitHub REST API (Clones/Fetches Data)
└─────┬─────┘                                  │
│                                        ▼
│                                Google Gemini AI (Compiles Changelog)
│                                        │
└◄───────────────────────────────────────┘
│ (HTTP Callback Return Payload)
▼
┌───────────┐
│ PostgreSQL│ ──► Relational Database Table (Stores Markdown Ledger State)
└───────────┘

### The Pipeline Execution Loop:
1. **Trigger:** A user inputs a repository link into the responsive Vercel interface and executes the transaction. 
2. **Delegation:** The Spring Boot backend instantiates a transient tracking row inside the database ledger, tags its state as `pending`, and immediately hands the execution off to the background webhook layer so the UI never blocks or freezes.
3. **AI Compilation:** A secure data payload fires into the Railway engine. The automated n8n workflow extracts structural repository components, passes them to Google Gemini AI models using optimized engineering prompts, and structures the generated output.
4. **Callback Sync:** The n8n engine issues an asynchronous HTTP POST return call back to Render's endpoints, upgrading the internal row status to `completed` and saving the raw markdown text directly into the database, making it instantly available to the React client interface.

---

## 🛠️ Technology Stack

| Layer | Technology | Deployment Platform |
| :--- | :--- | :--- |
| **Frontend UI** | React.js, Tailwind CSS, Axios, Lucide React | Vercel |
| **Backend API Gateway** | Java Spring Boot, Spring Data JPA, RestTemplate | Render |
| **Automation Workflow** | n8n Workflow Engine | Railway |
| **Database Tier** | PostgreSQL Relational Ledger | Railway Container Mesh |
| **Artificial Intelligence** | Google Gemini API (Natural Language Processing) | Cloud Infrastructure |

