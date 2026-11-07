import { FavoriteQuotes } from '@/components/favorite-quotes'
import { ROUTES } from '@/constants'

export const metadata = {
  title: 'Favorites',
  description: 'Quotes you saved in this browser.',
  alternates: {
    canonical: ROUTES.FAVORITES,
  },
  robots: {
    index: false,
  },
}

export default function FavoritesPage() {
  return (
    <>
      <h1 className="mb-6 text-center text-3xl">Favorites</h1>

      <FavoriteQuotes />
    </>
  )
}
