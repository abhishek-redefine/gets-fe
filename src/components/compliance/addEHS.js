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
    days: yup.number("Enter no of days").required("Enter no of days"),
    ehsFrequency: yup.string("Enter EHS Frequency").required("Enter EHS Frequency"),
    ehsAppliedOn: yup.string("Enter EHS Applied On").required("Enter EHS Applied On"),
});

const AddEHS = ({ EditEhsData, SetIsAddEhs }) => {
    const [initialValues, setInitialValues] = useState({
        officeIds: "",
        ehsTitle: "",
        ehsCategory: "",
        ehsMandate: "",
        days: "",
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
            try {
                if (EditEhsData?.id) {
                    values.ehsAppliedOn === "Driver" ? values["ehsAppliedOnDriver"] = true : values["ehsAppliedOnDriver"] = false;
                    values.officeIds = [values.officeIds];
                    const response = await ComplianceService.updateEHS({ "ehs": values })
                    if (response.status === 200) {
                        dispatch(toggleToast({ message: 'EHS details updated successfully!', type: 'success' }));
                        SetIsAddEhs(false);
                    } else if (response.status === 500) {
                        dispatch(toggleToast({ message: 'EHS details not updated. Please try again later!', type: 'error' }));
                        SetIsAddEhs(false);
                    }
                } else {
                    values.ehsAppliedOn === "Driver" ? values["ehsAppliedOnDriver"] = true : values["ehsAppliedOnDriver"] = false;
                    values.officeIds = [values.officeIds]
                    const response = await ComplianceService.createEHS({ "ehs": values })
                    if (response.status === 201) {
                        dispatch(toggleToast({ message: 'EHS details added successfully!', type: 'success' }));
                        SetIsAddEhs(false);
                    } else if (response.status === 500) {
                        dispatch(toggleToast({ message: 'EHS details not added. Please try again later!', type: 'error' }));
                        SetIsAddEhs(false);
                    }
                }
            } catch (err) {
                dispatch(toggleToast({ message: 'EHS details not added. Please try again later!', type: 'error' }));
                values.officeIds = values.officeIds[0];
                console.log(err);
            }
        }
    });

    const { errors, touched, values, handleChange, handleSubmit, handleReset } = formik;

    const [offices, setOffice] = useState([]);
    const [ehsCategoryList, setEhsCategoryList] = useState([]);
    const [ehsMandate, setEhsMandate] = useState([]);
    const [ehsFrequency, setEhsFrequency] = useState([]);
    const [transportTypes, setTransportTypes] = useState([]);
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

    const fetchAllMasterData = async () => {
        try {
            const EhsCategoryResponse = await ComplianceService.getMasterData('EhsCategory');
            const EhsFrequencyResponse = await ComplianceService.getMasterData('EhsFrequency');
            const EhsMandateResponse = await ComplianceService.getMasterData('EhsMandate');
            const TransportTypeResponse = await ComplianceService.getMasterData("TransportType");
            setEhsCategoryList(EhsCategoryResponse.data);
            setEhsFrequency(EhsFrequencyResponse.data);
            setEhsMandate(EhsMandateResponse.data);
            setTransportTypes(TransportTypeResponse.data);
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchAllOffices();
        fetchAllMasterData();
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
                        <FormControl required fullWidth>
                            <InputLabel id="ehsCategoryLabel">Ehs Category</InputLabel>
                            <Select
                                labelId="ehsCategoryLabel"
                                id="ehsCategory"
                                value={values.ehsCategory}
                                error={touched.ehsCategory && Boolean(errors.ehsCategory)}
                                name="ehsCategory"
                                label="Ehs Category"
                                onChange={handleChange}
                            >
                                {!!ehsCategoryList?.length && ehsCategoryList.map((category, idx) => (
                                    <MenuItem key={idx} value={category.displayName}>{category.displayName}</MenuItem>
                                ))}
                            </Select>
                            {touched.ehsCategory && errors.ehsCategory && <FormHelperText className='errorHelperText'>{errors.ehsCategory}</FormHelperText>}
                        </FormControl>
                        {/* <TextField
                            error={touched.ehsCategory && Boolean(errors.ehsCategory)}
                            helperText={touched.ehsCategory && errors.ehsCategory} onChange={handleChange}
                            required id="ehsCategory" name="ehsCategory" value={values.ehsCategory} label="EHS Category" variant="outlined" /> */}
                    </div>
                    <div className='form-control-input'>
                        <FormControl required fullWidth>
                            <InputLabel id="ehsMandateLabel">Ehs Mandate</InputLabel>
                            <Select
                                labelId="ehsMandateLabel"
                                id="ehsMandate"
                                value={values.ehsMandate}
                                error={touched.ehsMandate && Boolean(errors.ehsMandate)}
                                name="ehsMandate"
                                label="Ehs Mandate"
                                onChange={handleChange}
                            >
                                {!!ehsMandate?.length && ehsMandate.map((category, idx) => (
                                    <MenuItem key={idx} value={category.displayName}>{category.displayName}</MenuItem>
                                ))}
                            </Select>
                            {touched.ehsMandate && errors.ehsMandate && <FormHelperText className='errorHelperText'>{errors.ehsMandate}</FormHelperText>}
                        </FormControl>
                        {/* <TextField
                            error={touched.ehsMandate && Boolean(errors.ehsMandate)}
                            helperText={touched.ehsMandate && errors.ehsMandate} onChange={handleChange}
                            required id="ehsMandate" name="ehsMandate" value={values.ehsMandate} label="EHS Mandate" variant="outlined" /> */}
                    </div>
                    <div className='form-control-input'>
                        <FormControl required fullWidth>
                            <InputLabel id="ehsFrequencyLabel">EHS Frequency Type</InputLabel>
                            <Select
                                labelId="ehsFrequencyLabel"
                                id="ehsFrequency"
                                value={values.ehsFrequency}
                                error={touched.ehsFrequency && Boolean(errors.ehsFrequencyType)}
                                name="ehsFrequency"
                                label="Ehs Frequency Type"
                                onChange={handleChange}
                            >
                                {!!ehsFrequency?.length && ehsFrequency.map((category, idx) => (
                                    <MenuItem key={idx} value={category.displayName}>{category.displayName}</MenuItem>
                                ))}
                            </Select>
                            {touched.ehsFrequency && errors.ehsFrequency && <FormHelperText className='errorHelperText'>{errors.ehsFrequency}</FormHelperText>}
                        </FormControl>
                        {/* <TextField
                            error={touched.ehsFrequencyType && Boolean(errors.ehsFrequencyType)}
                            helperText={touched.ehsFrequencyType && errors.ehsFrequencyType} onChange={handleChange}
                            required id="ehsFrequencyType" name="ehsFrequencyType" value={values.ehsFrequencyType} label="EHS Frequency Type" variant="outlined" /> */}
                    </div>
                    <div className='form-control-input'>
                        <TextField
                            error={touched.ehsTitle && Boolean(errors.ehsTitle)}
                            helperText={touched.ehsTitle && errors.ehsTitle} onChange={handleChange}
                            required id="ehsTitle" name="ehsTitle" value={values.ehsTitle} label="EHS Title" variant="outlined" />
                    </div>
                    <div className='form-control-input'>
                        <TextField
                            error={touched.days && Boolean(errors.days)}
                            helperText={touched.days && errors.days} onChange={handleChange} type="number"
                            required id="days" name="days" value={values.days} label="EHS Frequency" variant="outlined" />
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
                            <FormControl required fullWidth>
                                <InputLabel id="vehicleType-label">Vehicle Type</InputLabel>
                                <Select
                                    labelId="vehicleType-label"
                                    id="vehicleType"
                                    name="vehicleType"
                                    value={values.ehsStatus}
                                    label="vehicleType"
                                    error={touched.vehicleType && Boolean(errors.vehicleType)}
                                    helperText={touched.vehicleType && errors.vehicleType}
                                    onChange={handleChange}
                                >
                                    {transportTypes.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>
                                            {g.value}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {/* <TextField
                            error={touched.vehicleType && Boolean(errors.vehicleType)}
                            helperText={touched.vehicleType && errors.vehicleType} onChange={handleChange}
                            required id="vehicleType" name="vehicleType" value={values.vehicleType} label="Vehicle Type" variant="outlined" /> */}
                        </div>
                    </div>
                }
                <div className='addBtnContainer'>
                    <div>
                        <button onClick={handleReset} className='btn btn-secondary'>Reset</button>
                    </div>
                    <div>
                        <button onClick={() => SetIsAddEhs(false)} className='btn btn-secondary'>Back</button>
                        <button type="submit" onClick={handleSubmit} className='btn btn-primary'>{EditEhsData?.id ? 'Update' : 'Create'} EHS</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddEHS;