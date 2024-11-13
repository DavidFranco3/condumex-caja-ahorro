import { useLocale } from "../../../hooks/useLocale"

const FRACTION_DIGITS = 2

export const toDigit = ({ locale, number }) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'MXN', maximumFractionDigits: FRACTION_DIGITS, minimumFractionDigits: FRACTION_DIGITS }).format(number)

export default function NumberDigits ({ children }) {
  const { locale } = useLocale()
  return toDigit({ locale, number: children })
}