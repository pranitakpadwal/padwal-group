import { permanentRedirect } from "next/navigation";

// Moved to /billionaire to match the site's URL structure — individual
// profiles live at /billionaire/[id], so the index belongs at /billionaire
// too, not a separate pluralized path.
export default function BillionairesIndexRedirect() {
  permanentRedirect("/billionaire");
}
