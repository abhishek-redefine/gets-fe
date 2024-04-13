import ShiftService from '@/services/shift.service';
import OfficeService from '@/services/office.service';
import { getFormattedLabel } from '@/utils/utils';
import React, { useEffect, useState } from 'react';
import { toggleToast } from '@/redux/company.slice';
import { useDispatch } from 'react-redux';
import { object, string } from 'yup';
import TextInputField from '@/components/multistepForm/TextInputField';
import MultiStepForm, { FormStep } from '@/components/multistepForm/MultiStepForm';
import SelectInputField from '../multistepForm/SelectInputField';
import FileInputField from '../multistepForm/FileInputField';
import DateInputField from '../multistepForm/DateInputField';
import ComplianceService from '@/services/compliance.service';
import { Button,FormControl,Autocomplete,TextField,Select,InputLabel,MenuItem } from '@mui/material';
import IframeComponent from '../iframe/Iframe';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import MasterDataService from '@/services/masterdata.service';
import dayjs from 'dayjs';

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

const validationSchemaStepOne = object({
    vehicleId: string().required('Vehicle ID is required'),
    vehicleRegistrationNumber: string().required('Vehicle Registration No is required'),
    stickerNumber: string().required('Sticker No is required'),
    vehicleType: string().required('Vehicle Type is required'),
    vehicleOwnerName: string().required('Vehicle Owner Name is required'),
    modelYear: string().required('Model Year is required'),
    vehicleMake: string().required('Vehicle Make is required'),
    vehicleModel: string().required('Vehicle Model is required'),
    fuelType: string().required('Fuel Type is required'),
    // vendorName: string().required('Vendor Name is required'),
    officeId: string().required('Office ID is required'),
    registrationDate: string().required('Registration Date is required'),
    manufacturingDate: string().required('Manufacturing Date is required'),
    inductionDate: string().required('Induction Date is required'),
    insuranceExpiryDate: string().required('Insurance Expiry Date is required'),
    roadTaxExpiryDate: string().required('Road Tax Expiry Date is required'),
    pollutionExpiryDate: string().required('Pollution Certificate Expiry Date is required'),
    statePermitExpiryDate: string().required('State Permit Expiry Date is required'),
    nationalPermitExpiryDate: string().required('National Permit Expiry Date is required'),
    fitnessExpiryDate: string().required('Fitness Expiry Date is required'),
    fitnessDate: string().required('Fitness Date is required'),
    garageLocation: string().required('Garage Location is required'),
    ehsStatus: string().required('EHS Status is required'),
    garageGeoCode: string().required('Garage Geocodes is required'),
    rfidStatus: string().required('RFID Status is required'),
    acStatus: string().required('AC Status is required'),
    gpsStatus: string().required('GPS Fitted Status is required'),
    //vehicleRemarks: string().required('Vehicle Remarks is required'),
    //driverId: string().required("Driver Id is required"),
})

const validationSchemaStepTwo = object({
    registrationCertificateUrl: string().required('Registration Certificate is required')
});

const validationSchemaStepThree = object({
    insuranceUrl: string().required('Insurance is required')
});

const validationSchemaStepFour = object({
    pollutionCertificateUrl: string().required('Pollution Certificate is required')
});

const validationSchemaStepFive = object({
    roadTaxCertificateUrl: string().required('Road Tax Certificate is required')
});

const validationSchemaStepSix = object({
    fitnessCertificateUrl: string().required('Fitness Certificate is required')
});

const validationSchemaStepSeven = object({
    statePermitUrl: string().required('State Permit Certificate is required')
});

const validationSchemaStepEight = object({
    nationalPermitUrl: string().required('National Permit Certificate is required')
});

// const validationSchemaStepNine = object({
//     medicalCertificateUrl: string().required('Medical Certificate is required')
// });

