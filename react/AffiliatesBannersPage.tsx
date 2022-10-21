import {
  createSystem,
  Page,
  PageContent,
  PageHeader,
  PageHeaderTitle,
  PageHeaderTop,
  ToastProvider,
} from '@vtex/admin-ui'
import React from 'react'
import { useIntl } from 'react-intl'
import BannersManager from './components/admin/banners/BannersManager'
import { messages } from './utils/messages'

const AffiliatesBannersPage = function () {
  const [ThemeProvider] = createSystem()
  const intl = useIntl()

  return (
    <ThemeProvider>
      <ToastProvider>
        <Page>
          <PageHeader>
            <PageHeaderTop>
              <PageHeaderTitle>
                {intl.formatMessage(messages.bannersPageHeaderTitle)}
              </PageHeaderTitle>
            </PageHeaderTop>
          </PageHeader>
          <PageContent>
            <BannersManager />
          </PageContent>
        </Page>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default AffiliatesBannersPage
