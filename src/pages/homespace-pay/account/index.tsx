import { ReactNode } from 'react'
import Account from './layout'

export default function Index() {
    return null
}

Index.appendLayout = true
Index.getLayout = function getLayout(page: ReactNode) {
    return <Account>{page}</Account>
}
