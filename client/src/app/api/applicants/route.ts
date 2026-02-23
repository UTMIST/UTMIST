import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const LIMIT = 20;

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	
	// Get query parameters
	const page = parseInt(searchParams.get("page") || "1", 10);
	const nameSearch = searchParams.get("nameSearch") || "";
	const jobId = searchParams.get("jobId") || searchParams.get("roleSearch") || "All"; // Support both for backward compatibility
	const applicationStatusFilter = searchParams.get("applicationStatusFilter") || "All";
	const interviewStatusFilter = searchParams.get("interviewStatusFilter") || "All";

	// Authenticate and check admin status in parallel with name search
	const supabase = await createClient();
	
	try {
		const [authResult, nameSearchResult] = await Promise.all([
			// Auth + admin check combined
			(async () => {
				const { data: { user }, error: authError } = await supabase.auth.getUser();
				if (authError || !user) {
					return { error: "Unauthorized", status: 401 };
				}
				const { data: userRow, error: adminError } = await supabase
					.from("user")
					.select("admin")
					.eq("id", user.id)
					.single();
				if (adminError || !userRow?.admin) {
					return { error: "Forbidden: Admin access required", status: 403 };
				}
				return { user, isAdmin: true };
			})(),
			// Name search query (if needed) - run in parallel
			(async () => {
				if (!nameSearch || !nameSearch.trim().length) {
					return null;
				}
				const searchLower = nameSearch.toLowerCase().trim();
				const { data: usersData, error: usersError } = await supabase
					.from("user")
					.select("id")
					.ilike("name", `%${searchLower}%`)
					.limit(1000);
				if (usersError) {
					return { error: usersError };
				}
				return (usersData || []).map((u: any) => u.id);
			})(),
		]);

		// Check auth result
		if ("error" in authResult) {
			return NextResponse.json(
				{ error: authResult.error },
				{ status: authResult.status }
			);
		}

		// Handle name search result
		if (nameSearchResult && "error" in nameSearchResult) {
			throw nameSearchResult.error;
		}

		let matchingUserIds: string[] | null = nameSearchResult as string[] | null;
		if (matchingUserIds && matchingUserIds.length === 0) {
			return NextResponse.json({
				applicants: [],
				totalPages: 1,
				page: 1,
				count: 0,
			});
		}

		// Build the main query with joins
		// Note: Using exact count for accurate pagination
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
				),
				Jobs:jobID (
					id,
					job_title
				)
			`, { count: "exact" });

		// Apply filters in optimal order (most selective first)
		if (jobId && jobId !== "All") {
			query = query.eq("jobID", jobId);
		}

		if (matchingUserIds) {
			query = query.in("userID", matchingUserIds);
		}

		if (applicationStatusFilter && applicationStatusFilter !== "All") {
			if (applicationStatusFilter === "Not Set") {
				query = query.is("acceptance_status", null);
			} else {
				query = query.eq("acceptance_status", applicationStatusFilter);
			}
		}

		if (interviewStatusFilter && interviewStatusFilter !== "All") {
			query = query.eq("interview_status", interviewStatusFilter);
		}

		// Apply pagination
		const from = (page - 1) * LIMIT;
		const to = from + LIMIT - 1;
		query = query.range(from, to);

		const { data, error: fetchError, count } = await query;

		if (fetchError) {
			throw fetchError;
		}

		// Transform data to match Applicant interface
		const applicants = (data || []).map((item: any) => {
			const userData = item.user || {};
			const jobData = item.Jobs || {};
			return {
				id: item.id || "",
				name: userData.name || "",
				role: jobData.job_title || "",
				interviewStatus: item.interview_status || "",
				applicationStatus: item.acceptance_status || "",
				email: userData.email || "",
				phone: "",
				school: "",
				major: "",
				year: "",
				notes: item.notes || "",
				questions: item.answers || [],
			};
		});

		const totalPages = count ? Math.ceil(count / LIMIT) : 1;

		return NextResponse.json({
			applicants,
			totalPages,
			page,
			count,
		});
	} catch (err) {
		console.error("Error fetching applicants:", err);
		return NextResponse.json(
			{ error: err instanceof Error ? err.message : "Failed to load applications" },
			{ status: 500 }
		);
	}
}
