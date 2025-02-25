"use client";
import Image from "next/image";
import Dictaphone from "./_components/Dictaphone";
import TextToSpeech from "./_components/TextToSpeech";

export default function Home() {
  return (
    <div className="p-8">
      <Dictaphone />
    </div>
  );
}
