import type {
  AffiliateBanner,
  MutationUpdateBannerAffiliateArgs,
} from 'ssesandbox04.affiliates-banners'

export const updateBannerAffiliate = async (
  _: unknown,
  {
    updateBannerAffiliate: updateBannerAffiliateArgs,
  }: MutationUpdateBannerAffiliateArgs,
  { clients: { affiliatesBanners } }: Context
) => {
  const { id } = updateBannerAffiliateArgs
  const mdDocument = {
    ...updateBannerAffiliateArgs,
  } as AffiliateBanner
  await affiliatesBanners.update(id, mdDocument)
  return affiliatesBanners.get(id, ['_all'])
}
