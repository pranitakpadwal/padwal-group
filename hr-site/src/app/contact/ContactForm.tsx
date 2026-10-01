"use client";

import { useState } from "react";

// Opens the visitor's email client with the details filled in.
// Swap for a real form backend when you are ready.
export default function ContactForm({ to }: { to: string }) {
  const [f, setF] = useState({ name: "", org: "", email: "", message: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  const field = "mt-1 w-full border border-rule bg-panel px-3 py-2.5 text-ink focus:border-navy focus:outline-none";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const body = `Name: ${f.name}\nOrganisation: ${f.org}\nEmail: ${f.email}\n\n${f.message}`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent("Hiring enquiry")}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <label className="block text-sm font-medium text-navy">Name<input required className={field} value={f.name} onChange={set("name")} /></label>
      <label className="block text-sm font-medium text-navy">Organisation<input className={field} value={f.org} onChange={set("org")} /></label>
      <label className="block text-sm font-medium text-navy">Work email<input required type="email" className={field} value={f.email} onChange={set("email")} /></label>
      <label className="block text-sm font-medium text-navy">About the role or mandate<textarea required rows={5} className={field} value={f.message} onChange={set("message")} /></label>
      <button type="submit" className="bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-deep">Send enquiry</button>
    </form>
  );
}
