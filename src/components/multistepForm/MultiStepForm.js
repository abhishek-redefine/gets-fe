import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import FormNavigation from './FormNavigation';
import { Step, StepLabel, Stepper, StepIndicator } from '@mui/material';

const MultiStepForm = ({ children, initialValues, onSubmit }) => {
    const [stepNumber, setStepNumber] = useState(0);
    const steps = React.Children.toArray(children);

    const [snapshot, setSnapshot] = useState(initialValues);

    const step = steps[stepNumber];
    const totalSteps = steps.length;
    const isLastStep = stepNumber === totalSteps - 1;

    const next = (values) => {
        setSnapshot(values);
        setStepNumber(stepNumber + 1);
    }

    const previous = (values) => {
        setSnapshot(values);
        setStepNumber(stepNumber - 1);
    }

    const handleSubmit = async (values, actions) => {
        if (step.props.onSubmit) {
            await step.props.onSubmit(values);
        }

        if (isLastStep) {
            return onSubmit(values, actions);
        } else {
            actions.setTouched({});
            next(values);
        }
    }

    return (
        <div>
            <Formik
                initialValues={snapshot}
                onSubmit={handleSubmit}
                validationSchema={step.props.validationSchema}
            >{(formik) => <Form onSubmit={formik.handleSubmit}>
                <Stepper  activeStep={stepNumber} alternativeLabel>
                    {steps.map(currentStep => {
                        const label = currentStep.props.stepName

                        return <Step key={label}  sx={{
                            "& .MuiStepLabel-root .Mui-completed": {
                                color: "black"
                            },
                            "& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel": {
                                color: "white"
                            },
                            "& .MuiStepLabel-root .Mui-active": {
                                color: "grey"
                            },
                            "& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel": {
                                color: "black"
                            },
                            "& .MuiStepLabel-root .Mui-active .MuiStepIcon-text": {
                                fill: "white"
                            }
                        }} >
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    })
                    }
                </Stepper>
                {step}
                <FormNavigation
                    isLastStep={isLastStep}
                    hasPrevious={stepNumber > 0}
                    onBackClick={() => previous(formik.values)} />
            </Form>}
            </Formik>
        </div>
    )
}

export default MultiStepForm

export const FormStep = ({ stepName = '', children }) => children;
