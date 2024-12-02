type useFileSelectorProps =
    | {
          onSelected: (file: File) => void
          accept: string
          multiple?: false
      }
    | {
          onSelected: (file: File[]) => void
          accept: string
          multiple: true
      }

function useFileSelector({ onSelected, accept, multiple }: useFileSelectorProps) {
    return () => {
        const fileInput = document.createElement('input')
        fileInput.type = 'file'
        fileInput.accept = accept
        fileInput.multiple = multiple || false
        fileInput.onchange = () => {
            if (multiple) {
                ;(onSelected as (file: File[]) => void)(Array.from(fileInput.files || []) as File[])
            } else {
                ;(onSelected as (file: File) => void)(fileInput.files![0])
            }
        }
        fileInput.click()
    }
}
export default useFileSelector
