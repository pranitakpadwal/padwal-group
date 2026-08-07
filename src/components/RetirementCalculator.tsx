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
} from "@/lib/retirement";

const RETURN_PRESETS = [
  { label: "Conservative (8%)", rate: 8 },
  { label: "Moderate (12%)", rate: 12 },
  { label: "Aggressive (15%)", rate: 15 },
];

// Matches the India LTCG preset already used in the "own a company" calculator,
// so the same assumption reads the same number across the site.
const TAX_PRESETS = [
  { label: "India LTCG (12.5%)", rate: 12.5 },
  { label: "US long-term (20%)", rate: 20 },
  { label: "None (0%)", rate: 0 },
];

const LTCG_EXEMPTION_INR = 125_000;

const LOAN_TYPES = ["Home Loan", "Personal Loan", "Car Loan", "Education Loan", "Other"];

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

export default function RetirementCalculator({
  roster,
  rates,
}: {
  roster: RosterEntry[];
  rates: DisplayRates;
}) {
  const [currentAge, setCurrentAge] = useState(35);
  const [retireAge, setRetireAge] = useState(55);
  const [currentInvestments, setCurrentInvestments] = useState(2_000_000); // ₹20L
  const [monthlyContribution, setMonthlyContribution] = useState(50_000);
  const [annualStepUpPercent, setAnnualStepUpPercent] = useState(0);
  const [annualReturnPercent, setAnnualReturnPercent] = useState(12);
  const [goalAmount, setGoalAmount] = useState(100_000_000); // ₹10 Cr
  const [taxRatePercent, setTaxRatePercent] = useState(12.5);
  const [currency, setCurrency] = useState("INR");
  const [loans, setLoans] = useState<LoanRow[]>([]);

  const currencyOptions = Object.keys(rates);
  // Values are computed in INR throughout; this is a cross-rate via USD,
  // since `rates` is quoted as "units of X per 1 USD". Both sides of the
  // cross-rate need the SAME fallback source — using a bare `?? 1` only on
  // the target side (as an earlier version of this did) silently treats any
  // currency with a missing live rate as if it were USD, which is wrong for
  // every non-USD currency and was producing an 83x-wrong ₹ figure whenever
  // the FX fetch degraded.
  const effectiveRates: DisplayRates = { USD: 1, INR: 83, ...rates };
  const crossRate = (1 / effectiveRates["INR"]) * (effectiveRates[currency] ?? effectiveRates["INR"]);
  const money = (inr: number) => formatCurrencyCompact(inr * crossRate, currency);

  const yearsToRetirement = Math.max(0, retireAge - currentAge);
  const monthsToRetirement = yearsToRetirement * 12;

  const result = useMemo(() => {
    const growth = simulateGrowth({
      currentInvestments,
      monthlyContribution,
      annualStepUpPercent,
      annualReturnPercent,
      years: yearsToRetirement,
    });
    const tax = estimateWithdrawalTax(
      growth.corpus,
      currentInvestments + growth.totalContributed,
      taxRatePercent,
      LTCG_EXEMPTION_INR,
    );
    const neededMonthly = requiredMonthlyContribution({
      currentInvestments,
      annualStepUpPercent,
      annualReturnPercent,
      years: yearsToRetirement,
      targetCorpus: goalAmount,
    });

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
    const stuckLoans = loanResults.filter((r) => r.payoff.months === null);

    const inHand = tax.postTax - totalLoanRemaining;
    const gap = goalAmount - inHand;

    return { growth, tax, neededMonthly, loanResults, totalLoanRemaining, stuckLoans, inHand, gap };
  }, [
    currentInvestments,
    monthlyContribution,
    annualStepUpPercent,
    annualReturnPercent,
    yearsToRetirement,
    monthsToRetirement,
    taxRatePercent,
    goalAmount,
    loans,
  ]);

  const lowestTracked = roster.length > 0 ? roster[roster.length - 1] : null;
  const goalUsd = goalAmount / effectiveRates["INR"];
  const goalVsLowestPercent = lowestTracked ? (goalUsd / lowestTracked.netWorthUsd) * 100 : null;

  const addLoan = () => {
    setLoans((prev) => [...prev, { id: newLoanId(), type: LOAN_TYPES[0], principal: 3_000_000, ratePercent: 8.5, emi: 30_000 }]);
  };
  const updateLoan = (id: string, patch: Partial<LoanRow>) => {
    setLoans((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };
  const removeLoan = (id: string) => {
    setLoans((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div className="flex flex-col gap-5">
      {/* You + currency */}
      <div className="grid grid-cols-1 gap-5 rounded-2xl border border-line bg-surface p-6 sm:grid-cols-3 sm:p-8">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">Your age now</span>
          <input
            type="number"
            min={18}
            max={90}
            value={currentAge}
            onChange={(e) => setCurrentAge(Math.max(18, Math.min(90, Number(e.target.value))))}
            className="rounded-lg border border-line bg-background px-3 py-2 text-lg text-foreground tabular-nums"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">Age you want to retire</span>
          <input
            type="number"
            min={currentAge}
            max={90}
            value={retireAge}
            onChange={(e) => setRetireAge(Math.max(currentAge, Math.min(90, Number(e.target.value))))}
            className="rounded-lg border border-line bg-background px-3 py-2 text-lg text-foreground tabular-nums"
          />
          <span className="text-xs text-[--muted]">{yearsToRetirement} years to go</span>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
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
      </div>

      {/* Existing investments */}
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h3 className="font-display text-lg font-semibold text-foreground">What you&apos;ve already got</h3>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">Current investments (shares, mutual funds, etc.)</span>
          <input
            type="number"
            min={0}
            step={100_000}
            value={currentInvestments}
            onChange={(e) => setCurrentInvestments(Math.max(0, Number(e.target.value)))}
            className="rounded-lg border border-line bg-background px-3 py-2 text-lg text-foreground tabular-nums"
          />
        </label>
        <div className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-foreground">
            Expected annual return: <span className="text-brand">{annualReturnPercent}%</span>
          </span>
          <input
            type="range"
            min={0}
            max={25}
            step={0.5}
            value={annualReturnPercent}
            onChange={(e) => setAnnualReturnPercent(Number(e.target.value))}
            className="accent-brand"
          />
          <div className="flex flex-wrap gap-1.5">
            {RETURN_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setAnnualReturnPercent(preset.rate)}
                className={`rounded-full border px-2.5 py-0.5 text-xs ${
                  annualReturnPercent === preset.rate
                    ? "border-brand bg-brand text-white"
                    : "border-line text-foreground/70 hover:border-brand"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-[--muted]">
            A rate you choose, not a prediction — real market returns vary and can be negative.
          </p>
        </div>
      </div>

      {/* Monthly contribution */}
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h3 className="font-display text-lg font-semibold text-foreground">What you&apos;re adding each month</h3>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">Monthly investment (SIP)</span>
          <input
            type="number"
            min={0}
            step={5_000}
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
            className="rounded-lg border border-line bg-background px-3 py-2 text-lg text-foreground tabular-nums"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm sm:max-w-xs">
          <span className="font-medium text-foreground">Annual step-up (optional)</span>
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
          <span className="text-xs text-[--muted]">e.g. raising your SIP with a yearly raise.</span>
        </label>
      </div>

      {/* Loans */}
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
        {loans.length === 0 && (
          <p className="text-sm text-[--muted]">No loans added — skip this if you&apos;re debt-free.</p>
        )}
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
              <button
                type="button"
                onClick={() => removeLoan(loan.id)}
                className="text-xs text-[--muted] hover:text-rose-500"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Goal + tax */}
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h3 className="font-display text-lg font-semibold text-foreground">Your retirement goal</h3>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">Target retirement corpus</span>
          <input
            type="number"
            min={0}
            step={1_000_000}
            value={goalAmount}
            onChange={(e) => setGoalAmount(Math.max(0, Number(e.target.value)))}
            className="rounded-lg border border-line bg-background px-3 py-2 text-lg text-foreground tabular-nums"
          />
          <span className="text-xs text-[--muted]">Defaults to ₹10 crore — change it to whatever your number is.</span>
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
                  taxRatePercent === preset.rate
                    ? "border-brand bg-brand text-white"
                    : "border-line text-foreground/70 hover:border-brand"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="flex flex-col gap-4 rounded-2xl border border-brand/40 bg-brand-soft/40 p-6 sm:p-8">
        <h3 className="font-display text-xl font-semibold text-foreground">
          At {retireAge}, here&apos;s where you&apos;d stand
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-background/60 p-4 text-center">
            <div className="text-xs uppercase tracking-wide text-[--muted]">Projected corpus</div>
            <div className="font-display text-2xl font-semibold text-brand-dark tabular-nums">{money(result.growth.corpus)}</div>
            <div className="mt-1 text-xs text-[--muted]">before tax</div>
          </div>
          <div className="rounded-xl bg-background/60 p-4 text-center">
            <div className="text-xs uppercase tracking-wide text-[--muted]">After tax</div>
            <div className="font-display text-2xl font-semibold text-brand-dark tabular-nums">{money(result.tax.postTax)}</div>
            <div className="mt-1 text-xs text-[--muted]">est. tax {money(result.tax.tax)}</div>
          </div>
          <div className="rounded-xl bg-background/60 p-4 text-center">
            <div className="text-xs uppercase tracking-wide text-[--muted]">In hand at retirement</div>
            <div className="font-display text-2xl font-semibold text-brand-dark tabular-nums">{money(Math.max(0, result.inHand))}</div>
            <div className="mt-1 text-xs text-[--muted]">
              {result.totalLoanRemaining > 0 ? `after ${money(result.totalLoanRemaining)} in remaining loans` : "loans clear, no deduction"}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-background/60 p-4 text-sm">
          {result.gap <= 0 ? (
            <p className="font-medium text-emerald-600 dark:text-emerald-400">
              You&apos;re on track — a projected surplus of {money(Math.abs(result.gap))} over your goal.
            </p>
          ) : (
            <p className="font-medium text-rose-600 dark:text-rose-400">
              Projected shortfall of {money(result.gap)} against your goal.{" "}
              {yearsToRetirement > 0 && (
                <span className="font-normal text-foreground/80">
                  Hitting your goal on this timeline needs about {money(result.neededMonthly)}/month instead of{" "}
                  {money(monthlyContribution)}/month.
                </span>
              )}
            </p>
          )}
        </div>

        {lowestTracked && goalVsLowestPercent !== null && (
          <p className="text-xs text-[--muted]">
            For scale: your {money(goalAmount)} goal is about {goalVsLowestPercent < 0.01 ? "<0.01" : goalVsLowestPercent.toFixed(2)}%
            of{" "}
            <Link href={`/billionaire/${lowestTracked.id}`} className="text-brand hover:underline">
              {lowestTracked.name}
            </Link>
            &apos;s net worth — the smallest fortune we track live, for context on how large &quot;billionaire&quot; actually is.
          </p>
        )}

        <p className="text-xs text-[--muted]">
          Illustrative only: assumes a constant return rate, ignores inflation and expense-ratio drag, and taxes
          the whole corpus as one lump-sum withdrawal (real LTCG exemptions renew every financial year, so
          phased withdrawals owe less). Not financial or tax advice.
        </p>
      </div>
    </div>
  );
}
