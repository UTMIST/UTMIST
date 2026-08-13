export interface Applicant {
	id: string;
	name: string;
	role: string;
	questions: {question: string; answer: string}[];
	interviewStatus: string;
	applicationStatus: string;
	notes: string;
	email: string;
	phone: string;
	school: string;
	major: string;
	year: string;
};