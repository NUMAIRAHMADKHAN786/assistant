import React,{useState} from 'react'
import  { createContext  } from 'react';
import main from '../gemini';

// Use PascalCase for context name
export const DataContext = createContext();

function UserContext({ children }) {
let [speaking,setSpeaking]=useState(false)
let [prompt,setPrompt]=useState("listening...")
let[response,setResponse]=useState(false)
  function speak(text) {
    // Create utterance instance correctly
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.volume = 1;
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.lang = "hi-GB"; // Hindi language code

    // Use window.speechSynthesis (lowercase) to speak
    window.speechSynthesis.speak(text_speak);
  }
  async function aiResponse(prompt) {
  let text = await main(prompt);
  let newText=text.split("**")&&text.split("**")&&text.replace("google","Numair")&&text.replace("Google","Numair");
  setPrompt(newText);
  speak(newText)
  setResponse(true)
  setTimeout(() => {
  setSpeaking(false)
  },5000);
}
  let SpeechRecognition=window.SpeechRecognition || window.webkitSpeechRecognition
  let recognition=new SpeechRecognition()
  recognition.onresult=(e)=>{
    let currentIndex=e.resultIndex
    let transcript=e.results[currentIndex][0].transcript
    setPrompt(transcript)
    aiResponse(transcript);
  }
  // function takeCommand(command){
  //   if(command.includes("open")&&command.includes("youtube")){
  //     window.open("https://www.youtube.com","_blank")
  //     speak("opening youtube")
  //     setPrompt("opening youtube")
  //     setTimeout(() => {
  // setSpeaking(false)
  // },5000);
  //   }
  // }
  const value = {
    recognition,
    speaking,
    setSpeaking,
    prompt,
    setPrompt,
    response,
    setResponse
  }; 
  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
export default UserContext;



