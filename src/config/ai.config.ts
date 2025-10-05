import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

import SecretConfig from './secrets.config';

dotenv.config();

export default class AIClient {
  static #instance: GoogleGenAI | undefined;

  static get instance(): GoogleGenAI {
    if (!this.#instance) {
      this.#instance = new GoogleGenAI({ apiKey: SecretConfig.geminiApiKey });
    }
    return this.#instance;
  }
}
