export interface Initiative {
    title: string;
    description: string;
    projectLink: string
    image: string // I know this will eventually use supabase, what type should this be then?
}

export interface Member {
    name: string;
    bio: string;
    email: string;
}

export interface MemberGroup {
    role: string;
    members: Member[]
}