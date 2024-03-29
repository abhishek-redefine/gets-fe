import { MASTER_DATA_TYPES } from '@/constants/app.constants.';
import { setMasterData } from '@/redux/master.slice';
import MasterDataService from '@/services/masterdata.service';
import OfficeService from '@/services/office.service';
import { getFormattedLabel } from '@/utils/utils';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from "formik";
import { validationSchema } from './escort/validationSchema';
import { toggleToast } from '@/redux/company.slice';

const AddEscort = ({
    onUserSuccess,
    editEmployeeData
}) => {

    const [initialValues, setInitialValues] = useState({
        name: "",
        escortId: "",
        mobile: "",
        alternateMobile: "",
        gender: "",
        officeIds: [],
        address: "",
        email: ""
    });

    useState(() => {
        if (editEmployeeData?.id) {
            let newEditInfo = Object.assign(initialValues, editEmployeeData);
            setInitialValues(newEditInfo);
        }
    }, [editEmployeeData]);

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            let allValues = {...values};
            Object.keys(allValues).forEach((objKey) => {
                if (allValues[objKey] === null || allValues[objKey] === "") {
                    delete allValues[objKey];
                }
            });
            try {
                if (initialValues?.id) {
                    await OfficeService.updateEscort({escort: {...initialValues, ...allValues}});
                    dispatch(toggleToast({ message: 'Escort updated successfully!', type: 'success' }));
                } else {
                    await OfficeService.createEscort({escort: allValues});
                    dispatch(toggleToast({ message: 'Escort added successfully!', type: 'success' }));
                }
                onUserSuccess(true);
            } catch (e) {
                console.error(e);
                dispatch(toggleToast({ message: e?.response?.data?.message || 'Error adding escort, please try again later!', type: 'error' }));
            }
        }
    });

    const { errors, touched, values, handleChange, handleSubmit, handleReset } = formik;

    const { Gender: gender } = useSelector((state) => state.master);
    const dispatch = useDispatch();
    const [offices, setOffice] = useState([]);    

    const fetchMasterData = async (type) => {
        try {
            const response = await MasterDataService.getMasterData(type);
            const { data } = response || {};
            if (data?.length) {
                dispatch(setMasterData({data, type}));
            }
        } catch (e) {

        }
    };

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
        if (!gender?.length) {
            fetchMasterData(MASTER_DATA_TYPES.GENDER);
        }
        fetchAllOffices();
    }, []);

    return (
        <div>
            <h4 className='pageSubHeading'>{editEmployeeData?.id ? 'Edit' : 'Add'} Escort</h4>
            <div className='addUpdateFormContainer'>
                <div>
                    <div className='form-control-input'>
                        <TextField 
                        error={touched.escortId && Boolean(errors.escortId)}
                        helperText={touched.escortId && errors.empId} onChange={handleChange}
                        required id="escortId" name="escortId" value={values.escortId} label="Escort ID" variant="outlined" />
                    </div>
                    <div className='form-control-input'>
                            <TextField error={touched.name && Boolean(errors.name)} onChange={handleChange}
                            helperText={touched.name && errors.name} required id="name" name="name"
                            label="Name" variant="outlined"  value={values.name} />
                    </div>
                    <div className='form-control-input'>
                        {!!gender?.length && <FormControl required fullWidth>
                            <InputLabel id="gender-label">Gender</InputLabel>
                            <Select
                                labelId="gender-label"
                                id="gender"
                                name="gender"
                                value={values.gender}
                                error={touched.gender && Boolean(errors.gender)}
                                label="Gender"
                                onChange={handleChange}
                            >
                                {gender.map((g, idx) => (
                                    <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                ))}
                            </Select>
                            {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
                        </FormControl>}
                    </div>
                    <div className='form-control-input'>
                        <TextField 
                        value={values.email}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email} onChange={handleChange}
                        required id="email" name="email" label="Email" variant="outlined" />
                    </div>
                </div>
                <div>
                    <div className='form-control-input'>
                        <TextField
                        value={values.mobile}
                        error={touched.mobile && Boolean(errors.mobile)}
                        helperText={touched.mobile && errors.mobile}
                        name="mobile" onChange={handleChange}
                        required id="mobile" label="Mobile No" variant="outlined" />
                    </div>
                    <div className='form-control-input'>
                        <TextField required
                        value={values.alternateMobile} onChange={handleChange}
                        error={touched.alternateMobile && Boolean(errors.alternateMobile)}
                        helperText={touched.alternateMobile && errors.alternateMobile}
                        name="alternateMobile" id="alternateMobile" label="Alternate Mobile No" variant="outlined" />
                    </div>
                    <div className='form-control-input'>
                        <FormControl required fullWidth>
                            <InputLabel id="primary-office-label">Primary Office</InputLabel>
                            <Select
                                style={{width: "250px"}}
                                labelId="primary-office-label"
                                id="officeIds"
                                multiple
                                value={values.officeIds}
                                error={touched.officeIds && Boolean(errors.officeIds)}
                                name="officeIds"
                                label="Primary Office"
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
                        value={values.address} onChange={handleChange}
                        error={touched.address && Boolean(errors.address)}
                        helperText={touched.address && errors.address}
                        name="address" required id="address" label="Address" variant="outlined" />
                    </div>
                </div>
                <div className='addBtnContainer'>
                    <div>
                        <button onClick={handleReset} className='btn btn-secondary'>Reset</button>
                    </div>
                    <div>
                        <button onClick={onUserSuccess} className='btn btn-secondary'>Back</button>
                        <button onClick={handleSubmit} className='btn btn-primary'>{editEmployeeData?.id ? 'Update' : 'Create'} Escort</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddEscort;