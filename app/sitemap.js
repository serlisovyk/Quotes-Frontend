import { ROUTES } from '@config/constants'
import { SITE_URL } from '@config/site'

export default function sitemap() {
  return [
    {
      url: `${SITE_URL}${ROUTES.HOME}`,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}${ROUTES.RANDOM}`,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}${ROUTES.SEARCH}`,
      lastModified: new Date(),
    },
  ]
}
