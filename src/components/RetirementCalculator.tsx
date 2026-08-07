"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { RosterEntry } from "@/lib/calculator-data";
import type { DisplayRates } from "@/lib/fx";
import { formatCurrencyCompact } from "@/lib/format";
import {
  simulateGrowth,
  requiredMonthlyContribution,
  estimateWithdrawalTax,
  loanMonthsToPayoff,
  remainingLoanBalance,
  inflateAmount,
  corpusNeededForRetirement,
} from "@/lib/retirement";

const LTCG_EXEMPTION_INR = 125_000;
const LOAN_TYPES = ["Home Loan", "Personal Loan", "Car Loan", "Education Loan", "Other"];

// Same three-card pattern used by Groww ("Like a king / happy as I am / like a monk")
// and ICICI Pru's calculator ("Scale Back / Similar Life / Live It Up") — a
// percentage of today's spending reads as an honest assumption rather than a vibe.
const LIFESTYLE_OPTIONS = [
  { id: "scaleback", emoji: "🌱", label: "Scale Back", description: "Simple, more modest expenses", multiplier: 0.75 },
  { id: "similar", emoji: "🏠", label: "Similar Life", description: "Maintain your current lifestyle", multiplier: 1.0 },
  { id: "liveitup", emoji: "✨", label: "Live It Up", description: "Travel, indulge, explore", multiplier: 1.25 },
] as const;

// Matches Groww's "Where are you saving?" framing — a named choice instead of
// asking someone to already know a return percentage.
const INVESTING_STYLES = [
  { id: "safe", label: "Safe (PF, FD, etc.)", returnPercent: 7 },
  { id: "aggressive", label: "Aggressive (Mutual Funds, Equity, etc.)", returnPercent: 12 },
] as const;

const TAX_PRESETS = [
  { label: "India LTCG (12.5%)", rate: 12.5 },
  { label: "US long-term (20%)", rate: 20 },
  { label: "None (0%)", rate: 0 },
];

interface LoanRow {
  id: string;
  type: string;
  principal: number;
  ratePercent: number;
  emi: number;
}

