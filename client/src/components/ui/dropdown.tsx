"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import "../../styles/dropdown.css";

export interface DropdownItem {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface DropdownProps {
  items: DropdownItem[];
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange: (value: string) => void;
  label?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  ariaLabel?: string;
}

export function Dropdown({
  items,
  placeholder,
  value,
  defaultValue,
  onValueChange,
  label,
  helperText,
  error,
  disabled,
  className,
  id,
  ariaLabel,
}: DropdownProps) {
  const generatedId = React.useId();
  const triggerId = id ?? generatedId;
  const labelId = label ? `${triggerId}-label` : undefined;
  const helperId = helperText || error ? `${triggerId}-helper` : undefined;

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {label && (
        <span
          id={labelId}
          className="text-sm font-medium text-[#1E19B1]"
        >
          {label}
        </span>
      )}

      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={triggerId}
          aria-label={ariaLabel}
          aria-labelledby={labelId}
          aria-describedby={helperId}
          className={cn(
            "dropdown-trigger flex h-11 w-full items-center justify-between rounded-2xl border border-[#CDD0FF] bg-white px-4 text-sm text-gray-700 shadow-[0_16px_40px_rgba(30,25,177,0.12)] transition focus:outline-none focus-visible:border-[#6B66E3] focus-visible:bg-[#EEF0FF] focus-visible:text-[#1E19B1] data-[state=open]:border-[#6B66E3] data-[state=open]:bg-[#EEF0FF] data-[state=open]:text-[#1E19B1]",
            error &&
              "border-red-500 focus-visible:border-red-500 focus-visible:bg-[#FFF2F2] data-[state=open]:border-red-500 data-[state=open]:bg-[#FFF2F2]",
            disabled && "cursor-not-allowed opacity-60"
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          className="dropdown-scroll mt-2 max-h-60 rounded-2xl border border-[#E4E7FF] bg-white px-1 py-1 shadow-[0_24px_60px_rgba(30,25,177,0.18)]"
          align="start"
        >
          {items.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              disabled={item.disabled}
              className="dropdown-item flex w-full select-none items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none transition data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40"
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {helperText && !error && (
        <p id={helperId} className="text-xs text-gray-500">
          {helperText}
        </p>
      )}

      {error && (
        <p id={helperId} className="text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

