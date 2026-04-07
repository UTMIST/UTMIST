export interface Applicant {
	id: string;
	name: string;
	role: string;
	answers: { [question: string]: string };
	interviewStatus: string;
	applicationStatus: string;
	notes: string;
	email: string;
	school: string;
	year: string;
};