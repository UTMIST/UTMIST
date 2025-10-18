"use client";

import React, { useState } from "react";
import { Applicant } from "@/types/admin";


export default function ApplicantRow({applicant}: {applicant: Applicant}) {

    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        setExpanded(!expanded);
    };
    
    return(
        
            <tr className={`transition-all overflow-hidden duration-300 divide-x-2 divide-gray-500 ease-in-out border-b`}>
                <td className="px-4 py-2"><a className="font-semibold underline text-blue-500" href={`/applicants/${applicant.id}`}>{applicant.name}</a></td>
                <td className="px-4 py-2">{applicant.role}</td>
                <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                        applicant.interviewStatus === "Scheduled"
                            ? "bg-green-200 text-green-800"
                            : "bg-yellow-200 text-yellow-800"
                    }`}>
                        {applicant.interviewStatus}
                    </span>
                </td>
                <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                        applicant.applicationStatus === "Pending"
                            ? "bg-blue-200 text-blue-800"
                            : applicant.applicationStatus === "Waitlisted"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-gray-200 text-gray-800"
                    }`}>
                        {applicant.applicationStatus}
                    </span>
                </td>
            </tr>
		);
}