import Image from 'next/image'
import Quote from '@components/Quote'
import Button from '@components/Button'
import { fetchQuoteByIdOrNull } from '@/services/quotes'
import { isQuoteValidId } from '@/utils/validation'
import { HOME_QUOTE_ID } from '@/config'
import { HOME_QUOTE_REVALIDATE_SECONDS, ROUTES } from '@/constants'

export default async function HomePage() {
  const quote = isQuoteValidId(HOME_QUOTE_ID)
    ? await fetchQuoteByIdOrNull(HOME_QUOTE_ID, {
        next: {
          revalidate: HOME_QUOTE_REVALIDATE_SECONDS,
        },
      })
    : null

  const hasQuote = Boolean(quote?.id)

  return (
    <>
      <section className="flex flex-col md:flex-row items-center justify-center gap-5 py-[16px] md:gap-10 md:py-[30px] lg:gap-20 lg:py-[50px]">
        <div className="max-w-lg md:max-w-[350px] lg:max-w-lg">
          <div className="text-2xl font-bold italic text-violet-900 lg:text-4xl">
            Success is not final, failure is not fatal: it is the courage to continue
            that counts. <br />
            <span className="text-violet-600">&nbsp;- Winston Churchill</span>
          </div>
        </div>
        <div>
          <Image
            src="/churchill.jpg"
            alt="Portrait of Winston Churchill"
            width={500}
            height={500}
            priority
            className="h-50 w-50 rounded-full"
          />
        </div>
      </section>
      <section className="flex flex-col items-center justify-center gap-5 pt-[40px] pb-[20px] md:gap-10 md:pt-[70px] lg:flex-row lg:gap-20 lg:pt-[150px] lg:pb-[40px]">
        <div className="max-w-xl text-xl text-indigo-400">
          <div className="mb-2 md:mb-5">
            These are the words of a politician, soldier, journalist, and true leader
            - one who traversed a long road of trials. His words and steely will
            reshaped the course of history. He proved that a single resolute voice,
            tempered in adversity, can ignite an entire nation.
          </div>
          <div className="mb-2 md:mb-5">
            It was these words by Winston Churchill that inspired me to create this
            large and interesting project around searching, creating, and editing
            quotes.
          </div>
          <div>
            This project is not just a collection of quotes. It is a place where
            everyone can find inspiration, improve their English, and find quotes for
            social networks and much more.
          </div>
        </div>
        {hasQuote && (
          <div className="max-w-[500px]">
            <Quote quote={quote} />
          </div>
        )}
      </section>
      <section className="flex flex-col justify-center sm:flex-row md:mb-10">
        <Button href={ROUTES.RANDOM} text="Random Quotes" />
        <Button href={ROUTES.SEARCH} text="Search Quotes" variant="secondary" />
      </section>
    </>
  )
}
