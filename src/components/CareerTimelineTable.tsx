import type { TimelineEntry } from "@/data/profiles";

export default function CareerTimelineTable({ timeline }: { timeline: TimelineEntry[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[420px] border-collapse text-left text-sm">
        <thead className="bg-brand-soft/60 text-xs uppercase tracking-wide text-[--muted]">
          <tr>
            <th className="px-4 py-2 font-medium">Year</th>
            <th className="px-4 py-2 font-medium">Milestone</th>
            <th className="px-4 py-2 font-medium">Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {timeline.map((entry, index) => (
            <tr key={index}>
              <td className="whitespace-nowrap px-4 py-2 align-top font-display font-semibold text-brand-dark">
                {entry.year}
              </td>
              <td className="px-4 py-2 align-top font-medium text-foreground">{entry.title}</td>
              <td className="px-4 py-2 align-top text-foreground/70">{entry.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
