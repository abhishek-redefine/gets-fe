import { MASTER_DATA_TYPES } from '@/constants/app.constants.';
import { setMasterData } from '@/redux/master.slice';
import MasterDataService from '@/services/masterdata.service';
import OfficeService from '@/services/office.service';
import RoleService from '@/services/role.service';
import { getFormattedLabel } from '@/utils/utils';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from "formik";
import { validationSchema } from './admin/validationSchema';
import { toggleToast } from '@/redux/company.slice';

const AddAdmin = ({
    roleType,
    onUserSuccess,
    editEmployeeData
}) => {

    const [initialValues, setInitialValues] = useState({
        name: "",
        mobile: "",
        alternateMobile: "",
        gender: "",
        officeIds: [],
        address: "",
        email: "",
        roles: []
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
                    await OfficeService.updateAdmin({adminUser: {...initialValues, ...allValues}});
                    dispatch(toggleToast({ message: 'Admin updated successfully!', type: 'success' }));
                } else {
                    await OfficeService.createAdmin({adminUser: allValues});
                    dispatch(toggleToast({ message: 'Admin added successfully!', type: 'success' }));
                }
                onUserSuccess(true);
                reset();
            } catch (e) {
                console.error(e);
                dispatch(toggleToast({ message: e?.response?.data?.message || 'Error adding admin, please try again later!', type: 'error' }));
            }
        }
    });

    const { errors, touched, values, handleChange, handleSubmit, handleReset } = formik;

    const { Gender: gender, TransportType: transportType, WeekDay: weekdays } = useSelector((state) => state.master);
    const dispatch = useDispatch();
    const [roles, setRoles] = useState([]);
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

    const getAllRolesByType = async () => {
        try {
            const response = await RoleService.getRolesByType(roleType);
            const { data } = response || {};
            setRoles(data);
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
        if (!transportType?.length) {
            fetchMasterData(MASTER_DATA_TYPES.TRANSPORT_TYPE);
        }
        if (!weekdays?.length) {
            fetchMasterData(MASTER_DATA_TYPES.WEEKDAY);
        }
        getAllRolesByType();
        fetchAllOffices();
    }, []);

    const reset = () => {
        setInitialValues({
            name: "",
            mobile: "",
            alternateMobile: "",
            gender: "",
            officeIds: [],
            address: "",
            email: "",
            roles: []
        });        
    };

    const onGoBack = () => {
        reset();
        onUserSuccess();
    };

    return (
        <div>
            <h4 className='pageSubHeading'>{editEmployeeData?.id ? 'Edit' : 'Add'} Admin</h4>
            <div className='addUpdateFormContainer'>
                <div>
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
                    <div className='form-control-input'>
                        <FormControl required fullWidth>
                            <InputLabel id="admin-role">Admin Role</InputLabel>
                            <Select
                                style={{width: "250px"}}
                                labelId="admin-role"
                                id="roles"
                                multiple
                                value={values.roles}
                                error={touched.roles && Boolean(errors.roles)}
                                name="roles"
                                label="Admin Role"
                                onChange={handleChange}
                            >
                                {!!roles?.length && roles.map((role, idx) => (
                                    <MenuItem key={idx} value={role.roleName}>{role.displayName}</MenuItem>
                                ))}
                            </Select>
                            {touched.roles && errors.roles && <FormHelperText className='errorHelperText'>{errors.roles}</FormHelperText>}
                        </FormControl>
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
                                value={values.officeIds}
                                error={touched.officeIds && Boolean(errors.officeIds)}
                                name="officeIds"
                                label="Primary Office"
                                multiple
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
                        <button onClick={onGoBack} className='btn btn-secondary'>Back</button>
                        <button type='submit' onClick={handleSubmit} className='btn btn-primary'>{editEmployeeData?.id ? 'Update' : 'Create'} Admin</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddAdmin;