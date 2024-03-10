import React from 'react';
import { TextField } from '@mui/material';
import { useField } from 'formik';

const TextInputField = ({ label, ...props }) => {
    const [field, meta] = useField(props);

    return (
        <div className='form-control-input'>
            <TextField
                label={label}
                {...field}
                {...props}
                error={meta.touched && Boolean(meta.error)}
                helperText={meta.touched && meta.error} />
        </div>
    )
}

export default TextInputField
