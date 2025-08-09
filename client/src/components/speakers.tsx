import React from "react";
import "../styles/eigenai.css";
import Image, { StaticImageData } from "next/image";

interface Speaker {
  name: string;
  role: string;
  profileURL: string;
  profileImage: StaticImageData;
}

interface Props {
  speakers: Speaker[];
}

export default function SpeakersGrid({ speakers }: Props) {
  return (
    <div className="speakers-container px-4">
      <h2 className="speakers-title mb-4 text-2xl md:text-3xl font-semibold">
        Our Past Organizers
      </h2>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 justify-center">
      {speakers.map((s, i) => (
          <div
            key={i}
            className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition"
          >
            <div className="flex flex-col items-center text-center">
              <Image
                src={s.profileImage}
                alt={`${s.name}'s profile picture`}
                width={100}
                height={100}
                draggable={false}
                className="w-24 h-24 rounded-full object-cover mb-2"
              />

              <p className="font-medium">{s.name}</p>
              <p className="text-sm text-gray-600">{s.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
