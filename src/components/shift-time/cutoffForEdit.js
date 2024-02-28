import { getFormattedLabel } from '@/utils/utils';
import { FormControl, FormControlLabel, RadioGroup, Radio, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ShiftService from '@/services/shift.service';

const CutoffForEdit = ({
    onUserSuccess,
    editEmployeeData
}) => {
    const [formValues, setFormValues] = useState({
        officeId: '',
        shiftType: '',
        transportType: '',
        shiftTime: ''
    });

    const [formValuesList, setFormValuesList] = useState({
        officeId: [],
        shiftType: [],
        transportType: [],
        shiftTime: []
    });

    const handleChange = (whatToChange) => {
        console.log(whatToChange)
    }

    const initializer = async () => {
        const response = await ShiftService.getAllShiftsWOPagination();
        console.log('CutoffForEdit', response)
    }

    useEffect(() => {
        initializer()
    })

    return (
        <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex' }}>
                <div style={{ width: '100%', padding: '20px', background: 'white', fontWeight: '600', fontSize: '20px' }}>
                    Manage cutoff for Create & Edit Booking
                </div>
            </div>
            <div style={{ display: 'flex' }}>
                <div style={{ width: '30%', padding: '20px', background: 'white', fontWeight: '600' }}>
                    Select Shift Timings For Cutoff Definition
                </div>
                <div style={{ width: '70%', padding: '20px', background: 'white', fontWeight: '600' }}>
                    Mention Cutoff For Employee and Spoc
                </div>
            </div>
            <div style={{ display: 'flex' }}>
                <div className='addUpdateFormContainer' style={{ width: '30%', marginTop: '0px', borderRight: '1px solid black', borderRadius: '0px', paddingTop: '20%' }}>
                    <div>
                        <div className='form-control-input'>
                            {<FormControl required fullWidth>
                                <InputLabel id="gender-label">Office ID</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={formValues.officeId}
                                    label="Gender"
                                    onChange={() => handleChange('officeId')}
                                >
                                    {formValuesList.officeId.map((item, idx) => (
                                        <MenuItem key={idx} value={item}>{item}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>}
                        </div>
                    </div>
                    <div>
                        <div className='form-control-input'>
                            <FormControl required fullWidth>
                                <InputLabel id="primary-office-label">Shift Type</InputLabel>
                                <Select
                                    labelId="primary-office-label"
                                    id="primaryOfficeId"
                                    value={formValues.shiftType}
                                    name="primaryOfficeId"
                                    label="Primary Office"
                                    onChange={() => handleChange('shiftType')}
                                >
                                    {formValuesList.shiftType.map((item, idx) => (
                                        <MenuItem key={idx} value={item}>{item}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div>
                        <div className='form-control-input'>
                            {<FormControl required fullWidth>
                                <InputLabel id="gender-label">Transport Type</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={formValues.transportType}
                                    label="Gender"
                                    onChange={() => handleChange('transportType')}
                                >
                                    {formValuesList.transportType.map((item, idx) => (
                                        <MenuItem key={idx} value={item}>{item}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>}
                        </div>
                    </div>
                    <div>
                        <div className='form-control-input'>
                            <FormControl required fullWidth>
                                <InputLabel id="primary-office-label">Shift Time</InputLabel>
                                <Select
                                    labelId="primary-office-label"
                                    id="primaryOfficeId"
                                    value={formValues.shiftTime}
                                    name="primaryOfficeId"
                                    label="Primary Office"
                                    onChange={() => handleChange('shiftTime')}
                                >
                                    {formValuesList.shiftTime.map((item, idx) => (
                                        <MenuItem key={idx} value={item}>{item}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                </div>
                <div style={{ width: '70%' }}>
                    <div className='addUpdateFormContainer' style={{ marginTop: '0px', display: 'flex', width: '100%', alignItems: 'center' }}>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            Day
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            Shift Visibility for Employee
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            Cutoff for Employee
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            Shift visibility for Spoc
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            Cutoff for Spoc
                        </div>
                    </div>
                    <div className='addUpdateFormContainer' style={{ marginTop: '0px', display: 'flex', width: '100%', alignItems: 'center' }}>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            Monday
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Yes/No</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Minutes</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Yes/No</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Minutes</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                    </div>
                    <div className='addUpdateFormContainer' style={{ marginTop: '0px', display: 'flex', width: '100%', alignItems: 'center' }}>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            Tuesday
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Yes/No</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Minutes</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Yes/No</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Minutes</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                    </div>
                    <div className='addUpdateFormContainer' style={{ marginTop: '0px', display: 'flex', width: '100%', alignItems: 'center' }}>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            Wednesday
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Yes/No</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Minutes</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Yes/No</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Minutes</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                    </div>
                    <div className='addUpdateFormContainer' style={{ marginTop: '0px', display: 'flex', width: '100%', alignItems: 'center' }}>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            Thursday
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Yes/No</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Minutes</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Yes/No</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Minutes</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                    </div>
                    <div className='addUpdateFormContainer' style={{ marginTop: '0px', display: 'flex', width: '100%', alignItems: 'center' }}>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            Friday
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Yes/No</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Minutes</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Yes/No</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Minutes</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                    </div>
                    <div className='addUpdateFormContainer' style={{ marginTop: '0px', display: 'flex', width: '100%', alignItems: 'center' }}>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            Saturday
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Yes/No</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Minutes</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Yes/No</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Minutes</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                    </div>
                    <div className='addUpdateFormContainer' style={{ marginTop: '0px', display: 'flex', width: '100%', alignItems: 'center' }}>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            Sunday
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Yes/No</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Minutes</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Yes/No</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Minutes</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                    </div>
                </div>





            </div>
            <div className='addBtnContainer' style={{ justifyContent: 'right' }}>
                <div>
                    <button onClick={onUserSuccess} className='btn btn-secondary'>Cancel</button>
                    <button type='submit' onClick={handleSubmit} className='btn btn-primary'>{editEmployeeData?.id ? 'Create' : 'Update'} </button>
                </div>
            </div>
        </div >
    );
}

export default CutoffForEdit;