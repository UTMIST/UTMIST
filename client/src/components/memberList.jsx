"use client"

import "@/styles/memberList.css"
import Image from "next/image"
import Mail from "@/assets/icons/email.svg"
import {useEffect, useState} from "react";

export function PersonCard(props) {
    const [isExpanded, setIsExpanded] = useState(false);

    // useEffect(() => {
    //     console.log(`The state is now ${isExpanded}`)
    //     console.log(`The object's value is ${document.getElementById("text").style.whitespace}`)
    //     if (isExpanded) {
    //         document.getElementById("text").style.whiteSpace = "normal"
    //     } else {
    //         document.getElementById("text").style.whiteSpace = "nowrap"
    //     }
    // }, [isExpanded]);

    return (
        <div className={"person-card"}>
            <p className={'person-name'}>{props.name}</p>
            <button onClick={() => setIsExpanded(!isExpanded)}>
                <p className={'person-text'}
                    style={{
                        // whiteSpace: isExpanded ? "normal" : "nowrap",
                        transition: "max-height 0.4s ease",
                        maxHeight: isExpanded ? "150px" : "40px",
                }}
                >{props.text}</p>
            </button>

            <div className={'mail-icon'}>
                <button onClick={() => navigator.clipboard.writeText('test')}>
                    <Image
                        src={Mail}
                        alt={'Mail icon'}
                        width={30}
                    />
                </button>

                <div className={'copy-me'}>
                    Click to copy!
                </div>
            </div>
        </div>
    )
}

