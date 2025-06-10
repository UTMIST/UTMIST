interface PersonalInformation {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

interface ContactInformation {
    country: string;
    address: string;
    city: string;
    postalCode: string;
    provinceOrState: string;
}

interface EducationInformation {
    school: string;
    degree: string;
    fieldOfStudy: string;
    graduationDate: string;
}

interface WorkExperienceInformation {
    workExperience: {
        companyName: string;
        jobTitle: string;
        startDate: string;
        endDate: string;
        description: string;
    }[];
}

interface ApplicationFormData {
    personalInfo: PersonalInformation;
    locationInfo: ContactInformation;
    experienceInfo: WorkExperienceInformation;
    educationInfo: EducationInformation;
}

const ApplicationForm = () => {

    

    return <div>Hello World</div>
}

export default ApplicationForm;