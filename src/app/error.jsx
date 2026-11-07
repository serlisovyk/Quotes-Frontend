'use client'

import { Button } from '@/components/button'
import { StatusMessage } from '@/components/status-message'

export default function ErrorPage({ reset }) {
  return (
    <section className="mt-10 flex flex-col items-center">
      <h1 className="mb-4 text-center text-2xl font-bold text-accent-text md:text-4xl">
        Something went wrong
      </h1>

      <StatusMessage
        text="We could not load this page. Please try again."
        size="large"
      />

      <div className="mt-8 md:mt-11">
        <Button onClick={reset} text="Try again" />
      </div>
    </section>
  )
}
