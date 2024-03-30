import OfficeService from '@/services/office.service';
import { getFormattedLabel } from '@/utils/utils';
import React, { useEffect, useState } from 'react';
import { toggleToast } from '@/redux/company.slice';
import { useDispatch } from 'react-redux';
import ComplianceService from '@/services/compliance.service';
import { object, string, date, tra } from 'yup';
import TextInputField from '@/components/multistepForm/TextInputField';
import MultiStepForm, { FormStep } from '@/components/multistepForm/MultiStepForm';
import SelectInputField from '../multistepForm/SelectInputField';
import FileInputField from '../multistepForm/FileInputField';
import DateInputField from '../multistepForm/DateInputField';
import { Button,FormControl,Autocomplete,TextField } from '@mui/material';
import IframeComponent from '../iframe/Iframe';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const validationSchemaStepOne = object({
    name: string().required('Driver Name is required'),
    mobile: string()
        .matches(/^[0-9]+$/, "Driver Mobile Number must be numeric")
        .min(10, 'Driver Mobile Number must be exactly 10 numbers')
        .max(10, 'Driver Mobile Number must be exactly 10 numbers'),
    dob: string()
        .required()
        .test('is-over-18', 'You must be at least 18 years old', value => {
            if (!value) return false; // If value is not provided, return false
            const today = new Date();
            const birthDate = new Date(value);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age >= 18;
        })
        .test('is-under-120', 'Age cannot be greater than 120', value => {
            if (!value) return false; // If value is not provided, return false
            const today = new Date();
            const birthDate = new Date(value);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age <= 120;
        }),
    gender: string().required('Gender is required'),
    officeId: string().required('Office ID is required'),
    // vendorName: string().required('Vendor Name is required'),
    licenseNo: string().required('License No is required')
        .min(16, 'License No must be exactly 16 alphanumeric including space')
        .max(16, 'License No must be exactly 16 alphanumeric including space'),
    licenseExpiry: string().required('License Expiry is required'),
    altMobile: string()
        .matches(/^[0-9]+$/, "Alternate Mobile Number must be numeric")
        .min(10, 'Alternate Mobile Number must be exactly 10 numbers')
        .max(10, 'Alternate Mobile Number must be exactly 10 numbers'),
    address: string().required('Address is required'),
    aadharId: string()
        .matches(/^[0-9]+$/, "Aadhar ID must be numeric")
        .min(12, 'Aadhar ID must be exactly 12 numbers')
        .max(12, 'Aadhar ID must be exactly 12 numbers'),
    panNo: string().required('Pan No is required')
        .min(10, 'Pan No must be exactly 10 alphanumeric')
        .max(10, 'Pan No must be exactly 10 alphanumeric'),
    email: string().required('Email is required').email('Email is not in correct format'),
    medicalFitnessDate : string().required("enter a valid date"),
    policeVerificationDate : string().required("enter a valid date"),
    bgvDate : string().required("enter a valid date"),
    ddTrainingDate : string().required("enter a valid date"),
});

const validationSchemaStepTwo = object({
    licenseUrl: string().required('License is required'),
    photoUrl: string().required('Photo is required')
});

const validationSchemaStepThree = object({
    photoUrl: string().required('Photo is required')
});

const validationSchemaStepFour = object({
    bgvUrl: string().required('BGV is required')
});

const validationSchemaStepFive = object({
    policeVerificationUrl: string().required('Police Verification is required')
});

const validationSchemaStepSix = object({
    badgeUrl: string().required('Badge is required')
});

const validationSchemaStepSeven = object({
    undertakingUrl: string().required('Undertaking is required')
});

const validationSchemaStepEight = object({
    driverTrainingCertUrl: string().required('Driver Training Certificate is required')
});

const validationSchemaStepNine = object({
    medicalCertUrl: string().required('Medical Certificate is required')
});

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    height: 600
};
const styleForErrorMessage={
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    height: 100,
    p: 3
}

