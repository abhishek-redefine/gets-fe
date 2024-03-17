import React, { useState } from 'react';
import { useField, useFormikContext } from 'formik';
import { MuiFileInput } from 'mui-file-input'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { FormHelperText } from '@mui/material';

const FileInputField = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    const { setFieldValue } = useFormikContext();
    return (
        <div className='form-control-input'>
            <FormHelperText className='labelHelperText'>{label}</FormHelperText>
            <MuiFileInput
                {...field}
                {...props}
                size="small"
                variant="outlined"
                InputProps={{
                    inputProps: {
                        accept: '.pdf'
                    },
                    endAdornment: <AttachFileIcon />
                }}
                onChange={(file) => setFieldValue(field.name, file)}
                onError={meta.touched && Boolean(meta.error)}
            />
            {meta.touched && meta.error && <FormHelperText className='errorHelperText'>{meta.error}</FormHelperText>}
        </div>
    )
}

export default FileInputField