const AddNewVehicle = ({ EditVehicleData, SetAddVehicleOpen }) => {
    const dispatch = useDispatch();

    const [initialValues, setInitialValues] = useState({
        vehicleId: "",
        vehicleRegistrationNumber: "",
        stickerNumber: "",
        vehicleType: "",
        vehicleOwnerName: "",
        modelYear: "",
        vehicleMake: "",
        vehicleModel: "",
        fuelType: "",
        vendorName: "",
        officeId: "",
        registrationDate: "",
        manufacturingDate: "",
        inductionDate: "",
        insuranceExpiryDate: "",
        roadTaxExpiryDate: "",
        pollutionExpiryDate: "",
        statePermitExpiryDate: "",
        nationalPermitExpiryDate: "",
        fitnessExpiryDate: "",
        fitnessDate: "",
        garageLocation: "",
        ehsStatus: "",
        garageGeoCode: "",
        rfidStatus: "",
        acStatus: "",
        gpsStatus: "",
        vehicleRemarks: "",
        insuranceUrl: "",
        registrationCertificateUrl: "",
        driverId: "",
        // ehsDoneBy: "Sultan",
        // ehsDoneAt: "2024-03-13",
        pollutionCertificateUrl: "",
        roadTaxCertificateUrl: "",
        fitnessCertificateUrl: "",
        statePermitUrl: "",
        nationalPermitUrl: "",
        medicalCertificateUrl: "",
        // complianceStatus: "NON_COMPLIANT"
    });

    const [officeList, setOfficeList] = useState([]);
    const [vehicleId, setVehicleId] = useState(EditVehicleData ? EditVehicleData.id : '');

    ////////////////////////////////////////////////////
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

    const [rcField,setRcField] = useState();
    const [rcFilename,setRcFilename] = useState("");
    const [fcField,setFcField] = useState();
    const [fcFilename,setFcFilename] = useState("");
    const [icField,setIcField] = useState();
    const [icFilename,setIcFilename] = useState("");
    const [spcField,setSpcField] = useState();
    const [spcFilename,setSpcFilename] = useState("");
    const [pcField,setPcField] = useState();
    const [pcFilename,setPcFilename] = useState("");
    const [npcField,setNpcField] = useState();
    const [npcFilename,setNpcFilename] = useState("");
    const [rtcField,setRtcField] = useState();
    const [rtcFilename,setRtcFilename] = useState("");

    const [searchVendor,setSearchVendor] = useState([]);
    const [openSearchVendor, setOpenSearchVendor] = useState(false);
    const [vendorName,setVendorName] = useState("");
    const [openSearchDriver, setOpenSearchDriver] = useState(false);
    const [searchedDriver, setSearchedDriver] = useState([]);
    const [driverId,setDriverId] = useState("");
    const [transportTypes,setTransportTypes] = useState([]);
    const [ehsTypes,setEhsTypes] = useState([]);
    const [rfidStatus,setRfidStatus] = useState([]);
    const [acTypes,setAcTypes] = useState([]);
    const [fuelType,setFuelTypes] = useState([]);
    const [gpsTypes,setGpsTypes] = useState([]);

    const onChangeDriverHandler = (newValue, name, key) => {
        console.log("on change handler", newValue);
        var allValues = {...initialValues};
        allValues.driverId = newValue?.driverId;
        setInitialValues(allValues);
        setDriverId(newValue?.driverId);
    };
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
    const onChangeHandlerDropdown = (newValue) =>{
        const {target} = newValue;
        const {name,value} = target; 
        console.log("on change handler", name);
        var allValues = {...initialValues};
        if(name === 'vehicleType') allValues.vehicleType = newValue.target.value;
        else if(name === 'ehsStatus') allValues.ehsStatus = newValue.target.value;
        else if(name === 'acStatus') allValues.acStatus = newValue.target.value;
        else if(name === 'rfidStatus') allValues.rfidStatus = newValue.target.value;
        else if(name === 'fuelType') allValues.fuelType = newValue.target.value;
        else if(name === 'gpsStatus') allValues.gpsStatus = newValue.target.value;
        setInitialValues(allValues);
        console.log(initialValues);
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
    const searchForDriver = async (e) => {
        try {
            if (e.target.value && vendorName != "") {
                console.log('searchForDriver', e.target.value)
                const response = await ComplianceService.searchDriverWithVendor(e.target.value,vendorName);
                console.log(response)
                const { data } = response || {};
                setSearchedDriver(data);
            } else {
                setSearchedDriver([]);
            }
        } catch (e) {
            console.error(e);
        }
    };
    ////////////////////////////////////////////////////////

    const addNewVehicleDetailsSubmit = async (values) => {
        try {
            if (EditVehicleData) {
                values.id = vehicleId;
                // if(vendorName === ""){
                //     alert("Enter vendor name");
                //     return;
                // }
                // values.vendorName = vendorName;
                if(driverId === ""){
                    delete values.driverId;
                }
                else{
                    values.driverId = driverId;
                }                
                const response = await ComplianceService.updateVehicle({ "vehicleDTO": values });
                if (response.status === 200) {
                    setVehicleId(response.data.vehicleDTO.id);
                    dispatch(toggleToast({ message: 'Vehicle details updated successfully!', type: 'success' }));
                    return true;
                } else if (response.status === 500) {
                    dispatch(toggleToast({ message: 'Vehicle details not updated. Please try again after some time.', type: 'error' }));
                    return false;
                }
            } else {
                var apiData = { ...values };
                if(vendorName === "")
                {
                    alert("Enter vendor name");
                    return;
                }
                apiData.driver = driverId;
                apiData.vendorName = vendorName;
                // apiData.rfidStatus = "ACTIVE";
                // apiData.gpsStatus = "ACTIVE";
                // apiData.acStatus = "AVAILABLE";
                // apiData.fuelType = "DIESEL";
                const response = await ComplianceService.createVehicle({ "vehicleDTO": apiData })
                console.log(response);
                if (response.status === 201) {
                    setVehicleId(response.data.vehicleDTO.id);
                    dispatch(toggleToast({ message: 'Vehicle details added successfully!', type: 'success' }));
                    return true;
                } else if (response.status === 500) {
                    dispatch(toggleToast({ message: 'Vehicle details not added. Please try again after some time.', type: 'error' }));
                    return false;
                }
            }
        } catch (e) {
            if(e.response.status ===  409){
                var message = e.response.data.message;
                if(checkUniqueConstraint(message,"vehicle_registration_number")){
                    setMessage('This registered vehicle number is already in use');
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
    const initializer = async () => {
        var officeResponse;

        await Promise.allSettled([
            officeResponse = await OfficeService.getAllOffices()
        ])

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
    };

    const completeNewVehicleFormSubmit = () => {
        try {
            dispatch(toggleToast({ message: EditVehicleData ? 'Vehicle details edited successfully' : 'Vehicle details added successfully!', type: 'success' }));
            SetAddVehicleOpen(false)
        } catch (e) {
        }
    }

    const uploadDocumentFormSubmit = async (id, role, documentToUpload, data) => {
        try {
            var formData = new FormData()
            formData.append('file', data);
            const response = await ComplianceService.documentUpload(id, role, documentToUpload, formData);
            if (response.status === 200) {
                dispatch(toggleToast({ message: `${documentToUpload.replace("/","").replace("_"," ")} uploaded successfully!`, type: 'success' }));
                if(documentToUpload === "/REGISTRATION_CERTIFICATE"){
                    EditVehicleData.registrationCertificateUrl = response.data.vehicleDTO.registrationCertificateUrl;
                }
                else if(documentToUpload === "/INSURANCE"){
                    EditVehicleData.insuranceUrl = response.data.vehicleDTO.insuranceUrl;
                }
                else if(documentToUpload === "/POLLUTION"){
                    EditVehicleData.pollutionCertificateUrl = response.data.vehicleDTO.pollutionCertificateUrl;
                }
                else if(documentToUpload === "/ROAD_TAX"){
                    EditVehicleData.roadTaxCertificateUrl = response.data.vehicleDTO.roadTaxCertificateUrl;
                }
                else if(documentToUpload === "/FITNESS_CERTIFICATE"){
                    EditVehicleData.fitnessCertificateUrl = response.data.vehicleDTO.fitnessCertificateUrl;
                }
                else if(documentToUpload === "/STATE_PERMIT"){
                    EditVehicleData.statePermitUrl = response.data.vehicleDTO.statePermitUrl;
                }
                else if(documentToUpload === "/NATIONAL_PERMIT"){
                    EditVehicleData.nationalPermitUrl = response.data.vehicleDTO.nationalPermitUrl;
                }
                setUploadCount(uploadCount+1);
                //dispatch(toggleToast({ message: 'Data uploaded successfully!', type: 'success' }));
                return true;
            } else if (response.status === 500) {
                dispatch(toggleToast({ message: 'Data not uploaded. Please try again after some time!', type: 'error' }));
                return false;
            }
        } catch (e) {
        }
    }

    const cancelHandler = () =>{
        dispatch(toggleToast({ message: 'Process is cancelled', type: 'error' }));
        SetAddVehicleOpen(false);
    }

    const fetchMasterData = async() => {
        const list = ['TransportType','EhsStatus','ACStatus','RfidStatus','FuelType','GPSStatus'];
        try {
            list.map(async (val)=>{
                const response = await MasterDataService.getMasterData(val);
                const { data } = response || {};
                if (data?.length) {
                    if(val === 'EhsStatus'){
                        var newData = data.find((val)=> val.value === "PENDING");
                    }
                    switch(val){
                        case ('TransportType'): setTransportTypes(data); break;
                        case ('EhsStatus'): setEhsTypes([newData]); break;
                        case ('ACStatus'): setAcTypes(data); break;
                        case ('RfidStatus'): setRfidStatus(data); break;
                        case ('FuelType'): setFuelTypes(data); break;
                        case ('GPSStatus') : setGpsTypes(data); break;
                    }

                }
            })

            return [];
        } catch (e) {
            console.log(e)
        }
    };

    useEffect(() => {
        if(SetAddVehicleOpen){
            initializer();
            fetchMasterData();
        }
        if(EditVehicleData?.id){
            var documentCount = 0;
            if(EditVehicleData?.registrationCertificateUrl && EditVehicleData.registrationCertificateUrl != ""){
                documentCount++;
            }
            if(EditVehicleData?.fitnessCertificateUrl && EditVehicleData.fitnessCertificateUrl != ""){
                documentCount++;
            }
            if(EditVehicleData?.insuranceUrl && EditVehicleData.insuranceUrl != ""){
                documentCount++;
            }
            if(EditVehicleData?.statePermitUrl && EditVehicleData.statePermitUrl != ""){
                documentCount++;
            }
            if(EditVehicleData?.pollutionCertificateUrl && EditVehicleData.pollutionCertificateUrl != ""){
                documentCount++;
            }
            if(EditVehicleData?.nationalPermitUrl && EditVehicleData.nationalPermitUrl != ""){
                documentCount++;
            }
            if(EditVehicleData?.roadTaxCertificateUrl && EditVehicleData.roadTaxCertificateUrl != ""){
                documentCount++;
            }
            setUploadCount(documentCount);
        }
    }, []);

    useEffect(()=>{
        console.log(uploadCount);
        if(uploadCount >= 7){
            setUploadDocumentValidation(true);
        }
    },[uploadCount])

    useState(() => {
        if (EditVehicleData?.id) {
            let newEditInfo = Object.assign(initialValues, EditVehicleData);
            setInitialValues(newEditInfo);
            setVendorName(EditVehicleData?.vendorName);
        }
    }, [EditVehicleData]);

    return (
        <div>
            {/* End waali cheez update */}
            <MultiStepForm 
                initialValues={initialValues}
                onSubmit={async () => {
                    const response = await ComplianceService.changeStatusVehicle(vehicleId);
                    if (response) {
                        completeNewVehicleFormSubmit();
                    }
                }}
                cancelBtn={cancelHandler}
                isValidate={uploadDocumentValidation}
            >
                <FormStep
                    stepName="Vehicle Details"
                    onSubmit={(values) => addNewVehicleDetailsSubmit(values)}
                    validationSchema={validationSchemaStepOne}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextInputField
                            name="vehicleId"
                            label="Vehicle ID" 
                            disabled={EditVehicleData?.id  ? true : false}
                            />
                        <TextInputField
                            name="vehicleRegistrationNumber"
                            label="Vehicle Registration Number" />
                        <TextInputField
                            name="stickerNumber"
                            label="Sticker Number" />
                        {/* <TextInputField
                            name="vehicleType"
                            label="Vehicle Type" /> */}
                        <SelectInputField
                            name="vehicleType"
                            label="Vehicle Type"
                            genderList={transportTypes} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextInputField
                            name="vehicleOwnerName"
                            label="Vehicle Owner Name" />
                        <TextInputField
                            name="modelYear"
                            label="Model Year" />
                        <TextInputField
                            name="vehicleMake"
                            label="Vehicle Make" />
                        <TextInputField
                            name="vehicleModel"
                            label="Vehicle Model" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <SelectInputField
                            name="fuelType"
                            label="Fuel Type"
                            genderList={fuelType} />
                        {
                            EditVehicleData?.id ?
                                <TextInputField
                                    name="vendorName"
                                    label="Vendor Name" 
                                    disabled={true}
                                />
                                :
                                <div className='form-control-input'>
                                    <FormControl variant="outlined">
                                        <Autocomplete
                                            disablePortal
                                            id="search-reporting-manager"
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
                        }
                        
                        
                        <SelectInputField
                            name="officeId"
                            label="Office Id"
                            genderList={officeList} />
                        <DateInputField
                            name="registrationDate"
                            label="Registration Date" 
                            maxDate={dayjs()}/>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <DateInputField
                            name="manufacturingDate"
                            label="Manufacturing Date" 
                            maxDate={dayjs()}/>
                        <DateInputField
                            name="inductionDate"
                            label="Induction Date" 
                            minDate={dayjs()}/>
                        <DateInputField
                            name="insuranceExpiryDate"
                            label="Insurance Expiry Date" 
                            minDate={dayjs()}/>
                        <DateInputField
                            name="roadTaxExpiryDate"
                            label="Road Tax Expiry Date"
                            minDate={dayjs()} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <DateInputField
                            name="pollutionExpiryDate"
                            label="Pollution Expiry Date" 
                            minDate={dayjs()}/>
                        <DateInputField
                            name="statePermitExpiryDate"
                            label="State Permit Expiry Date" 
                            minDate={dayjs()}/>
                        <DateInputField
                            name="nationalPermitExpiryDate"
                            label="National Permit Expiry Date" 
                            minDate={dayjs()}/>
                        <DateInputField
                            name="fitnessExpiryDate"
                            label="Fitness Expiry Date" 
                            minDate={dayjs()}/>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <DateInputField
                            name="fitnessDate"
                            label="Fitness Date" 
                            minDate={dayjs()}/>
                        <TextInputField
                            name="garageLocation"
                            label="Garage Location" />
                        <SelectInputField
                            name="ehsStatus"
                            label="EHS Status"
                            genderList={ehsTypes} />
                        <TextInputField
                            name="garageGeoCode"
                            label="Garage Geocodes" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <SelectInputField
                            name="rfidStatus"
                            label="RFID Status"
                            genderList={rfidStatus} />
                        <SelectInputField
                            name="acStatus"
                            label="AC Status"
                            genderList={acTypes} />
                        <SelectInputField
                            name="gpsStatus"
                            label="GPS Status"
                            genderList={gpsTypes} />
                        <TextInputField
                            name="vehicleRemarks"
                            label="Vehicle Remarks" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className='form-control-input'>
                            <FormControl variant="outlined">
                                <Autocomplete
                                    disablePortal
                                    id="search-driver"
                                    options={searchedDriver}
                                    autoComplete
                                    open={openSearchDriver}
                                    onOpen={() => {
                                        setOpenSearchDriver(true);
                                    }}
                                    onClose={() => {
                                        setOpenSearchDriver(false);
                                    }}
                                    onChange={(e, val) => onChangeDriverHandler(val, "driver", "driverId")}
                                    getOptionKey={(driver) => driver.driverId}
                                    getOptionLabel={(driver) => driver.driverName}
                                    freeSolo
                                    name="driver"
                                    renderInput={(params) => <TextField {...params} label="Search Driver" onChange={searchForDriver} />}
                                />
                            </FormControl>
                        </div>
                    </div>
                </FormStep>
                <FormStep
                    stepName="Upload Certificate"
                    validationSchema={validationSchemaStepTwo}
                >
                    <div style={{display: 'grid',gridTemplateColumns: '1fr 1fr',gap:'20px'}}>
                        <div className='column'>
                            <div style={{display: 'flex',alignItems: 'center',justifyContent: 'start'}}>
                                <FileInputField
                                    name="registrationCertificateUrl"
                                    label="Registration Certificate"
                                    filledValue={setRcField}
                                    fileName={rcFilename}
                                />
                                <button
                                    type='button'
                                    disabled={rcField?  false : true}
                                    onClick={()=>uploadDocumentFormSubmit('/' + vehicleId, '/VEHICLE', '/REGISTRATION_CERTIFICATE', rcField)}
                                    style={{width: '20%',marginRight: 0,marginLeft:0}}
                                    className='btn btn-primary'
                                >
                                    Upload
                                </button>
                                {
                                    EditVehicleData?.registrationCertificateUrl && EditVehicleData.registrationCertificateUrl !== "" &&
                                    <button
                                        type='button'
                                        onClick={()=>{
                                            setDocumentUrl(EditVehicleData.registrationCertificateUrl.replace("gets-dev.",""));
                                            handleOpen();
                                        }}
                                        style={{width: '20%',marginRight: 0,marginLeft:20,padding:'15px'}}
                                        className='btn btn-secondary    '
                                    >
                                        View
                                    </button>
                                }
                            </div>
                            <div style={{display: 'flex',alignItems: 'center',justifyContent: 'start'}}>
                                <FileInputField
                                    name="insuranceUrl"
                                    label="Insurance Certificate"
                                    filledValue={setIcField}
                                    fileName={icFilename}/>
                                <button
                                    type='button'
                                    disabled={icField?  false : true}
                                    onClick={()=>uploadDocumentFormSubmit('/' + vehicleId, '/VEHICLE', '/INSURANCE', icField)}
                                    style={{width: '20%',marginRight: 0,marginLeft:0}}
                                    className='btn btn-primary'
                                >
                                    Upload
                                </button>
                                {
                                    EditVehicleData?.insuranceUrl && EditVehicleData.insuranceUrl !== "" &&
                                    <button
                                        type='button'
                                        onClick={()=>{
                                            setDocumentUrl(EditVehicleData.insuranceUrl.replace("gets-dev.",""));
                                            handleOpen();
                                        }}
                                        style={{width: '20%',marginRight: 0,marginLeft:20,padding:'15px'}}
                                        className='btn btn-secondary    '
                                    >
                                        View
                                    </button>
                                }
                            </div>
                            <div style={{display: 'flex',alignItems: 'center',justifyContent: 'start'}}>
                                <FileInputField
                                name="pollutionCertificateUrl"
                                label="Pollution Certificate"
                                filledValue={setPcField}
                                fileName={pcFilename}/>
                                <button
                                    type='button'
                                    disabled={pcField?  false : true}
                                    onClick={()=>uploadDocumentFormSubmit('/' + vehicleId, '/VEHICLE', '/POLLUTION', pcField)}
                                    style={{width: '20%',marginRight: 0,marginLeft:0}}
                                    className='btn btn-primary'
                                >
                                    Upload
                                </button>
                                {
                                    EditVehicleData?.pollutionCertificateUrl && EditVehicleData.pollutionCertificateUrl !== "" &&
                                    <button
                                        type='button'
                                        onClick={()=>{
                                            setDocumentUrl(EditVehicleData.pollutionCertificateUrl.replace("gets-dev.",""));
                                            handleOpen();
                                        }}
                                        style={{width: '20%',marginRight: 0,marginLeft:20,padding:'15px'}}
                                        className='btn btn-secondary    '
                                    >
                                        View
                                    </button>
                                }
                            </div>
                            <div style={{display: 'flex',alignItems: 'center',justifyContent: 'start'}}>
                                <FileInputField
                                    name="roadTaxCertificateUrl"
                                    label="Road Tax Certificate"
                                    filledValue={setRtcField}
                                    fileName={rtcFilename}/>
                                <button
                                    type='button'
                                    disabled={rtcField?  false : true}
                                    onClick={()=>uploadDocumentFormSubmit('/' + vehicleId, '/VEHICLE', '/ROAD_TAX', rtcField)}
                                    style={{width: '20%',marginRight: 0,marginLeft:0}}
                                    className='btn btn-primary'
                                >
                                    Upload
                                </button>
                                {
                                    EditVehicleData?.roadTaxCertificateUrl && EditVehicleData.roadTaxCertificateUrl !== "" &&
                                    <button
                                        type='button'
                                        onClick={()=>{
                                            setDocumentUrl(EditVehicleData.roadTaxCertificateUrl.replace("gets-dev.",""));
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
                        <div className='column'>
                            <div style={{display: 'flex',alignItems: 'center',justifyContent: 'start'}}>
                                <FileInputField
                                    name="fitnessCertificateUrl"
                                    label="Fitness Certificate"
                                    filledValue={setFcField}
                                    fileName={fcFilename}/>
                                <button
                                    type='button'
                                    disabled={fcField?  false : true}
                                    onClick={()=>uploadDocumentFormSubmit('/' + vehicleId, '/VEHICLE', '/FITNESS_CERTIFICATE', fcField)}
                                    style={{width: '20%',marginRight: 0,marginLeft:0}}
                                    className='btn btn-primary'
                                >
                                    Upload
                                </button>
                                {
                                    EditVehicleData?.fitnessCertificateUrl && EditVehicleData.fitnessCertificateUrl !== "" &&
                                    <button
                                        type='button'
                                        onClick={()=>{
                                            setDocumentUrl(EditVehicleData.fitnessCertificateUrl.replace("gets-dev.",""));
                                            handleOpen();
                                        }}
                                        style={{width: '20%',marginRight: 0,marginLeft:20,padding:'15px'}}
                                        className='btn btn-secondary    '
                                    >
                                        View
                                    </button>
                                }
                            </div>
                            <div style={{display: 'flex',alignItems: 'center',justifyContent: 'start'}}>
                                <FileInputField
                                    name="statePermitUrl"
                                    label="State Permit Certificate"
                                    filledValue={setSpcField}
                                    fileName={spcFilename}/>
                                <button
                                    type='button'
                                    disabled={spcField?  false : true}
                                    onClick={()=>uploadDocumentFormSubmit('/' + vehicleId, '/VEHICLE', '/STATE_PERMIT', spcField)}
                                    style={{width: '20%',marginRight: 0,marginLeft:0}}
                                    className='btn btn-primary'
                                >
                                    Upload
                                </button>
                                {
                                    EditVehicleData?.statePermitUrl && EditVehicleData.statePermitUrl !== "" &&
                                    <button
                                        type='button'
                                        onClick={()=>{
                                            setDocumentUrl(EditVehicleData.statePermitUrl.replace("gets-dev.",""));
                                            handleOpen();
                                        }}
                                        style={{width: '20%',marginRight: 0,marginLeft:20,padding:'15px'}}
                                        className='btn btn-secondary    '
                                    >
                                        View
                                    </button>
                                }
                            </div>
                            <div style={{display: 'flex',alignItems: 'center',justifyContent: 'start'}}>
                                <FileInputField
                                    name="nationalPermitUrl"
                                    label="National Permit Certificate"
                                    filledValue={setNpcField}
                                    fileName={npcFilename}/>
                                <button
                                    type='button'
                                    disabled={npcField?  false : true}
                                    onClick={()=>uploadDocumentFormSubmit('/' + vehicleId, '/VEHICLE', '/NATIONAL_PERMIT', npcField)}
                                    style={{width: '20%',marginRight: 0,marginLeft:0}}
                                    className='btn btn-primary'
                                >
                                    Upload
                                </button>
                                {
                                    EditVehicleData?.nationalPermitUrl && EditVehicleData.nationalPermitUrl !== "" &&
                                    <button
                                        type='button'
                                        onClick={()=>{
                                            setDocumentUrl(EditVehicleData.nationalPermitUrl.replace("gets-dev.",""));
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

export default AddNewVehicle;