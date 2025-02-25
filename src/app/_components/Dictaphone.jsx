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
    const userMessage = transcript;

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
    <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg">
      <div className="text-white mb-4">
        <label
          htmlFor="roleSelect"
          className="block text-lg font-semibold mb-2"
        >
          Choose a role:
        </label>
        <select
          id="roleSelect"
          onChange={handleRoleChange}
          value={selectedRole}
          className="bg-black text-white p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-300"
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
        <div className="text-white mb-4">
          <label
            htmlFor="scenarioSelect"
            className="block text-lg font-semibold mb-2"
          >
            Choose a scenario:
          </label>
          <select
            id="scenarioSelect"
            onChange={handleScenarioChange}
            value={selectedScenario}
            className="bg-black text-white p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-300"
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

      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={SpeechRecognition.startListening}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors duration-300"
        >
          Start
        </button>
        <button
          onClick={() => {
            SpeechRecognition.stopListening;
            getChatResponse();
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors duration-300"
        >
          Stop
        </button>

        <div className="text-white">
          <span
            className={`w-4 h-4 rounded-full inline-block ${listening ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
          />
        </div>
      </div>

      <p className="text-white mb-4 w-full text-center text-4xl">
        {transcript}
      </p>

      <div className="border-t-2 border-white mt-6 pt-4">
        <p className="text-white font-semibold">Conversation History:</p>
        <div>
          {conversationHistory.map((message, index) => (
            <div
              key={index}
              className={`${
                message.role === "ai" ? "text-blue-300" : "text-gray-100"
              } mb-2`}
            >
              <strong className="font-semibold">
                {message.role === "ai" ? "Customer" : "User"}:
              </strong>{" "}
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
    </div>
  );
};

export default Dictaphone;
