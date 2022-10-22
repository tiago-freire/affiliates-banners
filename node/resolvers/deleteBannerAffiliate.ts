import type { MutationDeleteBannerAffiliateArgs } from 'ssesandbox04.affiliates-banners'

export const deleteBannerAffiliate = async (
  _: unknown,
  { id }: MutationDeleteBannerAffiliateArgs,
  { clients: { affiliatesBanners } }: Context
) => {
  await affiliatesBanners.delete(id)
  return id
}
