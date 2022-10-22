import {
  Box,
  Button,
  colors,
  Label,
  Select,
  Spinner,
  useToast,
} from '@vtex/admin-ui'
import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-apollo'
import { useIntl } from 'react-intl'
import type {
  BannerAffiliate,
  BannerAffiliateScroll,
  Mutation as MutationBannerAffiliate,
  Query as QueryBannersAffiliates,
} from 'ssesandbox04.affiliates-banners'
import type { Affiliate } from 'vtex.affiliates'
import { ButtonWithIcon, IconDelete, IconEdit, Table } from 'vtex.styleguide'
import ADD_BANNER_AFFILIATE from '../../../graphql/addBannerAffiliate.graphql'
import DELETE_BANNER_AFFILIATE from '../../../graphql/deleteBannerAffiliate.graphql'
import GET_AFFILIATES from '../../../graphql/getAffiliates.graphql'
import GET_BANNERS_AFFILIATES from '../../../graphql/getBannersAffiliates.graphql'
import UPDATE_BANNER_AFFILIATE from '../../../graphql/updateBannerAffiliate.graphql'
import UPLOAD_FILE from '../../../graphql/uploadFile.graphql'
import { messages } from '../../../utils/messages'

interface QueryAffiliates {
  getAffiliates: {
    data: [Affiliate]
    pagination: {
      page: number
      pageSize: number
      total: number
    }
  }
}

interface MutationUploadFile {
  uploadFile: { fileUrl: string }
}

