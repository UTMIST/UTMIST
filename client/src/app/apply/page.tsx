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
        school: '',
        degree: '',
        fieldOfStudy: '',
        graduationMonth: '',
        graduationYear: '',
    });
    const [workExperience, setWorkExperience] = useState<WorkExperienceInformation['workExperience']>([
        { companyName: '', jobTitle: '', startMonth: '', startYear: '', endMonth: '', endYear: '', description: '', currentlyWorking: false },
    ]);
    const [resume, setResume] = useState<File | null>(null);
    const [emailError, setEmailError] = useState<string>('');
    const [emailTouched, setEmailTouched] = useState<boolean>(false);

    // Area codes for dropdown
    const areaCodes = ['+1', '+44', '+91', '+61', '+81', '+86'];

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
            setResume(e.target.files[0]);
        }
    };

    // Email validation function
    const validateEmail = (email: string) => {
        if (!email) return true; // Treat empty as valid for error display
        return /^\S+@\S+\.\S+$/.test(email);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validate email
        if (personalInfo.email && !validateEmail(personalInfo.email)) {
            setEmailError('Please enter a valid email address.');
            setEmailTouched(true);
            return;
        } else {
            setEmailError('');
        }
        // Submission logic here
    };

    // Month and year options
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 51 }, (_, i) => String(currentYear - 40 + i));

    return (
        <form className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md mt-8" onSubmit={handleSubmit}>
            <h1 className="text-3xl font-bold text-center mb-2">Apply Here</h1>
            <h2 className="text-xl font-bold text-center mb-8">{'{JOB TITLE NAME}'}</h2>

            {/* Personal Information */}
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
                        <div className="flex gap-2">
                            <select
                                id="areaCode"
                                className="input bg-gray-200 rounded-full px-3 py-3 w-16 min-w-fit text-center"
                                value={personalInfo.areaCode}
                                onChange={e => setPersonalInfo({ ...personalInfo, areaCode: e.target.value })}
                            >
                                {areaCodes.map(code => (
                                    <option key={code} value={code}>{code}</option>
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

            {/* Contact Information */}
            <section className="mb-10">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="country" className="text-sm font-medium mb-1 ml-2">Country</label>
                        <input id="country" className="input bg-gray-200 rounded-full px-6 py-3" type="text" placeholder="" value={locationInfo.country} onChange={e => setLocationInfo({ ...locationInfo, country: e.target.value })} />
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
                        <input id="postalCode" className="input bg-gray-200 rounded-full px-6 py-3" type="text" placeholder="" value={locationInfo.postalCode} onChange={e => setLocationInfo({ ...locationInfo, postalCode: e.target.value })} />
                    </div>
                    <div className="flex flex-col gap-1 md:col-span-2">
                        <label htmlFor="provinceOrState" className="text-sm font-medium mb-1 ml-2">Province / State</label>
                        <input id="provinceOrState" className="input bg-gray-200 rounded-full px-6 py-3" type="text" placeholder="" value={locationInfo.provinceOrState} onChange={e => setLocationInfo({ ...locationInfo, provinceOrState: e.target.value })} />
                    </div>
                </div>
            </section>

            {/* Education */}
            <section className="mb-10">
                <h3 className="text-lg font-semibold mb-4">Education</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="school" className="text-sm font-medium mb-1 ml-2">School</label>
                        <input id="school" className="input bg-gray-200 rounded-full px-6 py-3" type="text" placeholder="" value={educationInfo.school} onChange={e => setEducationInfo({ ...educationInfo, school: e.target.value })} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="degree" className="text-sm font-medium mb-1 ml-2">Degree</label>
                        <input id="degree" className="input bg-gray-200 rounded-full px-6 py-3" type="text" placeholder="" value={educationInfo.degree} onChange={e => setEducationInfo({ ...educationInfo, degree: e.target.value })} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="fieldOfStudy" className="text-sm font-medium mb-1 ml-2">Field of Study</label>
                        <input id="fieldOfStudy" className="input bg-gray-200 rounded-full px-6 py-3" type="text" placeholder="" value={educationInfo.fieldOfStudy} onChange={e => setEducationInfo({ ...educationInfo, fieldOfStudy: e.target.value })} />
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

            {/* Work Experience */}
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
                            <div className="w-full flex flex-col gap-1 md:col-span-2">
                                <div className="flex w-full gap-8">
                                    <div className={`${!exp.currentlyWorking ? 'flex-1 max-w-xs' : 'flex-1'} flex flex-col min-w-0`}>
                                        <label className="text-sm font-medium mb-1 ml-2">Start Date</label>
                                        <div className="flex gap-2 min-w-0">
                                            <select
                                                className={`input bg-gray-200 rounded-full px-4 py-3 min-w-0 ${exp.currentlyWorking ? 'flex-1' : 'w-40'}`}
                                                value={exp.startMonth}
                                                onChange={e => handleWorkExperienceChange(idx, 'startMonth', e.target.value)}
                                            >
                                                <option value="">Start Month</option>
                                                {months.map(month => (
                                                    <option key={month} value={month}>{month}</option>
                                                ))}
                                            </select>
                                            <select
                                                className={`input bg-gray-200 rounded-full px-4 py-3 min-w-0 ${exp.currentlyWorking ? 'flex-1' : 'w-32'}`}
                                                value={exp.startYear}
                                                onChange={e => handleWorkExperienceChange(idx, 'startYear', e.target.value)}
                                            >
                                                <option value="">Start Year</option>
                                                {years.map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    {!exp.currentlyWorking && (
                                        <div className="flex-1 flex flex-col min-w-0 max-w-xs">
                                            <label className="text-sm font-medium mb-1 ml-2">End Date</label>
                                            <div className="flex gap-2 min-w-0">
                                                <select
                                                    className="input bg-gray-200 rounded-full px-4 py-3 w-40 min-w-0"
                                                    value={exp.endMonth}
                                                    onChange={e => handleWorkExperienceChange(idx, 'endMonth', e.target.value)}
                                                >
                                                    <option value="">End Month</option>
                                                    {months.map(month => (
                                                        <option key={month} value={month}>{month}</option>
                                                    ))}
                                                </select>
                                                <select
                                                    className="input bg-gray-200 rounded-full px-4 py-3 w-32 min-w-0"
                                                    value={exp.endYear}
                                                    onChange={e => handleWorkExperienceChange(idx, 'endYear', e.target.value)}
                                                >
                                                    <option value="">End Year</option>
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
                        </div>
                        <div className="flex flex-col gap-1 mt-2">
                            <label htmlFor={`description-${idx}`} className="text-sm font-medium mb-1 ml-2">Description</label>
                            <textarea id={`description-${idx}`} className="input bg-gray-200 rounded-2xl px-6 py-3 w-full min-h-[280px] mb-2 resize-none" placeholder="" value={exp.description} onChange={e => handleWorkExperienceChange(idx, 'description', e.target.value)} />
                        </div>
                    </div>
                ))}
                <button type="button" className="w-full flex items-center justify-center py-2 border-2 border-gray-300 rounded-full text-2xl font-bold text-gray-600 hover:bg-gray-100 mb-2" onClick={addWorkExperience}>
                    +
                </button>
            </section>

            {/* Resume Upload */}
            <section className="mb-10">
                <h3 className="text-lg font-semibold mb-4">Resume</h3>
                <label className="block w-full border-2 border-blue-200 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-400 transition mb-2 bg-gradient-to-br from-white to-blue-50">
                    <span className="text-2xl font-bold">Resume Upload</span>
                    <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
                </label>
                {resume && <div className="text-center text-sm text-gray-600">{resume.name}</div>}
            </section>

            <button type="submit" className="w-full py-3 bg-gray-200 rounded-full font-semibold text-lg hover:bg-gray-300 transition">Submit</button>
        </form>
    );
}

export default ApplicationForm;