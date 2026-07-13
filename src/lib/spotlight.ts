import type { Billionaire } from "@/data/billionaires";
import type { PersonProfile } from "@/data/profiles";
import type { Leaderboard, RankedBillionaire } from "@/lib/net-worth";
import { getPersonQuotes } from "@/data/quotes";
import { getListAppearances, getRelatedPeople } from "@/lib/person-context";
import { formatUsdCompact } from "@/lib/format";

/**
 * "Good News" spotlights are long-form, positively-framed profile features
 * — not breaking news. There is no live news feed wired into this site, so
 * rather than invent "latest" headlines, we compose these deterministically
 * from facts already fact-checked and stored in profiles.ts (bio, ventures,
 * career timeline, key facts, education, philanthropy mentions) plus the
 * live net worth. Every sentence traces back to a field we've already
 * vetted — nothing new is asserted. Length varies with how much verified
 * material exists for that person; we never pad with invented specifics.
 */

const PHILANTHROPY_KEYWORDS = [
  "pledge",
  "donat",
  "foundation",
  "give away",
  "gave away",
  "philanthrop",
  "giving pledge",
  "charitable",
];

function pronouns(gender: "male" | "female"): { subject: string; possessive: string; object: string } {
  return gender === "female"
    ? { subject: "she", possessive: "her", object: "her" }
    : { subject: "he", possessive: "his", object: "him" };
}

function lowerFirstWord(sentence: string): string {
  return sentence.charAt(0).toLowerCase() + sentence.slice(1);
}

function stripTrailingPeriod(sentence: string): string {
  return sentence.replace(/\.$/, "");
}

/** Lowercase the first word, unless it looks like an acronym (e.g. "AI", "IPO"). */
function lowerFirstWordSafe(sentence: string): string {
  if (/^[A-Z]{2,}/.test(sentence)) {
    return sentence;
  }
  return lowerFirstWord(sentence);
}

export interface Spotlight {
  headline: string;
  dek: string;
  paragraphs: string[];
  wordCount: number;
}

export function isSpotlightEligible(profile: PersonProfile | undefined): profile is PersonProfile {
  return Boolean(profile?.longBio && profile.longBio.length > 0);
}

