import { NO_ACTIVE_OPTION, OPTION_STEP_DOWN } from '@/constants'

export function getNextOptionIndex(currentIndex, optionCount, step) {
  if (optionCount === 0) return NO_ACTIVE_OPTION

  const hasActiveOption = currentIndex !== NO_ACTIVE_OPTION

  if (!hasActiveOption) return step === OPTION_STEP_DOWN ? 0 : optionCount - 1

  return (currentIndex + step + optionCount) % optionCount
}
