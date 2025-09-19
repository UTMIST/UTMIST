"use client";

import React from "react";
import Image from "next/image";
import "@/app/globals.css"
import Link from "next/link";

export default function Initiatives(props) {
    return (
        <div>
            <h1>Our Initiatives and Projects</h1>
            <p>This is what we contribute to the team</p>
            <div className={"Items"}>
                <div className={"Item"}>
                    <div className={"Image container"}>
                        <Image>

                        </Image>
                    </div>
                    <div className={"text container"}>

                    </div>
                    <Link>
                        <Image>

                        </Image>
                    </Link>
                </div>
            </div>
        </div>
    )
}