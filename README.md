# GitAnalyzer v1.0 🚀

**GitAnalyzer** is an AI-powered Git Commit Changelog Analyzer. It automatically tracks your GitHub repositories, reads your latest commit logs, and uses Artificial Intelligence to instantly convert messy technical code updates into clean, professional release notes.

By moving everything onto cloud servers, the entire process runs completely in the background. This means your user interface stays fast and responsive, and the tool works flawlessly from any device—including your mobile phone—without using up any of your local computer's processing power.

---

## 🌐 Live Deployment Links
* **Production Frontend UI:** [https://git-analyzer-alpha.vercel.app](https://git-analyzer-alpha.vercel.app)
* **Production Backend API:** [https://git-analyzer-g5k4.onrender.com](https://git-analyzer-g5k4.onrender.com)

---

## 🏗️ System Architecture & Data Flow

The application operates as a globally accessible, event-driven pipeline that runs entirely in the cloud. Here is how the data flows through the system step-by-step:

1. **The User Input (Vercel Frontend)**
   The user enters a GitHub repository URL into the web interface hosted on Vercel and clicks "Generate".
   
2. **The Gateway (Render Backend)**
   The request hits a Spring Boot application running on Render. The backend immediately creates a tracking row in the database marked as `pending` and hands the heavy lifting off to the cloud automation layer so the user's screen never freezes.

3. **The AI Engine (Railway & n8n)**
   An automation platform (n8n) running on Railway takes over. It securely connects to GitHub to fetch the latest commit data, passes that code context over to Google Gemini AI using optimized instructions, and generates a structured changelog.

4. **The Database Sync (PostgreSQL Callback)**
   Once the AI finishes generating the text, n8n sends a secure callback request back to Render. The backend updates the database row status to `completed` and saves the final markdown report directly into a PostgreSQL database table.

5. **The Final Display**
   The frontend UI, which has been checking the database status in the background, detects the completion and instantly displays the polished AI changelog to the user.

---
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

