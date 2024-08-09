import OfficeService from '@/services/office.service';
import { getFormattedLabel } from '@/utils/utils';
import { Autocomplete, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Radio, RadioGroup, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from "formik";
import * as yup from "yup";
import ComplianceService from '@/services/compliance.service';

export const validationSchema = yup.object({
    officeId: yup.string("Enter Office Id").required("Enter Office Id"),
    penaltyCategory: yup.string("Enter Penalty Category").required("Enter Penalty Category"),
    slaCategory: yup.string("Enter Sla Category").required("Enter Sla Category"),
    penaltyName: yup.string("Enter Penalty Name").required("Enter Penalty Name"),
    penaltyAmount: yup.string("Enter Penalty Amount").required("Enter Penalty Amount"),
    penaltyType: yup.string("Enter Penalty Type").required("Enter Penalty Type"),
    penaltyActionRequired: yup.string("Enter Penalty Action Required").required("Enter Penalty Action Required")
});

const AddPenalty = ({ EditPenaltyData, isAddPenalty }) => {
    const [initialValues, setInitialValues] = useState({
        officeId: "",
        penaltyCategory: "",
        slaCategory: "",
        penaltyName: "",
        penaltyAmount: "",
        penaltyType: "",
        penaltyActionRequired: ""
    });

    useState(() => {
        if (EditPenaltyData?.id) {
            let newEditInfo = Object.assign(initialValues, EditPenaltyData);
            setInitialValues(newEditInfo);
        }
    }, [EditPenaltyData]);

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                if (EditPenaltyData.id) {
                    values.id = EditPenaltyData.id;
                    const response = await ComplianceService.updatePenalty({ "penalty": values });
                    console.log(response.status);
                    isAddPenalty();
                } else {
                    const response = await ComplianceService.createPenalty({ "penalty": values })
                    console.log(response.status);
                    isAddPenalty();
                }
            } catch (err) {
                console.log(err);
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
            <h4 className='pageSubHeading'>{EditPenaltyData?.id ? 'Edit' : 'Add'} Penalty</h4>
            <div className='addUpdateFormContainer'>
                <div>
                    <div className='form-control-input'>
                        <FormControl required fullWidth>
                            <InputLabel id="officeId">Office ID</InputLabel>
                            <Select
                                labelId="officeId"
                                id="officeId"
                                value={values.officeId}
                                error={touched.officeId && Boolean(errors.officeId)}
                                name="officeId"
                                label="Office ID"
                                onChange={handleChange}
                            >
                                {!!offices?.length && offices.map((office, idx) => (
                                    <MenuItem key={idx} value={office.officeId}>{getFormattedLabel(office.officeId)}, {office.address}</MenuItem>
                                ))}
                            </Select>
                            {touched.officeId && errors.officeId && <FormHelperText className='errorHelperText'>{errors.officeId}</FormHelperText>}
                        </FormControl>
                    </div>
                    <div className='form-control-input'>
                        <TextField
                            error={touched.penaltyCategory && Boolean(errors.penaltyCategory)}
                            helperText={touched.penaltyCategory && errors.penaltyCategory} onChange={handleChange}
                            required id="penaltyCategory" name="penaltyCategory" value={values.penaltyCategory} label="Penalty Category" variant="outlined" />
                    </div>
                    <div className='form-control-input'>
                        <TextField
                            error={touched.slaCategory && Boolean(errors.slaCategory)}
                            helperText={touched.slaCategory && errors.slaCategory} onChange={handleChange}
                            required id="slaCategory" name="slaCategory" value={values.slaCategory} label="SLA Category" variant="outlined" />
                    </div>
                    <div className='form-control-input'>
                        <TextField
                            error={touched.penaltyType && Boolean(errors.penaltyType)}
                            helperText={touched.penaltyType && errors.penaltyType} onChange={handleChange}
                            required id="penaltyType" name="penaltyType" value={values.penaltyType} label="Penalty Type" variant="outlined" />
                    </div>
                    <div className='form-control-input'>
                        <TextField
                            error={touched.penaltyName && Boolean(errors.penaltyName)}
                            helperText={touched.penaltyName && errors.penaltyName} onChange={handleChange}
                            required id="penaltyName" name="penaltyName" value={values.penaltyName} label="Penalty Name" variant="outlined" />
                    </div>
                    <div className='form-control-input'>
                        <TextField
                            error={touched.penaltyAmount && Boolean(errors.penaltyAmount)}
                            helperText={touched.penaltyAmount && errors.penaltyAmount} onChange={handleChange}
                            required id="penaltyAmount" name="penaltyAmount" value={values.penaltyAmount} label="Penalty Amount" variant="outlined" />
                    </div>
                </div>
                <div>
                    <div className='form-control-input'>
                        <FormControl>
                            <FormLabel id="adhoc-booking-req">Penalty Action Required</FormLabel>
                            <RadioGroup
                                style={{ flexDirection: "row" }}
                                aria-labelledby="adhoc-booking-req"
                                value={values.penaltyActionRequired}
                                error={touched.penaltyActionRequired && Boolean(errors.penaltyActionRequired)}
                                name="penaltyActionRequired"
                                onChange={handleChange}
                            >
                                <FormControlLabel value={'No Action'} control={<Radio />} label={"No Action"} />
                                <FormControlLabel value={'Suspend'} control={<Radio />} label={"Suspend"} />
                                <FormControlLabel value={'Terminate'} control={<Radio />} label={"Terminate"} />
                                <FormControlLabel value={'Terminate and Blacklist'} control={<Radio />} label={"Terminate and Blacklist"} />
                            </RadioGroup>
                        </FormControl>
                    </div>
                </div>
                <div className='addBtnContainer'>
                    <div>
                        <button onClick={handleReset} className='btn btn-secondary'>Reset</button>
                    </div>
                    <div>
                        <button onClick={()=>isAddPenalty()} className='btn btn-secondary'>Back</button>
                        <button onClick={handleSubmit} className='btn btn-primary'>{EditPenaltyData?.id ? 'Update' : 'Create'} Penalty</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddPenalty;