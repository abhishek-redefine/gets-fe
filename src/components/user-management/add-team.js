import { MASTER_DATA_TYPES } from '@/constants/app.constants.';
import { setMasterData } from '@/redux/master.slice';
import MasterDataService from '@/services/masterdata.service';
import OfficeService from '@/services/office.service';
import { getFormattedLabel } from '@/utils/utils';
import { Autocomplete, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, Checkbox, ListItemText } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from "formik";
import { validationSchema } from './team/validationSchema';
import { toggleToast } from '@/redux/company.slice';
import LoaderComponent from '../loader';

const AddTeam = ({
    onUserSuccess,
    editEmployeeData
}) => {

    const [initialValues, setInitialValues] = useState({
        name: "",
        officeIds: [],
        managerIds: [],
        shiftType: "",
        description: "",
        sendNotification: "",
        comment: ""        
    });

    const [loading, setLoading] = useState(false);

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
            console.log("Values",values)
            let allValues = {...values};
            console.log("click")
            Object.keys(allValues).forEach((objKey) => {
                if (allValues[objKey] === null || allValues[objKey] === "") {
                    delete allValues[objKey];
                }
            });
            // if (allValues.managerIds) {
            //     allValues.managerIds = [allValues.managerIds];
            // }
            try {
                if (initialValues?.id) {
                    setLoading(true);
                    // await new Promise((resolve) => setTimeout(resolve, 5000));
                    await OfficeService.updateTeams({team: {...initialValues, ...allValues}});
                    dispatch(toggleToast({ message: 'Team updated successfully!', type: 'success' }));
                } else {
                    setLoading(true);
                    // await new Promise((resolve) => setTimeout(resolve, 5000));
                    console.log(allValues);
                    await OfficeService.createTeams({team: allValues});
                    dispatch(toggleToast({ message: 'Team added successfully!', type: 'success' }));
                }
                onUserSuccess(true);
            } catch (e) {
                console.error(e);
                dispatch(toggleToast({ message: e?.response?.data?.message || 'Error adding team, please try again later!', type: 'error' }));
            } finally {
                setLoading(false);
            }
        }
    });

    const { errors, touched, values, handleChange, handleSubmit, handleReset } = formik;

    const { ShiftType: shiftTypes } = useSelector((state) => state.master);
    const dispatch = useDispatch();
    const [offices, setOffice] = useState([]);    
    const [openSearchRM, setOpenSearchRM] = useState(false);
    const [searchedReportingManager, setSearchedReportingManager] = useState([]);

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
        if (!shiftTypes?.length) {
            fetchMasterData(MASTER_DATA_TYPES.SHIFT_TYPE);
        }
        fetchAllOffices();
    }, []);

    const searchForRM = async (e) => {
        try {
            if (e.target.value) {
                const response = await OfficeService.searchRM(e.target.value);
                const { data } = response || {};
                setSearchedReportingManager(data);
            } else {
                setSearchedReportingManager([]);
            }
        } catch (e) {
            console.error(e);
        }
    };    

    const onChangeHandler = (newValue, name, key) => {
        
        var teamManagerList = [newValue.map((val)=> {return val.data.toString()})]
        console.log(teamManagerList,name);
        formik.setFieldValue(name, teamManagerList[0] || "");
    };

    return (
        <div>
            <h4 className='pageSubHeading'>{editEmployeeData?.id ? 'Edit' : 'Add'} Team</h4>
            <div className='addUpdateFormContainer'>
                <div>
                    <div className='form-control-input'>
                        <FormControl required fullWidth>
                            <InputLabel id="primary-office-label">Office Id</InputLabel>
                            <Select
                                style={{width: "250px"}}
                                labelId="primary-office-label"
                                id="officeIds"
                                multiple
                                value={values.officeIds}
                                error={touched.officeIds && Boolean(errors.officeIds)}
                                renderValue={(selected) => selected.join(', ')}
                                name="officeIds"
                                label="Office Id"
                                onChange={handleChange}
                            >
                                {!!offices?.length && offices.map((office, idx) => (
                                    <MenuItem key={idx} value={office.officeId}>
                                        <Checkbox checked={values.officeIds.indexOf(office.officeId) > -1} />
                                        <ListItemText primary={`${getFormattedLabel(office.officeId)}, ${office.address}`} />
                                    </MenuItem>
                                    //<MenuItem key={idx} value={office.officeId}>{getFormattedLabel(office.officeId)}, {office.address}</MenuItem>
                                ))}
                            </Select>
                            {touched.officeIds && errors.officeIds && <FormHelperText className='errorHelperText'>{errors.officeIds}</FormHelperText>}
                        </FormControl>
                    </div>
                    <div className='form-control-input'>
                            <TextField error={touched.name && Boolean(errors.name)} onChange={handleChange}
                            helperText={touched.name && errors.name} required id="name" name="name"
                            label="Team Name" variant="outlined"  value={values.name} />
                    </div>
                    {/* <div className='form-control-input'>
                        {!!shiftTypes?.length && <FormControl required fullWidth>
                            <InputLabel id="shiftType-label">Shift Type</InputLabel>
                            <Select
                                labelId="shiftType-label"
                                id="shiftType"
                                name="shiftType"
                                value={values.shiftType}
                                error={touched.shiftType && Boolean(errors.shiftType)}
                                label="Gender"
                                onChange={handleChange}
                            >
                                {shiftTypes.map((sT, idx) => (
                                    <MenuItem key={idx} value={sT.value}>{getFormattedLabel(sT.value)}</MenuItem>
                                ))}
                            </Select>
                            {touched.shiftType && errors.shiftType && <FormHelperText className='errorHelperText'>{errors.shiftType}</FormHelperText>}
                        </FormControl>}
                    </div> */}
                    <div className='form-control-input'>
                        <FormControl variant="outlined">
                            <Autocomplete
                                disablePortal
                                id="search-managerIds"
                                options={searchedReportingManager}
                                autoComplete
                                multiple
                                open={openSearchRM}
                                onOpen={() => {
                                    setOpenSearchRM(true);
                                }}
                                onClose={() => {
                                    setOpenSearchRM(false);
                                }}
                                onChange={(e, val) => onChangeHandler(val, "managerIds", "empId")}
                                getOptionKey={(rm) => rm.empId}
                                getOptionLabel={(rm) => `${rm.data}, ${rm.empId}`}
                                freeSolo
                                name="managerIds"
                                renderInput={(params) => <TextField {...params} label="Search Team Manager"  onChange={searchForRM} />}
                            />
                            {touched.managerIds && errors.managerIds && <FormHelperText className='errorHelperText'>{errors.managerIds}</FormHelperText>}
                        </FormControl>
                    </div>
                </div>
                <div>
                    <div className='form-control-input'>
                        <TextField error={touched.description && Boolean(errors.description)} onChange={handleChange}
                            helperText={touched.description && errors.description} required id="description" name="description"
                            label="Description" variant="outlined"  value={values.description} />
                    </div>
                    <div className='form-control-input'>
                        <TextField error={touched.sendNotification && Boolean(errors.sendNotification)} onChange={handleChange}
                            helperText={touched.sendNotification && errors.sendNotification} required id="sendNotification" name="sendNotification"
                            label="Send Notification" variant="outlined"  value={values.sendNotification} />
                    </div>
                    <div className='form-control-input'>
                        <TextField value={values.comment} error={touched.comment && Boolean(errors.comment)} required id="comment" name="comment"
                        helperText={touched.comment && errors.comment} onChange={handleChange} label="Comment" variant="outlined" />
                    </div>                    
                </div>
                <div className='addBtnContainer'>
                    <div>
                        <button onClick={handleReset} className='btn btn-secondary'>Reset</button>
                    </div>
                    <div>
                        <button onClick={onUserSuccess} className='btn btn-secondary'>Back</button>
                        <button type='submit' onClick={handleSubmit} className='btn btn-primary'>
                            {editEmployeeData?.id ? 'Update' : 'Create'} Team
                        </button>
                    </div>
                </div>
            </div>
            {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "fixed",
                // backgroundColor: "#000000",
                zIndex: 1,
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                opacity: 1,
                color: "#000000",
                // height: "100vh",
                // width: "100vw",
              }}
            >
              <LoaderComponent />
            </div>
            ) : (
              " "
            )}
        </div>
    );
}

export default AddTeam;