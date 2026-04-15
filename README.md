# News Authentix 🛡️

**News Authentix** is a professional, enterprise-grade news verification platform that leverages advanced AI to mitigate misinformation. It provides deep content analysis, source credibility scoring, and explainable AI (LIME) evidence mapping.

## 🚀 Features

- **AI Verification Engine**: Deep analysis using Google Gemini 1.5 Flash.
- **Explainable AI (LIME)**: Visual mapping of evidence snippets with sentiment and type analysis.
- **Source Trust Index**: Real-time credibility scoring for news URLs.
- **Global News Feed**: Curated significant global news headlines.
- **Analytics Dashboard**: Insights into verification trends and classification distribution.
- **Manual Authentication**: Custom signup and login system with local persistence.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion, Recharts.
- **Backend**: Node.js (Express), Vercel Serverless Functions.
- **AI Engine**: Google Gemini API.

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/news-authentix.git
cd news-authentix
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add your Gemini API key:

```env
GEMINI_API_KEY="your_gemini_api_key"
```

### 4. Run Locally
```bash
npm run dev
```

## 🌐 Deployment (Vercel)

This project is pre-configured for Vercel deployment.

1. Push your code to a GitHub repository.
2. Connect the repository to Vercel.
3. Add `GEMINI_API_KEY` to the **Environment Variables** section in the Vercel project settings.
4. Deploy!

## 🔒 Security Note

The `.env` file is included in `.gitignore` to prevent sensitive API keys from being exposed in public repositories. Always use environment variables for production deployments.

## 📄 License

This project is licensed under the MIT License.
