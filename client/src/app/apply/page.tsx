"use client";
import React, { useState } from "react";
import {
  PersonalInformation,
  ContactInformation,
  EducationInformation,
  ApplicationFormData,
  UniversityAPIResponse,
} from "../../types/apply";
import { DocumentArrowUpIcon } from "@heroicons/react/24/outline";
import { validatePhoneNumber } from "../../utils/validation";
import { validatePostalCode } from "../../utils/validation";

// A robust, reusable wrapper for dropdowns to ensure cross-browser compatibility
const SelectWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`relative ${className}`}>
    {children}
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-6">
      <svg
        className="h-5 w-5 text-gray-500"
        width="16"
        height="10"
        viewBox="0 0 16 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 2L8 8L14 2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  </div>
);

// Month and year options
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
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
          <label htmlFor="firstName" className="text-sm font-medium mb-1 ml-2">
            First Name
          </label>
          <input
            id="firstName"
            className="input bg-gray-200 rounded-full px-6 py-3"
            type="text"
            placeholder=""
            value={personalInfo.firstName}
            onChange={(e) =>
              setPersonalInfo({ ...personalInfo, firstName: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="lastName" className="text-sm font-medium mb-1 ml-2">
            Last Name
          </label>
          <input
            id="lastName"
            className="input bg-gray-200 rounded-full px-6 py-3"
            type="text"
            placeholder=""
            value={personalInfo.lastName}
            onChange={(e) =>
              setPersonalInfo({ ...personalInfo, lastName: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-1 md:col-span-2">
          <label htmlFor="email" className="text-sm font-medium mb-1 ml-2">
            Email
          </label>
          <input
            id="email"
            className={`input bg-gray-200 rounded-full px-6 py-3${emailError && emailTouched ? " border-2 border-red-500" : ""}`}
            type="email"
            placeholder=""
            value={personalInfo.email}
            onChange={(e) => {
              setPersonalInfo({ ...personalInfo, email: e.target.value });
              if (emailTouched) {
                setEmailError(
                  e.target.value && !validateEmail(e.target.value)
                    ? "Please enter a valid email address."
                    : "",
                );
              }
            }}
            onBlur={() => {
              setEmailTouched(true);
              setEmailError(
                personalInfo.email && !validateEmail(personalInfo.email)
                  ? "Please enter a valid email address."
                  : "",
              );
            }}
          />
          {emailError && emailTouched && personalInfo.email && (
            <div className="text-red-500 text-sm ml-2 mt-1">{emailError}</div>
          )}
        </div>
        <div className="flex flex-col gap-1 md:col-span-2">
          <label htmlFor="areaCode" className="text-sm font-medium mb-1 ml-2">
            Area Code & Phone Number
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <SelectWrapper>
              <select
                id="areaCode"
                className="input bg-gray-200 rounded-full px-6 py-3 pr-12 appearance-none w-full"
                value={personalInfo.areaCode}
                onChange={(e) =>
                  setPersonalInfo({ ...personalInfo, areaCode: e.target.value })
                }
              >
                {areaCodes.map(({ code, country }) => (
                  <option key={code} value={code}>
                    {code} ({country})
                  </option>
                ))}
              </select>
            </SelectWrapper>
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
  );
};

// ContactInformationSection props
type ContactInformationSectionProps = {
  locationInfo: ContactInformation;
  setLocationInfo: React.Dispatch<React.SetStateAction<ContactInformation>>;
  postalCodePatterns: Record<
    string,
    { placeholder: string; pattern: string; title: string }
  >;
  formatPostalCode: (value: string, country: string) => string;
  postalCodeError?: string;
};

const ContactInformationSection = ({
  locationInfo,
  setLocationInfo,
  postalCodePatterns,
  formatPostalCode,
  postalCodeError,
}: ContactInformationSectionProps) => {
  const [otherCountry, setOtherCountry] = useState("");
  const [isOtherCountry, setIsOtherCountry] = useState(false);

  return (
    <section className="mb-10">
      <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="flex flex-col gap-1">
          <label htmlFor="country" className="text-sm font-medium mb-1 ml-2">
            Country
          </label>
          <SelectWrapper>
            <select
              id="country"
              className="input bg-gray-200 rounded-full px-6 py-3 pr-12 appearance-none w-full"
              value={isOtherCountry ? "Other" : locationInfo.country}
              onChange={(e) => {
                if (e.target.value === "Other") {
                  setIsOtherCountry(true);
                  setLocationInfo({
                    ...locationInfo,
                    country: otherCountry,
                    provinceOrState: "",
                    postalCode: "",
                  });
                } else {
                  setIsOtherCountry(false);
                  setOtherCountry("");
                  setLocationInfo({
                    ...locationInfo,
                    country: e.target.value,
                    provinceOrState: "",
                    postalCode: "",
                  });
                }
              }}
            >
              <option value="">Select a Country</option>
              {[
                "Canada",
                "United States",
                "United Kingdom",
                "Australia",
                "India",
                "China",
                "Other",
              ].map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </SelectWrapper>
          {isOtherCountry && (
            <input
              type="text"
              className="input bg-gray-200 rounded-full px-6 py-3 mt-2"
              placeholder="Please specify your country"
              value={otherCountry}
              onChange={(e) => {
                setOtherCountry(e.target.value);
                setLocationInfo({ ...locationInfo, country: e.target.value });
              }}
            />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="address" className="text-sm font-medium mb-1 ml-2">
            Address
          </label>
          <input
            id="address"
            className="input bg-gray-200 rounded-full px-6 py-3"
            type="text"
            placeholder=""
            value={locationInfo.address}
            onChange={(e) =>
              setLocationInfo({ ...locationInfo, address: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="city" className="text-sm font-medium mb-1 ml-2">
            City
          </label>
          <input
            id="city"
            className="input bg-gray-200 rounded-full px-6 py-3"
            type="text"
            placeholder=""
            value={locationInfo.city}
            onChange={(e) =>
              setLocationInfo({ ...locationInfo, city: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="postalCode" className="text-sm font-medium mb-1 ml-2">
            Postal Code
          </label>
          {!locationInfo.country && !isOtherCountry && (
            <input
              id="postalCode"
              className="input bg-gray-200 rounded-full px-6 py-3"
              type="text"
              placeholder="Please select a country"
              disabled
            />
          )}
          {locationInfo.country === "Canada" && (
            <>
              <input
                id="postalCode"
                className="input bg-gray-200 rounded-full px-6 py-3"
                type="text"
                placeholder={postalCodePatterns["Canada"].placeholder}
                pattern={postalCodePatterns["Canada"].pattern}
                title={postalCodePatterns["Canada"].title}
                value={locationInfo.postalCode}
                onChange={(e) =>
                  setLocationInfo({
                    ...locationInfo,
                    postalCode: formatPostalCode(e.target.value, "Canada"),
                  })
                }
                maxLength={7}
              />
              {postalCodeError && (
                <span className="text-xs text-red-600 mt-1 ml-2">
                  {postalCodeError}
                </span>
              )}
            </>
          )}
          {locationInfo.country === "United States" && (
            <>
              <input
                id="postalCode"
                className="input bg-gray-200 rounded-full px-6 py-3"
                type="text"
                placeholder={postalCodePatterns["United States"].placeholder}
                pattern={postalCodePatterns["United States"].pattern}
                title={postalCodePatterns["United States"].title}
                value={locationInfo.postalCode}
                onChange={(e) =>
                  setLocationInfo({
                    ...locationInfo,
                    postalCode: formatPostalCode(
                      e.target.value,
                      "United States",
                    ),
                  })
                }
                maxLength={10}
              />
              {postalCodeError && (
                <span className="text-xs text-red-600 mt-1 ml-2">
                  {postalCodeError}
                </span>
              )}
            </>
          )}
          {(locationInfo.country &&
            locationInfo.country !== "Canada" &&
            locationInfo.country !== "United States") ||
            (isOtherCountry && (
              <>
                <input
                  id="postalCode"
                  className="input bg-gray-200 rounded-full px-6 py-3"
                  type="text"
                  placeholder={postalCodePatterns["Other"].placeholder}
                  value={locationInfo.postalCode}
                  onChange={(e) =>
                    setLocationInfo({
                      ...locationInfo,
                      postalCode: e.target.value,
                    })
                  }
                />
                {postalCodeError && (
                  <span className="text-xs text-red-600 mt-1 ml-2">
                    {postalCodeError}
                  </span>
                )}
              </>
            ))}
        </div>
        <div className="flex flex-col gap-1 md:col-span-2">
          <label
            htmlFor="provinceOrState"
            className="text-sm font-medium mb-1 ml-2"
          >
            Province / State
          </label>
          {!locationInfo.country && !isOtherCountry && (
            <input
              id="provinceOrState"
              className="input bg-gray-200 rounded-full px-6 py-3"
              type="text"
              placeholder="Please select a country"
              disabled
            />
          )}
          {locationInfo.country === "Canada" && (
            <SelectWrapper>
              <select
                id="provinceOrState"
                className="input bg-gray-200 rounded-full px-6 py-3 pr-12 appearance-none w-full"
                value={locationInfo.provinceOrState}
                onChange={(e) =>
                  setLocationInfo({
                    ...locationInfo,
                    provinceOrState: e.target.value,
                  })
                }
              >
                <option value="">Select a Province/Territory</option>
                {[
                  "Alberta",
                  "British Columbia",
                  "Manitoba",
                  "New Brunswick",
                  "Newfoundland and Labrador",
                  "Northwest Territories",
                  "Nova Scotia",
                  "Nunavut",
                  "Ontario",
                  "Prince Edward Island",
                  "Quebec",
                  "Saskatchewan",
                  "Yukon",
                ].map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </SelectWrapper>
          )}
          {locationInfo.country === "United States" && (
            <SelectWrapper>
              <select
                id="provinceOrState"
                className="input bg-gray-200 rounded-full px-6 py-3 pr-12 appearance-none w-full"
                value={locationInfo.provinceOrState}
                onChange={(e) =>
                  setLocationInfo({
                    ...locationInfo,
                    provinceOrState: e.target.value,
                  })
                }
              >
                <option value="">Select a State</option>
                {[
                  "Alabama",
                  "Alaska",
                  "Arizona",
                  "Arkansas",
                  "California",
                  "Colorado",
                  "Connecticut",
                  "Delaware",
                  "Florida",
                  "Georgia",
                  "Hawaii",
                  "Idaho",
                  "Illinois",
                  "Indiana",
                  "Iowa",
                  "Kansas",
                  "Kentucky",
                  "Louisiana",
                  "Maine",
                  "Maryland",
                  "Massachusetts",
                  "Michigan",
                  "Minnesota",
                  "Mississippi",
                  "Missouri",
                  "Montana",
                  "Nebraska",
                  "Nevada",
                  "New Hampshire",
                  "New Jersey",
                  "New Mexico",
                  "New York",
                  "North Carolina",
                  "North Dakota",
                  "Ohio",
                  "Oklahoma",
                  "Oregon",
                  "Pennsylvania",
                  "Rhode Island",
                  "South Carolina",
                  "South Dakota",
                  "Tennessee",
                  "Texas",
                  "Utah",
                  "Vermont",
                  "Virginia",
                  "Washington",
                  "West Virginia",
                  "Wisconsin",
                  "Wyoming",
                ].map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </SelectWrapper>
          )}
          {((locationInfo.country &&
            locationInfo.country !== "Canada" &&
            locationInfo.country !== "United States") ||
            isOtherCountry) && (
            <input
              id="provinceOrState"
              className="input bg-gray-200 rounded-full px-6 py-3"
              type="text"
              placeholder="Enter your region/state"
              value={locationInfo.provinceOrState}
              onChange={(e) =>
                setLocationInfo({
                  ...locationInfo,
                  provinceOrState: e.target.value,
                })
              }
            />
          )}
        </div>
      </div>
    </section>
  );
};
// EducationSection props
type EducationSectionProps = {
  educationInfo: EducationInformation;
  setEducationInfo: React.Dispatch<React.SetStateAction<EducationInformation>>;
  months: string[];
  years: string[];
  otherFieldOfStudy: string;
  setOtherFieldOfStudy: React.Dispatch<React.SetStateAction<string>>;
  otherEducationLevel: string;
  setOtherEducationLevel: React.Dispatch<React.SetStateAction<string>>;
};

const EducationSection = ({
  educationInfo,
  setEducationInfo,
  months,
  years,
  otherFieldOfStudy,
  setOtherFieldOfStudy,
  otherEducationLevel,
  setOtherEducationLevel,
}: EducationSectionProps) => {
  const [universitySearch, setUniversitySearch] = useState<string>("");
  const [universities, setUniversities] = useState<
    Array<{ name: string; country: string }>
  >([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isActiveSearch, setIsActiveSearch] = useState<boolean>(false);

  // Education Level options
  const educationLevels = ["Diploma", "Undergraduate", "Graduate", "Other"];

  // Field of study options (comprehensive majors list)
  const stemMajors = {
    "Agriculture & Natural Resources": [
      "GENERAL AGRICULTURE",
      "AGRICULTURE PRODUCTION AND MANAGEMENT",
      "AGRICULTURAL ECONOMICS",
      "ANIMAL SCIENCES",
      "FOOD SCIENCE",
      "PLANT SCIENCE AND AGRONOMY",
      "SOIL SCIENCE",
      "MISCELLANEOUS AGRICULTURE",
      "FORESTRY",
      "NATURAL RESOURCES MANAGEMENT",
      "ENVIRONMENTAL SCIENCE",
    ],
    Arts: [
      "FINE ARTS",
      "DRAMA AND THEATER ARTS",
      "MUSIC",
      "VISUAL AND PERFORMING ARTS",
      "COMMERCIAL ART AND GRAPHIC DESIGN",
      "FILM VIDEO AND PHOTOGRAPHIC ARTS",
      "STUDIO ARTS",
      "MISCELLANEOUS FINE ARTS",
      "ART HISTORY AND CRITICISM",
    ],
    "Biology & Life Science": [
      "BIOLOGY",
      "BIOCHEMICAL SCIENCES",
      "BOTANY",
      "MOLECULAR BIOLOGY",
      "ECOLOGY",
      "GENETICS",
      "MICROBIOLOGY",
      "PHARMACOLOGY",
      "PHYSIOLOGY",
      "ZOOLOGY",
      "NEUROSCIENCE",
      "MISCELLANEOUS BIOLOGY",
      "COGNITIVE SCIENCE AND BIOPSYCHOLOGY",
    ],
    Business: [
      "GENERAL BUSINESS",
      "ACCOUNTING",
      "ACTUARIAL SCIENCE",
      "BUSINESS MANAGEMENT AND ADMINISTRATION",
      "OPERATIONS LOGISTICS AND E-COMMERCE",
      "BUSINESS ECONOMICS",
      "MARKETING AND MARKETING RESEARCH",
      "FINANCE",
      "HUMAN RESOURCES AND PERSONNEL MANAGEMENT",
      "INTERNATIONAL BUSINESS",
      "HOSPITALITY MANAGEMENT",
      "MANAGEMENT INFORMATION SYSTEMS AND STATISTICS",
      "MISCELLANEOUS BUSINESS & MEDICAL ADMINISTRATION",
    ],
    "Communications & Journalism": [
      "COMMUNICATIONS",
      "JOURNALISM",
      "MASS MEDIA",
      "ADVERTISING AND PUBLIC RELATIONS",
    ],
    "Computers & Mathematics": [
      "COMMUNICATION TECHNOLOGIES",
      "COMPUTER AND INFORMATION SYSTEMS",
      "COMPUTER PROGRAMMING AND DATA PROCESSING",
      "COMPUTER SCIENCE",
      "INFORMATION SCIENCES",
      "COMPUTER ADMINISTRATION MANAGEMENT AND SECURITY",
      "COMPUTER NETWORKING AND TELECOMMUNICATIONS",
      "MATHEMATICS",
      "APPLIED MATHEMATICS",
      "STATISTICS AND DECISION SCIENCE",
      "MATHEMATICS AND COMPUTER SCIENCE",
    ],
    Education: [
      "GENERAL EDUCATION",
      "EDUCATIONAL ADMINISTRATION AND SUPERVISION",
      "SCHOOL STUDENT COUNSELING",
      "ELEMENTARY EDUCATION",
      "MATHEMATICS TEACHER EDUCATION",
      "PHYSICAL AND HEALTH EDUCATION TEACHING",
      "EARLY CHILDHOOD EDUCATION",
      "SCIENCE AND COMPUTER TEACHER EDUCATION",
      "SECONDARY TEACHER EDUCATION",
      "SPECIAL NEEDS EDUCATION",
      "SOCIAL SCIENCE OR HISTORY TEACHER EDUCATION",
      "TEACHER EDUCATION: MULTIPLE LEVELS",
      "LANGUAGE AND DRAMA EDUCATION",
      "ART AND MUSIC EDUCATION",
      "MISCELLANEOUS EDUCATION",
      "LIBRARY SCIENCE",
    ],
    Engineering: [
      "ARCHITECTURE",
      "GENERAL ENGINEERING",
      "AEROSPACE ENGINEERING",
      "BIOLOGICAL ENGINEERING",
      "ARCHITECTURAL ENGINEERING",
      "BIOMEDICAL ENGINEERING",
      "CHEMICAL ENGINEERING",
      "CIVIL ENGINEERING",
      "COMPUTER ENGINEERING",
      "ELECTRICAL ENGINEERING",
      "ENGINEERING MECHANICS PHYSICS AND SCIENCE",
      "ENVIRONMENTAL ENGINEERING",
      "GEOLOGICAL AND GEOPHYSICAL ENGINEERING",
      "INDUSTRIAL AND MANUFACTURING ENGINEERING",
      "MATERIALS ENGINEERING AND MATERIALS SCIENCE",
      "MECHANICAL ENGINEERING",
      "METALLURGICAL ENGINEERING",
      "MINING AND MINERAL ENGINEERING",
      "NAVAL ARCHITECTURE AND MARINE ENGINEERING",
      "NUCLEAR ENGINEERING",
      "PETROLEUM ENGINEERING",
      "MISCELLANEOUS ENGINEERING",
      "ENGINEERING TECHNOLOGIES",
      "ENGINEERING AND INDUSTRIAL MANAGEMENT",
      "ELECTRICAL ENGINEERING TECHNOLOGY",
      "INDUSTRIAL PRODUCTION TECHNOLOGIES",
      "MECHANICAL ENGINEERING RELATED TECHNOLOGIES",
      "MISCELLANEOUS ENGINEERING TECHNOLOGIES",
      "MATERIALS SCIENCE",
    ],
    Health: [
      "NUTRITION SCIENCES",
      "GENERAL MEDICAL AND HEALTH SERVICES",
      "COMMUNICATION DISORDERS SCIENCES AND SERVICES",
      "HEALTH AND MEDICAL ADMINISTRATIVE SERVICES",
      "MEDICAL ASSISTING SERVICES",
      "MEDICAL TECHNOLOGIES TECHNICIANS",
      "HEALTH AND MEDICAL PREPARATORY PROGRAMS",
      "NURSING",
      "PHARMACY PHARMACEUTICAL SCIENCES AND ADMINISTRATION",
      "TREATMENT THERAPY PROFESSIONS",
      "COMMUNITY AND PUBLIC HEALTH",
      "MISCELLANEOUS HEALTH MEDICAL PROFESSIONS",
    ],
    "Humanities & Liberal Arts": [
      "AREA ETHNIC AND CIVILIZATION STUDIES",
      "LINGUISTICS AND COMPARATIVE LANGUAGE AND LITERATURE",
      "FRENCH GERMAN LATIN AND OTHER COMMON FOREIGN LANGUAGE STUDIES",
      "OTHER FOREIGN LANGUAGES",
      "ENGLISH LANGUAGE AND LITERATURE",
      "COMPOSITION AND RHETORIC",
      "LIBERAL ARTS",
      "HUMANITIES",
      "INTERCULTURAL AND INTERNATIONAL STUDIES",
      "PHILOSOPHY AND RELIGIOUS STUDIES",
      "THEOLOGY AND RELIGIOUS VOCATIONS",
      "ANTHROPOLOGY AND ARCHEOLOGY",
    ],
    "Industrial Arts & Consumer Services": [
      "COSMETOLOGY SERVICES AND CULINARY ARTS",
      "FAMILY AND CONSUMER SCIENCES",
      "MILITARY TECHNOLOGIES",
      "PHYSICAL FITNESS PARKS RECREATION AND LEISURE",
      "CONSTRUCTION SERVICES",
      "ELECTRICAL, MECHANICAL, AND PRECISION TECHNOLOGIES AND PRODUCTION",
      "TRANSPORTATION SCIENCES AND TECHNOLOGIES",
    ],
    Interdisciplinary: ["MULTI/INTERDISCIPLINARY STUDIES"],
    "Law & Public Policy": [
      "COURT REPORTING",
      "PRE-LAW AND LEGAL STUDIES",
      "CRIMINAL JUSTICE AND FIRE PROTECTION",
      "PUBLIC ADMINISTRATION",
      "PUBLIC POLICY",
    ],
    "Physical Sciences": [
      "PHYSICAL SCIENCES",
      "ASTRONOMY AND ASTROPHYSICS",
      "ATMOSPHERIC SCIENCES AND METEOROLOGY",
      "CHEMISTRY",
      "GEOLOGY AND EARTH SCIENCE",
      "GEOSCIENCES",
      "OCEANOGRAPHY",
      "PHYSICS",
      "MULTI-DISCIPLINARY OR GENERAL SCIENCE",
      "NUCLEAR, INDUSTRIAL RADIOLOGY, AND BIOLOGICAL TECHNOLOGIES",
    ],
    "Psychology & Social Work": [
      "PSYCHOLOGY",
      "EDUCATIONAL PSYCHOLOGY",
      "CLINICAL PSYCHOLOGY",
      "COUNSELING PSYCHOLOGY",
      "INDUSTRIAL AND ORGANIZATIONAL PSYCHOLOGY",
      "SOCIAL PSYCHOLOGY",
      "MISCELLANEOUS PSYCHOLOGY",
      "HUMAN SERVICES AND COMMUNITY ORGANIZATION",
      "SOCIAL WORK",
    ],
    "Social Science": [
      "INTERDISCIPLINARY SOCIAL SCIENCES",
      "GENERAL SOCIAL SCIENCES",
      "ECONOMICS",
      "CRIMINOLOGY",
      "GEOGRAPHY",
      "INTERNATIONAL RELATIONS",
      "POLITICAL SCIENCE AND GOVERNMENT",
      "SOCIOLOGY",
      "MISCELLANEOUS SOCIAL SCIENCES",
    ],
    Other: ["Other"],
  };

  // Search universities API
  const searchUniversities = async (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) {
      setUniversities([]);
      setIsActiveSearch(false);
      return;
    }

    setIsSearching(true);
    setIsActiveSearch(true);
    try {
      const response = await fetch(
        `http://universities.hipolabs.com/search?name=${encodeURIComponent(searchTerm)}`,
      );
      if (response.ok) {
        const data = await response.json();
        // Limit results to first 20 to avoid overwhelming the dropdown
        const limitedResults = data
          .slice(0, 20)
          .map((uni: UniversityAPIResponse) => ({
            name: uni.name,
            country: uni.country || "Unknown",
          }));
        console.log(data);
        setUniversities(limitedResults);
      } else {
        setUniversities([]);
      }
    } catch (error) {
      console.error("Error searching universities:", error);
      setUniversities([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleUniversityInputChange = (value: string) => {
    setUniversitySearch(value);
    setEducationInfo({ ...educationInfo, school: value });
    searchUniversities(value);
  };

  const handleUniversitySelect = (universityName: string) => {
    setEducationInfo({ ...educationInfo, school: universityName });
    setUniversitySearch(universityName);
    setIsActiveSearch(false);
    setUniversities([]);
  };

  return (
    <section className="mb-10">
      <h3 className="text-lg font-semibold mb-4">Education</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="flex flex-col gap-1">
          <label htmlFor="school" className="text-sm font-medium mb-1 ml-2">
            School
          </label>
          <div className="relative">
            <input
              id="school"
              type="text"
              className="input bg-gray-200 rounded-full px-6 py-3 w-full"
              placeholder="Search for your university..."
              value={universitySearch}
              onChange={(e) => handleUniversityInputChange(e.target.value)}
              onFocus={() => {
                if (universitySearch.length >= 2) {
                  setIsActiveSearch(true);
                }
              }}
              onBlur={() => {
                // Delay hiding to allow for clicks on suggestions
                setTimeout(() => {
                  setIsActiveSearch(false);
                }, 200);
              }}
            />
            {isSearching && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
              </div>
            )}
          </div>
          {/* University suggestions displayed below */}
          {isActiveSearch && universities.length > 0 && (
            <div className="mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {universities.map((university, index) => (
                <div
                  key={index}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                  onClick={() => handleUniversitySelect(university.name)}
                >
                  <div className="font-medium text-gray-900">
                    {university.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {university.country}
                  </div>
                </div>
              ))}
            </div>
          )}
          {isActiveSearch &&
            universitySearch &&
            !isSearching &&
            universities.length === 0 && (
              <div className="mt-2 text-sm text-gray-500 px-4 py-2 bg-gray-50 rounded-lg">
                No universities found. Try a different search term.
              </div>
            )}
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="educationLevel"
            className="text-sm font-medium mb-1 ml-2"
          >
            Education Level
          </label>
          <SelectWrapper>
            <select
              id="educationLevel"
              className="input bg-gray-200 rounded-full px-6 py-3 pr-12 appearance-none w-full"
              value={educationInfo.educationLevel}
              onChange={(e) => {
                if (e.target.value === "Other") {
                  setEducationInfo({
                    ...educationInfo,
                    educationLevel: "Other",
                  });
                } else {
                  setOtherEducationLevel("");
                  setEducationInfo({
                    ...educationInfo,
                    educationLevel: e.target.value,
                  });
                }
              }}
            >
              <option value="Select Education Level">
                Select Education Level
              </option>
              {educationLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </SelectWrapper>
          {educationInfo.educationLevel === "Other" && (
            <input
              type="text"
              className="input bg-gray-200 rounded-full px-6 py-3 mt-2"
              placeholder="Please specify your education level"
              value={otherEducationLevel}
              onChange={(e) => {
                setOtherEducationLevel(e.target.value);
                setEducationInfo({
                  ...educationInfo,
                  educationLevel: e.target.value,
                });
              }}
            />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="fieldOfStudy"
            className="text-sm font-medium mb-1 ml-2"
          >
            Field of Study
          </label>
          <SelectWrapper>
            <select
              id="fieldOfStudy"
              className="input bg-gray-200 rounded-full px-6 py-3 pr-12 appearance-none w-full"
              value={educationInfo.fieldOfStudy}
              onChange={(e) => {
                if (e.target.value === "Other") {
                  setEducationInfo({ ...educationInfo, fieldOfStudy: "Other" });
                } else {
                  setOtherFieldOfStudy("");
                  setEducationInfo({
                    ...educationInfo,
                    fieldOfStudy: e.target.value,
                  });
                }
              }}
            >
              <option value="Select a Major">Select a Major</option>
              {Object.entries(stemMajors).map(([category, majors]) => (
                <optgroup key={category} label={category}>
                  {majors.map((major) => (
                    <option key={major} value={major}>
                      {major}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </SelectWrapper>
          {educationInfo.fieldOfStudy === "Other" && (
            <input
              type="text"
              className="input bg-gray-200 rounded-full px-6 py-3 mt-2"
              placeholder="Please specify your field of study"
              value={otherFieldOfStudy}
              onChange={(e) => {
                setOtherFieldOfStudy(e.target.value);
                setEducationInfo({
                  ...educationInfo,
                  fieldOfStudy: e.target.value,
                });
              }}
            />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="graduationMonth"
            className="text-sm font-medium mb-1 ml-2"
          >
            Graduation Date
          </label>
          <div className="flex gap-2 min-w-0">
            <SelectWrapper className="flex-1 min-w-0">
              <select
                id="graduationMonth"
                className="input bg-gray-200 rounded-full px-6 py-3 pr-12 appearance-none w-full"
                value={educationInfo.graduationMonth}
                onChange={(e) =>
                  setEducationInfo({
                    ...educationInfo,
                    graduationMonth: e.target.value,
                  })
                }
              >
                <option value="">Month</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </SelectWrapper>
            <SelectWrapper className="flex-1 min-w-0">
              <select
                id="graduationYear"
                className="input bg-gray-200 rounded-full px-6 py-3 pr-12 appearance-none w-full"
                value={educationInfo.graduationYear}
                onChange={(e) =>
                  setEducationInfo({
                    ...educationInfo,
                    graduationYear: e.target.value,
                  })
                }
              >
                <option value="">Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </SelectWrapper>
          </div>
        </div>
      </div>
    </section>
  );
};

const ResumeUploadModule = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string>("");
  const [resumePreviewUrl, setResumePreviewUrl] = useState<string>("");

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type
      if (file.type !== "application/pdf") {
        setResume(null);
        setResumeError("Only PDF files are allowed.");
        setResumePreviewUrl("");
        return;
      }
      // Validate file size (max 5 MB)
      if (file.size > 5 * 1024 * 1024) {
        setResume(null);
        setResumeError("File size must be 5 MB or less.");
        setResumePreviewUrl("");
        return;
      }
      setResume(file);
      setResumeError("");
      // Create preview URL
      const url = URL.createObjectURL(file);
      setResumePreviewUrl(url);
    }
  };

  return (
    <section className="mb-10">
      <label className="block w-full border-2 border-blue-200 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-400 transition mb-2 bg-gradient-to-br from-white dark:from-[#0b101c] to-blue-50 dark:to-blue-950">
        <span className="flex flex-col items-center justify-center gap-2">
          <DocumentArrowUpIcon className="w-10 h-10 text-blue-400 mb-2" />
          <span className="text-xl font-bold">Resume Upload</span>
        </span>
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleResumeUpload}
        />
      </label>
      {resume && (
        <div className="text-center text-sm text-gray-600">{resume.name}</div>
      )}
      {resumeError && (
        <div className="text-center font-bold text-red-500 text-sm mt-2">
          {resumeError}
        </div>
      )}
      {resumePreviewUrl && (
        <div className="flex flex-col items-center mt-4">
          <span className="text-sm text-gray-500 mb-2">PDF Preview:</span>
          <embed
            src={resumePreviewUrl}
            type="application/pdf"
            className="w-full max-w-xl h-96 border rounded-lg shadow"
          />
        </div>
      )}
    </section>
  );
};

type MotivationStatementProps = {
  whyJoin: string;
  setWhyJoin: React.Dispatch<React.SetStateAction<string>>;
};

const MotivationStatement = ({
  whyJoin,
  setWhyJoin,
}: MotivationStatementProps) => {
  return (
    <section className="mb-10">
      <h3 className="text-lg font-bold mb-4">Why join UTMIST?</h3>
      <div className="flex flex-col gap-1">
        <textarea
          id="whyJoin"
          className="input bg-gray-200 rounded-2xl px-6 py-3 w-full min-h-[200px] resize-none"
          placeholder="Share your motivation and what you hope to contribute to UTMIST..."
          value={whyJoin}
          onChange={(e) => setWhyJoin(e.target.value)}
        />
      </div>
    </section>
  );
};

const ApplicationForm = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInformation>({
    firstName: "",
    lastName: "",
    email: "",
    areaCode: "+1",
    phoneNumber: "",
  });
  const [locationInfo, setLocationInfo] = useState<ContactInformation>({
    country: "",
    address: "",
    city: "",
    postalCode: "",
    provinceOrState: "",
  });
  const [educationInfo, setEducationInfo] = useState<EducationInformation>({
    school: "Select a University",
    educationLevel: "Select Education Level",
    fieldOfStudy: "Select a Major",
    graduationMonth: "",
    graduationYear: "",
  });

  const [emailError, setEmailError] = useState<string>("");
  const [emailTouched, setEmailTouched] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<string>("");
  const [phoneTouched, setPhoneTouched] = useState<boolean>(false);
  const [whyJoin, setWhyJoin] = useState<string>("");
  const [otherFieldOfStudy, setOtherFieldOfStudy] = useState<string>("");
  const [otherEducationLevel, setOtherEducationLevel] = useState<string>("");
  const [postalCodeError, setPostalCodeError] = useState<string>("");

  // Area codes for dropdown
  const areaCodes = [
    { code: "+1", country: "Canada/USA" },
    { code: "+44", country: "United Kingdom" },
    { code: "+91", country: "India" },
    { code: "+61", country: "Australia" },
    { code: "+81", country: "Japan" },
    { code: "+86", country: "China" },
  ];

  // Phone number formatting (North American style)
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");
    let formatted = "";
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
    if (!country && personalInfo.areaCode === "+1") country = "Canada/USA";
    else if (!country) country = "";
    if (formatted && !validatePhoneNumber(formatted, country)) {
      setPhoneError("Please enter a valid phone number.");
    } else {
      setPhoneError("");
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
      setEmailError("Please enter a valid email address.");
      setEmailTouched(true);
      return;
    } else {
      setEmailError("");
    }
    // Validate phone number
    let country = locationInfo.country;
    if (!country && personalInfo.areaCode === "+1") country = "Canada/USA";
    else if (!country) country = "";
    if (
      personalInfo.phoneNumber &&
      !validatePhoneNumber(personalInfo.phoneNumber, country)
    ) {
      setPhoneError("Please enter a valid phone number.");
      setPhoneTouched(true);
      return;
    } else {
      setPhoneError("");
    }

    // Validate postal code
    if (
      locationInfo.postalCode &&
      !validatePostalCode(locationInfo.postalCode, country)
    ) {
      setPostalCodeError("Please enter a valid postal code.");
      return;
    } else {
      setPostalCodeError("");
    }

    // Gather form data
    const formData: ApplicationFormData = {
      personalInfo,
      locationInfo,
      educationInfo: {
        ...educationInfo,
        otherFieldOfStudy: otherFieldOfStudy || undefined,
        otherEducationLevel: otherEducationLevel || undefined,
      },
      whyJoin,
    };

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Success logic here (e.g., show a success message, reset form, etc.)
        alert("Application submitted successfully!");
      } else {
        // Error logic here
        alert("There was an error submitting your application.");
      }
    } catch (error) {
      alert(`Network error. Please try again later. ${error}`);
    }
  };

  // Postal code validation patterns
  const postalCodePatterns: Record<
    string,
    { placeholder: string; pattern: string; title: string }
  > = {
    Canada: {
      placeholder: "A1A 1A1",
      pattern: "^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$",
      title: "Format: A1A 1A1",
    },
    "United States": {
      placeholder: "12345 or 12345-6789",
      pattern: "^\d{5}(-\d{4})?$",
      title: "Format: 12345 or 12345-6789",
    },
    Other: {
      placeholder: "Postal/ZIP Code",
      pattern: "",
      title: "",
    },
  };

  // Postal code formatting
  const formatPostalCode = (value: string, country: string) => {
    if (country === "Canada") {
      // Remove non-alphanumeric, uppercase, insert space after 3rd char
      let cleaned = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
      if (cleaned.length > 3) {
        cleaned = cleaned.slice(0, 3) + " " + cleaned.slice(3, 6);
      }
      return cleaned.slice(0, 7);
    } else if (country === "United States") {
      // Remove non-digits, format as 12345 or 12345-6789
      let cleaned = value.replace(/[^0-9]/g, "");
      if (cleaned.length > 5) {
        cleaned = cleaned.slice(0, 5) + "-" + cleaned.slice(5, 9);
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
        <h2 className="text-xl font-bold text-center mb-8">
          {"{JOB TITLE NAME}"}
        </h2>
      </>
    );
  };

  return (
    <form
      className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md mt-8"
      onSubmit={handleSubmit}
    >
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
        postalCodeError={postalCodeError}
      />
      <EducationSection
        educationInfo={educationInfo}
        setEducationInfo={setEducationInfo}
        months={months}
        years={years}
        otherFieldOfStudy={otherFieldOfStudy}
        setOtherFieldOfStudy={setOtherFieldOfStudy}
        otherEducationLevel={otherEducationLevel}
        setOtherEducationLevel={setOtherEducationLevel}
      />
      <MotivationStatement whyJoin={whyJoin} setWhyJoin={setWhyJoin} />
      <ResumeUploadModule />
      <button
        type="submit"
        className="w-full py-3 bg-gray-200 rounded-full font-semibold text-lg hover:bg-gray-300 transition"
      >
        Submit
      </button>
    </form>
  );
};

export default ApplicationForm;
