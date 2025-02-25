"use client";

import "regenerator-runtime/runtime";
import React, { useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import TextToSpeech from "./TextToSpeech";

const Dictaphone = () => {
  const [chatResponse, setChatResponse] = useState(""); // State to store AI response
  const [isResponseComplete, setIsResponseComplete] = useState(false); // Track if response is complete
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  async function getChatResponse() {
    setChatResponse(""); // Clear previous response
    setIsResponseComplete(false); // Reset response complete flag

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content:
              transcript ||
              "Write a bubble sort implementation in JavaScript with comments explaining how it works",
          },
        ],
      }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let fullResponse = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      fullResponse += decoder.decode(value); // Concatenate streamed content
    }

    setChatResponse(fullResponse); // Update state with full response
    setIsResponseComplete(true); // Mark response as complete
  }

  return (
    <div>
      <p>Microphone: {listening ? "on" : "off"}</p>
      <div className="flex items-center space-x-2">
        <button onClick={SpeechRecognition.startListening}>Start</button>
        <button onClick={SpeechRecognition.stopListening}>Stop</button>
        <button onClick={resetTranscript}>Reset</button>
      </div>
      <p>Spoken Text: {transcript}</p>

      <button
        onClick={getChatResponse}
        className="bg-blue-500 text-white px-4 py-2 mt-2"
      >
        Get Chat Response
      </button>

      <div className="border p-2 mt-4">
        <p>
          <strong>AI Response:</strong>
        </p>
        <p>{chatResponse}</p>
      </div>

      {isResponseComplete && <TextToSpeech text={chatResponse} />}
    </div>
  );
};

export default Dictaphone;
