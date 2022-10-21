// import type { Affiliates, MutationAddAffiliateArgs } from 'vtex.affiliates'
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

  console.log('addBannerAffiliate:\n\n\n', JSON.stringify(mdDocument, null, 2), '\n\n\n')

  const { DocumentId } = await affiliatesBanners.save(mdDocument)

  return affiliatesBanners.get(DocumentId, ['_all'])
}
