// ** React Import
import { useEffect } from 'react'

// ** Type Import
import { LayoutProps } from '@core/layouts/types'

// ** Layout Components
import VerticalLayout from './VerticalLayout'
import HorizontalLayout from './HorizontalLayout'

const Layout = (props: LayoutProps) => {
    // ** Props
    const { hidden, children, settings, saveSettings } = props

    useEffect(() => {
        if (hidden) {
            saveSettings({ ...settings, layout: 'vertical' })
        } else {
            saveSettings({ ...settings, layout: settings.lastLayout })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hidden])

    if (settings.layout === 'horizontal') {
        return <HorizontalLayout {...props}>{children}</HorizontalLayout>
    }

    return <VerticalLayout {...props}>{children}</VerticalLayout>
}

export default Layout