const AddNewDriver = ({ EditDriverData, SetAddDriverOpen }) => {
    const dispatch = useDispatch();

    const [genderList, setGenderList] = useState([]);
    const [officeList, setOfficeList] = useState([]);
    const [driverId, setDriverId] = useState(EditDriverData ? EditDriverData.id : null)
    const [uploadFlag,setUploadFlag] = useState(false);
    const [searchVendor,setSearchVendor] = useState([]);
    const [openSearchVendor, setOpenSearchVendor] = useState(false);
    const [vendorName,setVendorName] = useState("");

    const [documentUrl,setDocumentUrl] = useState();
    const [documentTitle,setDocumentTitle] = useState();
    const [uploadDocumentValidation,setUploadDocumentValidation] = useState(false);
    const [uploadCount,setUploadCount] = useState(0);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [message,setMessage] = useState("");
    const [uniqueModal,setUniqueModal] = useState(false);
    const handleShow = () => setUniqueModal(true);
    const handleHide = () => setUniqueModal(false);

    const [dlFieldName,setDlFieldName] = useState();
    const [dlFileName,setDlFileName] = useState("");
    const [photoFieldName,setPhotoFieldName] = useState();
    const [photoFileName,setPhotoFileName] = useState("");

    const [undertakingFieldName,setUndertakingFieldName] = useState();
    const [undertakingFileName,setUndertakingFileName] = useState("");
    const [badgeFieldName,setBadgeFieldName] = useState();
    const [badgeFileName,setBadgeFileName] = useState("");

    const [bgvFieldName,setBgvFieldName] = useState();
    const [bgvFileName,setBgvFileName] = useState("");
    const [dtcFieldName,setDtcFieldName] = useState();
    const [dtcFileName,setDtcFileName] = useState("");

    const [pvFieldName,setPvFieldName] = useState();
    const [pvFileName,setPvFileName] = useState("");
    const [medicalFieldName,setMedicalFieldName] = useState();
    const [medicalFileName,setMedicalPhotoFileName] = useState("");

    const [initialValues, setInitialValues] = useState({
        "name": "",
        "mobile": "",
        "dob": "",
        "gender": "",
        "officeId": "",
        "vendorName": "",
        "licenseNo": "",
        "licenseExpiry": "",
        "altMobile": "",
        "address": "",
        "aadharId": "",
        "panNo": "",
        "email": "",
        "remarks": "",
        "licenseUrl": "",
        "photoUrl": "",
        "bgvUrl": "",
        "policeVerificationUrl": "",
        "badgeUrl": "",
        "undertakingUrl": "",
        "driverTrainingCertUrl": "",
        "medicalCertUrl": "",
        "role": "DRIVER",
        "enabled": true,
        // "ehsDoneBy": "Sultan",
        // "ehsDoneAt": "2024-03-13",
        "complianceStatus": "NEW",
        "ehsStatus": "PENDING",
        "medicalFitnessDate" : "",
        "policeVerificationDate" : "",
        "bgvDate" : "",
        "ddTrainingDate" : ""
    });

    const addNewDriverDetailsSubmit = async (values) => {
        console.log('addNewDriverDetailsSubmit', values)
        console.log("Hello>>>>>>", vendorName)
        try {
            if (EditDriverData?.id) {
                values.id = driverId;
                values.vendorName = vendorName;
                if(vendorName === ""){
                    alert("please enter vendor");
                    return;
                }
                const response = await ComplianceService.updateDriver({ "driver": values });
                if (response.status === 200) {
                    setDriverId(response.data.driver.id);
                    dispatch(toggleToast({ message: 'Driver details updated successfully!', type: 'success' }));
                    return true;
                } else if (response.status === 500) {
                    dispatch(toggleToast({ message: 'Driver details not updated. Please try again after some time.', type: 'error' }));
                    return false;
                }
            } else {
                if(vendorName === ""){
                    alert("Please select a Vendor");
                    return ;
                }
                values.vendorName = vendorName;
                const response = await ComplianceService.createDriver({ "driver": values });
                if (response.status === 200) {
                    setDriverId(response.data.driver.id);
                    setUploadFlag(true);
                    dispatch(toggleToast({ message: 'Driver details added successfully!', type: 'success' }));
                    return true;
                } else if (response.status === 500) {
                    dispatch(toggleToast({ message: 'Driver details not added. Please try again after some time.', type: 'error' }));
                    return false;
                }
            }
        } catch (e) {
            if(e.response.status ===  409){
                var message = e.response.data.message;
                if(checkUniqueConstraint(message,"username")){
                    setMessage('This license is already in use');
                    handleShow();
                }
                else if(checkUniqueConstraint(message,"email")){
                    setMessage('This email is already in use');
                    handleShow();
                }
                else if(checkUniqueConstraint(message,"'mobile'")){
                    setMessage('This mobile is already in use');
                    handleShow();
                }
                else if(checkUniqueConstraint(message,"aadhar_id")){
                    setMessage('This adhaar is already in use');
                    handleShow();
                }
                else if(checkUniqueConstraint(message,"'alt_mobile'")){
                    setMessage('This alternate mobile is already in use');
                    handleShow();
                }
            }
        }
    }

    function checkUniqueConstraint (message,key){
        var result = message.search(key);
        return result != -1 ? true : false;
    }

    const completeNewDriverFormSubmit = async () => {
        try {
            dispatch(toggleToast({ message: EditDriverData ? 'Driver details edited successfully' : 'Driver details added successfully!', type: 'success' }));
            SetAddDriverOpen(false);
        } catch (e) {
        }
    }

    const searchForVendor = async(e) =>{
        try {
            if (e.target.value) {
                const response = await ComplianceService.searchVendor(e.target.value);
                const { data } = response || {};
                setSearchVendor(data);
            } else {
                setSearchVendor([]);
            }
        } catch (e) {
            console.error(e);
        }
    }

    const onChangeHandler = (newValue, name, key) => {
        console.log("on change handler", newValue);
        var allValues = {...initialValues}
        console.log(allValues);
        allValues.vendorName = newValue?.vendorName;
        console.log(allValues);
        setInitialValues(allValues);
        console.log(initialValues);
        setVendorName(newValue?.vendorName);
    };

    const uploadDocumentFormSubmit = async (id, role, documentToUpload, data) => {
        try {
            var formData = new FormData()
            formData.append('file', data);
            const response = await ComplianceService.documentUpload(id, role, documentToUpload, formData);
            if (response.status === 200) {
                if(documentToUpload === "/LICENSE_CERTIFICATE"){
                    setUploadCount(uploadCount + 1);
                    EditDriverData.licenseUrl = response.data.driver.licenseUrl;
                }
                else if(documentToUpload === "/DRIVER_PHOTO"){
                    setUploadCount(uploadCount + 1);
                    EditDriverData.photoUrl = response.data.driver.photoUrl;
                }
                else if(documentToUpload === "/BGV_CERTIFICATE"){
                    EditDriverData.bgvUrl = response.data.driver.bgvUrl;
                }
                else if(documentToUpload === "/POLICE_VERIFICATION_CERTIFICATE"){
                    EditDriverData.policeVerificationUrl = response.data.driver.policeVerificationUrl;
                }
                else if(documentToUpload === "/BADGE_CERTIFICATE"){
                    EditDriverData.badgeUrl = response.data.driver.badgeUrl;
                }
                else if(documentToUpload === "/UNDERTAKING_CERTIFICATE"){
                    EditDriverData.undertakingUrl = response.data.driver.undertakingUrl;
                }
                else if(documentToUpload === "/TRAINING_CERTIFICATE"){
                    EditDriverData.driverTrainingCertUrl = response.data.driver.driverTrainingCertUrl;
                }
                else if(documentToUpload === "/DRIVER_MEDICAL_CERTIFICATE"){
                    EditDriverData.medicalCertUrl = response.data.driver.medicalCertUrl;
                }
                dispatch(toggleToast({ message: 'Data uploaded successfully!', type: 'success' }));
                return true;
            } else if (response.status === 500) {
                dispatch(toggleToast({ message: 'Data not uploaded. Please try again after some time!', type: 'error' }));
                return false;
            }
        } catch (e) {
        }
    }

    const initializer = async () => {
        var officeResponse;
        var genderResponse;

        await Promise.allSettled([
            officeResponse = await OfficeService.getAllOffices(),
            genderResponse = await ComplianceService.getMasterData('Gender')
        ]);

        const { data } = officeResponse || {};
        const { clientOfficeDTO } = data || {};

        var OfficeList = []
        clientOfficeDTO.map((item) => {
            OfficeList.push({
                value: item.officeId,
                displayName: getFormattedLabel(item.officeId) + ', ' + item.address
            })
        });
        setOfficeList(OfficeList);
        setGenderList(genderResponse.data);
    };

    const cancelHandler = () =>{
        dispatch(toggleToast({ message: 'Process is cancelled', type: 'error' }));
        SetAddDriverOpen(false);
    }

    useEffect(()=>{
        if(driverId && uploadFlag){
            EditDriverData.licenseUrl = "";
            EditDriverData.photoUrl = "";
            EditDriverData.bgvUrl = "";
            EditDriverData.policeVerificationUrl = "";
            EditDriverData.badgeUrl = "";
            EditDriverData.undertakingUrl = "";
            EditDriverData.driverTrainingCertUrl = "";
            EditDriverData.medicalCertUrl = "";
        }
    },[driverId])

    useEffect(() => {
        if(SetAddDriverOpen) initializer();
        console.log("condition check>>>>>>>>>>",EditDriverData?.licenseUrl && EditDriverData.licenseUrl != "" )        
        if(EditDriverData?.id){
            var documentCount = 0;
            if(EditDriverData?.licenseUrl != ""){
                documentCount++;
            }
            if(EditDriverData.photoUrl != ""){
                documentCount++;
            }
            setUploadCount(documentCount);
        }
    }, []);

    useEffect(()=>{
        console.log(uploadCount);
        if(uploadCount >= 2){
            setUploadDocumentValidation(true);
        }
    },[uploadCount])

    useState(() => {
        if (EditDriverData?.id) {
            let newEditInfo = Object.assign(initialValues, EditDriverData);
            setInitialValues(newEditInfo);
        }
    }, [EditDriverData]);

    return (
        <div>
            <MultiStepForm 
                initialValues={initialValues}
                onSubmit={async () => {
                    const response = await ComplianceService.changeStatusDriver(driverId);
                    if (response.status === 200) {
                        completeNewDriverFormSubmit();
                    }
                }}
                isValidate={uploadDocumentValidation}
                cancelBtn={cancelHandler}
            >
                <FormStep
                    stepName="Driver Details"
                    onSubmit={(values) => {
                        return addNewDriverDetailsSubmit(values);
                    }}
                    validationSchema={validationSchemaStepOne}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextInputField
                            name="name"
                            label="Driver Name" />
                        <TextInputField
                            name="mobile"
                            label="Driver Mobile No" />
                        <DateInputField
                            name="dob"
                            label="DOB" />
                        <SelectInputField
                            name="gender"
                            label="Gender"
                            genderList={genderList} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <SelectInputField
                            name="officeId"
                            label="Office ID"
                            genderList={officeList} />
                        <div className='form-control-input'>
                            <FormControl variant="outlined">
                                <Autocomplete
                                    disablePortal
                                    id="search-vendor"
                                    options={searchVendor}
                                    autoComplete
                                    open={openSearchVendor}
                                    onOpen={() => {
                                        setOpenSearchVendor(true);
                                    }}
                                    onClose={() => {
                                        setOpenSearchVendor(false);
                                    }}
                                    onChange={(e, val) => onChangeHandler(val, "Vendor", "vendorId")}
                                    getOptionKey={(vendor) => vendor.vendorId}
                                    getOptionLabel={(vendor) => vendor.vendorName}
                                    freeSolo
                                    name="Vendor"
                                    renderInput={(params) => <TextField {...params} label="Search Vendor Name" onChange={searchForVendor} />}
                                />
                            </FormControl>
                        </div>
                        <TextInputField
                            name="licenseNo"
                            label="License No" />
                        <DateInputField
                            name="licenseExpiry"
                            label="License Expiry" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextInputField
                            name="altMobile"
                            label="Alternate Mobile Number" />
                        <TextInputField
                            name="address"
                            label="Address" />
                        <TextInputField
                            name="aadharId"
                            label="Aadhar ID" />
                        <TextInputField
                            name="panNo"
                            label="Pan No" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextInputField
                            name="email"
                            label="Email" />
                        <TextInputField
                            name="remarks"
                            label="Remarks" />
                        <DateInputField
                            name="medicalFitnessDate"
                            label="Medical Fitness Date" />
                        <DateInputField
                            name="policeVerificationDate"
                            label="Police Verification Date" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <DateInputField
                            name="bgvDate"
                            label="BGV Date" />
                        <DateInputField
                            name="ddTrainingDate"
                            label="Driving Training Date" />
                    </div>
                </FormStep>
                <FormStep
                    stepName="Upload Documents"
                    validationSchema={validationSchemaStepTwo}
                >
                    <div style={{display: 'grid',gridTemplateColumns: '1fr 1fr',gap:'20px'}}>
                        <div className='column'>
                            <div>
                                <div style={{display: 'flex',alignItems: 'center',justifyContent: 'start'}}>
                                    <FileInputField
                                        name="licenseUrl"
                                        label="License (required)"
                                        filledValue={setDlFieldName}
                                        fileName={dlFileName} 
                                    />
                                    <button 
                                        type='button'
                                        disabled={dlFieldName?  false : true}
                                        onClick={()=>uploadDocumentFormSubmit('/' + driverId, '/DRIVER', '/LICENSE_CERTIFICATE', dlFieldName)} 
                                        style={{width: '20%',marginRight: 0,marginLeft:0}} 
                                        className='btn btn-primary'
                                    >
                                        Upload
                                    </button>
                                    {
                                        EditDriverData?.licenseUrl && EditDriverData.licenseUrl !== "" &&
                                        <button
                                            type='button'
                                            onClick={()=>{
                                                setDocumentUrl(EditDriverData.licenseUrl.replace("gets-dev.",""));
                                                handleOpen();
                                            }}
                                            style={{width: '20%',marginRight: 0,marginLeft:20,padding:'15px'}} 
                                            className='btn btn-secondary    '
                                        >
                                            View
                                        </button>
                                    }
                                </div>
                            </div>
                            <div>
                                <div style={{display: 'flex',alignItems: 'center',justifyContent: 'start'}}>
                                    <FileInputField
                                        name="undertakingUrl"
                                        label="Undertaking (optional)" 
                                        filledValue={setUndertakingFieldName}
                                        fileName={undertakingFileName}
                                    />
                                    <button 
                                        type='button'
                                        disabled={undertakingFieldName?  false : true}
                                        onClick={()=>uploadDocumentFormSubmit('/' + driverId, '/DRIVER', '/UNDERTAKING_CERTIFICATE', undertakingFieldName)} 
                                        style={{width: '20%',marginRight: 0,marginLeft:0}} 
                                        className='btn btn-primary'
                                    >
                                        Upload
                                    </button>
                                    {
                                        EditDriverData?.undertakingUrl && EditDriverData.undertakingUrl !== "" &&
                                        <button
                                            type='button'
                                            onClick={()=>{
                                                setDocumentUrl(EditDriverData?.undertakingUrl.replace("gets-dev.",""));
                                                handleOpen();
                                            }}
                                            style={{width: '20%',marginRight: 0,marginLeft:20,padding:'15px'}} 
                                            className='btn btn-secondary    '
                                        >
                                            View
                                        </button>
                                    }
                                </div>
                            </div>
                            <div>
                                <div style={{display: 'flex',alignItems: 'center',justifyContent: 'start'}}>
                                    <FileInputField
                                        name="bgvUrl"
                                        label="BGV (optional)" 
                                        filledValue={setBgvFieldName}
                                        fileName={bgvFileName}
                                        />
                                    <button 
                                        type='button'
                                        disabled={bgvFieldName?  false : true}
                                        onClick={()=>uploadDocumentFormSubmit('/' + driverId, '/DRIVER', '/BGV_CERTIFICATE', bgvFieldName)} 
                                        style={{width: '20%',marginRight: 0,marginLeft:0}} 
                                        className='btn btn-primary'
                                    >
                                        Upload
                                    </button>
                                    {
                                        EditDriverData?.bgvUrl && EditDriverData.bgvUrl !== "" &&
                                        <button
                                            type='button'
                                            onClick={()=>{
                                                setDocumentUrl(EditDriverData?.bgvUrl.replace("gets-dev.",""));
                                                handleOpen();
                                            }}
                                            style={{width: '20%',marginRight: 0,marginLeft:20,padding:'15px'}} 
                                            className='btn btn-secondary    '
                                        >
                                            View
                                        </button>
                                    }
                                </div>
                            </div>
                            <div>
                                <div style={{display: 'flex',alignItems: 'center',justifyContent: 'start'}}>
                                    <FileInputField
                                        name="policeVerificationUrl"
                                        label="Police Verification (optional)" 
                                        filledValue={setPvFieldName}
                                        fileName={pvFileName}
                                        />
                                    <button 
                                        type='button'
                                        disabled={pvFieldName?  false : true}
                                        onClick={()=>uploadDocumentFormSubmit('/' + driverId, '/DRIVER', '/POLICE_VERIFICATION_CERTIFICATE', pvFieldName)} 
                                        style={{width: '20%',marginRight: 0,marginLeft:0}} 
                                        className='btn btn-primary'
                                    >
                                        Upload
                                    </button>
                                    {
                                        EditDriverData?.policeVerificationUrl && EditDriverData.policeVerificationUrl !== "" &&
                                        <button
                                            type='button'
                                            onClick={()=>{
                                                setDocumentUrl(EditDriverData?.policeVerificationUrl.replace("gets-dev.",""));
                                                handleOpen();
                                            }}
                                            style={{width: '20%',marginRight: 0,marginLeft:20,padding:'15px'}} 
                                            className='btn btn-secondary    '
                                        >
                                            View
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='column'>
                            <div>
                                <div style={{display: 'flex',alignItems: 'center',justifyContent: 'start'}}>
                                    <FileInputField
                                        name="photoUrl"
                                        label="Photo (required)" 
                                        filledValue={setPhotoFieldName}
                                        fileName={photoFileName}
                                        />
                                    <button 
                                        type='button'
                                        disabled={photoFieldName?  false : true}
                                        onClick={()=>uploadDocumentFormSubmit('/' + driverId, '/DRIVER', '/DRIVER_PHOTO', photoFieldName)} 
                                        style={{width: '20%',marginRight: 0,marginLeft:0}} 
                                        className='btn btn-primary'
                                    >
                                        Upload
                                    </button>
                                    {
                                        EditDriverData?.photoUrl && EditDriverData.photoUrl !== "" &&
                                        <button
                                            type='button'
                                            onClick={()=>{
                                                setDocumentUrl(EditDriverData?.photoUrl.replace("gets-dev.",""));
                                                handleOpen();
                                            }}
                                            style={{width: '20%',marginRight: 0,marginLeft:20,padding:'15px'}} 
                                            className='btn btn-secondary    '
                                        >
                                            View
                                        </button>
                                    }
                                </div>
                            </div>
                            <div>
                                <div style={{display: 'flex',alignItems: 'center',justifyContent: 'start'}}>
                                    <FileInputField
                                        name="badgeUrl"
                                        label="Badge (optional)" 
                                        filledValue={setBadgeFieldName}
                                        fileName={badgeFileName}
                                        />
                                    <button 
                                        type='button'
                                        disabled={badgeFieldName?  false : true}
                                        onClick={()=>uploadDocumentFormSubmit('/' + driverId, '/DRIVER', '/BADGE_CERTIFICATE', badgeFieldName)} 
                                        style={{width: '20%',marginRight: 0,marginLeft:0}} 
                                        className='btn btn-primary'
                                    >
                                        Upload
                                    </button>
                                    {
                                        EditDriverData?.badgeUrl && EditDriverData.badgeUrl !== "" &&
                                        <button
                                            type='button'
                                            onClick={()=>{
                                                setDocumentUrl(EditDriverData?.badgeUrl.replace("gets-dev.",""));
                                                handleOpen();
                                            }}
                                            style={{width: '20%',marginRight: 0,marginLeft:20,padding:'15px'}} 
                                            className='btn btn-secondary    '
                                        >
                                            View
                                        </button>
                                    }
                                </div>
                            </div>
                            <div>
                                <div style={{display: 'flex',alignItems: 'center',justifyContent: 'start'}}>
                                    <FileInputField
                                        name="driverTrainingCertUrl"
                                        label="Driver Training Certificate (optional)" 
                                        filledValue={setDtcFieldName}
                                        fileName={dtcFileName}
                                        />
                                    <button 
                                        type='button'
                                        disabled={dtcFieldName?  false : true}
                                        onClick={(values)=>uploadDocumentFormSubmit('/' + driverId, '/DRIVER', '/TRAINING_CERTIFICATE', dtcFieldName)} 
                                        style={{width: '20%',marginRight: 0,marginLeft:0}} 
                                        className='btn btn-primary'
                                    >
                                        Upload
                                    </button>
                                    {
                                        EditDriverData?.driverTrainingCertUrl && EditDriverData.driverTrainingCertUrl !== "" &&
                                        <button
                                            type='button'
                                            onClick={()=>{
                                                setDocumentUrl(EditDriverData?.driverTrainingCertUrl.replace("gets-dev.",""));
                                                handleOpen();
                                            }}
                                            style={{width: '20%',marginRight: 0,marginLeft:20,padding:'15px'}} 
                                            className='btn btn-secondary    '
                                        >
                                            View
                                        </button>
                                    }
                                </div>
                            </div>
                            <div>
                                <div style={{display: 'flex',alignItems: 'center',justifyContent: 'start'}}>
                                    <FileInputField
                                        name="medicalCertUrl"
                                        label="Medical Certificate (optional)" 
                                        filledValue={setMedicalFieldName}
                                        fileName={medicalFileName}
                                        />
                                    <button 
                                        type='button'
                                        disabled={medicalFieldName?  false : true}
                                        onClick={()=>uploadDocumentFormSubmit('/' + driverId, '/DRIVER', '/DRIVER_MEDICAL_CERTIFICATE', medicalFieldName)} 
                                        style={{width: '20%',marginRight: 0,marginLeft:0}} 
                                        className='btn btn-primary'
                                    >
                                        Upload
                                    </button>
                                    {
                                        EditDriverData?.medicalCertUrl && EditDriverData.medicalCertUrl !== "" &&
                                        <button
                                            type='button'
                                            onClick={()=>{
                                                setDocumentUrl(EditDriverData?.medicalCertUrl.replace("gets-dev.",""));
                                                handleOpen();
                                            }}
                                            style={{width: '20%',marginRight: 0,marginLeft:20,padding:'15px'}} 
                                            className='btn btn-secondary    '
                                        >
                                            View
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>    
                </FormStep>
            </MultiStepForm>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <IframeComponent url={documentUrl} title={documentTitle} />
                </Box>
            </Modal>
            <Modal
                open={uniqueModal}
                onClose={handleHide}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleForErrorMessage}>
                    <div style={{height: '100%'}}>
                        <p style={{fontWeight: 600,marginBottom:5}}>Form Submit Error:</p>
                        <p>{message}</p>
                    </div>
                </Box>
            </Modal>
        </div >
    )
}

export default AddNewDriver;