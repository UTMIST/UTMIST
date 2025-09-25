"use client"

import "@/styles/memberList.css"
import Image from "next/image"
import Mail from "../../public/email.svg"
import {useState} from "react";

interface Props {
    name: string;
    bio: string;
    email: string;
}


export function PersonCard({ name, bio, email }: Props) {

    const [isExpanded, setIsExpanded] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(email)
        setIsCopied(true)
        // console.log("Copied :" + isCopied)
        setTimeout(() => setIsCopied(false), 2000)
    }

    return (
        <div className={"person-card"}>
            <p className={'person-name'}>{name}</p>
            <button onClick={() => setIsExpanded(!isExpanded)}>
                <p className={'person-text'}
                    style={{
                        transition: "max-height 0.4s ease",
                        maxHeight: isExpanded ? "150px" : "40px",
                }}
                >{bio}</p>
            </button>

            <button className={'mail-icon'} onClick={() => handleCopy()}>
                <Image
                    src={Mail}
                    alt={'Mail icon'}
                    width={30}
                />
                <div className={'copy-me'}>
                    {!isCopied ? "Click to copy!" : "Copied"}
                </div>
            </button>


        </div>
    )
}

