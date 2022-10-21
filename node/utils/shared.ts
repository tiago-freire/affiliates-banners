import type { MasterDataEntity } from '@vtex/clients'

export const findDocumentsByField = <T extends Record<string, any>>(
  client: MasterDataEntity<T>,
  field: 'affiliateId' | 'affiliateSlug',
  value: string
) => {
  return client.search(
    {
      page: 1,
      pageSize: 10,
    },
    ['_all'],
    undefined,
    `${field}=${value}`
  )
}
