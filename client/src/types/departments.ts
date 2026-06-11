export interface DepartmentPage {
    id: string;
    name: string;
    tagline: string;
    description: string;
    slug: string;
    created_at?: string;
    updated_at?: string;
}

export interface DepartmentPageInput {
    name: string;
    tagline: string;
    description: string;
}

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
