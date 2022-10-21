import type { BannersAffiliatesFilterInput } from 'ssesandbox04.affiliates-banners'

export const parseAffiliatesFilters = ({
  searchTerm,
}: BannersAffiliatesFilterInput) => {
  const where = []

  if (searchTerm) {
    where.push(
      `(id="*${searchTerm}*" OR affiliateId="*${searchTerm}*" OR affiliateSlug="*${searchTerm}*")`
    )
  }

  return where.join(' AND ')
}
