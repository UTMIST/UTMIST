"use client"
import Image from "next/image"
import Mail from "../../public/email.svg"
import {useState} from "react";

interface Member {
    name: string;
    bio: string;
    email: string;
}


export function PersonCard({ name, bio, email }: Member) {

    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className={"bg-[#e8e8e8] flex w-[494px] h-fit px-[25px] py-[10px] justify-between rounded-[15px] font-sans my-[5px] mx-[8px]"}>
            <p className={"text-[25px] truncate h-fit shrink-0"}>{name}</p>
            <button className={"w-fit h-fit"} onClick={() => setIsExpanded(!isExpanded)}>
                <p className={"px-[7px] py-[8px] max-w-[211px] text-[17px] overflow-hidden text-ellipsis text-left cursor-pointer font-light"}
                   style={{
                       transition: "max-height 0.4s ease",
                       maxHeight: isExpanded ? "150px" : "40px",
                   }}
                >{bio}</p>
            </button>

            <button className={"relative h-fit mt-[9px] group"}>
                <Image
                    src={Mail}
                    alt={'Mail icon'}
                    width={30}
                    className={"relative h-fit cursor-pointer"}
                />
                <div
                    className={"absolute bottom-[130%] left-1/2 -translate-x-1/2 w-[fit] px-[8px] py-[3px] bg-[#a1a1a1] text-center rounded-[9px] select-text cursor-text pointer-events-none opacity-0 transition-opacity duration-100 hover:opacity-100 group-hover:opacity-100 group-hover:pointer-events-auto"}>
                    {email}
                    {/*Arrow element*/}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-[6px] border-solid border-t-[#a1a1a1]  border-r-transparent border-b-transparent border-l-transparent"></div>
                </div>
            </button>


        </div>
    )
}

