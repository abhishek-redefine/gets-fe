import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import FormNavigation from './FormNavigation';
import { Step, StepLabel, Stepper, StepIndicator } from '@mui/material';

const MultiStepForm = ({ children, initialValues, onSubmit,isValidate,cancelBtn }) => {
    const [stepNumber, setStepNumber] = useState(0);
    const steps = React.Children.toArray(children);

    const [snapshot, setSnapshot] = useState(initialValues);

    const step = steps[stepNumber];
    const totalSteps = steps.length;
    const isLastStep = stepNumber === totalSteps - 1;

    const next = (values) => {
        console.log("Next btn clicked")
        setSnapshot(values);
        setStepNumber(stepNumber + 1);
    }

    const previous = (values) => {
        setSnapshot(values);
        setStepNumber(stepNumber - 1);
    }

    const handleSubmit = async (values, actions) => {
        var response = false;
        if (step.props.onSubmit) {
            response = await step.props.onSubmit(values);
            console.log(response);
        }
        if (isLastStep) {
            console.log("Last step")
            return onSubmit(values, actions);
        } else {
            console.log("entered in else state");
            if (response) {
                actions.setTouched({});
                next(values);
            }
        }
    }

    return (
        <div>
            <Formik
                initialValues={snapshot}
                onSubmit={handleSubmit}
                validationSchema={step.props.validationSchema}
            >{(formik) => <Form onSubmit={formik.handleSubmit}>
                <Stepper activeStep={stepNumber} alternativeLabel>
                    {steps.map(currentStep => {
                        const label = currentStep.props.stepName

                        return <Step key={label} sx={{
                            "& .MuiStepLabel-root .Mui-completed": {
                                color: "black"
                            },
                            "& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel": {
                                color: "black"
                            },
                            "& .MuiStepLabel-root .Mui-active": {
                                color: "red"
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
                    onBackClick={() => previous(formik.values)}
                    isValidate={isValidate}
                    cancelBtn={cancelBtn}
                    />
            </Form>}
            </Formik>
        </div>
    )
}

export default MultiStepForm

export const FormStep = ({ stepName = '', children }) => children;
