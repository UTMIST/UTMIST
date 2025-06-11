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
        { companyName: '', jobTitle: '', startMonth: '', startYear: '', endMonth: '', endYear: '', description: '' },
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

    const handleWorkExperienceChange = (idx: number, field: string, value: string) => {
        setWorkExperience(prev => {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], [field]: value };
            return updated;
        });
    };

    const addWorkExperience = () => {
        setWorkExperience(prev => ([...prev, { companyName: '', jobTitle: '', startMonth: '', startYear: '', endMonth: '', endYear: '', description: '' }]));
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
                    <input className="input bg-gray-200 rounded-full px-6 py-3" type="text" placeholder="First Name" value={personalInfo.firstName} onChange={e => setPersonalInfo({ ...personalInfo, firstName: e.target.value })} />
                    <input className="input bg-gray-200 rounded-full px-6 py-3" type="text" placeholder="Last Name" value={personalInfo.lastName} onChange={e => setPersonalInfo({ ...personalInfo, lastName: e.target.value })} />
                    <input className={`input bg-gray-200 rounded-full px-6 py-3 md:col-span-2${emailError && emailTouched ? ' border-2 border-red-500' : ''}`} type="email" placeholder="Email" value={personalInfo.email} onChange={e => {
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
                        <div className="text-red-500 text-sm md:col-span-2 ml-2 mt-1">{emailError}</div>
                    )}
                    <div className="flex gap-2 md:col-span-2">
                        <select
                            className="input bg-gray-200 rounded-full px-3 py-3 w-16 min-w-fit text-center"
                            value={personalInfo.areaCode}
                            onChange={e => setPersonalInfo({ ...personalInfo, areaCode: e.target.value })}
                        >
                            {areaCodes.map(code => (
                                <option key={code} value={code}>{code}</option>
                            ))}
                        </select>
                        <input
                            className="input bg-gray-200 rounded-full px-6 py-3 flex-1"
                            type="tel"
                            placeholder="Phone Number"
                            value={personalInfo.phoneNumber}
                            onChange={handlePhoneNumberChange}
                            maxLength={12}
                        />
                    </div>
                </div>
            </section>

            {/* Contact Information */}
            <section className="mb-10">
                <h3 className="text-2xl font-semibold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <input className="input bg-gray-200 rounded-full px-6 py-3" type="text" placeholder="Country" value={locationInfo.country} onChange={e => setLocationInfo({ ...locationInfo, country: e.target.value })} />
                    <input className="input bg-gray-200 rounded-full px-6 py-3" type="text" placeholder="Address" value={locationInfo.address} onChange={e => setLocationInfo({ ...locationInfo, address: e.target.value })} />
                    <input className="input bg-gray-200 rounded-full px-6 py-3" type="text" placeholder="City" value={locationInfo.city} onChange={e => setLocationInfo({ ...locationInfo, city: e.target.value })} />
                    <input className="input bg-gray-200 rounded-full px-6 py-3" type="text" placeholder="Postal Code" value={locationInfo.postalCode} onChange={e => setLocationInfo({ ...locationInfo, postalCode: e.target.value })} />
                    <input className="input bg-gray-200 rounded-full px-6 py-3 md:col-span-2" type="text" placeholder="Province / State" value={locationInfo.provinceOrState} onChange={e => setLocationInfo({ ...locationInfo, provinceOrState: e.target.value })} />
                </div>
            </section>

            {/* Education */}
            <section className="mb-10">
                <h3 className="text-2xl font-semibold mb-4">Education</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <input className="input bg-gray-200 rounded-full px-6 py-3" type="text" placeholder="School" value={educationInfo.school} onChange={e => setEducationInfo({ ...educationInfo, school: e.target.value })} />
                    <input className="input bg-gray-200 rounded-full px-6 py-3" type="text" placeholder="Degree" value={educationInfo.degree} onChange={e => setEducationInfo({ ...educationInfo, degree: e.target.value })} />
                    <input className="input bg-gray-200 rounded-full px-6 py-3" type="text" placeholder="Field of Study" value={educationInfo.fieldOfStudy} onChange={e => setEducationInfo({ ...educationInfo, fieldOfStudy: e.target.value })} />
                    <div className="flex gap-2 min-w-0">
                        <select
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
            </section>

            {/* Work Experience */}
            <section className="mb-10">
                <h3 className="text-2xl font-bold mb-6">Work Experience</h3>
                {workExperience.map((exp, idx) => (
                    <div key={idx} className="mb-8 relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
                            <input className="input bg-gray-200 rounded-full px-6 py-3" type="text" placeholder="Company Name" value={exp.companyName} onChange={e => handleWorkExperienceChange(idx, 'companyName', e.target.value)} />
                            <div className="flex items-center gap-2">
                                <input className="input bg-gray-200 rounded-full px-6 py-3 flex-1" type="text" placeholder="Job Title" value={exp.jobTitle} onChange={e => handleWorkExperienceChange(idx, 'jobTitle', e.target.value)} />
                                {workExperience.length > 1 && (
                                    <button type="button" onClick={() => deleteWorkExperience(idx)}
                                        className="bg-gray-200 rounded-full flex items-center justify-center w-12 h-12 text-red-500 hover:text-red-700 hover:bg-gray-300 transition"
                                        title="Delete">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-2 min-w-0">
                                <select
                                    className="input bg-gray-200 rounded-full px-4 py-3 flex-1 min-w-0"
                                    value={exp.startMonth}
                                    onChange={e => handleWorkExperienceChange(idx, 'startMonth', e.target.value)}
                                >
                                    <option value="">Start Month</option>
                                    {months.map(month => (
                                        <option key={month} value={month}>{month}</option>
                                    ))}
                                </select>
                                <select
                                    className="input bg-gray-200 rounded-full px-4 py-3 flex-1 min-w-0"
                                    value={exp.startYear}
                                    onChange={e => handleWorkExperienceChange(idx, 'startYear', e.target.value)}
                                >
                                    <option value="">Start Year</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-2 min-w-0">
                                <select
                                    className="input bg-gray-200 rounded-full px-4 py-3 flex-1 min-w-0"
                                    value={exp.endMonth}
                                    onChange={e => handleWorkExperienceChange(idx, 'endMonth', e.target.value)}
                                >
                                    <option value="">End Month</option>
                                    {months.map(month => (
                                        <option key={month} value={month}>{month}</option>
                                    ))}
                                </select>
                                <select
                                    className="input bg-gray-200 rounded-full px-4 py-3 flex-1 min-w-0"
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
                        <textarea className="input bg-gray-200 rounded-2xl px-6 py-3 w-full min-h-[60px] mb-2 resize-none" placeholder="Description" value={exp.description} onChange={e => handleWorkExperienceChange(idx, 'description', e.target.value)} />
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