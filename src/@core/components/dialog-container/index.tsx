type DialogContainerProps = {
    children: JSX.Element
    open: boolean
}

export default function DialogContainer({ children, open }: DialogContainerProps) {
    if (!open) return null
    return children
}
