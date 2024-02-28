import { MASTER_DATA_TYPES } from '@/constants/app.constants.';
import { setMasterData } from '@/redux/master.slice';
import MasterDataService from '@/services/masterdata.service';
import OfficeService from '@/services/office.service';
import dayjs, { Dayjs } from 'dayjs';
import RoleService from '@/services/role.service';
import { getFormattedLabel } from '@/utils/utils';
import { FormControl, FormControlLabel, RadioGroup, Radio, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from "formik";
import { validationSchema } from './admin/validationSchema';
import { toggleToast } from '@/redux/company.slice';

const CutoffForNoShow = ({
    roleType,
    onUserSuccess,
    editEmployeeData
}) => {

    const [initialValues, setInitialValues] = useState({
        name: "",
        mobile: "",
        alternateMobile: "",
        gender: "",
        primaryOfficeId: "",
        secondaryOfficeId: "",
        address: "",
        email: "",
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
            let allValues = { ...values };
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
                    await OfficeService.updateAdmin({ adminUser: { ...initialValues, ...allValues } });
                    dispatch(toggleToast({ message: 'Admin updated successfully!', type: 'success' }));
                } else {
                    await OfficeService.createAdmin({ adminUser: allValues });
                    dispatch(toggleToast({ message: 'Admin added successfully!', type: 'success' }));
                }
                onUserSuccess(true);
            } catch (e) {
                console.error(e);
                dispatch(toggleToast({ message: e?.response?.data?.message || 'Error adding admin, please try again later!', type: 'error' }));
            }
        }
    });

    const { errors, touched, values, handleChange, handleSubmit } = formik;

    console.log("err", errors);

    const { Gender: gender, TransportType: transportType, WeekDay: weekdays } = useSelector((state) => state.master);
    const dispatch = useDispatch();
    const [roles, setRoles] = useState([]);
    const [offices, setOffice] = useState([]);
    const [value, setValue] = useState(dayjs('2022-04-17'));

    const fetchMasterData = async (type) => {
        try {
            const response = await MasterDataService.getMasterData(type);
            const { data } = response || {};
            if (data?.length) {
                dispatch(setMasterData({ data, type }));
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

    return (
        <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex' }}>
                <div style={{ width: '100%', padding: '20px', background: 'white', fontWeight: '600', fontSize: '20px' }}>
                    Manage cutoff for No-show Booking
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
                    </div>
                    <div>
                        <div className='form-control-input'>
                            <FormControl required fullWidth>
                                <InputLabel id="primary-office-label">Shift Type</InputLabel>
                                <Select
                                    labelId="primary-office-label"
                                    id="primaryOfficeId"
                                    value={values.primaryOfficeId}
                                    error={touched.primaryOfficeId && Boolean(errors.primaryOfficeId)}
                                    name="primaryOfficeId"
                                    label="Primary Office"
                                    onChange={handleChange}
                                >
                                    {!!offices?.length && offices.map((office, idx) => (
                                        <MenuItem key={idx} value={office.officeId}>{getFormattedLabel(office.officeId)}, {office.address}</MenuItem>
                                    ))}
                                </Select>
                                {touched.primaryOfficeId && errors.primaryOfficeId && <FormHelperText className='errorHelperText'>{errors.primaryOfficeId}</FormHelperText>}
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
                    </div>
                    <div>
                        <div className='form-control-input'>
                            <FormControl required fullWidth>
                                <InputLabel id="primary-office-label">Shift Time</InputLabel>
                                <Select
                                    labelId="primary-office-label"
                                    id="primaryOfficeId"
                                    value={values.primaryOfficeId}
                                    error={touched.primaryOfficeId && Boolean(errors.primaryOfficeId)}
                                    name="primaryOfficeId"
                                    label="Primary Office"
                                    onChange={handleChange}
                                >
                                    {!!offices?.length && offices.map((office, idx) => (
                                        <MenuItem key={idx} value={office.officeId}>{getFormattedLabel(office.officeId)}, {office.address}</MenuItem>
                                    ))}
                                </Select>
                                {touched.primaryOfficeId && errors.primaryOfficeId && <FormHelperText className='errorHelperText'>{errors.primaryOfficeId}</FormHelperText>}
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
                                    error={touched.gender && Boolean(errors.gender)}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                                {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
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
                                    error={touched.gender && Boolean(errors.gender)}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                                {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
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
                                    error={touched.gender && Boolean(errors.gender)}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                                {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
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
                                    error={touched.gender && Boolean(errors.gender)}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                                {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
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
                                    error={touched.gender && Boolean(errors.gender)}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                                {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
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
                                    error={touched.gender && Boolean(errors.gender)}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                                {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
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
                                    error={touched.gender && Boolean(errors.gender)}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                                {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
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
                                    error={touched.gender && Boolean(errors.gender)}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                                {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
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
                                    error={touched.gender && Boolean(errors.gender)}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                                {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
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
                                    error={touched.gender && Boolean(errors.gender)}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                                {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
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
                                    error={touched.gender && Boolean(errors.gender)}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                                {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
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
                                    error={touched.gender && Boolean(errors.gender)}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                                {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
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
                                    error={touched.gender && Boolean(errors.gender)}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                                {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
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
                                    error={touched.gender && Boolean(errors.gender)}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                                {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
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
                                    error={touched.gender && Boolean(errors.gender)}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                                {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
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
                                    error={touched.gender && Boolean(errors.gender)}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                                {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
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
                                    error={touched.gender && Boolean(errors.gender)}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                                {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
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
                                    error={touched.gender && Boolean(errors.gender)}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                                {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
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
                                    error={touched.gender && Boolean(errors.gender)}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                                {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
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
                                    error={touched.gender && Boolean(errors.gender)}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                                {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
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
                                    error={touched.gender && Boolean(errors.gender)}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                                {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
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
                                    error={touched.gender && Boolean(errors.gender)}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                                {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
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
                                    error={touched.gender && Boolean(errors.gender)}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                                {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
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
                                    error={touched.gender && Boolean(errors.gender)}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                                {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
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
                                    error={touched.gender && Boolean(errors.gender)}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                                {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
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
                                    error={touched.gender && Boolean(errors.gender)}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                                {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
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
                                    error={touched.gender && Boolean(errors.gender)}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                                {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
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
                                    error={touched.gender && Boolean(errors.gender)}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    {gender.map((g, idx) => (
                                        <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                    ))}
                                </Select>
                                {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
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

export default CutoffForNoShow;