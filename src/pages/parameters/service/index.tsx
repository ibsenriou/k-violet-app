import ServiceLayout from './layout'

export default function ServiceList() {
    return null
}

ServiceList.getLayout = function getLayout(page: React.ReactNode) {
    return <ServiceLayout>{page}</ServiceLayout>
}

ServiceList.appendLayout = true
