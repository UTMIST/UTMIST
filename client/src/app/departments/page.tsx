// import Home from "client/src/app/layout.tsx";
import {PersonCard} from "@/components/memberList"

export default function Template() {
    return (
        <>
            <PersonCard
                name = "Ambrose Ling"
                text = "Awesome flavour text"
            />
        </>
    )
}