import Groq from 'groq-sdk';
import { groqConfig } from '../config/groq';

const groq = new Groq({
  apiKey: groqConfig.apiKey,
});

export interface GroqPromptOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export class GroqService {
  private defaultModel = groqConfig.defaultModel;
  private defaultTemperature = groqConfig.defaultTemperature;
  private defaultMaxTokens = groqConfig.defaultMaxTokens;

  /**
   * Send a text prompt to Groq AI
   */
  async sendPrompt(
    prompt: string,
    options: GroqPromptOptions = {}
  ): Promise<string> {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: options.model || this.defaultModel,
        temperature: options.temperature ?? this.defaultTemperature,
        max_tokens: options.maxTokens ?? this.defaultMaxTokens,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Groq API error:', error);
      throw new Error('Failed to process AI prompt');
    }
  }

  /**
   * Send a structured prompt with system message for better responses
   */
  async sendStructuredPrompt(
    systemMessage: string,
    userPrompt: string,
    options: GroqPromptOptions = {}
  ): Promise<string> {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: systemMessage,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        model: options.model || this.defaultModel,
        temperature: options.temperature ?? this.defaultTemperature,
        max_tokens: options.maxTokens ?? this.defaultMaxTokens,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Groq API error:', error);
      throw new Error('Failed to process AI prompt');
    }
  }

  /**
   * Extract property information from document text using AI
   * This can be used to parse the Declaration of Division (Teilungserklärung)
   */
  async extractPropertyInfo(documentText: string): Promise<any> {
    const systemMessage = `You are an expert at extracting structured information from German property documents (Teilungserklärung). 
Extract all relevant property, building, and unit information and return it as JSON.`;

    const userPrompt = `Please extract the following information from this property document and return it as JSON:

{
  "property": {
    "name": "property name",
    "managementType": "WEG or MV",
    "address": {
      "street": "...",
      "houseNumber": "...",
      "postalCode": "...",
      "city": "...",
      "country": "..."
    }
  },
  "buildings": [
    {
      "address": {
        "street": "...",
        "houseNumber": "...",
        "postalCode": "...",
        "city": "...",
        "country": "..."
      },
      "additionalDetails": "..."
    }
  ],
  "units": [
    {
      "unitNumber": "...",
      "type": "Apartment/Office/Garden/Parking",
      "floor": "...",
      "entrance": "...",
      "sizeSqm": number,
      "coOwnershipShare": number (between 0 and 1),
      "constructionYear": number,
      "rooms": number,
      "buildingIndex": number (index in buildings array)
    }
  ]
}

Document text:
${documentText}`;

    try {
      const response = await this.sendStructuredPrompt(systemMessage, userPrompt, {
        temperature: 0.3, // Lower temperature for more consistent extraction
      });

      // Try to parse JSON from response
      // Sometimes the AI wraps JSON in markdown code blocks
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || response.match(/```\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : response;
      
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error extracting property info:', error);
      throw new Error('Failed to extract property information from document');
    }
  }
}

export const groqService = new GroqService();

