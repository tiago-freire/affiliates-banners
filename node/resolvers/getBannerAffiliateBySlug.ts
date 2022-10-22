import type {
  AffiliateBanner,
  QueryGetBannerAffiliateBySlugArgs,
} from 'ssesandbox04.affiliates-banners'
import { findDocumentsByField } from '../utils/shared'

export const getBannerAffiliateBySlug = async (
  _: unknown,
  { slug }: QueryGetBannerAffiliateBySlugArgs,
  { clients: { affiliatesBanners } }: Context
) => {
  const [bannerAffiliateData] = await findDocumentsByField<AffiliateBanner>(
    affiliatesBanners,
    'affiliateSlug',
    slug
  )

  if (!bannerAffiliateData) {
    return {}
  }

  return bannerAffiliateData
}
