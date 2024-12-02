function useFileDownloader() {
    function download(file: File): void
    function download(url: string): void
    function download(fileOrUrl: File | string): void {
        if (fileOrUrl instanceof File) {
            const url = URL.createObjectURL(fileOrUrl)
            const a = document.createElement('a')
            a.href = url
            a.download = fileOrUrl.name
            a.click()
            URL.revokeObjectURL(url)
        } else {
            const a = document.createElement('a')
            a.href = fileOrUrl
            a.download = ''
            a.click()
        }
    }

    return download
}

export default useFileDownloader
