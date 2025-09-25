"use client";

import React, { useState } from "react";
import { Applicant } from "@/types/admin";


export default function ApplicantRow({applicant}: {applicant: Applicant}) {

    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        setExpanded(!expanded);
    };
    
    return(
        <React.Fragment>
            <tr className={`transition-all overflow-hidden duration-300 ease-in-out`}>
                <td className="px-4 py-2"><a className="font-semibold underline text-blue-500" href={`/applicants/${applicant.id}`}>{applicant.name}</a></td>
                <td className="px-4 py-2">{applicant.role}</td>
                <td className={`px-4 py-2`}><div className={`max-h-12 overflow-hidden ${expanded ? "max-h-full" : "transition-all duration-300 ease-in-out"}`}>{applicant.summary}</div></td>
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
                <td className="px-4 py-2 space-x-2">
                    <button className="bg-indigo-500 text-white px-2 py-1 rounded text-xs">Schedule Interview</button>
                    <button className="bg-green-500 text-white px-2 py-1 rounded text-xs">Accept</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded text-xs">Reject</button>
                    <button className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">Waitlist</button>
                </td>
            </tr>
            <tr className="border-b">
                <td colSpan={6} className="text-center center text-blue-600 text-bold" onClick={toggleExpand}><button>{expanded ? "Collapse" : "Expand"}</button></td>
            </tr>
		</React.Fragment>);
}