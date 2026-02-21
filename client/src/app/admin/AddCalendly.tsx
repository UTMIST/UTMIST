"use client";

import { useState, useCallback } from "react";
import { updateUserProfile } from "@/utils/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddCalendly({
  userId,
  calendly: initialCalendly,
}: {
  userId: string;
  calendly: string;
}) {
  const [calendly, setCalendly] = useState(initialCalendly);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setMsg(null);
    const ok = await updateUserProfile(userId, { calendly });
    setSaving(false);
    setMsg(ok ? { type: "success", text: "Saved" } : { type: "error", text: "Failed to save" });
  }, [userId, calendly]);

  return (
    <div className="max-w-xl mx-auto space-y-4 border rounded-xl p-6">
      <div className="space-y-2">
        <label className="text-lg font-semibold">Calendly</label>
        <p className="text-sm text-gray-500">Enter your Calendly link which will automatically be sent to interview candidates as you schedule their interview.</p>
        <Input
          type="text"
          placeholder="https://calendly.com/your-link"
          value={calendly}
          onChange={(e) => {
            setCalendly(e.target.value);
            setMsg(null);
          }}
        />
      </div>
      <div className="flex items-center justify-end gap-3">
        <Button
          size="sm"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
        {msg && (
          <span className={`text-sm ${msg.type === "success" ? "text-green-600" : "text-red-500"}`}>
            {msg.text}
          </span>
        )}
      </div>
    </div>
  );
}
