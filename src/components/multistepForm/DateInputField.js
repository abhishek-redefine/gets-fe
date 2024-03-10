import React from 'react';
import { useField, useFormikContext } from 'formik';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FormHelperText } from '@mui/material';
import moment from 'moment';
import { DATE_FORMAT } from '@/constants/app.constants.';

const DateInputField = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    const { setFieldValue } = useFormikContext();

    return (
        <div className='form-control-input'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker', 'DatePicker']}>
                    <DatePicker
                        label={label}
                        {...field}
                        {...props}
                        value={meta.value ? dayjs(meta.value) : dayjs(new Date())}
                        onChange={newValue => {
                            setFieldValue(field.name, moment(newValue)._i.format(DATE_FORMAT));
                        }}
                        onError={meta.touched && Boolean(meta.error)}
                    />
                </DemoContainer>
            </LocalizationProvider>
            {meta.touched && meta.error && <FormHelperText className='errorHelperText'>{meta.error}</FormHelperText>}
        </div>
    )
}

export default DateInputField