const BannersManager = function () {
  const intl = useIntl()
  const showToast = useToast()

  const showError = (error: Record<string, any>) => {
    console.error('Banners Affiliates Error: ', JSON.stringify(error, null, 2))
    showToast({
      tone: 'critical',
      dismissible: true,
      message: error.message,
    })
  }

  const { loading: loadingAffiliates, data: dataAffiliates } =
    useQuery<QueryAffiliates>(GET_AFFILIATES, {
      variables: {
        page: 1,
        pageSize: 100,
      },
      onError: showError,
    })

  const {
    loading: loadingBannersAffiliates,
    data: dataBannersAffiliates,
    refetch: refetchBannersAffiliates,
  } = useQuery<QueryBannersAffiliates>(GET_BANNERS_AFFILIATES, {
    onError: showError,
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
  })

  const affiliates = dataAffiliates?.getAffiliates?.data
  const bannersAffiliates = dataBannersAffiliates?.getBannersAffiliatesScroll
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate>()
  const [selectedBannerFile, setSelectedBannerFile] = useState<File>()
  const [bannerAffiliateToUpdate, setBannerAffiliateToUpdate] =
    useState<BannerAffiliate>()
  const [availableAffiliates, setAvailableAffiliates] = useState<Affiliate[]>()

  useEffect(() => {
    if (bannersAffiliates?.length) {
      setAvailableAffiliates(
        affiliates?.filter(
          (affiliate) =>
            affiliate?.id === selectedAffiliate?.id ||
            !bannersAffiliates?.find(
              (saved: BannerAffiliateScroll | null) =>
                saved?.affiliateSlug === affiliate.slug
            )
        )
      )
    } else {
      setAvailableAffiliates(affiliates)
    }
  }, [affiliates, bannersAffiliates, selectedAffiliate])

  const [uploadFile, { loading: loadingUpload }] =
    useMutation<MutationUploadFile>(UPLOAD_FILE, { onError: showError })

  const [addBannerAffiliate, { loading: loadingAddBannerAffiliate }] =
    useMutation<MutationBannerAffiliate>(ADD_BANNER_AFFILIATE, {
      onError: showError,
      fetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,
    })

  const [deleteBannerAffiliate, { loading: loadingDeleteBannerAffiliate }] =
    useMutation<MutationBannerAffiliate>(DELETE_BANNER_AFFILIATE, {
      onError: showError,
      fetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,
    })

  const [updateBannerAffiliate, { loading: loadingUpdateBannerAffiliate }] =
    useMutation<MutationBannerAffiliate>(UPDATE_BANNER_AFFILIATE, {
      onError: showError,
      fetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,
    })

  const handleChangeUploadInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedBannerFile(e?.target?.files?.[0])
  }

  const handleChangeAffiliates = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAffiliate(affiliates?.find((a) => a.id === e.target.value))
  }

  const formBannerAffiliateReset = () => {
    setSelectedAffiliate(undefined)
    setSelectedBannerFile(undefined)
    setBannerAffiliateToUpdate(undefined)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget
    e.preventDefault()
    if (selectedAffiliate && selectedBannerFile) {
      const { data: dataUploadFile, errors: errorsUpload } = await uploadFile({
        variables: { file: selectedBannerFile },
      })

      if (!errorsUpload?.length && dataUploadFile?.uploadFile) {
        const fileUrl = dataUploadFile.uploadFile?.fileUrl

        const { data: dataSavedBannerAffiliate, errors: errorsSave } =
          bannerAffiliateToUpdate?.id
            ? await updateBannerAffiliate({
                variables: {
                  id: bannerAffiliateToUpdate.id,
                  affiliateId: selectedAffiliate.id,
                  affiliateSlug: selectedAffiliate.slug,
                  banner: fileUrl,
                },
              })
            : await addBannerAffiliate({
                variables: {
                  affiliateId: selectedAffiliate.id,
                  affiliateSlug: selectedAffiliate.slug,
                  banner: fileUrl,
                },
              })

        if (!errorsSave?.length && dataSavedBannerAffiliate) {
          await refetchBannersAffiliates()
          showToast({
            tone: 'positive',
            dismissible: true,
            message: intl.formatMessage(
              messages.editAffiliateBannerSuccessMessage
            ),
          })
        }
      }

      form.reset()
      formBannerAffiliateReset()
    } else {
      showError({ message: intl.formatMessage(messages.errorRequiredBanner) })
    }
  }

  const defaultTableSchema = {
    properties: {
      affiliateSlug: {
        title: intl.formatMessage(messages.affiliateLabel),
      },
      banner: {
        title: 'Banner',
        cellRenderer: ({ rowData }: { rowData: BannerAffiliate }) => (
          <img
            style={{ maxHeight: '80px' }}
            src={rowData.banner!}
            className="mv4"
            alt={`Banner ${rowData.affiliateSlug}`}
          />
        ),
      },
      id: {
        title: ' ',
        width: 110,
        cellRenderer: ({ rowData }: { rowData: BannerAffiliate }) => (
          <>
            <div className="mr2">
              <ButtonWithIcon
                size="small"
                onClick={() => {
                  setBannerAffiliateToUpdate(rowData)
                  setSelectedAffiliate(
                    affiliates?.find((a) => a.id === rowData.affiliateId!)
                  )
                }}
                icon={<IconEdit />}
              />
            </div>
            <div>
              <ButtonWithIcon
                variation="danger"
                size="small"
                onClick={async () => {
                  await deleteBannerAffiliate({ variables: { id: rowData.id } })
                  await refetchBannersAffiliates()
                }}
                icon={<IconDelete />}
              />
            </div>
          </>
        ),
      },
    },
  }

  return (
    <Box csx={{ marginY: 16 }}>
      {loadingAffiliates ? (
        <Spinner />
      ) : availableAffiliates?.length || bannerAffiliateToUpdate ? (
        <>
          <h2 className="c-action-primary mb4">
            {bannerAffiliateToUpdate
              ? intl.formatMessage(messages.updateAffiliateBannerTitle)
              : intl.formatMessage(messages.registrationAffiliateBannerTitle)}
          </h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Select
              value={selectedAffiliate?.id!}
              onChange={handleChangeAffiliates}
              label={`${intl.formatMessage(messages.affiliateLabel)}:`}
            >
              {availableAffiliates?.map((a) => (
                <option value={a.id!} key={a.id!}>
                  /{a.slug} - {a.name} - {a.email}
                </option>
              ))}
            </Select>
            <br />
            <Label style={{ color: colors.gray50 }} htmlFor="banner">
              Banner:
            </Label>
            <br />

            <input id="banner" onChange={handleChangeUploadInput} type="file" />
            {bannerAffiliateToUpdate && (
              <img
                style={{ maxHeight: '80px' }}
                className="ml4 v-mid"
                src={bannerAffiliateToUpdate.banner!}
                alt={`Banner ${bannerAffiliateToUpdate.affiliateSlug}`}
              />
            )}

            <br />
            <br />

            <Button
              loading={
                loadingUpload ||
                loadingAddBannerAffiliate ||
                loadingUpdateBannerAffiliate
              }
              type="submit"
            >
              {intl.formatMessage(messages.saveLabel)}
            </Button>
            {bannerAffiliateToUpdate && (
              <Button
                className="ml4"
                variant="criticalSecondary"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.form?.reset()
                  formBannerAffiliateReset()
                }}
              >
                {intl.formatMessage(messages.cancelLabel)}
              </Button>
            )}
          </form>
        </>
      ) : (
        intl.formatMessage(messages.registrationAffiliateBannerOnlyUpdateLabel)
      )}
      <h2 className="c-action-primary mv6">
        {intl.formatMessage(messages.listAffiliatesBannersTitle)}
      </h2>
      <div className="w-100">
        <Table
          fullWidth
          dynamicRowHeight
          density="low"
          emptyStateLabel={intl.formatMessage(
            messages.listAffiliatesBannersEmpty
          )}
          loading={
            loadingAffiliates ||
            loadingBannersAffiliates ||
            loadingDeleteBannerAffiliate
          }
          schema={defaultTableSchema}
          items={bannersAffiliates}
        />
      </div>
    </Box>
  )
}

export default BannersManager
