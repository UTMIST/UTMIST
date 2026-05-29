"use client";

import React from "react";
import { Applicant } from "@/types/admin";


export default function ApplicantRow({applicant}: {applicant: Applicant}) {
    // Ensure we have valid values for display
    const name = applicant.name || "N/A";
    const role = applicant.role || "N/A";
    const interviewStatus = applicant.interviewStatus || "Not Set";
    const applicationStatus = applicant.applicationStatus || "Not Set";
    
    return(
        
            <tr className={`transition-all overflow-hidden duration-300 divide-x-2 divide-gray-500 ease-in-out border-b`}>
                <td className="px-4 py-2"><a className="font-semibold underline text-blue-500" href={`/applicants/${applicant.id}`}>{name}</a></td>
                <td className="px-4 py-2">{role}</td>
                <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                        interviewStatus === "SCHEDULED"
                            ? "bg-green-200 text-green-800"
                            : interviewStatus === "COMPLETED"
                            ? "bg-blue-200 text-blue-800"
                            : interviewStatus === "PENDING"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-gray-200 text-gray-800"
                    }`}>
                        {interviewStatus || "Not Set"}
                    </span>
                </td>
                <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                        applicationStatus === "ACCEPTED"
                            ? "bg-green-200 text-green-800"
                            : applicationStatus === "REJECTED"
                            ? "bg-red-200 text-red-800"
                            : applicationStatus === "WAITLISTED"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-gray-200 text-gray-800"
                    }`}>
                        {applicationStatus || "Not Set"}
                    </span>
                </td>
            </tr>
		);
}