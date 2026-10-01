"use client";

import { useState } from "react";

export default function QuickEnquiry({ to }: { to: string }) {
  const [f, setF] = useState({ name: "", phone: "", role: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  const field = "w-full border border-white/30 bg-white/10 px-3 py-3 text-white placeholder:text-white/60 focus:border-white focus:outline-none";
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const body = `Name: ${f.name}\nPhone: ${f.phone}\nHiring for: ${f.role}`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent("Hiring enquiry")}&body=${encodeURIComponent(body)}`;
  }
  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.4fr_auto]">
      <input required placeholder="Your name" aria-label="Your name" className={field} value={f.name} onChange={set("name")} />
      <input required placeholder="Phone number" aria-label="Phone number" className={field} value={f.phone} onChange={set("phone")} />
      <input required placeholder="Role you are hiring for" aria-label="Role you are hiring for" className={field} value={f.role} onChange={set("role")} />
      <button type="submit" className="bg-white px-6 py-3 font-semibold text-navy hover:bg-paper">Request a call</button>
    </form>
  );
}
