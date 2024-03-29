import { Button } from '@mui/material';
import React from 'react';

const FormNavigation = (props) => {
    return (
            <div className='addBtnContainer' style={{ justifyContent: 'right' }}>
                <button type='button' className='btn btn-secondary' onClick={props.cancelBtn}>Cancel</button>
                {props.hasPrevious && <button className='btn btn-secondary' onClick={props.onBackClick}>Back</button>}
                <button type='submit' className='btn btn-primary' disabled={!props.isValidate && props.isLastStep} onClick={props.onSubmit}>
                    {props.isLastStep ? 'Submit' : 'Next'}
                </button>
            </div>

    )
}

export default FormNavigation
