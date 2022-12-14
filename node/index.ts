import type { ClientsConfig, RecorderState, ServiceContext } from '@vtex/api'
import { Service } from '@vtex/api'

import { Clients } from './clients'
import { addBannerAffiliate } from './resolvers/addBannerAffiliate'
import { deleteBannerAffiliate } from './resolvers/deleteBannerAffiliate'
import { getBannerAffiliateBySlug } from './resolvers/getBannerAffiliateBySlug'
import { getBannersAffiliatesScroll } from './resolvers/getBannersAffiliatesScroll'
import { updateBannerAffiliate } from './resolvers/updateBannerAffiliate'
import type { BannerAffiliateInput } from './typings/bannersAffiliates'

const TIMEOUT_MS = 1000

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag, containing the Status client.
  implementation: Clients,
  options: {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default: {
      retries: 3,
      timeout: TIMEOUT_MS,
    },
  },
}

declare global {
  // We declare a global Context type just to avoid re-writing ServiceContext<Clients, State> in every handler and resolver
  type Context = ServiceContext<Clients, State>

  // The shape of our State object found in `ctx.state`. This is used as state bag to communicate between middlewares.
  interface State extends RecorderState {
    affiliateBanner?: BannerAffiliateInput
  }
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  graphql: {
    resolvers: {
      Query: {
        getBannersAffiliatesScroll,
        getBannerAffiliateBySlug,
      },
      Mutation: {
        addBannerAffiliate,
        updateBannerAffiliate,
        deleteBannerAffiliate,
      },
    },
  },
})
