import {MemberList} from "@/components/memberList"
import {MemberGroup} from "@/types/departments";

const members: MemberGroup[] = [
    {
    role: "Director",
    members: [
            {
                name : "Ambrose Ling",
                bio : "Awesome flavour text lorme ipismdifa ajdn askjdnaklsjdnb lhjkab jhkl bndka bdak jn",
                email : "test@mail.com"
            },
    {
        name : "Ambrose Ling",
        bio : "Awesome flavour text lorme ipismdifa ajdn askjdnaklsjdnb lhjkab jhkl bndka bdak jn",
        email : "test@ail.com"
    }
    ] },
    {
        role: "Developers",
        members: [
            {
                name : "Ambrose Ling",
                bio : "Awesome flavour text lorme ipismdifa ajdn askjdnaklsjdnb lhjkab jhkl bndka bdak jn",
                email : "te3t@mail.com"
            },
            {
                name : "Ambrose Ling",
                bio : "Awesome flavour text lorme ipismdifa ajdn askjdnaklsjdnb lhjkab jhkl bndka bdak jn",
                email : "te1t@ail.com"
            }
        ] }
]



export default function DepartmentsPage() {
    return (
        <>
            <MemberList members={members} />
        </>
    )
}