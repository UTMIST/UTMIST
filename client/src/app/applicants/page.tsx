"use client";

import React from "react";

import ApplicantRow from "@/components/admin/ApplicantRow";
import { Applicant } from "@/types/admin";
import applicantData from "@/assets/applicants.json";
	
const mockApplicants: Applicant[] = applicantData.map((applicant) => ({
	id: applicant.id,
	name: applicant.name,
	role: applicant.role,
	notes: applicant.notes,
	questions: applicant.questions,
	interviewStatus: applicant.interviewStatus,
	applicationStatus: applicant.applicationStatus,
	phone: applicant.phone,
	school: applicant.school,
	major: applicant.major,
	year: applicant.year,
	email: applicant.email,
}));

export default function ApplicantsDashboard() {

	return (
		<div className="p-8 px-[15em] justify-center center">
			<h1 className="text-2xl font-bold mb-6">Applicants Dashboard</h1>
			<table className="min-w-full border-2 border-[#6b66e3] border-collapse rounded-lg overflow-hidden">
				<thead className="bg-gray-100">
					<tr className="divide-x-2 divide-[#6b66e3]">
						<th className="px-4 py-2 text-left">Name</th>
						<th className="px-4 py-2 text-left">Role Applied</th>
						<th className="px-4 py-2 text-left">Interview Status</th>
						<th className="px-4 py-2 text-left">Application Status</th>
					</tr>
				</thead>
				<tbody className="bg-white">
					{mockApplicants.map((applicant) => (
						<ApplicantRow key={applicant.id} applicant={applicant} />
					))}
				</tbody>
			</table>
		</div>
	);
}
