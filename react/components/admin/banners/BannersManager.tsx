import { Box, Button, colors, Label, Select, useToast } from '@vtex/admin-ui'
import React, { useState } from 'react'
import { useMutation, useQuery } from 'react-apollo'
// import { useIntl } from 'react-intl'
import type { Affiliate } from 'vtex.affiliates'
import ADD_BANNER_AFFILIATE from '../../../graphql/addBannerAffiliate.graphql'
import GET_AFFILIATES from '../../../graphql/getAffiliates.graphql'
import UPLOAD_FILE from '../../../graphql/uploadFile.graphql'
// import { messages } from './utils/messages'

interface QueryAffiliates {
  //   getAffiliatesScroll: [Affiliate]
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

interface MutationAddBannerAffiliate {
  addBannerAffiliate: {
    affiliateId: string
    affiliateSlug: string
    banner: string
  }
}

const BannersManager = function () {
  //   const intl = useIntl()
  const showToast = useToast()
  const showError = (error: Record<string, any>) => {
    console.log('Error!!! ', JSON.stringify(error, null, 2))
    showToast({
      tone: 'critical',
      dismissible: true,
      message: error.message,
    })
  }
  const {
    loading: loadingAffiliates,
    error: errorAffiliates,
    data: dataAffiliates,
  } = useQuery<QueryAffiliates>(GET_AFFILIATES, {
    variables: {
      page: 1,
      pageSize: 100,
    },
    onError: showError,
  })

  const affiliates = dataAffiliates?.getAffiliates?.data

  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate>()
  const [selectedBannerFile, setSelectedBannerFile] = useState<File>()
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>()

  const [uploadFile, { loading: loadingUpload }] =
    useMutation<MutationUploadFile>(UPLOAD_FILE, { onError: showError })

  const [addBannerAffiliate, { loading: loadingAddBannerAffiliate }] =
    useMutation<MutationAddBannerAffiliate>(ADD_BANNER_AFFILIATE, {
      onCompleted(dataAddedBannerAffiliate) {
        console.log('dataAddedBannerAffiliate', dataAddedBannerAffiliate)
        showToast({
          tone: 'positive',
          dismissible: true,
          message: `Banner cadastrado com sucesso`,
        })
      },
      onError: showError,
    })

  const handleChangeUploadInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedBannerFile(e?.target?.files?.[0])
  }

  const handleChangeAffiliates = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAffiliate(affiliates?.find((a) => a.id === e.target.value))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget
    e.preventDefault()
    if (selectedAffiliate && selectedBannerFile) {
      const { data: dataUploadFile } = await uploadFile({
        variables: { file: selectedBannerFile },
      })
      if (dataUploadFile?.uploadFile) {
        const fileUrl = dataUploadFile.uploadFile?.fileUrl
        await addBannerAffiliate({
          variables: {
            affiliateId: selectedAffiliate.id,
            affiliateSlug: selectedAffiliate.slug,
            banner: fileUrl,
          },
        })
        setUploadedFileUrl(fileUrl)
      }
      form.reset()
    }
  }

  console.log('loadingAffiliates => ', loadingAffiliates)
  console.log('loadingAddBannerAffiliate => ', loadingAddBannerAffiliate)
  !loadingAffiliates && console.log('affiliates => ', affiliates)
  errorAffiliates && console.log('errorAffiliates => ', errorAffiliates)

  return (
    <Box csx={{ marginY: 16 }}>
      {!errorAffiliates && (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Select
            value={selectedAffiliate?.id!}
            onChange={handleChangeAffiliates}
            label={loadingAffiliates ? 'Carregando afiliados...' : 'Afiliado:'}
          >
            {!loadingAffiliates &&
              affiliates?.map((a) => (
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

          <br />
          <br />

          <Button
            loading={loadingUpload || loadingAddBannerAffiliate}
            type="submit"
          >
            Salvar
          </Button>

          {selectedAffiliate && uploadedFileUrl && (
            <>
              <br />
              <br />
              Banner da(o) afiliada(o){' '}
              <a href={`/affiliates/${selectedAffiliate.slug}`}>
                {selectedAffiliate.name}
              </a>
              :
              <img src={uploadedFileUrl} alt={`Banner ${selectedAffiliate}`} />
            </>
          )}
        </form>
      )}
    </Box>
  )
}

export default BannersManager