function newLoanId(): string {
  return `loan-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="tabular-nums text-brand-dark">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-brand"
      />
      <div className="flex justify-between text-xs text-[--muted]">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

export default function RetirementCalculator({
  roster,
  rates,
}: {
  roster: RosterEntry[];
  rates: DisplayRates;
}) {
  // --- Primary flow: the four things Groww/ICICI/AMFI all actually ask for ---
  const [currentAge, setCurrentAge] = useState(30);
  const [retireAge, setRetireAge] = useState(60);
  const [currentMonthlyExpenses, setCurrentMonthlyExpenses] = useState(50_000);
  const [currentSavings, setCurrentSavings] = useState(500_000);
  const [lifestyleId, setLifestyleId] = useState<(typeof LIFESTYLE_OPTIONS)[number]["id"]>("similar");
  const [investingStyleId, setInvestingStyleId] = useState<(typeof INVESTING_STYLES)[number]["id"]>("aggressive");

  // --- Advanced: everything a power user might want, hidden by default ---
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [preReturnOverride, setPreReturnOverride] = useState<number | null>(null);
  const [postRetirementReturnPercent, setPostRetirementReturnPercent] = useState(7);
  const [inflationPercent, setInflationPercent] = useState(6);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [annualStepUpPercent, setAnnualStepUpPercent] = useState(0);
  const [currentMonthlyInvestment, setCurrentMonthlyInvestment] = useState(0);
  const [manualGoal, setManualGoal] = useState<number | null>(null);
  const [taxRatePercent, setTaxRatePercent] = useState(12.5);
  const [currency, setCurrency] = useState("INR");
  const [loans, setLoans] = useState<LoanRow[]>([]);

  const currencyOptions = Object.keys(rates);
  const effectiveRates: DisplayRates = { USD: 1, INR: 83, ...rates };
  const crossRate = (1 / effectiveRates["INR"]) * (effectiveRates[currency] ?? effectiveRates["INR"]);
  const money = (inr: number) => formatCurrencyCompact(inr * crossRate, currency);

  const lifestyle = LIFESTYLE_OPTIONS.find((l) => l.id === lifestyleId)!;
  const investingStyle = INVESTING_STYLES.find((s) => s.id === investingStyleId)!;
  const preRetirementReturnPercent = preReturnOverride ?? investingStyle.returnPercent;

  const yearsToRetirement = Math.max(0, retireAge - currentAge);
  const retirementYears = Math.max(0, lifeExpectancy - retireAge);
  const monthsToRetirement = yearsToRetirement * 12;

  const result = useMemo(() => {
    const monthlyExpenseAtRetirement = inflateAmount(
      currentMonthlyExpenses * lifestyle.multiplier,
      inflationPercent,
      yearsToRetirement,
    );
    const computedCorpus = corpusNeededForRetirement({
      monthlyExpenseAtRetirement,
      postRetirementReturnPercent,
      inflationPercent,
      retirementYears,
    });
    const targetCorpus = manualGoal ?? computedCorpus;

    const neededMonthly = requiredMonthlyContribution({
      currentInvestments: currentSavings,
      annualStepUpPercent,
      annualReturnPercent: preRetirementReturnPercent,
      years: yearsToRetirement,
      targetCorpus,
    });

    // Only meaningful once someone tells us what they're already putting in.
    const projected = simulateGrowth({
      currentInvestments: currentSavings,
      monthlyContribution: currentMonthlyInvestment,
      annualStepUpPercent,
      annualReturnPercent: preRetirementReturnPercent,
      years: yearsToRetirement,
    });
    const tax = estimateWithdrawalTax(
      projected.corpus,
      currentSavings + projected.totalContributed,
      taxRatePercent,
      LTCG_EXEMPTION_INR,
    );

    const loanResults = loans.map((loan) => {
      const payoff = loanMonthsToPayoff(loan.principal, loan.ratePercent, loan.emi);
      const clearsBeforeRetirement = payoff.months !== null && payoff.months <= monthsToRetirement;
      const remainingAtRetirement =
        payoff.months === null ? loan.principal : remainingLoanBalance(loan.principal, loan.ratePercent, loan.emi, monthsToRetirement);
      return { loan, payoff, clearsBeforeRetirement, remainingAtRetirement };
    });
    const totalLoanRemaining = loanResults.reduce(
      (sum, r) => sum + (r.payoff.months === null ? 0 : r.remainingAtRetirement),
      0,
    );

    const inHand = tax.postTax - totalLoanRemaining;
    const gap = targetCorpus - inHand;

    return { monthlyExpenseAtRetirement, computedCorpus, targetCorpus, neededMonthly, projected, tax, loanResults, totalLoanRemaining, inHand, gap };
  }, [
    currentMonthlyExpenses,
    lifestyle.multiplier,
    inflationPercent,
    yearsToRetirement,
    postRetirementReturnPercent,
    retirementYears,
    manualGoal,
    currentSavings,
    annualStepUpPercent,
    preRetirementReturnPercent,
    currentMonthlyInvestment,
    taxRatePercent,
    loans,
    monthsToRetirement,
  ]);

  const lowestTracked = roster.length > 0 ? roster[roster.length - 1] : null;
  const goalUsd = result.targetCorpus / effectiveRates["INR"];
  const goalVsLowestPercent = lowestTracked ? (goalUsd / lowestTracked.netWorthUsd) * 100 : null;

  const addLoan = () =>
    setLoans((prev) => [...prev, { id: newLoanId(), type: LOAN_TYPES[0], principal: 3_000_000, ratePercent: 8.5, emi: 30_000 }]);
  const updateLoan = (id: string, patch: Partial<LoanRow>) =>
    setLoans((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const removeLoan = (id: string) => setLoans((prev) => prev.filter((l) => l.id !== id));

  return (
    <div className="flex flex-col gap-5">
      {/* Primary flow — the same four questions Groww/ICICI/AMFI all ask */}
      <div className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <SliderField
            label="How old are you?"
            value={currentAge}
            onChange={(v) => setCurrentAge(Math.min(v, retireAge))}
            min={18}
            max={70}
            step={1}
            format={(v) => `${v}`}
          />
          <SliderField
            label="Age you want to retire"
            value={retireAge}
            onChange={(v) => setRetireAge(Math.max(v, currentAge + 1))}
            min={currentAge + 1}
            max={75}
            step={1}
            format={(v) => `${v}`}
          />
        </div>

        <SliderField
          label="How much do you spend per month?"
          value={currentMonthlyExpenses}
          onChange={setCurrentMonthlyExpenses}
          min={5_000}
          max={300_000}
          step={1_000}
          format={(v) => money(v)}
        />

        <SliderField
          label="What you've already saved for retirement"
          value={currentSavings}
          onChange={setCurrentSavings}
          min={0}
          max={20_000_000}
          step={50_000}
          format={(v) => money(v)}
        />

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">How do you plan to spend retirement?</span>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {LIFESTYLE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setLifestyleId(option.id)}
                className={`flex flex-col items-start gap-1.5 rounded-xl border p-4 text-left transition-colors ${
                  lifestyleId === option.id ? "border-brand bg-brand-soft/50" : "border-line hover:border-brand/50"
                }`}
              >
                <span className="text-xl" aria-hidden>
                  {option.emoji}
                </span>
                <span className="font-medium text-foreground">{option.label}</span>
                <span className="text-xs text-foreground/70">{option.description}</span>
                <span className="rounded-full bg-background/70 px-2 py-0.5 text-xs font-medium text-brand-dark">
                  {Math.round(option.multiplier * 100)}% of today
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">Where are you saving for retirement?</span>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {INVESTING_STYLES.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setInvestingStyleId(option.id)}
                className={`rounded-xl border p-4 text-left text-sm transition-colors ${
                  investingStyleId === option.id ? "border-brand bg-brand-soft/50" : "border-line hover:border-brand/50"
                }`}
              >
                <span className="font-medium text-foreground">{option.label}</span>
                <span className="ml-2 text-xs text-[--muted]">assumes ~{option.returnPercent}%/yr</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result — the two headline numbers, same as the reference calculators */}
      <div className="flex flex-col gap-4 rounded-2xl border border-brand/40 bg-brand-soft/40 p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-background/70 p-5 text-center">
            <div className="text-xs uppercase tracking-wide text-[--muted]">Amount required for retirement</div>
            <div className="font-display text-3xl font-semibold text-brand-dark tabular-nums sm:text-4xl">
              {money(result.targetCorpus)}
            </div>
          </div>
          <div className="rounded-xl bg-background/70 p-5 text-center">
            <div className="text-xs uppercase tracking-wide text-[--muted]">How much you need to save per month</div>
            <div className="font-display text-3xl font-semibold text-brand-dark tabular-nums sm:text-4xl">
              {money(result.neededMonthly)}
            </div>
          </div>
        </div>
        <p className="text-xs text-[--muted]">
          Based on spending {money(currentMonthlyExpenses * lifestyle.multiplier)}/month in today&apos;s money ({Math.round(lifestyle.multiplier * 100)}% of your current {money(currentMonthlyExpenses)}), inflated to age {retireAge} at {inflationPercent}%/yr, and lasting to age {lifeExpectancy} — both editable below.
        </p>

        {currentMonthlyInvestment > 0 && (
          <div className="rounded-xl bg-background/70 p-4 text-sm">
            {result.gap <= 0 ? (
              <p className="font-medium text-emerald-600 dark:text-emerald-400">
                Investing {money(currentMonthlyInvestment)}/month, you&apos;re on track — a projected surplus of {money(Math.abs(result.gap))}.
              </p>
            ) : (
              <p className="font-medium text-rose-600 dark:text-rose-400">
                Investing {money(currentMonthlyInvestment)}/month leaves a projected shortfall of {money(result.gap)}.
              </p>
            )}
          </div>
        )}

        {lowestTracked && goalVsLowestPercent !== null && (
          <p className="text-xs text-[--muted]">
            For scale: {money(result.targetCorpus)} is about {goalVsLowestPercent < 0.01 ? "<0.01" : goalVsLowestPercent.toFixed(2)}% of{" "}
            <Link href={`/billionaire/${lowestTracked.id}`} className="text-brand hover:underline">
              {lowestTracked.name}
            </Link>
            &apos;s net worth — the smallest fortune we track live.
          </p>
        )}
      </div>

      {/* Advanced — everything a power user might want, off by default */}
      <button
        type="button"
        onClick={() => setShowAdvanced((v) => !v)}
        className="self-start text-sm font-medium text-brand hover:underline"
      >
        {showAdvanced ? "Hide advanced options" : "Customize assumptions, add loans, see tax impact →"}
      </button>

      {showAdvanced && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6 sm:p-8">
            <h3 className="font-display text-lg font-semibold text-foreground">Fine-tune the assumptions</h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <SliderField
                label="Return while you're investing"
                value={preRetirementReturnPercent}
                onChange={setPreReturnOverride}
                min={0}
                max={20}
                step={0.5}
                format={(v) => `${v}%`}
              />
              <SliderField
                label="Return during retirement"
                value={postRetirementReturnPercent}
                onChange={setPostRetirementReturnPercent}
                min={0}
                max={15}
                step={0.5}
                format={(v) => `${v}%`}
              />
              <SliderField
                label="Inflation"
                value={inflationPercent}
                onChange={setInflationPercent}
                min={0}
                max={12}
                step={0.5}
                format={(v) => `${v}%`}
              />
              <SliderField
                label="Plan until age"
                value={lifeExpectancy}
                onChange={(v) => setLifeExpectancy(Math.max(v, retireAge + 1))}
                min={retireAge + 1}
                max={100}
                step={1}
                format={(v) => `${v}`}
              />
            </div>
            <label className="flex flex-col gap-1.5 text-sm sm:max-w-xs">
              <span className="font-medium text-foreground">Annual step-up on your savings</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={annualStepUpPercent}
                  onChange={(e) => setAnnualStepUpPercent(Math.max(0, Math.min(50, Number(e.target.value))))}
                  className="w-24 rounded-lg border border-line bg-background px-3 py-2 text-foreground tabular-nums"
                />
                <span className="text-[--muted]">% more each year</span>
              </div>
            </label>
            <p className="text-xs text-[--muted]">
              These are assumptions you choose, not predictions — real markets and inflation don&apos;t move at a fixed rate every year.
            </p>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6 sm:p-8">
            <h3 className="font-display text-lg font-semibold text-foreground">Track what you&apos;re actually investing</h3>
            <label className="flex flex-col gap-1.5 text-sm sm:max-w-sm">
              <span className="font-medium text-foreground">Your current monthly investment (optional)</span>
              <input
                type="number"
                min={0}
                step={5_000}
                value={currentMonthlyInvestment}
                onChange={(e) => setCurrentMonthlyInvestment(Math.max(0, Number(e.target.value)))}
                className="rounded-lg border border-line bg-background px-3 py-2 text-lg text-foreground tabular-nums"
              />
              <span className="text-xs text-[--muted]">Leave at 0 to just see the number you&apos;d need to hit your goal.</span>
            </label>
            <label className="flex flex-col gap-1.5 text-sm sm:max-w-sm">
              <span className="font-medium text-foreground">Set your own goal instead (optional)</span>
              <input
                type="number"
                min={0}
                step={1_000_000}
                value={manualGoal ?? ""}
                placeholder={`Computed: ${Math.round(result.computedCorpus).toLocaleString("en-IN")}`}
                onChange={(e) => setManualGoal(e.target.value === "" ? null : Math.max(0, Number(e.target.value)))}
                className="rounded-lg border border-line bg-background px-3 py-2 text-lg text-foreground tabular-nums"
              />
              <span className="text-xs text-[--muted]">
                Already know your number — say, ₹10 crore? Type it here to override the computed goal.
              </span>
            </label>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-lg font-semibold text-foreground">Your loans</h3>
              <button
                type="button"
                onClick={addLoan}
                className="rounded-full border border-brand px-3 py-1.5 text-sm font-medium text-brand hover:bg-brand-soft/50"
              >
                + Add a loan
              </button>
            </div>
            {loans.length === 0 && <p className="text-sm text-[--muted]">No loans added — skip this if you&apos;re debt-free.</p>}
            {result.loanResults.map(({ loan, payoff, clearsBeforeRetirement }) => (
              <div key={loan.id} className="flex flex-col gap-3 rounded-xl border border-line p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="font-medium text-foreground">Type</span>
                    <select
                      value={loan.type}
                      onChange={(e) => updateLoan(loan.id, { type: e.target.value })}
                      className="rounded-lg border border-line bg-background px-2 py-1.5 text-sm text-foreground"
                    >
                      {LOAN_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="font-medium text-foreground">Outstanding</span>
                    <input
                      type="number"
                      min={0}
                      step={50_000}
                      value={loan.principal}
                      onChange={(e) => updateLoan(loan.id, { principal: Math.max(0, Number(e.target.value)) })}
                      className="rounded-lg border border-line bg-background px-2 py-1.5 text-sm text-foreground tabular-nums"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="font-medium text-foreground">Interest rate %</span>
                    <input
                      type="number"
                      min={0}
                      max={40}
                      step={0.1}
                      value={loan.ratePercent}
                      onChange={(e) => updateLoan(loan.id, { ratePercent: Math.max(0, Number(e.target.value)) })}
                      className="rounded-lg border border-line bg-background px-2 py-1.5 text-sm text-foreground tabular-nums"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="font-medium text-foreground">Monthly EMI</span>
                    <input
                      type="number"
                      min={0}
                      step={1_000}
                      value={loan.emi}
                      onChange={(e) => updateLoan(loan.id, { emi: Math.max(0, Number(e.target.value)) })}
                      className="rounded-lg border border-line bg-background px-2 py-1.5 text-sm text-foreground tabular-nums"
                    />
                  </label>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  {payoff.months === null ? (
                    <span className="font-medium text-rose-600 dark:text-rose-400">
                      This EMI doesn&apos;t cover the interest — the balance won&apos;t shrink. Raise the EMI.
                    </span>
                  ) : (
                    <span className={clearsBeforeRetirement ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                      Paid off in {Math.ceil(payoff.months / 12)} yrs ({payoff.months} months)
                      {clearsBeforeRetirement ? " — before you retire." : " — still running when you retire."}
                    </span>
                  )}
                  <button type="button" onClick={() => removeLoan(loan.id)} className="text-xs text-[--muted] hover:text-rose-500">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6 sm:p-8">
            <h3 className="font-display text-lg font-semibold text-foreground">Currency &amp; tax</h3>
            <label className="flex flex-col gap-1.5 text-sm sm:max-w-xs">
              <span className="font-medium text-foreground">Show values in</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="rounded-lg border border-line bg-background px-3 py-2 text-foreground"
              >
                {currencyOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-foreground">If you cashed out, capital gains tax rate</span>
              <div className="flex flex-wrap gap-1.5">
                {TAX_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setTaxRatePercent(preset.rate)}
                    className={`rounded-full border px-2.5 py-0.5 text-xs ${
                      taxRatePercent === preset.rate ? "border-brand bg-brand text-white" : "border-line text-foreground/70 hover:border-brand"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
            {currentMonthlyInvestment > 0 && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-brand-soft/50 p-3 text-center">
                  <div className="text-xs uppercase tracking-wide text-[--muted]">Projected corpus</div>
                  <div className="font-display text-lg font-semibold text-brand-dark tabular-nums">{money(result.projected.corpus)}</div>
                </div>
                <div className="rounded-lg bg-brand-soft/50 p-3 text-center">
                  <div className="text-xs uppercase tracking-wide text-[--muted]">After tax</div>
                  <div className="font-display text-lg font-semibold text-brand-dark tabular-nums">{money(result.tax.postTax)}</div>
                </div>
                <div className="rounded-lg bg-brand-soft/50 p-3 text-center">
                  <div className="text-xs uppercase tracking-wide text-[--muted]">In hand after loans</div>
                  <div className="font-display text-lg font-semibold text-brand-dark tabular-nums">{money(Math.max(0, result.inHand))}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <p className="text-xs text-[--muted]">
        Illustrative only: assumes constant return and inflation rates, and taxes the whole corpus as one lump-sum
        withdrawal (real LTCG exemptions renew every financial year, so phased withdrawals owe less). Not financial
        or tax advice.
      </p>
    </div>
  );
}
