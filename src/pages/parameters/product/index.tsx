import ProductLayout from "./layout";

export default function ProductList() {
    return null
}

ProductList.getLayout = function getLayout(page: React.ReactNode) {
    return <ProductLayout>{page}</ProductLayout>
}

ProductList.appendLayout = true
