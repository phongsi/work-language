import React, { useEffect } from "react";
import { useSpeech } from "react-text-to-speech";

export default function TextToSpeech({ text }) {
  const {
    Text, // Component that renders the processed text
    speechStatus, // Current speech status
    isInQueue, // Indicates if the speech is active or queued
    start, // Starts or queues the speech
    pause, // Pauses the speech
    stop, // Stops or removes the speech from the queue
  } = useSpeech({ text: text });
  console.log(text);

  useEffect(() => {
    start();
  }, [text]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", rowGap: "1rem" }}
    ></div>
  );
}
