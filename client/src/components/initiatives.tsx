"use client";
import React from "react";
import Image from "next/image";
import "@/app/globals.css"
import Link from "next/link";
import link from "../../public/linkOut.png"
import {Initiative} from "@/types/departments"

export function InitiativeCard({title, description, projectLink, image}: Initiative) {
    return (
        <div
            className={'flex max-w-[830px]  items-center'}
            style={{}}
        >
            <div className={'p-[8px] mr-[50px] border-2 rounded-2xl border-[#A1A1A1]'}>
                <Image
                    className={'rounded-2xl'}
                    src={image}
                    alt={'Project Image'}
                    width={500}
                    height={50}
                />
            </div>
            <div>
                <div className={'mr-[40px]'}>
                    <h1 className={'text-3xl pb-6'}
                    >{title}</h1>
                    <p className={'text-gray-700'}>{description}</p>
                </div>
            </div>
            <Link href={projectLink}>
                <Image
                    src={link}
                    alt={'Link to project'}
                    width={200}
                />
            </Link>
        </div>
    )
}