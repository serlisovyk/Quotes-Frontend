import { STATUS_MESSAGE_CLASSES, STATUS_MESSAGE_SIZE_CLASSES } from '@/constants'

export function StatusMessage({ text, size = 'base', className = '' }) {
  const sizeClasses = STATUS_MESSAGE_SIZE_CLASSES[size]
  const classes = `${STATUS_MESSAGE_CLASSES} ${sizeClasses} ${className}`.trim()

  return <p className={classes}>{text}</p>
}
