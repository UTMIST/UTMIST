"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Applicant } from "@/types/admin";
import applicantData from "@/assets/applicants.json";


export default function ApplicantDashboard() {
	const params = useParams();
	const applicantId = params.id as string;
	const [applicant, setApplicant] = useState<any>(applicantData.find((applicant) => applicant.id === applicantId));
	const [notes, setNotes] = useState("");

	const hideScheduleButton = ["Scheduled", "Finished"].includes(applicant.interviewStatus);

	return (
			<div className="w-full min-h-screen px-0 py-0 relative">
				<div className="max-w-4xl mx-auto pt-12 pb-8 px-8">
					<div className="justify-between flex mb-6">
					<h1 className="text-4xl font-extrabold tracking-tight">Applicant Dashboard</h1>
					<a
						className="bg-white hover:bg-indigo-100 text-black font-semibold px-5 py-2 rounded-lg shadow border"
						href="/applicants"
					>
					&larr; Back
					</a>
					</div>
					
					<div className="text-2xl font-bold text-gray-900 mb-2">{applicant.name}</div>
					<div className="text-xl text-gray-700 font-semibold mb-2">Role:
						<span className="font-semibold text-blue-700">{applicant.role}</span></div>
					
					<div className="flex flex-wrap items-center gap-8 mb-8">	
						<div className={`px-4 py-2 rounded-lg text-base font-semibold shadow-sm ${
							applicant.interviewStatus === "Scheduled" || applicant.interviewStatus === "Finished"
								? "bg-green-100 text-green-800 border border-green-200"
								: "bg-yellow-100 text-yellow-800 border border-yellow-200"
						}`}>
							Interview Status: {applicant.interviewStatus}
						</div>
						<div className={`px-4 py-2 rounded-lg text-base font-semibold shadow-sm ${
							applicant.applicationStatus === "Pending"
								? "bg-blue-100 text-blue-800 border border-blue-200"
								: applicant.applicationStatus === "Waitlisted"
								? "bg-yellow-100 text-yellow-800 border border-yellow-200"
								: "bg-gray-100 text-gray-800 border border-gray-200"
						}`}>
							Application Status: {applicant.applicationStatus}
						</div>
					</div>
					<div className="flex gap-6 mb-10">
						{!hideScheduleButton && (
							<button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-bold shadow transition-colors duration-200">Schedule Interview</button>
						)}
						<button className="border-2 border-black hover:bg-green-600 hover:text-white px-4 py-2 rounded-xl text-lg font-bold shadow transition-colors duration-200">Accept</button>
						<button className="border-2 border-black hover:bg-red-600 hover:text-white px-4 py-2 rounded-xl text-lg font-bold shadow transition-colors duration-200">Reject</button>
						<button className="border-2 border-black hover:bg-yellow-500 hover:text-white px-4 py-2 rounded-xl text-lg font-bold shadow transition-colors duration-200">Waitlist</button>
					</div>
					<div className="pr-8 pt-8 pb-8 mb-6">
						<div className="mb-2 flex items-center text-lg">
							<span className="font-bold text-gray-700 mr-2">Resume:</span>
							<a
								href={"https://mvmrwmtxepoyoueoiedh.supabase.co/storage/v1/object/sign/Meals/A%20Shubham's%20Resume.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83ZGQzMTU2ZS1hODE4LTQxOTMtYThkZi00NzZhYTUxYzZmMjUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJNZWFscy9BIFNodWJoYW0ncyBSZXN1bWUucGRmIiwiaWF0IjoxNzU4MzI0NTkwLCJleHAiOjE3ODk4NjA1OTB9.D3Qswo981fig8crwcgtFhu04Odg1hmjujPvx9F5kY3M"}
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-600 underline font-semibold ml-2"
								download
							>
								View Resume
							</a>
						</div>
							<div className="mb-2 mt-8 flex items-center text-lg gap-8">
								<div className="flex items-center w-[50%]">
									<span className="font-bold text-gray-700 mr-2">Email:</span>
									<span className="text-gray-900">{applicant.email}</span>
								</div>
								<div className="flex items-center w-[50%]">
									<span className="font-bold text-gray-700 mr-2">Phone:</span>
									<span className="text-gray-900">{applicant.phone}</span>
								</div>
							</div>
						<div className="mb-2 mt-8 flex items-center text-lg">
							<span className="font-bold text-gray-700 mr-2">School:</span>
							<span className="text-gray-900">{applicant.school}</span>
						</div>
							<div className="mb-2 mt-4 flex items-center text-lg gap-8">
								<div className="flex items-center w-[50%]">
									<span className="font-bold text-gray-700 mr-2">Major:</span>
									<span className="text-gray-900">{applicant.major}</span>
								</div>
								<div className="flex items-center w-[50%]">
									<span className="font-bold text-gray-700 mr-2">Year:</span>
									<span className="text-gray-900">{applicant.year}</span>
								</div>
							</div>
						<div className="mt-8 mb-2 font-bold text-gray-800 flex items-start text-lg">
							Why do you want this role?
						</div>
						<div className="mb-2 text-gray-900 whitespace-pre-wrap">
							For abc reasons.
						</div>
					</div>
					<div className="bg-white border border-blue-100 rounded-2xl p-8 mb-6 shadow">
						<div className="mb-4 font-bold text-lg text-blue-700">Leave Notes:</div>
						<textarea
							className="w-full border border-blue-200 rounded-xl p-4 mb-4 min-h-[120px] text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
							value={notes}
							onChange={e => setNotes(e.target.value)}
							placeholder="Type your notes here..."
						/>
						<button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-lg font-bold shadow transition-colors duration-200">Save Notes</button>
					</div>
				</div>
			</div>
	);
}
