'use client'
import React, { useState } from 'react';

interface PersonalInformation {
    firstName: string;
    lastName: string;
    email: string;
    areaCode: string;
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
    graduationMonth: string;
    graduationYear: string;
}

interface WorkExperienceInformation {
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

interface ApplicationFormData {
    personalInfo: PersonalInformation;
    locationInfo: ContactInformation;
    experienceInfo: WorkExperienceInformation;
    educationInfo: EducationInformation;
}

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
        degree: 'Select a Degree',
        fieldOfStudy: 'Select a Major',
        graduationMonth: '',
        graduationYear: '',
    });
    const [otherDegree, setOtherDegree] = useState<string>('');
    const [otherMajor, setOtherMajor] = useState<string>('');
    const [otherSchool, setOtherSchool] = useState<string>('');
    const [workExperience, setWorkExperience] = useState<WorkExperienceInformation['workExperience']>([
        { companyName: '', jobTitle: '', startMonth: '', startYear: 'W', endMonth: '', endYear: '', description: '', currentlyWorking: false },
    ]);
    const [resume, setResume] = useState<File | null>(null);
    const [resumeError, setResumeError] = useState<string>('');
    const [resumePreviewUrl, setResumePreviewUrl] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [emailTouched, setEmailTouched] = useState<boolean>(false);

    // Area codes for dropdown
    const areaCodes = [
        { code: '+1', country: 'Canada/USA' },
        { code: '+44', country: 'United Kingdom' },
        { code: '+91', country: 'India' },
        { code: '+61', country: 'Australia' },
        { code: '+81', country: 'Japan' },
        { code: '+86', country: 'China' }
    ];

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
    };

    const handleWorkExperienceChange = (idx: number, field: string, value: string | boolean) => {
        setWorkExperience(prev => {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], [field]: value };
            if (field === 'currentlyWorking' && value === true) {
                updated[idx].endMonth = '';
                updated[idx].endYear = '';
            }
            return updated;
        });
    };

    const addWorkExperience = () => {
        setWorkExperience(prev => ([...prev, { companyName: '', jobTitle: '', startMonth: '', startYear: '', endMonth: '', endYear: '', description: '', currentlyWorking: false }]));
    };

    const deleteWorkExperience = (idx: number) => {
        setWorkExperience(prev => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev);
    };

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
    
        // Gather form data
        const formData: ApplicationFormData = {
            personalInfo,
            locationInfo,
            experienceInfo: { workExperience },
            educationInfo,
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
            alert('Network error. Please try again later.');
        }
    };

    // Month and year options
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 51 }, (_, i) => String(currentYear - 40 + i));

    // Degree options
    const degrees = [
        'Bachelor of Arts (BA)',
        'Bachelor of Science (BS)',
        'Bachelor of Business Administration (BBA)',
        'Bachelor of Engineering (BEng)',
        'Bachelor of Computer Science (BCS)',
        'Bachelor of Applied Science (BASc)',
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

    const PersonalInformationSection = () => {
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
                                className="input bg-gray-200 rounded-full px-3 py-3 w-32 min-w-fit text-center"
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

    const ContactInformationSection = () => {
        return (
            <section className="mb-10">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="country" className="text-sm font-medium mb-1 ml-2">Country</label>
                        <select
                            id="country"
                            className="input bg-gray-200 rounded-full px-6 py-3"
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
                                className="input bg-gray-200 rounded-full px-6 py-3"
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
                                className="input bg-gray-200 rounded-full px-6 py-3"
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

    const WorkExperienceSection = () => {
        return (
             <section className="mb-10">
             <h3 className="text-2xl font-bold mb-6">Work Experience</h3>
             {workExperience.map((exp, idx) => (
                 <div key={idx} className="mb-8 relative">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
                         <div className="flex flex-col gap-1">
                             <label htmlFor={`companyName-${idx}`} className="text-sm font-medium mb-1 ml-2">Company Name</label>
                             <input id={`companyName-${idx}`} className="input bg-gray-200 rounded-full px-6 py-3" type="text" placeholder="" value={exp.companyName} onChange={e => handleWorkExperienceChange(idx, 'companyName', e.target.value)} />
                         </div>
                         <div className="flex flex-col gap-1">
                             <label htmlFor={`jobTitle-${idx}`} className="text-sm font-medium mb-1 ml-2">Job Title</label>
                             <div className="flex items-center gap-2">
                                 <input id={`jobTitle-${idx}`} className="input bg-gray-200 rounded-full px-6 py-3 flex-1" type="text" placeholder="" value={exp.jobTitle} onChange={e => handleWorkExperienceChange(idx, 'jobTitle', e.target.value)} />
                                 {workExperience.length > 1 && (
                                     <button type="button" onClick={() => deleteWorkExperience(idx)}
                                         className="bg-gray-200 rounded-full flex items-center justify-center w-12 h-12 text-red-500 hover:text-red-700 hover:bg-gray-300 transition"
                                         title="Delete">
                                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                     </button>
                                 )}
                             </div>
                         </div>
                         {/* Date labels and inputs */}
                         <div className={`w-full flex flex-col gap-1 md:col-span-2 ${exp.currentlyWorking ? '' : 'flex-col sm:flex-row'}`}>
                             <div className="flex-1 flex flex-col min-w-0 max-w-xs">
                                 <label className="text-sm font-medium mb-1 ml-2">Start Date</label>
                                 <div className="flex flex-col sm:flex-row gap-2 min-w-0">
                                     <select
                                         className="input bg-gray-200 rounded-full px-4 py-3 min-w-0 w-full sm:w-40"
                                         value={exp.startMonth}
                                         onChange={e => handleWorkExperienceChange(idx, 'startMonth', e.target.value)}
                                     >
                                         <option value="">Month</option>
                                         {months.map(month => (
                                             <option key={month} value={month}>{month}</option>
                                         ))}
                                     </select>
                                     <select
                                         className="input bg-gray-200 rounded-full px-4 py-3 min-w-0 w-full sm:w-32"
                                         value={exp.startYear}
                                         onChange={e => handleWorkExperienceChange(idx, 'startYear', e.target.value)}
                                     >
                                         <option value="">Year</option>
                                         {years.map(year => (
                                             <option key={year} value={year}>{year}</option>
                                         ))}
                                     </select>
                                 </div>
                             </div>
                             {!exp.currentlyWorking && (
                                 <div className="flex-1 flex flex-col min-w-0 max-w-xs mt-4 sm:mt-0">
                                     <label className="text-sm font-medium mb-1 ml-2">End Date</label>
                                     <div className="flex flex-col sm:flex-row gap-2 min-w-0">
                                         <select
                                             className="input bg-gray-200 rounded-full px-4 py-3 min-w-0 w-full sm:w-40"
                                             value={exp.endMonth}
                                             onChange={e => handleWorkExperienceChange(idx, 'endMonth', e.target.value)}
                                         >
                                             <option value="">Month</option>
                                             {months.map(month => (
                                                 <option key={month} value={month}>{month}</option>
                                             ))}
                                         </select>
                                         <select
                                             className="input bg-gray-200 rounded-full px-4 py-3 min-w-0 w-full sm:w-32"
                                             value={exp.endYear}
                                             onChange={e => handleWorkExperienceChange(idx, 'endYear', e.target.value)}
                                         >
                                             <option value="">Year</option>
                                             {years.map(year => (
                                                 <option key={year} value={year}>{year}</option>
                                             ))}
                                         </select>
                                     </div>
                                 </div>
                             )}
                             <div className="flex items-center ml-auto mt-6 md:mt-7">
                                 <input
                                     type="checkbox"
                                     id={`currentlyWorking-${idx}`}
                                     checked={!!exp.currentlyWorking}
                                     onChange={e => handleWorkExperienceChange(idx, 'currentlyWorking', e.target.checked)}
                                     className="ml-2"
                                 />
                                 <label htmlFor={`currentlyWorking-${idx}`} className="select-none cursor-pointer ml-1">I currently work here</label>
                             </div>
                         </div>
                     </div>
                     <div className="flex flex-col gap-1 mt-2">
                         <label htmlFor={`description-${idx}`} className="text-sm font-medium mb-1 ml-2">Description</label>
                         <textarea id={`description-${idx}`} className="input bg-gray-200 rounded-2xl px-6 py-3 w-full min-h-[280px] mb-2 resize-none" placeholder="" value={exp.description} onChange={e => handleWorkExperienceChange(idx, 'description', e.target.value)} />
                     </div>
                 </div>
             ))}
             <button type="button" className="w-full flex flex-col items-center justify-center py-2 border-2 border-gray-300 rounded-full font-bold text-gray-600 hover:bg-gray-100 mb-2" onClick={addWorkExperience}>
                 <span className="flex flex-col items-center justify-center gap-2">
                     <svg fill="none" strokeWidth="3" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-8 h-8 text-gray-600 mb-1">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
                     </svg>
                     <span className="text-base font-semibold">Add Work Experience</span>
                 </span>
             </button>
         </section>
        )
    }

    const EducationSection = () => {
        return (
            <section className="mb-10">
                <h3 className="text-lg font-semibold mb-4">Education</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="school" className="text-sm font-medium mb-1 ml-2">School</label>
                        <select
                            id="school"
                            className="input bg-gray-200 rounded-full px-6 py-3"
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
                        <label htmlFor="degree" className="text-sm font-medium mb-1 ml-2">Degree</label>
                        <select
                            id="degree"
                            className="input bg-gray-200 rounded-full px-6 py-3"
                            value={educationInfo.degree === otherDegree ? 'Other' : educationInfo.degree}
                            onChange={e => {
                                if (e.target.value === 'Other') {
                                    setEducationInfo({ ...educationInfo, degree: otherDegree || '' });
                                } else {
                                    setOtherDegree('');
                                    setEducationInfo({ ...educationInfo, degree: e.target.value });
                                }
                            }}
                        >
                            <option value="Select a Degree">Select a Degree</option>
                            {degrees.map(degree => (
                                <option key={degree} value={degree}>{degree}</option>
                            ))}
                        </select>
                        {educationInfo.degree === otherDegree && (
                            <input
                                type="text"
                                className="input bg-gray-200 rounded-full px-6 py-3 mt-2"
                                placeholder="Please specify your degree"
                                value={otherDegree}
                                onChange={e => {
                                    setOtherDegree(e.target.value);
                                    setEducationInfo({ ...educationInfo, degree: e.target.value });
                                }}
                            />
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="fieldOfStudy" className="text-sm font-medium mb-1 ml-2">Field of Study</label>
                        <select
                            id="fieldOfStudy"
                            className="input bg-gray-200 rounded-full px-6 py-3"
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
                                className="input bg-gray-200 rounded-full px-4 py-3 flex-1 min-w-0"
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
                                className="input bg-gray-200 rounded-full px-4 py-3 flex-1 min-w-0"
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
        )
    }

    const ResumeUploadModule = () => {
        return (
            <section className="mb-10">
                <label className="block w-full border-2 border-blue-200 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-400 transition mb-2 bg-gradient-to-br from-white to-blue-50">
                    <span className="flex flex-col items-center justify-center gap-2">
                        <svg fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-10 h-10 text-blue-400 mb-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"></path>
                        </svg>
                        <span className="text-xl font-bold">Resume Upload</span>
                    </span>
                    <input type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} />
                </label>
                {resume && <div className="text-center text-sm text-gray-600">{resume.name}</div>}
                {resumeError && <div className="text-center text-red-500 text-sm mt-2">{resumeError}</div>}
                {resumePreviewUrl && (
                    <div className="flex flex-col items-center mt-4">
                        <span className="text-sm text-gray-500 mb-2">PDF Preview:</span>
                        <embed src={resumePreviewUrl} type="application/pdf" className="w-full max-w-xl h-96 border rounded-lg shadow" />
                    </div>
                )}
            </section>
        )
    }

    return (
        <form className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md mt-8" onSubmit={handleSubmit}>
            <JobInformationSection />
            <PersonalInformationSection/>
            <ContactInformationSection/>
            <EducationSection />
            <WorkExperienceSection />
            <ResumeUploadModule />
            <button type="submit" className="w-full py-3 bg-gray-200 rounded-full font-semibold text-lg hover:bg-gray-300 transition">Submit</button>
        </form>
    );
}

export default ApplicationForm;