export function buildSpotlight(
  person: Billionaire,
  profile: PersonProfile,
  ranked: RankedBillionaire | undefined,
  leaderboard?: Leaderboard,
): Spotlight {
  const { subject, possessive } = pronouns(person.gender);
  const firstName = person.name.split(" ")[0];
  const paragraphs: string[] = [];

  // Opening: the business story, straight from the vetted bio.
  paragraphs.push(...profile.longBio!);

  // Origin story: how the wealth was built, then education/residence as a separate sentence.
  if (profile.wealthOrigin) {
    const framing =
      profile.wealthOrigin === "Self-made"
        ? `${person.name} built this fortune from the ground up — a self-made success in ${person.industry.toLowerCase()}.`
        : profile.wealthOrigin === "Inherited"
          ? `${person.name} inherited the foundation of this fortune and has stewarded it since.`
          : `${person.name} inherited the foundation of this fortune and has grown it substantially since taking the reins.`;
    paragraphs.push(framing);
  }
  const personalFacts: string[] = [];
  if (profile.education) {
    personalFacts.push(`studied at ${profile.education}`);
  }
  if (profile.residenceCity) {
    personalFacts.push(`is based in ${profile.residenceCity}`);
  }
  if (personalFacts.length > 0) {
    const pronoun = subject === "he" ? "He" : "She";
    paragraphs.push(`${pronoun} ${personalFacts.join(" and ")}.`);
  }

  // Key facts: the punchy, widely-reported highlights, woven into prose.
  if (profile.keyFacts && profile.keyFacts.length > 0) {
    const sentences = profile.keyFacts.map((fact) => stripTrailingPeriod(fact));
    paragraphs.push(`A few of the highlights on the public record: ${sentences.join("; ")}.`);
  }

  // The full journey: every documented milestone, in order.
  if (profile.careerTimeline && profile.careerTimeline.length > 0) {
    const milestoneSentences = profile.careerTimeline.map(
      (m) => `In ${m.year}, ${lowerFirstWordSafe(stripTrailingPeriod(m.description))}`,
    );
    paragraphs.push(
      `The journey to get here is well documented. ${milestoneSentences.join(". ")}.`,
    );
  }

  // Track record: every venture beyond the primary holding.
  if (profile.ventures && profile.ventures.length > 0) {
    const ventureSentences = profile.ventures.map(
      (v) =>
        `${v.name}, where ${subject} serves as ${v.role} — ${lowerFirstWordSafe(stripTrailingPeriod(v.description))}`,
    );
    paragraphs.push(
      `Beyond ${person.primarySource}, ${possessive} track record includes ${ventureSentences.join("; ")}.`,
    );
  }

  // Notable assets: widely-reported, sourced — the "what the money buys" section.
  if (profile.notableAssets && profile.notableAssets.length > 0) {
    const assetSentences = profile.notableAssets.map(
      (a) => `${a.name} — ${lowerFirstWordSafe(stripTrailingPeriod(a.description))}`,
    );
    paragraphs.push(`The success shows up in what's publicly reported, too: ${assetSentences.join("; ")}.`);
  }

  // In their own words — one verified quote, if we have one on file.
  const quotes = getPersonQuotes(person.id);
  if (quotes.length > 0) {
    const quote = quotes[0];
    paragraphs.push(`In ${possessive} own words: "${quote.text}" — said ${quote.source}${quote.year ? ` in ${quote.year}` : ""}.`);
  }

  // Where this fortune ranks: every list it appears on, and the nearest peers.
  if (leaderboard && ranked) {
    const appearances = getListAppearances(leaderboard, person.id);
    if (appearances.length > 1) {
      const others = appearances.filter((a) => a.category !== "world");
      const listSentences = others.map((a) => `#${a.rank} on ${a.label} (out of ${a.total} tracked)`);
      if (listSentences.length > 0) {
        paragraphs.push(`The fortune shows up across our lists, too: ${listSentences.join(", ")}.`);
      }
    }

    const related = getRelatedPeople(leaderboard, ranked, 2);
    if (related.length > 0) {
      const peerSentences = related.map((r) => `${r.name} (${formatUsdCompact(r.netWorthUsd)})`);
      const verb = related.length > 1 ? "companies are" : "company is";
      paragraphs.push(
        `On net worth alone, the closest ${verb} ${peerSentences.join(" and ")} — a reminder of how tightly bunched the very top of the wealth list really is.`,
      );
    }
  }

  // Family, in the narrow, safety-conscious way this site handles it.
  if (profile.family) {
    const familyBits: string[] = [profile.family.maritalStatus.toLowerCase()];
    if (profile.family.spouseName) familyBits.push(`married to ${profile.family.spouseName}`);
    if (profile.family.childrenCount !== undefined) {
      familyBits.push(`${profile.family.childrenCount} children`);
    }
    paragraphs.push(`On the personal side: ${firstName} is ${familyBits.join(", ")}.`);
  }

  // Giving back: only if the vetted bio/facts already mention it explicitly.
  const philanthropySource = [...(profile.keyFacts ?? []), ...(profile.longBio ?? [])].find((line) =>
    PHILANTHROPY_KEYWORDS.some((keyword) => line.toLowerCase().includes(keyword)),
  );
  if (philanthropySource) {
    paragraphs.push(`On the giving side: ${lowerFirstWordSafe(stripTrailingPeriod(philanthropySource))}.`);
  }

  // Close on the live number — this is the one line that's genuinely "now."
  if (ranked) {
    paragraphs.push(
      `Today, ${firstName} is worth an estimated ${formatUsdCompact(ranked.netWorthUsd)} — #${ranked.rank} in the world on our real-time list, a figure that moves with ${person.ticker ? `${person.ticker}'s share price` : `the latest public reporting on ${possessive} holdings`}.`,
    );
  }

  const wordCount = paragraphs.join(" ").split(/\s+/).filter(Boolean).length;

  return {
    headline: `${person.name}: The Story Behind the Fortune`,
    dek: profile.longBio![0],
    paragraphs,
    wordCount,
  };
}
