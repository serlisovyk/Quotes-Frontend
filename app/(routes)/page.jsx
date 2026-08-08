import Image from 'next/image'
import сhurchillImage from '@public/сhurchill.jpg'
import Quote from '@components/Quote'
import Button from '@components/Button'
import StatusMessage from '@components/StatusMessage'
import { MY_QUOTE_ID, ROUTES } from '@config/constants'
import { fetchQuoteByIdOrNull } from '@services/services'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const quote = await fetchQuoteByIdOrNull(MY_QUOTE_ID)

  if (!quote?.id) {
    return (
      <StatusMessage
        text="Error while fetching quotes for the home page. Please try again later."
        className="p-10"
      />
    )
  }

  return (
    <>
      <section className="flex flex-col md:flex-row justify-center items-center gap-5 md:gap-10 lg:gap-20 py-[16px] md:py-[30px] lg:py-[50px]">
        <div className="max-w-lg md:max-w-[350px] lg:max-w-lg">
          <div className="text-2xl lg:text-4xl font-bold italic text-violet-900">
            Success is not final, failure is not fatal: it is the courage to continue
            that counts. <br />
            <span className="text-violet-600">&nbsp; - Winston Churchill</span>
          </div>
        </div>
        <div>
          <Image
            src={сhurchillImage}
            alt="Portrait of Winston Churchill"
            width={500}
            height={500}
            priority
            className="rounded-full w-50 h-50"
          />
        </div>
      </section>
      <section className="flex flex-col lg:flex-row justify-center items-center gap-5 md:gap-10 lg:gap-20 pt-[40px] md:pt-[70px] lg:pt-[150px] pb-[20px] lg:pb-[40px]">
        <div className="max-w-xl text-xl text-indigo-400">
          <div className="mb-2 md:mb-5">
            These are the words of a politician, soldier, journalist, and true leader
            - who traversed a long road of trials; his words and steely will reshaped
            the course of history. He proved that a single resolute voice, tempered
            in adversity, can ignite an entire nation.
          </div>
          <div className="mb-2 md:mb-5">
            It was these words by Winston Churchill that inspired me to create this
            huge and interesting project with searching, creating, editing quotes.
          </div>
          <div>
            This project is not just a collection of quotes, it is a place where
            everyone can find inspiration, improve their English, find quotes for
            their social networks) and much more.
          </div>
        </div>
        <div className="max-w-[500px]">
          <Quote quote={quote} />
        </div>
      </section>
      <section className="flex flex-col sm:flex-row justify-center md:mb-10">
        <Button href={ROUTES.RANDOM} text="Random Quotes" />
        <Button href={ROUTES.SEARCH} text="Search Quotes" variant="secondary" />
      </section>
    </>
  )
}
