export interface PersonalInformation {
    firstName: string;
    lastName: string;
    email: string;
    areaCode: string;
    phoneNumber: string;
}

export interface ContactInformation {
    country: string;
    address: string;
    city: string;
    postalCode: string;
    provinceOrState: string;
}

export interface EducationInformation {
    school: string;
    educationLevel: string;
    fieldOfStudy: string;
    graduationMonth: string;
    graduationYear: string;
}

export interface WorkExperienceInformation {
    workExperience: {
        companyName: string;
        jobTitle: string;
        startMonth: string;
        startYear: string;
        endMonth: string;
        endYear: string;
        description: string;
        currentlyWorking?: boolean;
    }[];
}

export interface ApplicationFormData {
    personalInfo: PersonalInformation;
    locationInfo: ContactInformation;
    experienceInfo: WorkExperienceInformation;
    educationInfo: EducationInformation;
    whyJoin: String;
} 