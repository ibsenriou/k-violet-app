import React, { useRef } from 'react'
import { Editor, IAllProps } from '@tinymce/tinymce-react'

type InitParams = {
    contentSelector?: string
    toobarSelector?: string
}

type EditorOptions = IAllProps['init']

const InitModeConfig: { [key: string]: (initParams: InitParams) => EditorOptions } = {
    full: () => ({
        menubar: 'file edit view insert format tools table',
        plugins:
            'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion',
        toolbar:
            'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl'
    }),
    inline: (initParams: InitParams) =>
        ({
            selector: initParams.contentSelector,
            menubar: false,
            plugins:
                'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion',
            toolbar:
                'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl',
            toolbar_persist: true,
            toolbar_mode: 'floating',
            toolbar_sticky: true,
            toolbar_location: 'bottom',
            fixed_toolbar_container: initParams.toobarSelector
        } as EditorOptions)
}

type InitModeConfig = typeof InitModeConfig

type TextEditorProps = {
    mode: keyof InitModeConfig
    initialValue?: string
    onChange?: (content: string) => void
} & InitParams

export default function TextEditor({ mode, initialValue, onChange, ...initParams }: TextEditorProps) {
    const editorRef = useRef<Editor>(null)

    return (
        <Editor
            apiKey='mokux68ab8ezq1cqytmidfofspy4hxa3v1xv694fijpqh3pz'
            init={InitModeConfig[mode](initParams) as IAllProps['init']}
            initialValue={initialValue}
            onChange={e => onChange?.(e.target.getContent())}
            ref={editorRef}
            onInit={() => {
                editorRef.current?.editor?.container?.style?.setProperty?.('height', '100%')
            }}
        />
    )
}
