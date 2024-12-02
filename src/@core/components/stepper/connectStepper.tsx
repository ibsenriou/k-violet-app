import { ComponentProps, JSXElementConstructor, createElement } from 'react'
import StepperProvider from './StepperProvider'

export default function connectStepper<C extends JSXElementConstructor<any>>(component: C): C {
    return ((props: ComponentProps<C>) => {
        return <StepperProvider>{createElement(component, { ...props })}</StepperProvider>
    }) as C
}
