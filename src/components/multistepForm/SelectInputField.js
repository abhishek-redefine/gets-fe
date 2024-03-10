import React from 'react';
import { useField } from 'formik';
import { FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField } from '@mui/material';

const SelectInputField = ({ label, genderList, ...props }) => {
    const [field, meta] = useField(props);

    return (
        <div className='form-control-input'>
            <FormControl required fullWidth>
                <InputLabel>{label}</InputLabel>
                <Select
                    label={label}
                    {...field}
                    {...props}
                    error={meta.touched && Boolean(meta.error)}
                    helperText={meta.touched && meta.error}
                >
                    {
                        genderList.map((item, idx) => (
                            <MenuItem key={idx} value={item.value}>{item.displayName}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl >
        </div>
    )
}

export default SelectInputField
