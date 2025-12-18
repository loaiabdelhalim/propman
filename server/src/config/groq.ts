import dotenv from 'dotenv';

dotenv.config();

export const groqConfig = {
  apiKey: process.env.GROQ_API_KEY || '',
  defaultModel: process.env.GROQ_MODEL || 'llama-3.1-70b-versatile',
  defaultTemperature: parseFloat(process.env.GROQ_TEMPERATURE || '0.7'),
  defaultMaxTokens: parseInt(process.env.GROQ_MAX_TOKENS || '4096', 10),
};

if (!groqConfig.apiKey && process.env.NODE_ENV === 'production') {
  console.warn('Warning: GROQ_API_KEY is not set. AI features will not work.');
}