"use client";

import { useState } from "react";

import {
  Dropdown,
  type DropdownItem,
} from "@/components/ui/dropdown";

const departmentOptions: DropdownItem[] = [
  { label: "AI²", value: "ai2" },
  { label: "EigenAI", value: "eigenai" },
  { label: "ML Fundamentals", value: "mlf" },
  { label: "Startups", value: "startups" },
];

const longList: DropdownItem[] = Array.from({ length: 15 }, (_, idx) => ({
  label: `Option ${idx + 1}`,
  value: `option-${idx + 1}`,
}));

export default function DropdownDemoPage() {
  const [department, setDepartment] = useState<string | undefined>("ai2");
  const [longValue, setLongValue] = useState<string | undefined>();

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-12 px-6 py-12">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold text-[#1E19B1]">
          Dropdown Component Preview
        </h1>
        <p className="max-w-2xl text-sm text-gray-600">
          Preview of the reusable UTMIST dropdown component.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Controlled dropdown
        </h2>
        <p className="text-sm text-gray-500">
          The parent component manages the selected value and passes it down as props.
        </p>
        <Dropdown
          label="Department"
          placeholder="Select department"
          items={departmentOptions}
          value={department}
          onValueChange={setDepartment}
          helperText="Used for filtering content by department."
          className="max-w-md"
        />
        <div className="rounded-xl bg-[#F3F4FF] px-4 py-3 text-sm text-[#1E19B1]">
          Selected value: {department ?? "none"}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Uncontrolled dropdown with long list
        </h2>
        <p className="text-sm text-gray-500">
          The dropdown keeps track of its own selection, optionally seeded with a default value.
        </p>
        <Dropdown
          placeholder="Select option"
          items={longList}
          defaultValue={longList[0]?.value}
          onValueChange={setLongValue}
          helperText="Demonstrates scrollable content and default value."
          className="max-w-md"
        />
        <div className="rounded-xl bg-[#F3F4FF] px-4 py-3 text-sm text-[#1E19B1]">
          Last selection: {longValue ?? "default (Option 1)"}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Disabled dropdown with error state
        </h2>
        <p className="text-sm text-gray-500">
          Demonstrates the disabled styling and inline error messaging when input is blocked.
        </p>
        <Dropdown
          label="Requires authentication"
          placeholder="Unavailable"
          items={departmentOptions}
          onValueChange={() => undefined}
          error="Feature locked until profile is completed."
          disabled
          className="max-w-md"
        />
      </section>
    </main>
  );
}

