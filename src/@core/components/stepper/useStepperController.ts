import { useContext, useLayoutEffect } from 'react'
import StepperContext from './StepperContext'
import { is } from 'date-fns/locale'

type useStepperControllerProps = {
    finishLabel?: string
    nextLabel?: string
    prevLabel?: string
    cancelLabel?: string
    onFinish?: () => void
    onNext?: () => void
    onPrev?: () => void
    onCancel?: () => void
    on?: (event: EventListener, fn: () => void) => () => void
}
const useStepperController = ({
    finishLabel = 'Finalizar',
    nextLabel = 'Próximo',
    prevLabel = 'Anterior',
    cancelLabel = 'Cancelar',
    onFinish,
    onNext,
    onPrev,
    onCancel
}: useStepperControllerProps = {}) => {
    const context = useContext(StepperContext)
    if (!context) {
        throw new Error('useStepperController must be used within a StepperProvider')
    }

    useLayoutEffect(() => {
        if (onFinish) {
            return context.on('onFinish', onFinish)
        }
    }, [onFinish])

    useLayoutEffect(() => {
        if (onNext) {
            return context.on('onNext', onNext)
        }
    }, [onNext])

    useLayoutEffect(() => {
        if (onPrev) {
            return context.on('onPrev', onPrev)
        }
    }, [onPrev])

    useLayoutEffect(() => {
        if (onCancel) {
            return context.on('onCancel', onCancel)
        }
    }, [onCancel])

    return {
        ...context,
        nextLabel: context.activeStep === context.stepItems.length - 1 ? finishLabel : nextLabel,
        prevLabel: context.activeStep === 0 ? cancelLabel : prevLabel,
        isLastStep: context.activeStep === context.stepItems.length - 1
    }
}

export default useStepperController
