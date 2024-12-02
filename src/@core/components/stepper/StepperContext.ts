import { createContext } from 'react'
import StepMui from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import { FieldValues, UseFormHandleSubmit, UseFormReturn } from 'react-hook-form'

export type EventListener = 'onFinish' | 'onNext' | 'onPrev' | 'onCancel'

export type StepItem = {
    title: string
    children: React.ReactNode
    id: string
    stepProps?: React.ComponentProps<typeof StepMui>
    labelProps?: React.ComponentProps<typeof StepLabel>
    formProvider?: UseFormReturn<any>
    beforeNext?: () => Promise<unknown>
    handleSubmit?: UseFormHandleSubmit<FieldValues>
}

export type StepperContextProps = {
    activeStep: number
    setActiveStep: (step: number) => void
    nextStep: () => void
    prevStep: () => void
    reset: () => void
    setStepItems: (items: StepItem[]) => void
    stepItems: StepItem[]
    on: (event: EventListener, fn: () => void) => () => void
}
const StepperContext = createContext<StepperContextProps | null>(null)

export default StepperContext
