
export const SYSTEM_CHARGE_RATE = 0.05 // 5%

export function calculateSystemCharge(price: number | string | null | undefined): number {
  const num = Number(price || 0)
  if (isNaN(num) || num <= 0) return 0
  return Math.round(num * SYSTEM_CHARGE_RATE)
}

export function formatNaira(amount: number | string | null | undefined): string {
  const num = Number(amount || 0)
  return num.toLocaleString('en-NG')
}