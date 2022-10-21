import { IOClients } from '@vtex/api'
import { masterDataFor } from '@vtex/clients'
import type { AffiliateBanner } from 'ssesandbox04.affiliates-banners'

export class Clients extends IOClients {
  public get affiliatesBanners() {
    return this.getOrSet('affiliateBanner', masterDataFor<AffiliateBanner>('affiliateBanner'))
  }
}
