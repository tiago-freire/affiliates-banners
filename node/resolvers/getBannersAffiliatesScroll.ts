import type {
  AffiliateBanner, QueryGetBannersAffiliatesScrollArgs
} from 'ssesandbox04.affiliates-banners'

import { SCROLL_PAGE_SIZE } from '../utils/constants'
import { parseAffiliatesFilters } from '../utils/filters'

export const getBannersAffiliatesScroll = async (
  _: unknown,
  { filter, sorting }: QueryGetBannersAffiliatesScrollArgs,
  { clients: { affiliatesBanners } }: Context
): Promise<AffiliateBanner[]> => {
  const responseData: AffiliateBanner[][] = []
  let MD_TOKEN = ''

  let hasMoreData = true
  const fields = ['id', 'affiliateId', 'affiliateSlug', 'banner']
  const sort = sorting ? `${sorting.field} ${sorting.order}` : undefined
  const where = filter ? parseAffiliatesFilters(filter) : undefined

  while (hasMoreData) {
    // eslint-disable-next-line no-await-in-loop
    const { data, mdToken } = await affiliatesBanners.scroll({
      fields,
      size: SCROLL_PAGE_SIZE,
      sort,
      where,
      mdToken: MD_TOKEN !== '' ? MD_TOKEN : undefined,
    })

    responseData.push(data as AffiliateBanner[])

    MD_TOKEN = MD_TOKEN !== '' ? MD_TOKEN : mdToken

    if (data.length === 0) {
      hasMoreData = false
    }
  }

  const documents = responseData.flat()

  return documents
}
