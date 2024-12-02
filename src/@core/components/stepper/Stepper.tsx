import Box from '@mui/material/Box'
import StepMui from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepperMui from '@mui/material/Stepper'
import React, { useContext, useEffect } from 'react'
import { FormProvider } from 'react-hook-form'
import StepperContext, { StepItem } from './StepperContext'
import Step from './Step'

type StepperProps = {
    items?: StepItem[]
    children?: React.ReactComponentElement<typeof Step>[]
}

const Stepper = (props: StepperProps) => {
    const context = useContext(StepperContext)
    if (!context) {
        throw new Error('useStepperController must be used within a StepperProvider')
    }

    const items =
        props.items ||
        React.Children.map(props.children, child => {
            if (!React.isValidElement(child)) {
                return null
            }
            const { title, children, stepProps, labelProps, id, formProvider, beforeNext } = child.props
            return { title, children, stepProps, labelProps, id, formProvider, beforeNext }
        }) ||
        []

    useEffect(() => {
        context.setStepItems(items)
    }, [])

    return (
        <Box display='grid' gap={8}>
            <StepperMui activeStep={context.activeStep}>
                {items.map(({ title, id, stepProps, labelProps }) => (
                    <StepMui {...stepProps} key={id}>
                        <StepLabel {...labelProps}>{title}</StepLabel>
                    </StepMui>
                ))}
            </StepperMui>
            <Box>
                {items[context.activeStep]?.formProvider ? (
                    <FormProvider {...items[context.activeStep].formProvider!}>
                        {items[context.activeStep]?.children}
                    </FormProvider>
                ) : (
                    items[context.activeStep]?.children
                )}
            </Box>
        </Box>
    )
}

export default Stepper
