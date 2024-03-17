import ComplianceService from '@/services/compliance.service';
import { getFormattedLabel } from '@/utils/utils';
import { Autocomplete, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Radio, RadioGroup, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from "formik";
import * as yup from "yup";
import OfficeService from '@/services/office.service';
import { toggleToast } from '@/redux/company.slice';

export const validationSchema = yup.object({
    officeIds: yup.string("Enter Office Id").required("Enter Office Id"),
    ehsTitle: yup.string("Enter EHS Title").required("Enter EHS Title"),
    ehsCategory: yup.string("Enter EHS Category").required("Enter EHS Category"),
    ehsMandate: yup.string("Enter EHS Mandate").required("Enter EHS Mandate"),
    ehsFrequencyType: yup.string("Enter EHS Frequency Type").required("Enter EHS Frequency Type"),
    ehsFrequency: yup.string("Enter EHS Frequency").required("Enter EHS Frequency"),
    ehsAppliedOn: yup.string("Enter EHS Applied On").required("Enter EHS Applied On"),
});

const AddEHS = ({ EditEhsData }) => {
    const [initialValues, setInitialValues] = useState({
        officeIds: "",
        ehsTitle: "",
        ehsCategory: "",
        ehsMandate: "",
        ehsFrequencyType: "",
        ehsFrequency: "",
        ehsAppliedOn: "",
        vehicleType: ""
    });

    useState(() => {
        if (EditEhsData?.id) {
            let newEditInfo = Object.assign(initialValues, EditEhsData);
            console.log(newEditInfo)
            newEditInfo.ehsAppliedOnDriver ? newEditInfo.ehsAppliedOn = "Driver" : newEditInfo.ehsAppliedOn = "Vehicle";
            newEditInfo.officeIds = newEditInfo.officeIds[0];
            setInitialValues(newEditInfo);
        }
    }, [EditEhsData]);

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            console.log(values)
            if (EditEhsData?.id) {
                values.ehsAppliedOn === "Driver" ? values.ehsAppliedOnDriver = true : values.ehsAppliedOnDriver = false;
                values.officeIds = [values.officeIds];
                const response = await ComplianceService.updateEHS({ "ehs": values })
                if (response.status === 200) {
                    dispatch(toggleToast({ message: 'EHS details updated successfully!', type: 'success' }));
                } else if (response.status === 500) {
                    dispatch(toggleToast({ message: 'EHS details not updated. Please try again later!', type: 'error' }));
                }
            } else {
                values.ehsAppliedOn === "Driver" ? values.ehsAppliedOnDriver = true : values.ehsAppliedOnDriver = false;
                values.officeIds = [values.officeIds]
                const response = await ComplianceService.createEHS({ "ehs": values })
                if (response.status === 201) {
                    dispatch(toggleToast({ message: 'EHS details added successfully!', type: 'success' }));
                } else if (response.status === 500) {
                    dispatch(toggleToast({ message: 'EHS details not added. Please try again later!', type: 'error' }));
                }
            }
        }
    });

    const { errors, touched, values, handleChange, handleSubmit, handleReset } = formik;

    const [offices, setOffice] = useState([]);
    const dispatch = useDispatch();

    const fetchAllOffices = async () => {
        try {
            const response = await OfficeService.getAllOffices();
            const { data } = response || {};
            const { clientOfficeDTO } = data || {};
            setOffice(clientOfficeDTO);
        } catch (e) {

        }
    };

    useEffect(() => {
        fetchAllOffices();
    }, []);

    return (
        <div>
            <h4 className='pageSubHeading'>{EditEhsData?.id ? 'Edit' : 'Add'} EHS</h4>
            <div className='addUpdateFormContainer'>
                <div>
                    <div className='form-control-input'>
                        <FormControl required fullWidth>
                            <InputLabel id="officeIds">Office ID</InputLabel>
                            <Select
                                labelId="officeIds"
                                id="officeIds"
                                value={values.officeIds}
                                error={touched.officeIds && Boolean(errors.officeIds)}
                                name="officeIds"
                                label="Office ID"
                                onChange={handleChange}
                            >
                                {!!offices?.length && offices.map((office, idx) => (
                                    <MenuItem key={idx} value={office.officeId}>{getFormattedLabel(office.officeId)}, {office.address}</MenuItem>
                                ))}
                            </Select>
                            {touched.officeIds && errors.officeIds && <FormHelperText className='errorHelperText'>{errors.officeIds}</FormHelperText>}
                        </FormControl>
                    </div>
                    <div className='form-control-input'>
                        <TextField
                            error={touched.ehsCategory && Boolean(errors.ehsCategory)}
                            helperText={touched.ehsCategory && errors.ehsCategory} onChange={handleChange}
                            required id="ehsCategory" name="ehsCategory" value={values.ehsCategory} label="EHS Category" variant="outlined" />
                    </div>
                    <div className='form-control-input'>
                        <TextField
                            error={touched.ehsMandate && Boolean(errors.ehsMandate)}
                            helperText={touched.ehsMandate && errors.ehsMandate} onChange={handleChange}
                            required id="ehsMandate" name="ehsMandate" value={values.ehsMandate} label="EHS Mandate" variant="outlined" />
                    </div>
                    <div className='form-control-input'>
                        <TextField
                            error={touched.ehsFrequencyType && Boolean(errors.ehsFrequencyType)}
                            helperText={touched.ehsFrequencyType && errors.ehsFrequencyType} onChange={handleChange}
                            required id="ehsFrequencyType" name="ehsFrequencyType" value={values.ehsFrequencyType} label="EHS Frequency Type" variant="outlined" />
                    </div>
                    <div className='form-control-input'>
                        <TextField
                            error={touched.ehsTitle && Boolean(errors.ehsTitle)}
                            helperText={touched.ehsTitle && errors.ehsTitle} onChange={handleChange}
                            required id="ehsTitle" name="ehsTitle" value={values.ehsTitle} label="EHS Title" variant="outlined" />
                    </div>
                    <div className='form-control-input'>
                        <TextField
                            error={touched.ehsFrequency && Boolean(errors.ehsFrequency)}
                            helperText={touched.ehsFrequency && errors.ehsFrequency} onChange={handleChange}
                            required id="ehsFrequency" name="ehsFrequency" value={values.ehsFrequency} label="EHS Frequency" variant="outlined" />
                    </div>
                </div>
                <div>
                    <div className='form-control-input'>
                        <FormControl>
                            <FormLabel id="adhoc-booking-req">EHS Applied On</FormLabel>
                            <RadioGroup
                                style={{ flexDirection: "row" }}
                                aria-labelledby="adhoc-booking-req"
                                value={values.ehsAppliedOn}
                                error={touched.ehsAppliedOn && Boolean(errors.ehsAppliedOn)}
                                name="ehsAppliedOn"
                                onChange={handleChange}
                            >
                                <FormControlLabel value={'Driver'} control={<Radio />} label={"Driver"} />
                                <FormControlLabel value={'Vehicle'} control={<Radio />} label={"Vehicle"} />
                            </RadioGroup>
                        </FormControl>
                    </div>
                </div>
                {
                    values.ehsAppliedOn === 'Vehicle' &&
                    <div>
                        <div className='form-control-input'>
                        <TextField
                            error={touched.vehicleType && Boolean(errors.vehicleType)}
                            helperText={touched.vehicleType && errors.vehicleType} onChange={handleChange}
                            required id="vehicleType" name="vehicleType" value={values.vehicleType} label="Vehicle Type" variant="outlined" />
                        </div>
                    </div>
                }
                <div className='addBtnContainer'>
                    <div>
                        <button onClick={handleReset} className='btn btn-secondary'>Reset</button>
                    </div>
                    <div>
                        <button className='btn btn-secondary'>Back</button>
                        <button type="submit" onClick={handleSubmit} className='btn btn-primary'>{EditEhsData?.id ? 'Update' : 'Create'} EHS</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddEHS;