export interface DepartmentPageSection {
    component: string;
    data: Record<string, string>;
}

export interface DepartmentPageFormSection {
    component: string;
    dataJson: string;
}

export interface DepartmentPageFormInput {
    name: string;
    tagline: string;
    slug: string;
    sections: DepartmentPageFormSection[];
}

export interface DepartmentPage {
    id: string;
    name: string;
    tagline: string;
    sections: DepartmentPageSection[];
    slug: string;
    created_at?: string;
    updated_at?: string;
}

export interface DepartmentPageInput {
    name: string;
    tagline: string;
    slug: string;
    sections: DepartmentPageSection[];
}

export interface Initiative {
    title: string;
    description: string;
    projectLink: string
    image: string
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
