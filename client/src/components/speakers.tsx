import React from "react";
import "../styles/eigenai.css";
import Image from "next/image";

interface Speaker {
  name: string;
  role: string;
  profileURL: string;
  profileImageURL: any;
}

interface Props {
  speakers: Speaker[];
}

export default function SpeakersGrid({ speakers }: Props) {
  const firstRow = speakers.slice(0, 3);
  const secondRow = speakers.slice(3, 7);

  return (
    <div className="speakers-container">
      <h2 className="speakers-title">Our Past Speakers</h2>

      <div className="speakers-row">
        {firstRow.map((s, i) => (
          <a
            key={`row1-${i}`}
            href={s.profileURL}
            className="speaker-card"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={s.profileImageURL}
              alt={`${s.name}'s profile picture`}
              width={100}
              height={100}
              className="speaker-photo object-cover"
            />
            <div className="speaker-info">
              <p className="speaker-name">{s.name}</p>
              <p className="speaker-role">{s.role}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="speakers-row">
        {secondRow.map((s, i) => (
          <a
            key={`row2-${i}`}
            href={s.profileURL}
            className="speaker-card"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={s.profileImageURL}
              alt={`${s.name}'s profile picture`}
              width={100}
              height={100}
              className="speaker-photo object-cover"
            />
            <div className="speaker-info">
              <p className="speaker-name">{s.name}</p>
              <p className="speaker-role">{s.role}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
