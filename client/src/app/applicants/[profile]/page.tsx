"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Applicant } from "@/types/admin";

export default function ApplicantProfile() {
	const params = useParams();
	const applicantId = params.profile as string;
	const [applicant, setApplicant] = useState<Applicant | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [notes, setNotes] = useState("");
	const [saving, setSaving] = useState(false);
	const [saveMessage, setSaveMessage] = useState<string | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [modalAction, setModalAction] = useState<'Accept' | 'Reject' | 'Waitlist' | null>(null);

	useEffect(() => {
		const fetchApplicant = async () => {
			try {
				setLoading(true);
				const response = await fetch(`/api/applicants/${applicantId}`);
				
				if (!response.ok) {
					throw new Error('Failed to fetch applicant');
				}

				const data = await response.json();
				setApplicant(data.applicant);
				setNotes(data.applicant.notes || '');
			} catch (err) {
				console.error('Error fetching applicant:', err);
				setError(err instanceof Error ? err.message : 'Failed to load applicant');
			} finally {
				setLoading(false);
			}
		};

		if (applicantId) {
			fetchApplicant();
		}
	}, [applicantId]);

	const handleSaveNotes = async () => {
		try {
			setSaving(true);
			setSaveMessage(null);
			const response = await fetch(`/api/applicants/${applicantId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ notes }),
			});

			if (!response.ok) {
				throw new Error('Failed to save notes');
			}

			setSaveMessage('Notes saved successfully!');
			setTimeout(() => setSaveMessage(null), 3000);
		} catch (err) {
			console.error('Error saving notes:', err);
			setSaveMessage('Failed to save notes');
		} finally {
			setSaving(false);
		}
	};

	const handleActionClick = (action: 'Accept' | 'Reject' | 'Waitlist') => {
		setModalAction(action);
		setShowModal(true);
	};

	const handleConfirmAction = () => {
		// TODO: Implement the actual action logic here
		console.log(`Confirmed action: ${modalAction}`);
		setShowModal(false);
		setModalAction(null);
	};

	const handleCancelAction = () => {
		setShowModal(false);
		setModalAction(null);
	};

	if (loading) {
		return <div className="w-full min-h-screen flex items-center justify-center">
			<h1 className="text-3xl font-bold">Loading...</h1>
		</div>;
	}

	if (error || !applicant) {
		return <div className="w-full min-h-screen flex items-center justify-center">
			<h1 className="text-3xl font-bold">{error || 'Applicant Not Found'}</h1>
		</div>;
	}

	const hideScheduleButton = ["Scheduled", "Finished"].includes(applicant.interviewStatus);

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
						<button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl text-lg font-bold shadow transition-colors cursor-pointer duration-200">Schedule Interview</button>
					)}
				<button onClick={() => handleActionClick('Accept')} className="border-2 border-[#6B66E3] bg-gradient-to-l from-[#6B66E3] to-[#1E19B1] px-4 py-1.5 hover:bg-white hover:text-[#6B66E3] rounded-2xl cursor-pointer text-lg font-bold shadow hover:[background-image:none] text-white transition-colors duration-200">Accept</button>
				<button onClick={() => handleActionClick('Reject')} className="border-2 border-[#6B66E3] bg-white text-[#6B66E3] hover:bg-[#6B66E3] cursor-pointer hover:text-white px-4 py-1.5 rounded-2xl text-lg font-bold shadow transition-colors duration-200">Reject</button>
				<button onClick={() => handleActionClick('Waitlist')} className="border-2 border-[#6B66E3] hover:bg-white cursor-pointer hover:text-[#6B66E3] px-4 py-1.5 rounded-2xl text-lg bg-[#6B66E3] text-white font-bold shadow transition-colors duration-200">Waitlist</button>
					</div>
					<div className="pr-8 pt-8 pb-8 mb-6">
					<div className="mb-2 flex items-center text-lg">
						<span className="font-bold text-gray-700 mr-2">Email:</span>
						<span className="text-gray-900">{applicant.email}</span>
					</div>
					<div className="mb-2 mt-4 flex items-center text-lg">
							<span className="font-bold text-gray-700 mr-2">School:</span>
							<span className="text-gray-900">{applicant.school}</span>
						</div>
					<div className="mb-2 mt-4 flex items-center text-lg">
						<span className="font-bold text-gray-700 mr-2">Year:</span>
						<span className="text-gray-900">{applicant.year}</span>
					</div>
						<div className="mt-8">
							<h3 className="text-xl font-bold text-gray-800 mb-4">Application Answers</h3>
							{applicant.answers && Object.entries(applicant.answers).map(([question, answer]) => (
								<div key={question} className="mb-6">
									<div className="mb-2 font-bold text-gray-800 flex items-start text-lg">
										{question}
									</div>
									<div className="mb-2 text-gray-900 whitespace-pre-wrap">
										{answer}
									</div>
								</div>
							))}
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
					<div className="flex items-center gap-4">
						<button 
							onClick={handleSaveNotes}
							disabled={saving}
							className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-lg font-bold shadow transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{saving ? 'Saving...' : 'Save Notes'}
						</button>
						{saveMessage && (
							<span className={`text-base font-semibold ${
								saveMessage.includes('success') ? 'text-green-600' : 'text-red-600'
							}`}>
								{saveMessage}
							</span>
						)}
					</div>
					</div>
				</div>

				{showModal && (
				<div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl">
						<p className="text-lg text-gray-700 mb-8 text-center">
								Are you sure you want to <span className="font-semibold">{modalAction}</span> this applicant?
							</p>
						<div className="flex gap-4 justify-evenly">
							<button
								onClick={handleCancelAction}
							className="border-2 cursor-pointer border-[#6B66E3] bg-white text-[#6B66E3] hover:bg-[#6B66E3] hover:text-white px-6 py-2 rounded-2xl text-lg font-bold shadow transition-colors duration-200"
								>
									No
								</button>
								<button
									onClick={handleConfirmAction}
								className="border-2 cursor-pointer border-[#6B66E3] bg-[#6B66E3] text-white hover:bg-white hover:text-[#6B66E3] px-6 py-2 rounded-2xl text-lg font-bold shadow transition-colors duration-200"
								>
									Yes
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
	);
}
