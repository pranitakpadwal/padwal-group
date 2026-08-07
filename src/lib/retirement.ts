/**
 * Pure finance math for the retirement calculator — no UI, no live data,
 * so every number is auditable independent of the component that renders it.
 *
 * Growth is simulated month by month (not a closed-form annuity formula) so
 * annual step-ups compose correctly and the logic stays easy to follow.
 * Contributions land at the START of each month, then the balance compounds
 * for that month — the standard "annuity-due" convention most Indian SIP
 * calculators use.
 */

export interface GrowthInputs {
  currentInvestments: number;
  monthlyContribution: number;
  /** How much the monthly contribution rises each year, e.g. 10 for a 10% annual step-up. */
  annualStepUpPercent: number;
  annualReturnPercent: number;
  years: number;
}

export interface GrowthResult {
  corpus: number;
  totalContributed: number;
}

export function simulateGrowth({
  currentInvestments,
  monthlyContribution,
  annualStepUpPercent,
  annualReturnPercent,
  years,
}: GrowthInputs): GrowthResult {
  const months = Math.max(0, Math.round(years * 12));
  const monthlyRate = annualReturnPercent / 100 / 12;
  let corpus = Math.max(0, currentInvestments);
  let contribution = Math.max(0, monthlyContribution);
  let totalContributed = 0;

  for (let month = 1; month <= months; month++) {
    corpus += contribution;
    totalContributed += contribution;
    corpus *= 1 + monthlyRate;
    if (month % 12 === 0 && annualStepUpPercent > 0) {
      contribution *= 1 + annualStepUpPercent / 100;
    }
  }

  return { corpus, totalContributed };
}

/**
 * The monthly contribution needed to reach targetCorpus by the given horizon,
 * everything else held equal. Solved by binary search over simulateGrowth
 * rather than an inverted formula, so it stays correct even with step-ups.
 */
export function requiredMonthlyContribution(
  inputs: Omit<GrowthInputs, "monthlyContribution"> & { targetCorpus: number },
): number {
  const { targetCorpus, ...rest } = inputs;
  if (targetCorpus <= simulateGrowth({ ...rest, monthlyContribution: 0 }).corpus) {
    return 0;
  }
  let lo = 0;
  let hi = Math.max(targetCorpus / 12, 1);
  // Grow the upper bound until it's provably enough, then binary search into it.
  while (simulateGrowth({ ...rest, monthlyContribution: hi }).corpus < targetCorpus && hi < targetCorpus) {
    hi *= 2;
  }
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const { corpus } = simulateGrowth({ ...rest, monthlyContribution: mid });
    if (corpus < targetCorpus) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return hi;
}

/** A future amount growing at a fixed annual rate — used to project today's expenses forward to retirement. */
export function inflateAmount(amount: number, annualRatePercent: number, years: number): number {
  return amount * Math.pow(1 + annualRatePercent / 100, Math.max(0, years));
}

export interface DrawdownInputs {
  corpus: number;
  /** Monthly expense in year one of retirement — already inflation- and lifestyle-adjusted. */
  monthlyExpenseAtRetirement: number;
  /** Return the corpus earns during retirement (typically more conservative than the pre-retirement rate). */
  postRetirementReturnPercent: number;
  /** The withdrawal rises with inflation once a year, same annual-step convention as simulateGrowth. */
  inflationPercent: number;
  /** Years the corpus needs to last — usually (life expectancy − retirement age). */
  retirementYears: number;
}

/**
 * Draws down `corpus` month by month: withdraw at the start of the month,
 * then the remainder earns postRetirementReturnPercent for that month. The
 * withdrawal itself rises with inflation once a year. Returns the ending
 * balance — negative means the money ran out before retirementYears was up.
 */
