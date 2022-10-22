import type {
  AffiliateBanner,
  MutationAddBannerAffiliateArgs,
} from 'ssesandbox04.affiliates-banners'

export const addBannerAffiliate = async (
  _: unknown,
  { newBannerAffiliate }: MutationAddBannerAffiliateArgs,
  { clients: { affiliatesBanners } }: Context
) => {
  const mdDocument = {
    ...newBannerAffiliate,
  } as AffiliateBanner
  const { DocumentId } = await affiliatesBanners.save(mdDocument)
  const savedDocument = await affiliatesBanners.get(DocumentId, ['_all'])
  return savedDocument
}
