# News Authentix: Full Technical Documentation 🛡️

## 1. Introduction & Project Vision
**News Authentix** is a cutting-edge, AI-powered news verification ecosystem designed to combat the spread of misinformation in the digital age. Unlike basic fact-checkers, News Authentix provides **Explainable AI (XAI)**, allowing users to move beyond binary "True/False" verdicts and understand the underlying logic of the analysis.

The platform targets journalists, researchers, and conscious news consumers who require deep-dive analysis and verifiable evidence for the content they consume.

---

## 2. Core Architecture

The application follows a **Full-Stack SPA (Single Page Application)** architecture:

### 2.1. Frontend (The Interface)
- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Light Mode Only).
- **Animations**: Framer Motion (used for page transitions, loading states, and result entry).
- **Charts**: Recharts (used for analytics and confidence trend visualization).
- **Icons**: Lucide React.

### 2.2. Backend (The Proxy & Logic)
- **Runtime**: Node.js
- **Server**: Express.js
- **Purpose**: 
  - Proxies requests to the Google Gemini API to keep API keys secure.
  - Implements caching for news feeds to optimize performance and quota usage.
  - Serves static assets in production.

### 2.3. AI Engine (The Brain)
- **Provider**: Google Gemini API (`@google/genai`).
- **Model**: `gemini-1.5-flash-latest`.
- **Capabilities**: 
  - Natural Language Processing (NLP) for content analysis.
  - **Function Calling / Tools**: Uses the `googleSearch` tool for real-time news retrieval.
  - **Structured Output**: Enforces JSON schemas for consistent UI rendering.

---

## 3. Feature Breakdown

### 3.1. Instant News Verification
Users can paste raw text or provide a news URL. The system:
1. Sends the content to the Gemini API.
2. Analyzes for factual consistency, emotional bias, and logical fallacies.
3. Produces a classification (**Authentic**, **Misleading**, or **Fake**).
4. Assigns a **Confidence Score** (0-100%).

### 3.2. Explainable AI (LIME Evidence Mapping)
The most unique feature of the app. It breaks down the AI's "thought process" into specific evidence snippets:
- **Phrase Extraction**: Pulls exact quotes from the input.
- **Explanation**: Explains *why* that specific snippet is problematic or supporting.
- **Sentiment Analysis**: Tags the snippet as Positive, Negative, or Neutral.
- **Type Tagging**: Categorizes evidence (e.g., "Emotional Bias", "Factual Claim").

### 3.3. Global News Feed & Categorization
A real-time ticker showing significant news across multiple sectors:
- **Categories**: World, Technology, Science, Business, Health, Entertainment, Sports, Politics.
- **Real-time Source**: Uses Gemini's search capabilities to fetch headlines from the last 24 hours.
- **Share Functionality**: Allows users to copy article URLs directly to their clipboard.

### 3.4. Analytics Dashboard
Provides high-level insights for the authenticated user:
- **Reliability Scorecard**: aggregated stats of all verifications.
- **Confidence Trend**: A chart showing how news reliability is trending across the user's history.
- **Source Reliability**: A breakdown of the most frequently verified domains and their average trust scores.

---

## 4. Technical Implementation Details

### 4.1. AI Prompt Engineering
The system uses a highly structured system prompt in `server.ts`. It instructs the model to act as a neutral fact-checker and requires response in a specific JSON schema.
- **Verification Prompt**: Focuses on extraction of evidence and sentiment.
- **News Feed Prompt**: Utilizes `tools: [{ googleSearch: {} }]` to ground the model's response in current events.

### 4.2. State Management & Navigation
- **Navigation**: Managed by `react-router-dom` with protected routes for the Dashboard.
- **Global State**: `Dashboard.tsx` uses a centralized state for `activeTab`, `history`, `newsFeed`, and `reliabilityStats`.
- **Persistence**: Verification history is automatically saved to `localStorage`, allowing users to revisit past analyses.

### 4.3. Manual Authentication
A custom authentication service located in `src/lib/auth.ts`:
- Emulates a database using `localStorage`.
- Supports Signup, Login, and Session persistence.
- Provides a "Context-like" experience for user identity.

---

## 5. Security & Environment
- **Environment Variables**: Sensitive keys are stored in `.env.example`.
- **API Security**: No third-party API keys are exposed to the client. The browser communicates only with the Express server.
- **Data Sanitization**: Uses `clsx` and `tailwind-merge` (`cn` utility) for safe class manipulation.

---

## 6. Setup & Installation

### Prerequisites
- Node.js (v18+)
- A Google Gemini API Key.

### Steps
1. **Clone & Install**:
   ```bash
   npm install
   ```
2. **Environment**: Ensure `GEMINI_API_KEY` is set in your environment.
3. **Start Development**:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:3000`.

---

## 7. Future Roadmap
- **Blockchain Verification**: Anchoring verification hashes for permanent, immutable records.
- **Multi-Source Cross-Referencing**: Automatically comparing multiple URLs for the same story.
- **Browser Extension**: Real-time verification snippets while browsing popular news sites.
- **Community fact-checking**: Allowing users to vote on AI verdicts.

---

**Developed with ❤️ for News Authentix.**
