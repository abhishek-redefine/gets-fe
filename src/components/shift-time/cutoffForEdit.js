import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ShiftService from '@/services/shift.service';
import { useDispatch } from 'react-redux';
import { toggleToast } from '@/redux/company.slice';

const CutoffForEdit = ({
    editEmployeeData,
    SetForEdit
}) => {
    const dropDownValues = {
        "Monday": [
            { value: 'Yes' },
            { value: 'No' }
        ],
        "Tuesday": [
            { value: 'Yes' },
            { value: 'No' }
        ],
        "Wednesday": [
            { value: 'Yes' },
            { value: 'No' }
        ],
        "Thursday": [
            { value: 'Yes' },
            { value: 'No' }
        ],
        "Friday": [
            { value: 'Yes' },
            { value: 'No' }
        ],
        "Saturday": [
            { value: 'Yes' },
            { value: 'No' }
        ],
        "Sunday": [
            { value: 'Yes' },
            { value: 'No' }
        ]
    };

    const dispatch = useDispatch();

    const [formValues, setFormValues] = useState({
        officeIds: '',
        shiftType: '',
        transportTypes: '',
        shiftTime: ''
    });
    const [formValuesList, setFormValuesList] = useState({
        officeIds: [],
        shiftType: [],
        transportTypes: [],
        shiftTime: []
    });
    const [finalSelectedData, setFinalSelectedData] = useState({})
    const [listData, setListData] = useState([])
    const [dayCutoffValues, setDayCutoffValues] = useState({
        "Monday": {
            "CutoffforEmployee": 0,
            "CutoffforSpoc": 0,
            "EmployeeAvailability": "No",
            "SpocAvailability": "No"
        },
        "Tuesday": {
            "CutoffforEmployee": 0,
            "CutoffforSpoc": 0,
            "EmployeeAvailability": "No",
            "SpocAvailability": "No"
        },
        "Wednesday": {
            "CutoffforEmployee": 0,
            "CutoffforSpoc": 0,
            "EmployeeAvailability": "No",
            "SpocAvailability": "No"
        },
        "Thursday": {
            "CutoffforEmployee": 0,
            "CutoffforSpoc": 0,
            "EmployeeAvailability": "No",
            "SpocAvailability": "No"
        },
        "Friday": {
            "CutoffforEmployee": 0,
            "CutoffforSpoc": 0,
            "EmployeeAvailability": "No",
            "SpocAvailability": "No"
        },
        "Saturday": {
            "CutoffforEmployee": 0,
            "CutoffforSpoc": 0,
            "EmployeeAvailability": "No",
            "SpocAvailability": "No"
        },
        "Sunday": {
            "CutoffforEmployee": 0,
            "CutoffforSpoc": 0,
            "EmployeeAvailability": "No",
            "SpocAvailability": "No"
        }
    });

    const initializeFormValues = (data) => {
        setDayCutoffValues(JSON.parse(data[0].shiftCreateBookingAttribute));
        setFinalSelectedData(data[0]);
    }

    const cutOffForEditFormSubmit = async () => {
        var apiData = finalSelectedData
        apiData.shiftCreateBookingAttribute = JSON.stringify(dayCutoffValues)
        const response = await ShiftService.updateShift({ "shift": apiData })
        if (response.data) {
            dispatch(toggleToast({ message: 'Shift cut off for edit added successfully!', type: 'success' }));
            initializer();
            setFormValues({
                officeIds: '',
                shiftType: '',
                transportTypes: '',
                shiftTime: ''
            });
            setDayCutoffValues({
                "Monday": {
                    "CutoffforEmployee": 0,
                    "CutoffforSpoc": 0,
                    "EmployeeAvailability": "No",
                    "SpocAvailability": "No"
                },
                "Tuesday": {
                    "CutoffforEmployee": 0,
                    "CutoffforSpoc": 0,
                    "EmployeeAvailability": "No",
                    "SpocAvailability": "No"
                },
                "Wednesday": {
                    "CutoffforEmployee": 0,
                    "CutoffforSpoc": 0,
                    "EmployeeAvailability": "No",
                    "SpocAvailability": "No"
                },
                "Thursday": {
                    "CutoffforEmployee": 0,
                    "CutoffforSpoc": 0,
                    "EmployeeAvailability": "No",
                    "SpocAvailability": "No"
                },
                "Friday": {
                    "CutoffforEmployee": 0,
                    "CutoffforSpoc": 0,
                    "EmployeeAvailability": "No",
                    "SpocAvailability": "No"
                },
                "Saturday": {
                    "CutoffforEmployee": 0,
                    "CutoffforSpoc": 0,
                    "EmployeeAvailability": "No",
                    "SpocAvailability": "No"
                },
                "Sunday": {
                    "CutoffforEmployee": 0,
                    "CutoffforSpoc": 0,
                    "EmployeeAvailability": "No",
                    "SpocAvailability": "No"
                }
            });
        }

    }

    const dropDownListValuesSetFunction = (data) => {
        var FormValuesList = {
            officeIds: [],
            shiftType: [],
            transportTypes: [],
            shiftTime: []
        }

        data.map((item) => {
            if (FormValuesList.officeIds.indexOf(item.officeIds) === -1) {
                FormValuesList.officeIds.push(item.officeIds)
            }
            if (FormValuesList.shiftType.indexOf(item.shiftType) === -1) {
                FormValuesList.shiftType.push(item.shiftType)
            }
            if (FormValuesList.transportTypes.indexOf(item.transportTypes) === -1) {
                FormValuesList.transportTypes.push(item.transportTypes)
            }
            if (FormValuesList.shiftTime.indexOf(item.shiftTime) === -1) {
                FormValuesList.shiftTime.push(item.shiftTime)
            }
        })
        setFormValuesList(FormValuesList)
    }

    const initializer = async () => {
        const response = await ShiftService.getAllShiftsWOPagination();
        var data = response.data.data.filter((item) => item.enabled === true);
        dropDownListValuesSetFunction(data);
        setListData(data);
    }

    useEffect(() => {
        initializer()
    }, [])

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
                                <InputLabel id="gender-label">Office IDs</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={formValues.officeIds}
                                    label="Gender"
                                    onChange={(e) => { var data = listData.filter((item) => item.officeIds === e.target.value); dropDownListValuesSetFunction(data); setListData(data); setFormValues({ ...formValues, officeIds: e.target.value }); }}
                                >
                                    {formValuesList.officeIds.map((item, idx) => (
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
                                    onChange={(e) => { var data = listData.filter((item) => item.shiftType === e.target.value); dropDownListValuesSetFunction(data); setListData(data); setFormValues({ ...formValues, shiftType: e.target.value }); }}
                                    disabled={formValues.officeIds === ''}
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
                                    value={formValues.transportTypes}
                                    label="Gender"
                                    onChange={(e) => { var data = listData.filter((item) => item.transportTypes === e.target.value); dropDownListValuesSetFunction(data); setListData(data); setFormValues({ ...formValues, transportTypes: e.target.value }); }}
                                    disabled={formValues.shiftType === ''}
                                >
                                    {formValuesList.transportTypes.map((item, idx) => (
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
                                    onChange={(e) => { setFormValues({ ...formValues, shiftTime: e.target.value }); initializeFormValues(listData.filter((item) => item.shiftTime === e.target.value)); }}
                                    disabled={formValues.transportTypes === ''}
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
                                    value={dayCutoffValues.Monday.EmployeeAvailability}
                                    label="Gender"
                                    onChange={(event) => setDayCutoffValues({ ...dayCutoffValues, "Monday": { ...dayCutoffValues.Monday, "EmployeeAvailability": event.target.value } })}
                                    disabled={formValues.shiftTime === ''}
                                >
                                    {dropDownValues.Monday.map((item, idx) => (
                                        <MenuItem key={idx} value={item.value}>{item.value}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <TextField
                                id="outlined-controlled"
                                label=""
                                value={dayCutoffValues.Monday.CutoffforEmployee}
                                onChange={(event) => {
                                    setDayCutoffValues({ ...dayCutoffValues, "Monday": { ...dayCutoffValues.Monday, "CutoffforEmployee": event.target.value } })
                                }}
                                disabled={formValues.shiftTime === ''}
                            />
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Yes/No</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={dayCutoffValues.Monday.SpocAvailability}
                                    label="Gender"
                                    onChange={(event) => setDayCutoffValues({ ...dayCutoffValues, "Monday": { ...dayCutoffValues.Monday, "SpocAvailability": event.target.value } })}
                                    disabled={formValues.shiftTime === ''}
                                >
                                    {dropDownValues.Monday.map((item, idx) => (
                                        <MenuItem key={idx} value={item.value}>{item.value}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <TextField
                                id="outlined-controlled"
                                label=""
                                value={dayCutoffValues.Monday.CutoffforSpoc}
                                onChange={(event) => {
                                    setDayCutoffValues({ ...dayCutoffValues, "Monday": { ...dayCutoffValues.Monday, "CutoffforSpoc": event.target.value } })
                                }}
                                disabled={formValues.shiftTime === ''}
                            />
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
                                    value={dayCutoffValues.Tuesday.EmployeeAvailability}
                                    label="Gender"
                                    onChange={(event) => setDayCutoffValues({ ...dayCutoffValues, "Tuesday": { ...dayCutoffValues.Tuesday, "EmployeeAvailability": event.target.value } })}
                                    disabled={formValues.shiftTime === ''}
                                >
                                    {dropDownValues.Tuesday.map((item, idx) => (
                                        <MenuItem key={idx} value={item.value}>{item.value}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <TextField
                                id="outlined-controlled"
                                label=""
                                value={dayCutoffValues.Tuesday.CutoffforEmployee}
                                onChange={(event) => {
                                    setDayCutoffValues({ ...dayCutoffValues, "Tuesday": { ...dayCutoffValues.Tuesday, "CutoffforEmployee": event.target.value } })
                                }}
                                disabled={formValues.shiftTime === ''}
                            />
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Yes/No</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={dayCutoffValues.Tuesday.SpocAvailability}
                                    label="Gender"
                                    onChange={(event) => setDayCutoffValues({ ...dayCutoffValues, "Tuesday": { ...dayCutoffValues.Tuesday, "SpocAvailability": event.target.value } })}
                                    disabled={formValues.shiftTime === ''}
                                >
                                    {dropDownValues.Tuesday.map((item, idx) => (
                                        <MenuItem key={idx} value={item.value}>{item.value}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <TextField
                                id="outlined-controlled"
                                label=""
                                value={dayCutoffValues.Tuesday.CutoffforSpoc}
                                onChange={(event) => {
                                    setDayCutoffValues({ ...dayCutoffValues, "Tuesday": { ...dayCutoffValues.Tuesday, "CutoffforSpoc": event.target.value } })
                                }}
                                disabled={formValues.shiftTime === ''}
                            />
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
                                    value={dayCutoffValues.Wednesday.EmployeeAvailability}
                                    label="Gender"
                                    onChange={(event) => setDayCutoffValues({ ...dayCutoffValues, "Wednesday": { ...dayCutoffValues.Wednesday, "EmployeeAvailability": event.target.value } })}
                                    disabled={formValues.shiftTime === ''}
                                >
                                    {dropDownValues.Wednesday.map((item, idx) => (
                                        <MenuItem key={idx} value={item.value}>{item.value}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <TextField
                                id="outlined-controlled"
                                label=""
                                value={dayCutoffValues.Wednesday.CutoffforEmployee}
                                onChange={(event) => {
                                    setDayCutoffValues({ ...dayCutoffValues, "Wednesday": { ...dayCutoffValues.Wednesday, "CutoffforEmployee": event.target.value } })
                                }}
                                disabled={formValues.shiftTime === ''}
                            />
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Yes/No</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={dayCutoffValues.Wednesday.SpocAvailability}
                                    label="Gender"
                                    onChange={(event) => setDayCutoffValues({ ...dayCutoffValues, "Wednesday": { ...dayCutoffValues.Wednesday, "SpocAvailability": event.target.value } })}
                                    disabled={formValues.shiftTime === ''}
                                >
                                    {dropDownValues.Wednesday.map((item, idx) => (
                                        <MenuItem key={idx} value={item.value}>{item.value}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <TextField
                                id="outlined-controlled"
                                label=""
                                value={dayCutoffValues.Wednesday.CutoffforSpoc}
                                onChange={(event) => {
                                    setDayCutoffValues({ ...dayCutoffValues, "Wednesday": { ...dayCutoffValues.Wednesday, "CutoffforSpoc": event.target.value } })
                                }}
                                disabled={formValues.shiftTime === ''}
                            />
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
                                    value={dayCutoffValues.Thursday.EmployeeAvailability}
                                    label="Gender"
                                    onChange={(event) => setDayCutoffValues({ ...dayCutoffValues, "Thursday": { ...dayCutoffValues.Thursday, "EmployeeAvailability": event.target.value } })}
                                    disabled={formValues.shiftTime === ''}
                                >
                                    {dropDownValues.Thursday.map((item, idx) => (
                                        <MenuItem key={idx} value={item.value}>{item.value}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <TextField
                                id="outlined-controlled"
                                label=""
                                value={dayCutoffValues.Thursday.CutoffforEmployee}
                                onChange={(event) => {
                                    setDayCutoffValues({ ...dayCutoffValues, "Thursday": { ...dayCutoffValues.Thursday, "CutoffforEmployee": event.target.value } })
                                }}
                                disabled={formValues.shiftTime === ''}
                            />
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Yes/No</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={dayCutoffValues.Thursday.SpocAvailability}
                                    label="Gender"
                                    onChange={(event) => setDayCutoffValues({ ...dayCutoffValues, "Thursday": { ...dayCutoffValues.Thursday, "SpocAvailability": event.target.value } })}
                                    disabled={formValues.shiftTime === ''}
                                >
                                    {dropDownValues.Thursday.map((item, idx) => (
                                        <MenuItem key={idx} value={item.value}>{item.value}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <TextField
                                id="outlined-controlled"
                                label=""
                                value={dayCutoffValues.Thursday.CutoffforSpoc}
                                onChange={(event) => {
                                    setDayCutoffValues({ ...dayCutoffValues, "Thursday": { ...dayCutoffValues.Thursday, "CutoffforSpoc": event.target.value } })
                                }}
                                disabled={formValues.shiftTime === ''}
                            />
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
                                    value={dayCutoffValues.Friday.EmployeeAvailability}
                                    label="Gender"
                                    onChange={(event) => setDayCutoffValues({ ...dayCutoffValues, "Friday": { ...dayCutoffValues.Friday, "EmployeeAvailability": event.target.value } })}
                                    disabled={formValues.shiftTime === ''}
                                >
                                    {dropDownValues.Friday.map((item, idx) => (
                                        <MenuItem key={idx} value={item.value}>{item.value}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <TextField
                                id="outlined-controlled"
                                label=""
                                value={dayCutoffValues.Friday.CutoffforEmployee}
                                onChange={(event) => {
                                    setDayCutoffValues({ ...dayCutoffValues, "Friday": { ...dayCutoffValues.Friday, "CutoffforEmployee": event.target.value } })
                                }}
                                disabled={formValues.shiftTime === ''}
                            />
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Yes/No</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={dayCutoffValues.Friday.SpocAvailability}
                                    label="Gender"
                                    onChange={(event) => setDayCutoffValues({ ...dayCutoffValues, "Friday": { ...dayCutoffValues.Friday, "SpocAvailability": event.target.value } })}
                                    disabled={formValues.shiftTime === ''}
                                >
                                    {dropDownValues.Friday.map((item, idx) => (
                                        <MenuItem key={idx} value={item.value}>{item.value}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <TextField
                                id="outlined-controlled"
                                label=""
                                value={dayCutoffValues.Friday.CutoffforSpoc}
                                onChange={(event) => {
                                    setDayCutoffValues({ ...dayCutoffValues, "Friday": { ...dayCutoffValues.Friday, "CutoffforSpoc": event.target.value } })
                                }}
                                disabled={formValues.shiftTime === ''}
                            />
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
                                    value={dayCutoffValues.Saturday.EmployeeAvailability}
                                    label="Gender"
                                    onChange={(event) => setDayCutoffValues({ ...dayCutoffValues, "Saturday": { ...dayCutoffValues.Saturday, "EmployeeAvailability": event.target.value } })}
                                    disabled={formValues.shiftTime === ''}
                                >
                                    {dropDownValues.Saturday.map((item, idx) => (
                                        <MenuItem key={idx} value={item.value}>{item.value}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <TextField
                                id="outlined-controlled"
                                label=""
                                value={dayCutoffValues.Saturday.CutoffforEmployee}
                                onChange={(event) => {
                                    setDayCutoffValues({ ...dayCutoffValues, "Saturday": { ...dayCutoffValues.Saturday, "CutoffforEmployee": event.target.value } })
                                }}
                                disabled={formValues.shiftTime === ''}
                            />
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Yes/No</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={dayCutoffValues.Saturday.SpocAvailability}
                                    label="Gender"
                                    onChange={(event) => setDayCutoffValues({ ...dayCutoffValues, "Saturday": { ...dayCutoffValues.Saturday, "SpocAvailability": event.target.value } })}
                                    disabled={formValues.shiftTime === ''}
                                >
                                    {dropDownValues.Saturday.map((item, idx) => (
                                        <MenuItem key={idx} value={item.value}>{item.value}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <TextField
                                id="outlined-controlled"
                                label=""
                                value={dayCutoffValues.Saturday.CutoffforSpoc}
                                onChange={(event) => {
                                    setDayCutoffValues({ ...dayCutoffValues, "Saturday": { ...dayCutoffValues.Saturday, "CutoffforSpoc": event.target.value } })
                                }}
                                disabled={formValues.shiftTime === ''}
                            />
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
                                    value={dayCutoffValues.Sunday.EmployeeAvailability}
                                    label="Gender"
                                    onChange={(event) => setDayCutoffValues({ ...dayCutoffValues, "Sunday": { ...dayCutoffValues.Sunday, "EmployeeAvailability": event.target.value } })}
                                    disabled={formValues.shiftTime === ''}
                                >
                                    {dropDownValues.Sunday.map((item, idx) => (
                                        <MenuItem key={idx} value={item.value}>{item.value}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <TextField
                                id="outlined-controlled"
                                label=""
                                value={dayCutoffValues.Sunday.CutoffforEmployee}
                                onChange={(event) => {
                                    setDayCutoffValues({ ...dayCutoffValues, "Sunday": { ...dayCutoffValues.Sunday, "CutoffforEmployee": event.target.value } })
                                }}
                                disabled={formValues.shiftTime === ''}
                            />
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <FormControl required fullWidth>
                                <InputLabel id="gender-label">Yes/No</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={dayCutoffValues.Sunday.SpocAvailability}
                                    label="Gender"
                                    onChange={(event) => setDayCutoffValues({ ...dayCutoffValues, "Sunday": { ...dayCutoffValues.Sunday, "SpocAvailability": event.target.value } })}
                                    disabled={formValues.shiftTime === ''}
                                >
                                    {dropDownValues.Sunday.map((item, idx) => (
                                        <MenuItem key={idx} value={item.value}>{item.value}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ fontWeight: '600', margin: '20px', width: '30%' }}>
                            <TextField
                                id="outlined-controlled"
                                label=""
                                value={dayCutoffValues.Sunday.CutoffforSpoc}
                                onChange={(event) => {
                                    setDayCutoffValues({ ...dayCutoffValues, "Sunday": { ...dayCutoffValues.Sunday, "CutoffforSpoc": event.target.value } })
                                }}
                                disabled={formValues.shiftTime === ''}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className='addBtnContainer' style={{ justifyContent: 'right' }}>
                <div>
                    <button onClick={() => SetForEdit({
                        forEdit: false,
                        forCancel: false,
                        forNoShow: false
                    })} className='btn btn-secondary'>Cancel</button>
                    <button type='submit' onClick={cutOffForEditFormSubmit} className='btn btn-primary'>{editEmployeeData?.id ? 'Create' : 'Update'} </button>
                </div>
            </div>
        </div >
    );
}

export default CutoffForEdit;