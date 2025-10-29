let ApiKey = "AIzaSyAwCDKrrI0b4bCEiOu3sRIm2uNcbAS3mSg";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Create AI client
const ai = new GoogleGenerativeAI(ApiKey);

async function main(prompt = "Explain how AI works in a few words") {
  // Generate response
  const result = await ai.getGenerativeModel({ model: "gemini-2.5-flash" }).generateContent(prompt);

  // Extract the text safely
  const output = result.response.text();
  return output;
}

export default main;