export function simulateDrawdown({
  corpus,
  monthlyExpenseAtRetirement,
  postRetirementReturnPercent,
  inflationPercent,
  retirementYears,
}: DrawdownInputs): number {
  const months = Math.max(0, Math.round(retirementYears * 12));
  const monthlyRate = postRetirementReturnPercent / 100 / 12;
  let balance = corpus;
  let withdrawal = monthlyExpenseAtRetirement;

  for (let month = 1; month <= months; month++) {
    balance -= withdrawal;
    balance *= 1 + monthlyRate;
    if (month % 12 === 0 && inflationPercent > 0) {
      withdrawal *= 1 + inflationPercent / 100;
    }
  }

  return balance;
}

/**
 * The corpus needed so a monthly withdrawal — starting at
 * monthlyExpenseAtRetirement, rising with inflation once a year — lasts
 * exactly retirementYears, given the corpus keeps earning
 * postRetirementReturnPercent while it's drawn down. Solved by binary search
 * over simulateDrawdown, the same technique requiredMonthlyContribution uses
 * for the accumulation phase — one shared, already-verified approach instead
 * of a second closed-form formula with its own edge cases to get right.
 * Answers "will the money actually last?", not just "did I hit my number."
 */
export function corpusNeededForRetirement(inputs: Omit<DrawdownInputs, "corpus">): number {
  const { monthlyExpenseAtRetirement, retirementYears } = inputs;
  if (retirementYears <= 0 || monthlyExpenseAtRetirement <= 0) return 0;

  let lo = 0;
  let hi = Math.max(monthlyExpenseAtRetirement * 12 * retirementYears, 1);
  while (simulateDrawdown({ ...inputs, corpus: hi }) < 0 && hi < Number.MAX_SAFE_INTEGER / 4) {
    hi *= 2;
  }
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (simulateDrawdown({ ...inputs, corpus: mid }) < 0) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return hi;
}

export interface WithdrawalTax {
  gains: number;
  taxableGains: number;
  tax: number;
  postTax: number;
}

/**
 * A simplified, single-withdrawal estimate: gains above the exemption taxed
 * once at the chosen rate. Real-world tax depends on how you actually
 * withdraw (the ₹1.25L equity exemption renews every financial year, so
 * spreading withdrawals across years legitimately lowers this) — this models
 * "if you cashed it all out on day one," the honest worst case, not a
 * withdrawal strategy. Not tax advice.
 */
export function estimateWithdrawalTax(
  corpus: number,
  principalContributed: number,
  taxRatePercent: number,
  exemptionAmount: number,
): WithdrawalTax {
  const gains = Math.max(0, corpus - principalContributed);
  const taxableGains = Math.max(0, gains - exemptionAmount);
  const tax = taxableGains * (taxRatePercent / 100);
  return { gains, taxableGains, tax, postTax: corpus - tax };
}

export interface LoanPayoff {
  /** Months to fully pay off at the given EMI, or null if the EMI never clears it. */
  months: number | null;
  totalInterest: number | null;
}

export function loanMonthsToPayoff(principal: number, annualRatePercent: number, emi: number): LoanPayoff {
  if (principal <= 0) return { months: 0, totalInterest: 0 };
  if (emi <= 0) return { months: null, totalInterest: null };

  const r = annualRatePercent / 100 / 12;
  if (r === 0) {
    const months = Math.ceil(principal / emi);
    return { months, totalInterest: 0 };
  }
  if (emi <= principal * r) {
    // The EMI doesn't even cover a month's interest — balance never shrinks.
    return { months: null, totalInterest: null };
  }
  const months = Math.ceil(-Math.log(1 - (principal * r) / emi) / Math.log(1 + r));
  const totalInterest = emi * months - principal;
  return { months, totalInterest };
}

/** Outstanding principal after `monthsElapsed` payments at a fixed EMI. Clamped to 0. */
export function remainingLoanBalance(
  principal: number,
  annualRatePercent: number,
  emi: number,
  monthsElapsed: number,
): number {
  if (principal <= 0 || monthsElapsed <= 0) return Math.max(0, principal);
  const r = annualRatePercent / 100 / 12;
  if (r === 0) {
    return Math.max(0, principal - emi * monthsElapsed);
  }
  const growth = Math.pow(1 + r, monthsElapsed);
  const balance = principal * growth - emi * ((growth - 1) / r);
  return Math.max(0, balance);
}
