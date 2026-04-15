export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  image?: string;
}

export interface Evidence {
  phrase: string;
  explanation: string;
  sentiment: "Positive" | "Negative" | "Neutral";
  type: string;
}

export interface SourceCredibility {
  score: number;
  details: string;
}

export interface VerificationResult {
  classification: "Authentic" | "Misleading" | "Fake";
  confidence: number;
  reasoning: string;
  evidence: Evidence[];
  sourceCredibility?: SourceCredibility;
}

export interface PredictionHistory {
  id: string;
  userId: string;
  text: string;
  url?: string;
  result: VerificationResult;
  timestamp: any;
}
