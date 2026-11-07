import { parseReadOnly } from '@/utils/parse-read-only'

export const IS_READ_ONLY = parseReadOnly(process.env.READ_ONLY)
