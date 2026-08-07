import StatusMessage from '@components/StatusMessage'

export default function QuoteNotFoundMessage({ id }) {
  return (
    <StatusMessage
      text={`Quote with id ${id} not found.`}
      size="large"
      className="mt-10"
    />
  )
}
