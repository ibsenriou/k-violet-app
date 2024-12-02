import { ReactNode, useCallback, useRef, useState } from 'react'
import StepperContext, { EventListener, StepItem } from './StepperContext'
import { FieldValues, UseFormReturn } from 'react-hook-form'

const StepperProvider = ({ children }: { children: ReactNode }) => {
    const [activeStep, setActiveStep] = useState(0)
    const [stepItems, setStepItems] = useState<StepItem[]>([])

    const listnersRef = useRef<{ event: EventListener; fn: () => void }[]>([])

    const currentFormHandlerRef = useRef<UseFormReturn<FieldValues> | null>(null)
    currentFormHandlerRef.current = stepItems[activeStep]?.formProvider || null

    const activeStepRef = useRef(activeStep)
    activeStepRef.current = activeStep

    const stepItemsRef = useRef(stepItems)
    stepItemsRef.current = stepItems

    const trigger = useCallback((event: EventListener) => {
        listnersRef.current.forEach(f => {
            if (f.event === event) {
                f.fn()
            }
        })
    }, [])

    const nextStep = useCallback(async () => {
        const beforeNextFn = stepItemsRef.current[activeStepRef.current]?.beforeNext
        const nextStep =
            activeStepRef.current === stepItemsRef.current.length - 1 ? (i: number) => i : (i: number) => i + 1
        if (currentFormHandlerRef.current?.handleSubmit) {
            currentFormHandlerRef.current.handleSubmit(async () => {
                if (beforeNextFn) {
                    await beforeNextFn()
                }
                setActiveStep(nextStep)
            })()
        } else {
            if (beforeNextFn) {
                await beforeNextFn()
            }
            setActiveStep(nextStep)
        }

        trigger(activeStepRef.current === stepItemsRef.current.length - 1 ? 'onFinish' : 'onNext')
    }, [])

    const prevStep = useCallback(() => {
        if (activeStepRef.current === 0) {
            trigger('onCancel')
        } else {
            trigger('onPrev')
            setActiveStep(activeStep => activeStep - 1)
        }
    }, [])

    const reset = useCallback(() => setActiveStep(0), [])

    const on = (event: EventListener, fn: () => void) => {
        listnersRef.current.push({ event, fn })
        return () => {
            listnersRef.current = listnersRef.current.filter(f => f.fn !== fn)
        }
    }

    return (
        <StepperContext.Provider
            value={{ activeStep, setActiveStep, nextStep, prevStep, reset, setStepItems, stepItems, on }}
        >
            {children}
        </StepperContext.Provider>
    )
}

export default StepperProvider
