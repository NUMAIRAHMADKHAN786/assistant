import React, { useState, useEffect, createContext } from "react";
import main from "../gemini.js";

export const DataContext = createContext();

function UserContext({ children }) {
  const [speaking, setSpeaking] = useState(false);
  const [prompt, setPrompt] = useState("Listening...");
  const [response, setResponse] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  // SPEAK FUNCTION
  function speak(text) {
    setSpeaking(true);
    const utter = new SpeechSynthesisUtterance(text);
    utter.volume = 1;
    utter.rate = 1;
    utter.pitch = 1;
    utter.lang = "hi-IN";

    utter.onend = () => {
      setSpeaking(false);
      setRetryCount(0); // reset retry counter after successful response
      recognition.start();
    };

    window.speechSynthesis.speak(utter);
  }

  // GEMINI RESPONSE HANDLER WITH RETRY
  async function aiResponse(userPrompt) {
    if (isProcessing) return;
    setIsProcessing(true);
    setResponse(false);
    setPrompt("Thinking... 🤔");

    try {
      const text = await main(userPrompt);
      if (!text || text.trim() === "") throw new Error("Empty response");

      const cleaned = text
        .replace(/\*\*/g, "")
        .replace(/Google/gi, "Numair");

      setPrompt(cleaned);
      speak(cleaned);
      setResponse(true);
    } catch (error) {
      console.error("AI error:", error);

      // Retry mechanism (max 2 retries)
      if (retryCount < 2) {
        console.warn(`Retrying Gemini response (${retryCount + 1})...`);
        setRetryCount((prev) => prev + 1);
        setTimeout(() => aiResponse(userPrompt), 1500);
      } else {
        setPrompt("Sorry, I’m having trouble connecting right now.");
        speak("Sorry, I’m having trouble connecting right now.");
      }
    } finally {
      setIsProcessing(false);
    }
  }

  useEffect(() => {
    recognition.onresult = (e) => {
      recognition.stop();
      const transcript = e.results[e.resultIndex][0].transcript;
      setPrompt(transcript);
      aiResponse(transcript);
    };

    recognition.onerror = (err) => {
      console.error("Speech Recognition Error:", err.error);

      const ignoredErrors = [
        "no-speech",
        "aborted",
        "audio-capture",
        "network",
      ];
      if (ignoredErrors.includes(err.error)) return;

      setPrompt("Couldn't catch that. Try again.");
      setTimeout(() => recognition.start(), 2000);
    };

    recognition.start();

    return () => recognition.abort();
  }, []);

  const value = {
    recognition,
    speaking,
    setSpeaking,
    prompt,
    setPrompt,
    response,
    setResponse,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export default UserContext;
