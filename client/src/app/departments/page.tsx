import {MemberList} from "@/components/memberList"
import {InitiativeCard} from "@/components/initiatives"
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
           <hr className={"pt-20 pb-20"}/>
            <InitiativeCard
                title={"UTMIST Website"}
                description={"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."}
                projectLink={"#"}
                image={"file.svg"}
            />
        </>
    )
}