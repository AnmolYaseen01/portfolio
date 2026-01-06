
export enum CaseType {
  CRIMINAL = 'Criminal (FIR/Bail)',
  PROPERTY = 'Property/Land Dispute',
  FAMILY = 'Family Law (Marriage/Divorce)',
  LABOUR = 'Labour/Employment',
  CONSUMER = 'Consumer Rights',
  OTHER = 'Other'
}

export interface User {
  name: string;
  email: string;
  joinedAt: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isThinking?: boolean;
  groundingUrls?: { uri: string; title: string }[];
}

export interface AnalysisResult {
  summary: string;
  risks: string[];
  nextSteps: string[];
  simplifiedTerms: { term: string; meaning: string }[];
}
