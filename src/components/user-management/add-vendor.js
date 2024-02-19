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
import { validationSchema } from './vendor/validationSchema';
import { toggleToast } from '@/redux/company.slice';

const AddVendor = ({
    roleType,
    onUserSuccess,
    editEmployeeData
}) => {

    const [initialValues, setInitialValues] = useState({
        officeId: "",
        vendorId: "",        
        name: "",
        address: "",
        gstNo: "",
        city: "",
        mob: "",
        contactPerson: "",
        contactPersonMob: "",
        email: "",
        remarks: "",
        roles: ""
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
            const role = allValues.role;
            delete allValues.role;
            if (allValues.roles) {
                allValues.roles = [allValues.roles];
            }
            Object.keys(allValues).forEach((objKey) => {
                if (allValues[objKey] === null || allValues[objKey] === "") {
                    delete allValues[objKey];
                }
            });
            try {
                if (initialValues?.id) {
                    await OfficeService.updateVendor({vendorTeamDTO: {...initialValues, ...allValues}, role});
                    dispatch(toggleToast({ message: 'Vendor updated successfully!', type: 'success' }));
                } else {
                    await OfficeService.createVendor({vendorTeamDTO: allValues, role});
                    dispatch(toggleToast({ message: 'Vendor added successfully!', type: 'success' }));
                }
                onUserSuccess(true);
            } catch (e) {
                console.error(e);
                dispatch(toggleToast({ message: e?.response?.data?.message || 'Error adding vendor, please try again later!', type: 'error' }));
            }
        }
    });

    const { errors, touched, values, handleChange, handleSubmit } = formik;


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

    console.log("error", errors);

    return (
        <div>
            <h4 className='pageSubHeading'>{editEmployeeData?.id ? 'Edit' : 'Add'} Vendor</h4>
            <div className='addUpdateFormContainer'>
                <div>
                    <div className='form-control-input'>
                            <TextField error={touched.officeId && Boolean(errors.officeId)} onChange={handleChange}
                            helperText={touched.officeId && errors.officeId} required id="officeId" name="officeId"
                            label="Office Id" variant="outlined"  value={values.officeId} />
                    </div>
                    <div className='form-control-input'>
                            <TextField error={touched.vendorId && Boolean(errors.vendorId)} onChange={handleChange}
                            helperText={touched.vendorId && errors.vendorId} required id="vendorId" name="vendorId"
                            label="Vendor Id" variant="outlined"  value={values.vendorId} />
                    </div>
                    <div className='form-control-input'>
                            <TextField error={touched.name && Boolean(errors.name)} onChange={handleChange}
                            helperText={touched.name && errors.name} required id="name" name="name"
                            label="Name" variant="outlined"  value={values.name} />
                    </div>
                    <div className='form-control-input'>
                        <FormControl required fullWidth>
                            <InputLabel id="vendor-role">Vendor Role</InputLabel>
                            <Select
                                labelId="vendor-role"
                                id="role"
                                value={values.role}
                                error={touched.role && Boolean(errors.role)}
                                name="role"
                                label="Vendor Role"
                                onChange={handleChange}
                            >
                                {!!roles?.length && roles.map((role, idx) => (
                                    <MenuItem key={idx} value={role.roleName}>{role.displayName}</MenuItem>
                                ))}
                            </Select>
                            {touched.role && errors.role && <FormHelperText className='errorHelperText'>{errors.role}</FormHelperText>}
                        </FormControl>
                    </div>
                </div>
                <div>                    
                    <div className='form-control-input'>
                        <TextField
                        value={values.mob}
                        error={touched.mob && Boolean(errors.mob)}
                        helperText={touched.mob && errors.mob}
                        name="mob" onChange={handleChange}
                        required id="mob" label="Mobile No" variant="outlined" />
                    </div>
                    <div className='form-control-input'>
                        <TextField
                        value={values.contactPerson}
                        error={touched.contactPerson && Boolean(errors.contactPerson)}
                        helperText={touched.contactPerson && errors.contactPerson}
                        name="contactPerson" onChange={handleChange}
                        required id="contactPerson" label="Contact Person" variant="outlined" />
                    </div>
                    <div className='form-control-input'>
                        <TextField
                        value={values.contactPersonMob} onChange={handleChange}
                        error={touched.contactPersonMob && Boolean(errors.contactPersonMob)}
                        helperText={touched.contactPersonMob && errors.contactPersonMob}
                        name="contactPersonMob" id="contactPersonMob" label="Contact Person Mobile No" variant="outlined" />
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
                        value={values.gstNo} required
                        error={touched.gstNo && Boolean(errors.gstNo)}
                        helperText={touched.gstNo && errors.gstNo} onChange={handleChange}
                        id="gstNo" name="gstNo" label="GST No" variant="outlined" />
                    </div>
                    <div className='form-control-input'>
                        <TextField
                        value={values.address} onChange={handleChange}
                        error={touched.address && Boolean(errors.address)}
                        helperText={touched.address && errors.address}
                        name="address" required id="address" label="Address" variant="outlined" />
                    </div>
                    <div className='form-control-input'>
                        <TextField 
                        value={values.city}
                        error={touched.city && Boolean(errors.city)}
                        helperText={touched.city && errors.city} onChange={handleChange}
                        required id="city" name="city" label="City" variant="outlined" />
                    </div>
                    <div className='form-control-input'>
                        <TextField 
                        value={values.remarks}
                        error={touched.remarks && Boolean(errors.remarks)}
                        helperText={touched.remarks && errors.remarks} onChange={handleChange}
                        id="remarks" name="remarks" label="Remarks" variant="outlined" />
                    </div>
                </div>
                <div className='addBtnContainer'>
                    <div>
                        <button className='btn btn-secondary'>Reset</button>
                    </div>
                    <div>
                        <button onClick={onUserSuccess} className='btn btn-secondary'>Back</button>
                        <button type='submit' onClick={handleSubmit} className='btn btn-primary'>{editEmployeeData?.id ? 'Update' : 'Create'} Vendor</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddVendor;