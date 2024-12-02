import StepperComponent from './Stepper'
import Step from './Step'
import StepperContext from './StepperContext'
import useStepperController from './useStepperController'
import StepperProvider from './StepperProvider'
import connectStepper from './connectStepper'

export type StepperType = {
    Step: typeof Step
    Context: typeof StepperContext
    useController: typeof useStepperController
    Provider: typeof StepperProvider
    connect: typeof connectStepper
    Container: typeof StepperComponent
}

const Stepper: StepperType = {
    Step,
    Context: StepperContext,
    useController: useStepperController,
    Provider: StepperProvider,
    connect: connectStepper,
    Container: StepperComponent
}

export default Stepper
