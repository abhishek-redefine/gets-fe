import OfficeService from '@/services/office.service';
import { getFormattedLabel } from '@/utils/utils';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from "formik";
import { validationSchema } from './office-mapping/validationSchema';
import { toggleToast } from '@/redux/company.slice';
import LoaderComponent from '../loader';

const AddOfficeMapping = ({
    onUserSuccess
}) => {

    const [initialValues, setInitialValues] = useState({
        primaryOfficeId: "",
        secondaryOfficeId: []
    });
    const [loading, setLoading] = useState(false);
    
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            let allValues = {
                primaryOfficeId: values.primaryOfficeId,
                secondaryOfficeId: values.secondaryOfficeId.toString()
            };
            try {
                setLoading(true);
                // await new Promise((resolve) => setTimeout(resolve, 5000));
                await OfficeService.createOfficeMapping({officeMappingDTO: {...initialValues, ...allValues}});
                dispatch(toggleToast({ message: 'Employee updated successfully!', type: 'success' }));
                onUserSuccess(true);
            } catch (e) {
                console.error(e);
                dispatch(toggleToast({ message: e?.response?.data?.message || 'Error adding employee, please try again later!', type: 'error' }));
            } finally {
                setLoading(false);
            }
        }
    });
    const { errors, touched, values, handleChange, handleSubmit } = formik;

    const dispatch = useDispatch();
    const [offices, setOffice] = useState([]);    

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
            <h4 className='pageSubHeading'>Add Mapping</h4>
            <div className='addUpdateFormContainer'>

                <div className='officeMappingContainer'>
                    <div className='formControlContainer'>
                        <div className='form-control-input'>
                            <FormControl required fullWidth>
                                <InputLabel id="primary-office-label">Primary Office</InputLabel>
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
                    <div className='formControlContainer'>
                        {values?.primaryOfficeId && <div className='form-control-input'>
                            <FormControl required fullWidth style={{width: "350px"}}>
                                <InputLabel id="primary-office-label">Secondary Office</InputLabel>
                                <Select
                                    labelId="primary-office-label"
                                    id="secondaryOfficeId"
                                    multiple
                                    value={values.secondaryOfficeId}
                                    error={touched.secondaryOfficeId && Boolean(errors.secondaryOfficeId)}
                                    name="secondaryOfficeId"
                                    label="Secondary Office"
                                    onChange={handleChange}
                                >
                                    {!!offices?.length && offices.map((office, idx) => (
                                        <MenuItem key={idx} value={office.officeId}>{getFormattedLabel(office.officeId)}, {office.address}</MenuItem>
                                    ))}
                                </Select>
                                {touched.secondaryOfficeId && errors.secondaryOfficeId && <FormHelperText className='errorHelperText'>{errors.secondaryOfficeId}</FormHelperText>}
                            </FormControl>
                        </div>}
                    </div>
                </div>
                <div className='addBtnContainer'>
                    <div>

                    </div>
                    <div>
                        <button onClick={onUserSuccess} className='btn btn-secondary'>Back</button>
                        <button onClick={handleSubmit} className='btn btn-primary'>Add Mapping</button>
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

export default AddOfficeMapping;