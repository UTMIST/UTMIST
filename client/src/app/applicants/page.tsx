"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ApplicantRow from "@/components/admin/ApplicantRow";
import { Applicant } from "@/types/admin";
import { supabase } from "@/lib/supabase/client";

const LIMIT = 20;

export default function ApplicantsDashboard() {
	const router = useRouter();
	const [nameSearch, setNameSearch] = useState("");
	const [roleSearch, setRoleSearch] = useState("");
	const [applicationStatusFilter, setApplicationStatusFilter] = useState("All");
	const [interviewStatusFilter, setInterviewStatusFilter] = useState("All");

	const [applicants, setApplicants] = useState<Applicant[]>([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // null = loading, false = not admin, true = admin

	const applicationStatusOptions = ["All", "Accepted", "Rejected", "Pending/Waitlisted"];

	// Derive interview status options from current page results (may change across pages)
	const interviewStatusOptions = [
		"All",
		...Array.from(new Set(applicants.map((a) => a.interviewStatus).filter(Boolean)))
	];

	async function fetchApplications(p = page) {
		setLoading(true);
		setError(null);
		try {
			// Single query with foreign key join - most efficient approach
			// Join Applicants with user table using userID foreign key
			let query = supabase
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
					)
				`, { count: "exact" });

			// Apply filters
			if (applicationStatusFilter && applicationStatusFilter !== "All") {
				if (applicationStatusFilter === "Pending/Waitlisted") {
					query = query.in("acceptance_status", ["Pending", "Waitlisted"]);
				} else {
					query = query.eq("acceptance_status", applicationStatusFilter);
				}
			}
			if (interviewStatusFilter && interviewStatusFilter !== "All") {
				query = query.eq("interview_status", interviewStatusFilter);
			}

			// Apply pagination
			const from = (p - 1) * LIMIT;
			const to = from + LIMIT - 1;
			query = query.range(from, to);

			const { data, error: fetchError, count } = await query;

			if (fetchError) {
				throw fetchError;
			}

			// Transform data
			let transformedData: Applicant[] = (data || []).map((item: any) => {
				const userData = item.user || {};
				return {
					id: item.id || "",
					name: userData.name || "",
					role: "",
					interviewStatus: item.interview_status || "",
					applicationStatus: item.acceptance_status || "",
					email: userData.email || "",
					phone: "",
					school: "",
					major: "",
					year: "",
					notes: item.notes || "",
					questions: item.answers || []
				};
			});

			// Filter by name client-side (since it's from joined table)
			if (nameSearch) {
				const searchLower = nameSearch.toLowerCase();
				transformedData = transformedData.filter(a => 
					a.name.toLowerCase().includes(searchLower)
				);
			}

			setApplicants(transformedData);
			setTotalPages(count ? Math.ceil(count / LIMIT) : 1);
			setPage(p);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load applications");
			console.error("Error fetching applicants:", err);
		} finally {
			setLoading(false);
		}
	}

	// Check if user is admin on mount
	useEffect(() => {
		async function checkAdmin() {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) {
				router.push("/auth");
				return;
			}

			// Check if user is admin in the user table
			const { data: userData, error } = await supabase
				.from("user")
				.select("admin")
				.eq("id", user.id)
				.single();

			if (error || !userData?.admin) {
				setIsAdmin(false);
			} else {
				setIsAdmin(true);
			}
		}
		checkAdmin();
	}, [router]);

	// Fetch applications only if user is admin
	useEffect(() => {
		if (isAdmin === true) {
			fetchApplications(page);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, isAdmin]);

	function handleApplyFilters() {
		setPage(1);
		fetchApplications(1);
	}

	// Show loading while checking admin status
	if (isAdmin === null) {
		return (
			<div className="p-8 flex items-center justify-center min-h-screen">
				<div>Checking permissions...</div>
			</div>
		);
	}

	// Show unauthorized if not admin
	if (isAdmin === false) {
		return (
			<div className="p-8 flex flex-col items-center justify-center min-h-screen">
				<h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized</h1>
				<p className="text-gray-600">You do not have permission to access this page.</p>
			</div>
		);
	}

	return (
		<div className="p-8 px-[15em] justify-center center">
			<h1 className="text-2xl font-bold mb-6">Applicants Dashboard</h1>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 border-2 border-[#e0e0e0] rounded-lg">
				<div>
					<label htmlFor="nameSearch" className="block text-sm font-medium text-gray-700">Search Name</label>
					<input
						type="text"
						id="nameSearch"
						placeholder="Filter by name..."
						value={nameSearch}
						onChange={(e) => setNameSearch(e.target.value)}
						className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					/>
				</div>
				<div>
					<label htmlFor="roleSearch" className="block text-sm font-medium text-gray-700">Search Role</label>
					<input
						type="text"
						id="roleSearch"
						placeholder="Filter by role..."
						value={roleSearch}
						onChange={(e) => setRoleSearch(e.target.value)}
						className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					/>
				</div>
				<div>
					<label htmlFor="appStatusFilter" className="block text-sm font-medium text-gray-700">Application Status</label>
					<select
						id="appStatusFilter"
						value={applicationStatusFilter}
						onChange={(e) => setApplicationStatusFilter(e.target.value)}
						className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					>
						{applicationStatusOptions.map((status) => (
							<option key={status} value={status}>{status}</option>
						))}
					</select>
				</div>
				<div>
					<label htmlFor="interviewStatusFilter" className="block text-sm font-medium text-gray-700">Interview Status</label>
					<select
						id="interviewStatusFilter"
						value={interviewStatusFilter}
						onChange={(e) => setInterviewStatusFilter(e.target.value)}
						className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					>
						{interviewStatusOptions.map((status) => (
							<option key={status} value={status}>{status}</option>
						))}
					</select>
				</div>

				<div className="md:col-span-4 flex justify-end mt-2">
					<button
						onClick={handleApplyFilters}
						className="px-4 py-2 bg-[#6b66e3] text-white rounded-md shadow-sm cursor-pointer hover:opacity-95"
					>
						Apply Filters
					</button>
				</div>
			</div>

			<div className="mb-4">
				{loading && <div>Loading applications...</div>}
				{error && <div className="text-red-600">{error}</div>}
			</div>

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
					{applicants.length === 0 && !loading ? (
						<tr>
							<td colSpan={4} className="px-4 py-6 text-center text-gray-500">No applications found.</td>
						</tr>
					) : (
						applicants.map((applicant) => (
							<ApplicantRow key={applicant.id} applicant={applicant} />
						))
					)}
				</tbody>
			</table>

			<div className="flex items-center justify-center mt-4">
				<div className="flex items-center justify-center gap-6 space-x-2">
					<button
						onClick={() => setPage((p) => Math.max(1, p - 1))}
						disabled={page <= 1}
						className="px-3 py-1 bg-white border rounded disabled:opacity-50"
					>
						Previous
					</button>
					<span className="text-sm">Page {page} of {totalPages}</span>
					<button
						onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
						disabled={page >= totalPages}
						className="px-3 py-1 bg-white border rounded disabled:opacity-50"
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
}
