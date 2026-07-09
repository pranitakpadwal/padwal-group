export function calculateAge(birthDateIso: string, asOf: Date = new Date()): number {
  const birthDate = new Date(birthDateIso);
  let age = asOf.getFullYear() - birthDate.getFullYear();

  const hasHadBirthdayThisYear =
    asOf.getMonth() > birthDate.getMonth() ||
    (asOf.getMonth() === birthDate.getMonth() && asOf.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return age;
}
