import { firm } from "@/lib/site";

export default function WhatsAppButton() {
  if (!firm.whatsapp) return null;
  return (
    <a
      href={`https://wa.me/${firm.whatsapp}?text=${encodeURIComponent("Hello, I would like to discuss a hiring requirement.")}`}
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#1e8e4e] px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#17753f]"
    >
      <span>WhatsApp us</span>
    </a>
  );
}
