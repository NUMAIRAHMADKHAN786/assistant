import React, { useContext } from 'react'
import "./App.css"
import va from "./assets/ai.png"
import { CiMicrophoneOn } from "react-icons/ci";
import { DataContext } from './context/UserContext.jsx';
import speakimg from "./assets/speak.gif"
import aigif from "./assets/aiVoice.gif"
function App() {
  let {recognition,speaking,setSpeaking,prompt,response,setPrompt,setResponse}=useContext(DataContext)
  // speak("Hello brother")

 
  return (
    <div className="main">
      <img src={va} alt="" id="Shifra"/>
      <span>I'm Shifra, Your Advanced Virtual Assistant</span>
      {!speaking ? (
        <button 
          onClick={() => {
            setPrompt("listening...")
            setSpeaking(true)
            setResponse(false);
            recognition.start();
          }}
        >
          Click Here <CiMicrophoneOn />
        </button>
      ) : (
        <div className='response'>
          {!response?<img src={speakimg}
          alt="" id="speak"/>
          :<img src={aigif} alt="" id="aigif"/>}
      
        <p>{prompt}</p>
        </div>
      )}
    </div>
  )
}

export default App