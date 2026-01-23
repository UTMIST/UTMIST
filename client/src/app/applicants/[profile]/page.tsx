"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

interface UserData {
	id: string;
	name: string;
	email: string;
}

interface JobData {
	id: string;
	job_title: string;
}

interface ApplicantData {
	id: string;
	name: string;
	role: string;
	email: string;
	phone: string;
	school: string;
	major: string;
	year: string;
	interviewStatus: string;
	applicationStatus: string;
	notes: string;
	answers: any;
	questions: any[];
}

export default function ApplicantProfile() {
	const params = useParams();
	const applicantId = params.profile as string;
	const [applicant, setApplicant] = useState<ApplicantData | null>(null);
	const [notes, setNotes] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchApplicant() {
			try {
				const { data, error: fetchError } = await supabase
					.from("Applicants")
					.select(`
						id,
						interview_status,
						acceptance_status,
						jobID,
						answers,
						notes,
						interview_time,
						created_at,
						userID,
						user:userID (
							id,
							name,
							email
						),
						Jobs:jobID (
							id,
							job_title
						)
					`)
					.eq("id", applicantId)
					.single();

				if (fetchError) {
					throw fetchError;
				}

				if (!data) {
					setError("Applicant not found");
					setLoading(false);
					return;
				}

				// Extract user data - handle both object and array cases
				const userDataRaw = data.user;
				const userData: UserData = Array.isArray(userDataRaw) 
					? (userDataRaw[0] as UserData)
					: (userDataRaw as UserData) || { id: "", name: "", email: "" };
				
				const jobDataRaw = data.Jobs;
				const jobData: JobData = Array.isArray(jobDataRaw) 
					? (jobDataRaw[0] as JobData)
					: (jobDataRaw as JobData) || { id: "", job_title: "" };

				// Parse answers JSON
				let phone = "";
				let school = "";
				let major = "";
				let year = "";
				let questions: any[] = [];

				if (data.answers) {
					try {
						const answers = typeof data.answers === 'string' 
							? JSON.parse(data.answers) 
							: data.answers;

						phone = answers.phone || answers.Phone || answers.phoneNumber || "";
						school = answers.school || answers.School || "";
						major = answers.major || answers.Major || answers.fieldOfStudy || "";
						year = answers.year || answers.Year || answers.educationLevel || "";

						// Extract questions if they exist in answers
						if (Array.isArray(answers.questions)) {
							questions = answers.questions;
						} else if (typeof answers === 'object') {
							// Convert object to array format
							questions = Object.entries(answers)
								.filter(([key]) => key.toLowerCase().includes('question') || key.toLowerCase().includes('why'))
								.map(([question, answer]) => ({
									question,
									answer: String(answer)
								}));
						}
					} catch (e) {
						console.error("Error parsing answers:", e);
					}
				}

				setApplicant({
					id: data.id || "",
					name: userData?.name || "",
					role: jobData?.job_title || "",
					email: userData?.email || "",
					phone: phone,
					school: school,
					major: major,
					year: year,
					interviewStatus: data.interview_status || "",
					applicationStatus: data.acceptance_status || "",
					notes: data.notes || "",
					answers: data.answers || {},
					questions: questions
				});

				// Load existing notes
				if (data.notes) {
					setNotes(data.notes);
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to load applicant");
				console.error("Error fetching applicant:", err);
			} finally {
				setLoading(false);
			}
		}

		if (applicantId) {
			fetchApplicant();
		}
	}, [applicantId]);

	if (loading) {
		return (
			<div className="w-full min-h-screen flex items-center justify-center">
				<div className="relative">
					<div className="w-12 h-12 border-4 border-[#6b66e3] border-t-transparent rounded-full animate-spin"></div>
				</div>
			</div>
		);
	}

	if (error || !applicant) {
		return (
			<div className="w-full min-h-screen flex items-center justify-center">
				<h1 className="text-3xl font-bold">{error || "Applicant Not Found"}</h1>
			</div>
		);
	}

	const hideScheduleButton = ["SCHEDULED", "COMPLETED"].includes(applicant.interviewStatus);

	return (
			<div className="w-full min-h-screen px-0 py-0 relative">
				<div className="max-w-4xl mx-auto pt-12 pb-8 px-8">
					<div className="justify-between flex mb-6">
					<h1 className="text-4xl font-extrabold tracking-tight">Applicant Dashboard</h1>
					<Link
						className="bg-white hover:bg-[#6b66e3] text-[#6b66e3] hover:text-white font-semibold px-5 py-2 rounded-3xl shadow border-2 border-[#6b66e3] transition-colors duration-200 flex items-center"
						href="/applicants"
					>
					&larr; Back
					</Link>
					</div>
					
					<div className="text-2xl font-bold text-gray-900 mb-2">{applicant.name}</div>
					<div className="text-xl text-gray-700 font-semibold mb-2">Role: 
						<span className="font-semibold text-blue-700">{applicant.role}</span></div>
					
					<div className="flex flex-wrap items-center gap-8 mb-8">	
						<div className={`px-4 py-2 rounded-lg text-base font-semibold shadow-sm ${
							applicant.interviewStatus === "SCHEDULED" || applicant.interviewStatus === "COMPLETED"
								? "bg-green-100 text-green-800 border border-green-200"
								: applicant.interviewStatus === "PENDING"
								? "bg-yellow-100 text-yellow-800 border border-yellow-200"
								: "bg-gray-100 text-gray-800 border border-gray-200"
						}`}>
							Interview Status: {applicant.interviewStatus || "Not Set"}
						</div>
						<div className={`px-4 py-2 rounded-lg text-base font-semibold shadow-sm ${
							applicant.applicationStatus === "ACCEPTED"
								? "bg-green-100 text-green-800 border border-green-200"
								: applicant.applicationStatus === "REJECTED"
								? "bg-red-100 text-red-800 border border-red-200"
								: applicant.applicationStatus === "WAITLISTED"
								? "bg-yellow-100 text-yellow-800 border border-yellow-200"
								: "bg-gray-100 text-gray-800 border border-gray-200"
						}`}>
							Application Status: {applicant.applicationStatus || "Not Set"}
						</div>
					</div>
					<div className="flex gap-6 mb-10">
						{!hideScheduleButton && (
							<button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-bold shadow transition-colors duration-200">Schedule Interview</button>
						)}
						<button className="border-2 border-[#6B66E3] bg-gradient-to-l from-[#6B66E3] to-[#1E19B1] px-4 py-2 hover:bg-white hover:text-[#6B66E3] rounded-2xl cursor-pointer text-lg font-bold shadow hover:[background-image:none] text-white transition-colors duration-200">Accept</button>
						<button className="border-2 border-[#6B66E3] bg-white text-[#6B66E3] hover:bg-[#6B66E3] cursor-pointer hover:text-white px-4 py-2 rounded-2xl text-lg font-bold shadow transition-colors duration-200">Reject</button>
						<button className="border-2 border-[#6B66E3] hover:bg-white cursor-pointer hover:text-[#6B66E3] px-4 py-2 rounded-2xl text-lg bg-[#6B66E3] text-white font-bold shadow transition-colors duration-200">Waitlist</button>
					</div>
					<div className="pr-8 pt-8 pb-8 mb-6">
						<div className="mb-2 flex items-center text-lg">
							<span className="font-bold text-gray-700 mr-2">Resume:</span>
							<a
								href={"EMPTY"}
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
						{applicant.questions && applicant.questions.length > 0 ? (
							applicant.questions.map((q: any, index: number) => (
								<div key={index} className="mt-8 mb-4">
									<div className="mb-2 font-bold text-gray-800 flex items-start text-lg">
										{q.question || `Question ${index + 1}`}
									</div>
									<div className="mb-2 text-gray-900 whitespace-pre-wrap">
										{q.answer || "No answer provided"}
									</div>
								</div>
							))
						) : (
							<div className="mt-8 mb-2">
								<div className="mb-2 font-bold text-gray-800 flex items-start text-lg">
									No questions answered
								</div>
								<div className="mb-2 text-gray-500">
									This applicant has not answered any questions yet.
								</div>
							</div>
						)}
					</div>
					<div className="bg-white border border-blue-100 rounded-2xl p-8 mb-6 shadow">
						<div className="mb-4 font-bold text-lg text-blue-700">Leave Notes:</div>
						<textarea
							className="w-full border border-blue-200 rounded-xl p-4 mb-4 min-h-[120px] text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
							value={notes}
							onChange={e => setNotes(e.target.value)}
							placeholder="Type your notes here..."
						/>
						<button 
							onClick={async () => {
								try {
									const { error: updateError } = await supabase
										.from("Applicants")
										.update({ notes: notes })
										.eq("id", applicantId);

									if (updateError) {
										throw updateError;
									}
									alert("Notes saved successfully!");
								} catch (err) {
									console.error("Error saving notes:", err);
									alert("Failed to save notes. Please try again.");
								}
							}}
							className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-lg font-bold shadow transition-colors duration-200"
						>
							Save Notes
						</button>
					</div>
				</div>
			</div>
	);
}
