import {PersonCard, MemberList} from "@/components/memberList"

interface Member {
    name: string;
    bio: string;
    email: string;
}

const members: Member[] = [
    {
        name : "Ambrose Ling",
        bio : "Awesome flavour text lorme ipismdifa ajdn askjdnaklsjdnb lhjkab jhkl bndka bdak jn",
        email : "test@mail.com"
    },
    {
        name : "Ambrose Ling",
        bio : "Awesome flavour text lorme ipismdifa ajdn askjdnaklsjdnb lhjkab jhkl bndka bdak jn",
        email : "test@mail.com"
    }
]


export default function Test() {
    return (
        <>
            <MemberList
                members = {members}
            />
        </>
    )
}