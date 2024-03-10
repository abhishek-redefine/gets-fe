import { Button } from '@mui/material';
import React from 'react';

const FormNavigation = (props) => {
    return (
            <div className='addBtnContainer' style={{ justifyContent: 'right' }}>
                {props.hasPrevious && <button className='btn btn-secondary' onClick={props.onBackClick}>Back</button>}
                <button type='submit' className='btn btn-primary'>
                    {props.isLastStep ? 'Submit' : 'Next'}
                </button>
            </div>

    )
}

export default FormNavigation
