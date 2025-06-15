'use client'
import React, { useState } from 'react';
import { PersonalInformation, ContactInformation, EducationInformation, ApplicationFormData } from "../../types/apply"

// Month and year options
const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
const currentYear = new Date().getFullYear();
const maxYear = 2030;
const minYear = currentYear - 50;
const years: string[] = [];
for (let y = maxYear; y >= minYear; y--) {
    years.push(String(y));
}

// Add types for props

type PersonalInformationSectionProps = {
  personalInfo: PersonalInformation;
  setPersonalInfo: React.Dispatch<React.SetStateAction<PersonalInformation>>;
  emailError: string;
  setEmailError: React.Dispatch<React.SetStateAction<string>>;
  emailTouched: boolean;
  setEmailTouched: React.Dispatch<React.SetStateAction<boolean>>;
  validateEmail: (email: string) => boolean;
  areaCodes: { code: string; country: string }[];
  handlePhoneNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PersonalInformationSection = ({
  personalInfo,
  setPersonalInfo,
  emailError,
  setEmailError,
  emailTouched,
  setEmailTouched,
  validateEmail,
  areaCodes,
  handlePhoneNumberChange,
}: PersonalInformationSectionProps) => {
    return (
        <section className="mb-10">
            <h3 className="text-2xl font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="flex flex-col gap-1">
                    <label htmlFor="firstName" className="text-sm font-medium mb-1 ml-2">First Name</label>
                    <input id="firstName" className="input bg-gray-200 rounded-full px-6 py-3" type="text" placeholder="" value={personalInfo.firstName} onChange={e => setPersonalInfo({ ...personalInfo, firstName: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="lastName" className="text-sm font-medium mb-1 ml-2">Last Name</label>
                    <input id="lastName" className="input bg-gray-200 rounded-full px-6 py-3" type="text" placeholder="" value={personalInfo.lastName} onChange={e => setPersonalInfo({ ...personalInfo, lastName: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                    <label htmlFor="email" className="text-sm font-medium mb-1 ml-2">Email</label>
                    <input id="email" className={`input bg-gray-200 rounded-full px-6 py-3${emailError && emailTouched ? ' border-2 border-red-500' : ''}`} type="email" placeholder="" value={personalInfo.email} onChange={e => {
                        setPersonalInfo({ ...personalInfo, email: e.target.value });
                        if (emailTouched) {
                            setEmailError((e.target.value && !validateEmail(e.target.value)) ? 'Please enter a valid email address.' : '');
                        }
                    }}
                    onBlur={() => {
                        setEmailTouched(true);
                        setEmailError((personalInfo.email && !validateEmail(personalInfo.email)) ? 'Please enter a valid email address.' : '');
                    }}
                    />
                    {emailError && emailTouched && personalInfo.email && (
                        <div className="text-red-500 text-sm ml-2 mt-1">{emailError}</div>
                    )}
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                    <label htmlFor="areaCode" className="text-sm font-medium mb-1 ml-2">Area Code & Phone Number</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <select
                            id="areaCode"
                            className="input bg-gray-200 rounded-full px-3 py-3 w-32 min-w-fit text-center pr-12 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2210%22%20viewBox%3D%220%200%2016%2010%22%20fill%3D%22none%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%27M2%202L8%208L14%202%27%20stroke%3D%22black%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_1.5rem_center] bg-[length:1rem_1rem]"
                            value={personalInfo.areaCode}
                            onChange={e => setPersonalInfo({ ...personalInfo, areaCode: e.target.value })}
                        >
                            {areaCodes.map(({ code, country }) => (
                                <option key={code} value={code}>
                                    {code} ({country})
                                </option>
                            ))}
                        </select>
                        <input
                            id="phoneNumber"
                            className="input bg-gray-200 rounded-full px-6 py-3 flex-1"
                            type="tel"
                            placeholder=""
                            value={personalInfo.phoneNumber}
                            onChange={handlePhoneNumberChange}
                            maxLength={12}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

// ContactInformationSection props
type ContactInformationSectionProps = {
  locationInfo: ContactInformation;
  setLocationInfo: React.Dispatch<React.SetStateAction<ContactInformation>>;
  postalCodePatterns: Record<string, { placeholder: string; pattern: string; title: string }>;
  formatPostalCode: (value: string, country: string) => string;
};

const ContactInformationSection = ({
  locationInfo,
  setLocationInfo,
  postalCodePatterns,
  formatPostalCode,
}: ContactInformationSectionProps) => {
    return (
        <section className="mb-10">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="flex flex-col gap-1">
                    <label htmlFor="country" className="text-sm font-medium mb-1 ml-2">Country</label>
                    <select
                        id="country"
                        className="input bg-gray-200 rounded-full px-6 py-3 pr-12 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2210%22%20viewBox%3D%220%200%2016%2010%22%20fill%3D%22none%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%27M2%202L8%208L14%202%27%20stroke%3D%22black%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_1.5rem_center] bg-[length:1rem_1rem]"
                        value={locationInfo.country}
                        onChange={e => setLocationInfo({ ...locationInfo, country: e.target.value, provinceOrState: '', postalCode: '' })}
                    >
                        <option value="">Select a Country</option>
                        {['Canada','United States','United Kingdom','Australia','India','China','Other'].map(country => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="address" className="text-sm font-medium mb-1 ml-2">Address</label>
                    <input id="address" className="input bg-gray-200 rounded-full px-6 py-3" type="text" placeholder="" value={locationInfo.address} onChange={e => setLocationInfo({ ...locationInfo, address: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="city" className="text-sm font-medium mb-1 ml-2">City</label>
                    <input id="city" className="input bg-gray-200 rounded-full px-6 py-3" type="text" placeholder="" value={locationInfo.city} onChange={e => setLocationInfo({ ...locationInfo, city: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="postalCode" className="text-sm font-medium mb-1 ml-2">Postal Code</label>
                    {!locationInfo.country && (
                        <input
                            id="postalCode"
                            className="input bg-gray-200 rounded-full px-6 py-3"
                            type="text"
                            placeholder="Please select a country"
                            disabled
                        />
                    )}
                    {locationInfo.country === 'Canada' && (
                        <input
                            id="postalCode"
                            className="input bg-gray-200 rounded-full px-6 py-3"
                            type="text"
                            placeholder={postalCodePatterns['Canada'].placeholder}
                            pattern={postalCodePatterns['Canada'].pattern}
                            title={postalCodePatterns['Canada'].title}
                            value={locationInfo.postalCode}
                            onChange={e => setLocationInfo({ ...locationInfo, postalCode: formatPostalCode(e.target.value, 'Canada') })}
                            maxLength={7}
                        />
                    )}
                    {locationInfo.country === 'United States' && (
                        <input
                            id="postalCode"
                            className="input bg-gray-200 rounded-full px-6 py-3"
                            type="text"
                            placeholder={postalCodePatterns['United States'].placeholder}
                            pattern={postalCodePatterns['United States'].pattern}
                            title={postalCodePatterns['United States'].title}
                            value={locationInfo.postalCode}
                            onChange={e => setLocationInfo({ ...locationInfo, postalCode: formatPostalCode(e.target.value, 'United States') })}
                            maxLength={10}
                        />
                    )}
                    {locationInfo.country && locationInfo.country !== 'Canada' && locationInfo.country !== 'United States' && (
                        <input
                            id="postalCode"
                            className="input bg-gray-200 rounded-full px-6 py-3"
                            type="text"
                            placeholder={postalCodePatterns['Other'].placeholder}
                            value={locationInfo.postalCode}
                            onChange={e => setLocationInfo({ ...locationInfo, postalCode: e.target.value })}
                        />
                    )}
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                    <label htmlFor="provinceOrState" className="text-sm font-medium mb-1 ml-2">Province / State</label>
                    {!locationInfo.country && (
                        <input
                            id="provinceOrState"
                            className="input bg-gray-200 rounded-full px-6 py-3"
                            type="text"
                            placeholder="Please select a country"
                            disabled
                        />
                    )}
                    {locationInfo.country === 'Canada' && (
                        <select
                            id="provinceOrState"
                            className="input bg-gray-200 rounded-full px-6 py-3 pr-12 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2210%22%20viewBox%3D%220%200%2016%2010%22%20fill%3D%22none%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%27M2%202L8%208L14%202%27%20stroke%3D%22black%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_1.5rem_center] bg-[length:1rem_1rem]"
                            value={locationInfo.provinceOrState}
                            onChange={e => setLocationInfo({ ...locationInfo, provinceOrState: e.target.value })}
                        >
                            <option value="">Select a Province/Territory</option>
                            {['Alberta','British Columbia','Manitoba','New Brunswick','Newfoundland and Labrador','Northwest Territories','Nova Scotia','Nunavut','Ontario','Prince Edward Island','Quebec','Saskatchewan','Yukon'].map(province => (
                                <option key={province} value={province}>{province}</option>
                            ))}
                        </select>
                    )}
                    {locationInfo.country === 'United States' && (
                        <select
                            id="provinceOrState"
                            className="input bg-gray-200 rounded-full px-6 py-3 pr-12 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2210%22%20viewBox%3D%220%200%2016%2010%22%20fill%3D%22none%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%27M2%202L8%208L14%202%27%20stroke%3D%22black%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_1.5rem_center] bg-[length:1rem_1rem]"
                            value={locationInfo.provinceOrState}
                            onChange={e => setLocationInfo({ ...locationInfo, provinceOrState: e.target.value })}
                        >
                            <option value="">Select a State</option>
                            {['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'].map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                    )}
                    {locationInfo.country && locationInfo.country !== 'Canada' && locationInfo.country !== 'United States' && (
                        <input
                            id="provinceOrState"
                            className="input bg-gray-200 rounded-full px-6 py-3"
                            type="text"
                            placeholder="Enter your region/state"
                            value={locationInfo.provinceOrState}
                            onChange={e => setLocationInfo({ ...locationInfo, provinceOrState: e.target.value })}
                        />
                    )}
                </div>
            </div>
        </section>
    )
}

// WorkExperienceSection props
type WorkExperienceItem = {
  id: string;
  companyName: string;
  jobTitle: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  description: string;
  currentlyWorking?: boolean;
};

type WorkExperienceSectionProps = {
  workExperience: WorkExperienceItem[];
  setWorkExperience: React.Dispatch<React.SetStateAction<WorkExperienceItem[]>>;
  months: string[];
  years: string[];
};

// EducationSection props
type EducationSectionProps = {
  educationInfo: EducationInformation;
  setEducationInfo: React.Dispatch<React.SetStateAction<EducationInformation>>;
  months: string[];
  years: string[];
};

const EducationSection = ({ educationInfo, setEducationInfo, months, years }: EducationSectionProps) => {
  const [otherDegree, setOtherDegree] = useState<string>('');
  const [otherMajor, setOtherMajor] = useState<string>('');
  const [otherSchool, setOtherSchool] = useState<string>('');

  // Education Level options
  const educationLevels = [
    'Diploma',
    'Undergraduate',
    'Graduate',
    'Other'
  ];

  // Field of study options (STEM majors)
  const stemMajors = {
    'Computer Science & Software': [
      'Computer Science',
      'Software Engineering',
      'Computer Engineering',
      'Data Science',
    ],
    'Engineering': [
      'Mechanical Engineering',
      'Electrical Engineering',
      'Civil Engineering',
      'Chemical Engineering',
      'Industrial Engineering',
      'Aerospace Engineering',
      'Biomedical Engineering',
      'Environmental Engineering',
      'Materials Engineering'
    ],
    'Mathematics & Statistics': [
      'Mathematics',
      'Statistics',
      'Actuarial Science',
    ],
    'Physical Sciences': [
      'Physics',
      'Chemistry',
      'Astronomy',
      'Geology',
      'Earth Sciences',
      'Environmental Science'
    ],
    'Business': [
      'Business Administration',
      'Finance',
      'Accounting',
      'Marketing',
      'Management',
      'Human Resources',
      'Economics'
    ],
    'Other': [
      'Other'
    ]
  };

  // University options
  const universities = {
    'Ontario': [
      'University of Toronto',
      'University of Waterloo',
      'University of Ottawa',
      'Queen\'s University',
      'Western University',
      'McMaster University',
      'University of Guelph',
      'York University',
      'Carleton University',
      'Ryerson University',
      'University of Windsor',
      'Brock University',
      'Trent University',
      'Lakehead University',
      'Laurentian University',
      'Ontario Tech University',
      'Wilfrid Laurier University'
    ],
    'Other Canadian Provinces': [
      'University of British Columbia',
      'McGill University',
      'University of Alberta',
      'University of Calgary',
      'University of Montreal',
      'Simon Fraser University',
      'University of Victoria',
      'Dalhousie University',
      'University of Saskatchewan',
      'University of Manitoba'
    ],
    'Other': [
      'Other'
    ]
  };

  return (
    <section className="mb-10">
      <h3 className="text-lg font-semibold mb-4">Education</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="flex flex-col gap-1">
          <label htmlFor="school" className="text-sm font-medium mb-1 ml-2">School</label>
          <select
            id="school"
            className="input bg-gray-200 rounded-full px-6 py-3 pr-12 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2210%22%20viewBox%3D%220%200%2016%2010%22%20fill%3D%22none%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%27M2%202L8%208L14%202%27%20stroke%3D%22black%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_1.5rem_center] bg-[length:1rem_1rem]"
            value={educationInfo.school === otherSchool ? 'Other' : educationInfo.school}
            onChange={e => {
              if (e.target.value === 'Other') {
                setEducationInfo({ ...educationInfo, school: otherSchool || '' });
              } else {
                setOtherSchool('');
                setEducationInfo({ ...educationInfo, school: e.target.value });
              }
            }}
          >
            <option value="Select a University">Select a University</option>
            {Object.entries(universities).map(([province, schools]) => (
              <optgroup key={province} label={province}>
                {schools.map(school => (
                  <option key={school} value={school}>{school}</option>
                ))}
              </optgroup>
            ))}
          </select>
          {educationInfo.school === otherSchool && (
            <input
              type="text"
              className="input bg-gray-200 rounded-full px-6 py-3 mt-2"
              placeholder="Please specify your university"
              value={otherSchool}
              onChange={e => {
                setOtherSchool(e.target.value);
                setEducationInfo({ ...educationInfo, school: e.target.value });
              }}
            />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="educationLevel" className="text-sm font-medium mb-1 ml-2">Education Level</label>
          <select
            id="educationLevel"
            className="input bg-gray-200 rounded-full px-6 py-3 pr-12 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2210%22%20viewBox%3D%220%200%2016%2010%22%20fill%3D%22none%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%27M2%202L8%208L14%202%27%20stroke%3D%22black%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_1.5rem_center] bg-[length:1rem_1rem]"
            value={educationInfo.educationLevel === otherDegree ? 'Other' : educationInfo.educationLevel}
            onChange={e => {
              if (e.target.value === 'Other') {
                setEducationInfo({ ...educationInfo, educationLevel: otherDegree || '' });
              } else {
                setOtherDegree('');
                setEducationInfo({ ...educationInfo, educationLevel: e.target.value });
              }
            }}
          >
            <option value="Select Education Level">Select Education Level</option>
            {educationLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          {educationInfo.educationLevel === otherDegree && (
            <input
              type="text"
              className="input bg-gray-200 rounded-full px-6 py-3 mt-2"
              placeholder="Please specify your education level"
              value={otherDegree}
              onChange={e => {
                setOtherDegree(e.target.value);
                setEducationInfo({ ...educationInfo, educationLevel: e.target.value });
              }}
            />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="fieldOfStudy" className="text-sm font-medium mb-1 ml-2">Field of Study</label>
          <select
            id="fieldOfStudy"
            className="input bg-gray-200 rounded-full px-6 py-3 pr-12 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2210%22%20viewBox%3D%220%200%2016%2010%22%20fill%3D%22none%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%27M2%202L8%208L14%202%27%20stroke%3D%22black%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_1.5rem_center] bg-[length:1rem_1rem]"
            value={educationInfo.fieldOfStudy === otherMajor ? 'Other' : educationInfo.fieldOfStudy}
            onChange={e => {
              if (e.target.value === 'Other') {
                setEducationInfo({ ...educationInfo, fieldOfStudy: otherMajor || '' });
              } else {
                setOtherMajor('');
                setEducationInfo({ ...educationInfo, fieldOfStudy: e.target.value });
              }
            }}
          >
            <option value="Select a Major">Select a Major</option>
            {Object.entries(stemMajors).map(([category, majors]) => (
              <optgroup key={category} label={category}>
                {majors.map(major => (
                  <option key={major} value={major}>{major}</option>
                ))}
              </optgroup>
            ))}
          </select>
          {educationInfo.fieldOfStudy === otherMajor && (
            <input
              type="text"
              className="input bg-gray-200 rounded-full px-6 py-3 mt-2"
              placeholder="Please specify your major"
              value={otherMajor}
              onChange={e => {
                setOtherMajor(e.target.value);
                setEducationInfo({ ...educationInfo, fieldOfStudy: e.target.value });
              }}
            />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="graduationMonth" className="text-sm font-medium mb-1 ml-2">Graduation Date</label>
          <div className="flex gap-2 min-w-0">
            <select
              id="graduationMonth"
              className="input bg-gray-200 rounded-full px-6 py-3 flex-1 min-w-0 pr-12 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2210%22%20viewBox%3D%220%200%2016%2010%22%20fill%3D%22none%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%27M2%202L8%208L14%202%27%20stroke%3D%22black%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_1.5rem_center] bg-[length:1rem_1rem]"
              value={educationInfo.graduationMonth}
              onChange={e => setEducationInfo({ ...educationInfo, graduationMonth: e.target.value })}
            >
              <option value="">Month</option>
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <select
              id="graduationYear"
              className="input bg-gray-200 rounded-full px-6 py-3 flex-1 min-w-0 pr-12 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2210%22%20viewBox%3D%220%200%2016%2010%22%20fill%3D%22none%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%27M2%202L8%208L14%202%27%20stroke%3D%22black%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_1.5rem_center] bg-[length:1rem_1rem]"
              value={educationInfo.graduationYear}
              onChange={e => setEducationInfo({ ...educationInfo, graduationYear: e.target.value })}
            >
              <option value="">Year</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
};

const ResumeUploadModule = () => {

    const [resume, setResume] = useState<File | null>(null);
    const [resumeError, setResumeError] = useState<string>('');
    const [resumePreviewUrl, setResumePreviewUrl] = useState<string>('');

    const ResumeIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"></path>
      </svg>
    );

    const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Validate file type
            if (file.type !== 'application/pdf') {
                setResume(null);
                setResumeError('Only PDF files are allowed.');
                setResumePreviewUrl('');
                return;
            }
            // Validate file size (max 5 MB)
            if (file.size > 5 * 1024 * 1024) {
                setResume(null);
                setResumeError('File size must be 5 MB or less.');
                setResumePreviewUrl('');
                return;
            }
            setResume(file);
            setResumeError('');
            // Create preview URL
            const url = URL.createObjectURL(file);
            setResumePreviewUrl(url);
        }
    };

    return (
        <section className="mb-10">
            <label className="block w-full border-2 border-blue-200 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-400 transition mb-2 bg-gradient-to-br from-white to-blue-50">
                <span className="flex flex-col items-center justify-center gap-2">
                  <ResumeIcon className="w-10 h-10 text-blue-400 mb-2" />
                  <span className="text-xl font-bold">Resume Upload</span>
                </span>
                <input type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} />
            </label>
            {resume && <div className="text-center text-sm text-gray-600">{resume.name}</div>}
            {resumeError && <div className="text-center font-bold text-red-500 text-sm mt-2">{resumeError}</div>}
            {resumePreviewUrl && (
                <div className="flex flex-col items-center mt-4">
                    <span className="text-sm text-gray-500 mb-2">PDF Preview:</span>
                    <embed src={resumePreviewUrl} type="application/pdf" className="w-full max-w-xl h-96 border rounded-lg shadow" />
                </div>
            )}
        </section>
    )
}

type MotivationStatementProps = {
  whyJoin: string;
  setWhyJoin: React.Dispatch<React.SetStateAction<string>>;
};

const MotivationStatement = ({ whyJoin, setWhyJoin }: MotivationStatementProps) => {
  return (
    <section className="mb-10">
      <h3 className="text-lg font-bold mb-4">Why join UTMIST?</h3>
      <div className="flex flex-col gap-1">
        <textarea 
          id="whyJoin" 
          className="input bg-gray-200 rounded-2xl px-6 py-3 w-full min-h-[200px] resize-none" 
          placeholder="Share your motivation and what you hope to contribute to UTMIST..."
          value={whyJoin}
          onChange={e => setWhyJoin(e.target.value)}
        />
      </div>
    </section>
  );
};

const ApplicationForm = () => {
    const [personalInfo, setPersonalInfo] = useState<PersonalInformation>({
        firstName: '',
        lastName: '',
        email: '',
        areaCode: '+1',
        phoneNumber: '',
    });
    const [locationInfo, setLocationInfo] = useState<ContactInformation>({
        country: '',
        address: '',
        city: '',
        postalCode: '',
        provinceOrState: '',
    });
    const [educationInfo, setEducationInfo] = useState<EducationInformation>({
        school: 'Select a University',
        educationLevel: 'Select Education Level',
        fieldOfStudy: 'Select a Major',
        graduationMonth: '',
        graduationYear: '',
    });
    
    const [workExperience, setWorkExperience] = useState<WorkExperienceItem[]>([
        { id: crypto.randomUUID(), companyName: '', jobTitle: '', startMonth: '', startYear: '', endMonth: '', endYear: '', description: '', currentlyWorking: false },
    ]);
    
    const [emailError, setEmailError] = useState<string>('');
    const [emailTouched, setEmailTouched] = useState<boolean>(false);
    const [phoneError, setPhoneError] = useState<string>('');
    const [phoneTouched, setPhoneTouched] = useState<boolean>(false);
    const [whyJoin, setWhyJoin] = useState<string>('');

    // Area codes for dropdown
    const areaCodes = [
        { code: '+1', country: 'Canada/USA' },
        { code: '+44', country: 'United Kingdom' },
        { code: '+91', country: 'India' },
        { code: '+61', country: 'Australia' },
        { code: '+81', country: 'Japan' },
        { code: '+86', country: 'China' }
    ];

    // Phone number validation based on country
    const validatePhoneNumber = (number: string, country: string) => {
        const digits = number.replace(/\D/g, '');
        switch (country) {
            case 'Canada':
            case 'United States':
            case 'Canada/USA':
                return /^\d{10}$/.test(digits);
            case 'United Kingdom':
                return /^\d{10,11}$/.test(digits);
            case 'India':
                return /^\d{10}$/.test(digits);
            case 'Australia':
                return /^\d{9}$/.test(digits);
            case 'Japan':
                return /^\d{10,11}$/.test(digits);
            case 'China':
                return /^\d{11}$/.test(digits);
            default:
                return /^\d{6,}$/.test(digits);
        }
    };

    // Phone number formatting (North American style)
    const formatPhoneNumber = (value: string) => {
        // Remove all non-digit characters
        const digits = value.replace(/\D/g, '');
        let formatted = '';
        if (digits.length <= 3) {
            formatted = digits;
        } else if (digits.length <= 6) {
            formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
        } else {
            formatted = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
        }
        return formatted;
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        setPersonalInfo({ ...personalInfo, phoneNumber: formatted });
        setPhoneTouched(true);
        // Determine country for validation
        let country = locationInfo.country;
        if (!country && personalInfo.areaCode === '+1') country = 'Canada/USA';
        else if (!country) country = '';
        if (formatted && !validatePhoneNumber(formatted, country)) {
            setPhoneError('Please enter a valid phone number.');
        } else {
            setPhoneError('');
        }
    };

    // Email validation function
    const validateEmail = (email: string) => {
        if (!email) return true; // Treat empty as valid for error display
        return /^\S+@\S+\.\S+$/.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validate email
        if (personalInfo.email && !validateEmail(personalInfo.email)) {
            setEmailError('Please enter a valid email address.');
            setEmailTouched(true);
            return;
        } else {
            setEmailError('');
        }
        // Validate phone number
        let country = locationInfo.country;
        if (!country && personalInfo.areaCode === '+1') country = 'Canada/USA';
        else if (!country) country = '';
        if (personalInfo.phoneNumber && !validatePhoneNumber(personalInfo.phoneNumber, country)) {
            setPhoneError('Please enter a valid phone number.');
            setPhoneTouched(true);
            return;
        } else {
            setPhoneError('');
        }
    
        // Gather form data
        const formData: ApplicationFormData = {
            personalInfo,
            locationInfo,
            experienceInfo: { workExperience },
            educationInfo,
            whyJoin,
        };
    
        try {
            const response = await fetch('/api/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (response.ok) {
                // Success logic here (e.g., show a success message, reset form, etc.)
                alert('Application submitted successfully!');
            } else {
                // Error logic here
                alert('There was an error submitting your application.');
            }
        } catch (error) {
            alert(`Network error. Please try again later. ${error}`);
        }
    };

    // Postal code validation patterns
    const postalCodePatterns: Record<string, { placeholder: string; pattern: string; title: string }> = {
        'Canada': {
            placeholder: 'A1A 1A1',
            pattern: '^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$',
            title: 'Format: A1A 1A1'
        },
        'United States': {
            placeholder: '12345 or 12345-6789',
            pattern: '^\d{5}(-\d{4})?$',
            title: 'Format: 12345 or 12345-6789'
        },
        'Other': {
            placeholder: 'Postal/ZIP Code',
            pattern: '',
            title: ''
        }
    };

    // Postal code formatting
    const formatPostalCode = (value: string, country: string) => {
        if (country === 'Canada') {
            // Remove non-alphanumeric, uppercase, insert space after 3rd char
            let cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
            if (cleaned.length > 3) {
                cleaned = cleaned.slice(0, 3) + ' ' + cleaned.slice(3, 6);
            }
            return cleaned.slice(0, 7);
        } else if (country === 'United States') {
            // Remove non-digits, format as 12345 or 12345-6789
            let cleaned = value.replace(/[^0-9]/g, '');
            if (cleaned.length > 5) {
                cleaned = cleaned.slice(0, 5) + '-' + cleaned.slice(5, 9);
            }
            return cleaned.slice(0, 10);
        } else {
            return value;
        }
    };
    
    const JobInformationSection = () => {
        return (
            <>
                <h1 className="text-3xl font-bold text-center mb-2">Apply Here</h1>
                <h2 className="text-xl font-bold text-center mb-8">{'{JOB TITLE NAME}'}</h2>
            </>
        )
    }

    return (
        <form className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md mt-8" onSubmit={handleSubmit}>
            <JobInformationSection />
            <PersonalInformationSection
                personalInfo={personalInfo}
                setPersonalInfo={setPersonalInfo}
                emailError={emailError}
                setEmailError={setEmailError}
                emailTouched={emailTouched}
                setEmailTouched={setEmailTouched}
                validateEmail={validateEmail}
                areaCodes={areaCodes}
                handlePhoneNumberChange={handlePhoneNumberChange}
            />
            {/* Phone error message below phone input */}
            {phoneError && phoneTouched && (
                <div className="text-red-500 text-sm ml-2 mb-4">{phoneError}</div>
            )}
            <ContactInformationSection
                locationInfo={locationInfo}
                setLocationInfo={setLocationInfo}
                postalCodePatterns={postalCodePatterns}
                formatPostalCode={formatPostalCode}
            />
            <EducationSection
                educationInfo={educationInfo}
                setEducationInfo={setEducationInfo}
                months={months}
                years={years}
            />
            <MotivationStatement whyJoin={whyJoin} setWhyJoin={setWhyJoin} />
            <ResumeUploadModule />
            <button type="submit" className="w-full py-3 bg-gray-200 rounded-full font-semibold text-lg hover:bg-gray-300 transition">Submit</button>
        </form>
    );
}

export default ApplicationForm;