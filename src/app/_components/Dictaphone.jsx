"use client";

import "regenerator-runtime/runtime";
import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import TextToSpeech from "./TextToSpeech";

const Dictaphone = () => {
  const roles = [
    {
      name: "Front Desk",
      scenarios: [
        "Check in a Guest",
        "Handle Maintenance Requests",
        "Concierge Services",
      ],
    },
    {
      name: "Food and Beverages",
      scenarios: ["Food order", "Complaint"],
    },
    {
      name: "Phone Customer Service",
      scenarios: [
        "Technical Issue",
        "Customer Service Complaint",
        "Billing Question",
      ],
    },
  ];

  const [selectedRole, setSelectedRole] = useState(""); // Track selected role
  const [selectedScenario, setSelectedScenario] = useState(""); // Track selected scenario
  const [conversationHistory, setConversationHistory] = useState([]); // Store conversation history
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

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value); // Update selected role
    setSelectedScenario(""); // Reset scenario when role changes
  };

  const handleScenarioChange = (e) => {
    setSelectedScenario(e.target.value); // Update selected scenario
  };

  const getChatResponse = async () => {
    const userMessage =
      transcript || "Hello, can you assist me with my booking?";

    // Update the conversation history with the user message
    setConversationHistory((prevHistory) => [
      ...prevHistory,
      { role: "user", content: userMessage },
    ]);

    setIsResponseComplete(false); // Reset response complete flag

    // Custom system message based on the selected role and scenario
    const systemMessage = `the user is a ${selectedRole} in the scenario: ${selectedScenario}. You are the client/guest you are conversing with the ${selectedRole} please keep all of your responses to 1 or 2 sentences `;

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          ...conversationHistory,
          { role: "system", content: systemMessage },
          { role: "user", content: userMessage },
        ], // Send full conversation history
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

    // Update the conversation history with the AI response
    setConversationHistory((prevHistory) => [
      ...prevHistory,
      { role: "ai", content: fullResponse },
    ]);

    setIsResponseComplete(true); // Mark response as complete
  };

  const selectedRoleObject = roles.find((role) => role.name === selectedRole);

  return (
    <div className="p-4">
      <div>
        <label htmlFor="roleSelect">Choose a role:</label>
        <select
          id="roleSelect"
          onChange={handleRoleChange}
          value={selectedRole}
          className="bg-black text-white p-2"
        >
          <option value="">Select a role</option>
          {roles.map((role, index) => (
            <option key={index} value={role.name}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      {selectedRole && selectedRoleObject && (
        <div>
          <label htmlFor="scenarioSelect">Choose a scenario:</label>
          <select
            id="scenarioSelect"
            onChange={handleScenarioChange}
            value={selectedScenario}
            className="bg-black text-white p-2"
          >
            <option value="">Select a scenario</option>
            {selectedRoleObject.scenarios.map((scenario, index) => (
              <option key={index} value={scenario}>
                {scenario}
              </option>
            ))}
          </select>
        </div>
      )}

      <p>Microphone: {listening ? "on" : "off"}</p>
      <div className="flex items-center space-x-2">
        <button
          onClick={SpeechRecognition.startListening}
          className="bg-green-500 text-white px-4 py-2"
        >
          Start
        </button>
        <button
          onClick={SpeechRecognition.stopListening}
          className="bg-red-500 text-white px-4 py-2"
        >
          Stop
        </button>
        <button
          onClick={resetTranscript}
          className="bg-yellow-500 text-white px-4 py-2"
        >
          Reset
        </button>
      </div>
      <p>Spoken Text: {transcript}</p>

      <button
        onClick={getChatResponse}
        className="bg-blue-500 text-white px-4 py-2 mt-4"
      >
        Get Chat Response
      </button>

      <div className="border p-2 mt-4">
        <p>
          <strong>Conversation History:</strong>
        </p>
        <div>
          {conversationHistory.map((message, index) => (
            <div
              key={index}
              className={
                message.role === "ai" ? "text-blue-500" : "text-gray-800"
              }
            >
              <strong>{message.role === "ai" ? "AI" : "User"}:</strong>{" "}
              {message.content}
            </div>
          ))}
        </div>
      </div>

      {isResponseComplete && (
        <TextToSpeech
          text={conversationHistory[conversationHistory.length - 1].content}
        />
      )}

      {/* Optional: Use a predefined greeting */}
      <TextToSpeech text={"Hello, how are you?"} />
    </div>
  );
};

export default Dictaphone;
