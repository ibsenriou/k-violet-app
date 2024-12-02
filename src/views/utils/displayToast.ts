import toast from 'react-hot-toast'

/**
 *
 * @param actionResult
 * @returns void
 *
 * @description
 * This function is used to display a toast message to the user after an action is performed.
 */
export const displayToast = (actionResult: { error?: string; success?: string }) => {
    if (actionResult && actionResult.error) {
        toast.error(
            'Ocorreu um erro ao realizar a ação. Por favor, tente novamente. Caso o problema persista, favor entrar em contato com a nossa equipe de suporte.',
            {
                position: 'bottom-left',
                duration: 10000
            }
        )
    } else {
        toast.success(actionResult && actionResult.success ? actionResult.success : 'Ação realizada com sucesso!', {
            position: 'bottom-left'
        })
    }
}
