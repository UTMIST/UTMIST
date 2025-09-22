"use client"

import "@/styles/memberList.css"
import Image from "next/image"
import Mail from "@/assets/icons/email.svg"
import {useEffect, useState} from "react";

export function PersonCard(props) {
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        console.log(`The state is now ${isExpanded}`)
    }, [isExpanded]);

    return (
        <div className={"person-card"}>
            <p className={'person-name'}>{props.name}</p>
            <button onClick={() => setIsExpanded(!isExpanded)}>
                <p className={'person-text'}>{props.text}</p>
            </button>

            <Image
                src={Mail}
                alt={'test'}
                width={30}

            />
        </div>
    )
}

