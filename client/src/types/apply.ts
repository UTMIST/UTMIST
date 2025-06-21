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
    otherFieldOfStudy?: string;
    otherEducationLevel?: string;
}

export interface ApplicationFormData {
    personalInfo: PersonalInformation;
    locationInfo: ContactInformation;
    educationInfo: EducationInformation;
    whyJoin: String;
} 

// Type for the response from the universities API
export type UniversityAPIResponse = {
    web_page: string;
    country: string;
    domain: string;
    name: string;
};
