// ** React Imports
import { ReactElement, ReactNode } from 'react'

// ** !! IGS Redux Imports
import { store } from 'src/store'
import { Provider } from 'react-redux'

// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/cache'

// ** Config Imports
import themeConfig from 'src/configs/themeConfig'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import ThemeComponent from '@core/theme/ThemeComponent'
import AuthGuard from '@core/components/auth/AuthGuard'
import GuestGuard from '@core/components/auth/GuestGuard'
import WindowWrapper from '@core/components/window-wrapper'

// ** Spinner Import
import Spinner from '@core/components/spinner'

// ** Contexts
import { AuthProvider } from 'src/context/AuthContext'
import { SettingsConsumer, SettingsProvider } from '@core/context/settingsContext'

// ** Styled Components
import ReactHotToast from '@core/styles/libs/react-hot-toast'

// ** Utils Imports
import { createEmotionCache } from '@core/utils/create-emotion-cache'

// ** Prismjs Styles
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** Global css styles
import '../../styles/globals.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SnackbarProvider } from 'src/context/SnackbarContext'
import { DialogProvider } from 'src/context/DialogContext'

import moment from 'moment'
import { PermissionProvider } from 'src/context/PermissionContext'

moment.updateLocale('pt-br', {
    months: 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
    monthsShort: 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
    monthsParseExact: true,
    weekdays: 'domingo_segunda-feira_terça-feira_quarta-feira_quinta-feira_sexta-feira_sábado'.split('_'),
    weekdaysShort: 'dom_seg_ter_qua_qui_sex_sáb'.split('_'),
    weekdaysMin: 'do_2ª_3ª_4ª_5ª_6ª_sá'.split('_'),
    weekdaysParseExact: true,
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D [de] MMMM [de] YYYY',
        LLL: 'D [de] MMMM [de] YYYY [às] HH:mm',
        LLLL: 'dddd, D [de] MMMM [de] YYYY [às] HH:mm'
    },
    calendar: {
        sameDay: '[Hoje às] LT',
        nextDay: '[Amanhã às] LT',
        nextWeek: 'dddd [às] LT',
        lastDay: '[Ontem às] LT',
        lastWeek: function () {
            const self = this as any

            return self.day() === 0 || self.day() === 6 ? '[Último] dddd [às] LT' : '[Última] dddd [às] LT'
        },
        sameElse: 'L'
    },
    relativeTime: {
        future: 'em %s',
        past: 'há %s',
        s: 'poucos segundos',
        m: 'um minuto',
        mm: '%d minutos',
        h: 'uma hora',
        hh: '%d horas',
        d: 'um dia',
        dd: '%d dias',
        M: 'um mês',
        MM: '%d meses',
        y: 'um ano',
        yy: '%d anos'
    },
    dayOfMonthOrdinalParse: /\d{1,2}º/,
    ordinal: function (number) {
        return number + 'º'
    },
    meridiemParse: /AM|PM/,
    isPM: function (input) {
        return input.charAt(0) === 'P'
    },
    meridiem: function (hours) {
        return hours < 12 ? 'AM' : 'PM'
    },
    week: {
        dow: 0,
        doy: 4
    }
})

moment.locale('pt-br')

const queryClient = new QueryClient()

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
    Component: NextPage
    emotionCache: EmotionCache
}

type GuardProps = {
    authGuard: boolean
    guestGuard: boolean
    children: ReactNode
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
    Router.events.on('routeChangeStart', () => {
        NProgress.start()
    })
    Router.events.on('routeChangeError', () => {
        NProgress.done()
    })
    Router.events.on('routeChangeComplete', () => {
        NProgress.done()
    })
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
    if (guestGuard) {
        return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>
    } else if (!guestGuard && !authGuard) {
        return <>{children}</>
    } else {
        return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>
    }
}

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

    // Variables
    const getLayout = Component.appendLayout
        ? (page: ReactElement) => <UserLayout>{Component.getLayout!(page)}</UserLayout>
        : Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)

    const setConfig = Component.setConfig ?? undefined

    const authGuard = Component.authGuard ?? true

    const guestGuard = Component.guestGuard ?? false

    return (
        <Provider store={store}>
            <CacheProvider value={emotionCache}>
                <Head>
                    <title>{`${themeConfig.templateName}`}</title>
                    <meta
                        name='description'
                        content={`${themeConfig.templateName} – Educação e reforço positivo para crianças`}
                    />
                    <meta name='keywords' content='Material Design, MUI, Admin Template, React Admin Template' />
                    <meta name='viewport' content='initial-scale=1, width=device-width' />
                </Head>

                <QueryClientProvider client={queryClient}>
                    <SnackbarProvider>
                        <AuthProvider>
                            <PermissionProvider>
                                <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
                                    <SettingsConsumer>
                                        {({ settings }) => {
                                            return (
                                                <ThemeComponent settings={settings}>
                                                    <DialogProvider>
                                                        <WindowWrapper>
                                                            <Guard authGuard={authGuard} guestGuard={guestGuard}>
                                                                {/* <AclGuard
                                                                    aclAbilities={aclAbilities}
                                                                    guestGuard={guestGuard}
                                                                > */}
                                                                {getLayout(<Component {...pageProps} />)}
                                                                {/* </AclGuard> */}
                                                            </Guard>
                                                        </WindowWrapper>
                                                        <ReactHotToast>
                                                            <Toaster
                                                                position={settings.toastPosition}
                                                                toastOptions={{ className: 'react-hot-toast' }}
                                                            />
                                                        </ReactHotToast>
                                                    </DialogProvider>
                                                </ThemeComponent>
                                            )
                                        }}
                                    </SettingsConsumer>
                                </SettingsProvider>
                            </PermissionProvider>
                        </AuthProvider>
                    </SnackbarProvider>
                </QueryClientProvider>
            </CacheProvider>
        </Provider>
    )
}

export default App
