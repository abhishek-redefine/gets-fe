import ShiftService from '@/services/shift.service';
import OfficeService from '@/services/office.service';
import { getFormattedLabel } from '@/utils/utils';
import { FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField } from '@mui/material';
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
    vendorName: string().required('Vendor Name is required'),
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
    vehicleRemarks: string().required('Vehicle Remarks is required'),
    driverId: string().required("Driver Id is required"),
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

const validationSchemaStepNine = object({
    medicalCertificateUrl: string().required('Medical Certificate is required')
});

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
        ehsDoneBy: "Sultan",
        ehsDoneAt: "2024-03-13",
        pollutionCertificateUrl: "",
        roadTaxCertificateUrl: "",
        fitnessCertificateUrl: "",
        statePermitUrl: "",
        nationalPermitUrl: "",
        medicalCertificateUrl: "",
        complianceStatus: "NON_COMPLIANT"
    });

    const [officeList, setOfficeList] = useState([]);
    const [vehicleId, setVehicleId] = useState(EditVehicleData ? EditVehicleData.id : '');

    const addNewVehicleDetailsSubmit = async (values) => {
        try {
            if (EditVehicleData) {
                values.id = vehicleId;
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
                apiData.rfidStatus = "ACTIVE";
                apiData.gpsStatus = "ACTIVE";
                apiData.acStatus = "AVAILABLE";
                apiData.fuelType = "DIESEL";
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
        }
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
            formData.append('file', new Blob([data, {
                contentType: "multipart/form-data"
            }]));
            const response = await ComplianceService.documentUpload(id, role, documentToUpload, formData);
            if (response.status === 200) {
                dispatch(toggleToast({ message: 'Data uploaded successfully!', type: 'success' }));
                return true;
            } else if (response.status === 500) {
                dispatch(toggleToast({ message: 'Data not uploaded. Please try again after some time!', type: 'error' }));
                return false;
            }
        } catch (e) {
        }
    }

    useEffect(() => {
        initializer();
    }, []);

    useState(() => {
        if (EditVehicleData?.id) {
            let newEditInfo = Object.assign(initialValues, EditVehicleData);
            setInitialValues(newEditInfo);
        }
    }, [EditVehicleData]);

    return (
        <div>
            {/* End waali cheez update */}
            <MultiStepForm initialValues={initialValues}
                onSubmit={async (values) => {
                    const response = await uploadDocumentFormSubmit('/' + vehicleId, '/VEHICLE', '/MEDICAL_CERTIFICATE', values.medicalCertificateUrl);
                    if (response) {
                        completeNewVehicleFormSubmit();
                    }
                }}
            >
                <FormStep
                    stepName="Vehicle Details"
                    onSubmit={(values) => addNewVehicleDetailsSubmit(values)}
                    validationSchema={validationSchemaStepOne}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextInputField
                            name="vehicleId"
                            label="Vehicle ID" />
                        <TextInputField
                            name="vehicleRegistrationNumber"
                            label="Vehicle Registration Number" />
                        <TextInputField
                            name="stickerNumber"
                            label="Sticker Number" />
                        <TextInputField
                            name="vehicleType"
                            label="Vehicle Type" />
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
                        <TextInputField
                            name="fuelType"
                            label="Fuel Type" />
                        <TextInputField
                            name="vendorName"
                            label="Vendor Name" />
                        <SelectInputField
                            name="officeId"
                            label="Office Id"
                            genderList={officeList} />
                        <DateInputField
                            name="registrationDate"
                            label="Registration Date" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <DateInputField
                            name="manufacturingDate"
                            label="Manufacturing Date" />
                        <DateInputField
                            name="inductionDate"
                            label="Induction Date" />
                        <DateInputField
                            name="insuranceExpiryDate"
                            label="Insurance Expiry Date" />
                        <DateInputField
                            name="roadTaxExpiryDate"
                            label="Road Tax Expiry Date" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <DateInputField
                            name="pollutionExpiryDate"
                            label="Pollution Expiry Date" />
                        <DateInputField
                            name="statePermitExpiryDate"
                            label="State Permit Expiry Date" />
                        <DateInputField
                            name="nationalPermitExpiryDate"
                            label="National Permit Expiry Date" />
                        <DateInputField
                            name="fitnessExpiryDate"
                            label="Fitness Expiry Date" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <DateInputField
                            name="fitnessDate"
                            label="Fitness Date" />
                        <TextInputField
                            name="garageLocation"
                            label="Garage Location" />
                        <TextInputField
                            name="ehsStatus"
                            label="EHS Status" />
                        <TextInputField
                            name="garageGeoCode"
                            label="Garage Geocodes" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextInputField
                            name="rfidStatus"
                            label="RFID Status" />
                        <TextInputField
                            name="acStatus"
                            label="AC Status" />
                        <TextInputField
                            name="gpsStatus"
                            label="GPS Status" />
                        <TextInputField
                            name="vehicleRemarks"
                            label="Vehicle Remarks" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextInputField
                            name="driverId"
                            label="Driver Id" />
                    </div>
                </FormStep>
                <FormStep
                    stepName="Registration Certificate"
                    onSubmit={(values) => uploadDocumentFormSubmit('/' + vehicleId, '/VEHICLE', '/REGISTRATION_CERTIFICATE', values.registrationCertificateUrl)}
                    validationSchema={validationSchemaStepTwo}
                >
                    <FileInputField
                        name="registrationCertificateUrl"
                        label="Registration Certificate" />
                </FormStep>
                <FormStep
                    stepName="Insurance Certificate"
                    onSubmit={(values) => uploadDocumentFormSubmit('/' + vehicleId, '/VEHICLE', '/INSURANCE', values.insuranceUrl)}
                    validationSchema={validationSchemaStepThree}
                >
                    <FileInputField
                        name="insuranceUrl"
                        label="Insurance Certificate" />
                </FormStep>
                <FormStep
                    stepName="Pollution Certificate"
                    onSubmit={(values) => uploadDocumentFormSubmit('/' + vehicleId, '/VEHICLE', '/POLLUTION', values.pollutionCertificateUrl)}
                    validationSchema={validationSchemaStepFour}
                >
                    <FileInputField
                        name="pollutionCertificateUrl"
                        label="Pollution Certificate" />
                </FormStep>
                <FormStep
                    stepName="Road Tax Certificate"
                    onSubmit={(values) => uploadDocumentFormSubmit('/' + vehicleId, '/VEHICLE', '/ROAD_TAX', values.roadTaxCertificateUrl)}
                    validationSchema={validationSchemaStepFive}
                >
                    <FileInputField
                        name="roadTaxCertificateUrl"
                        label="Road Tax Certificate" />
                </FormStep>
                <FormStep
                    stepName="Fitness Certificate"
                    onSubmit={(values) => uploadDocumentFormSubmit('/' + vehicleId, '/VEHICLE', '/FITNESS_CERTIFICATE', values.fitnessCertificateUrl)}
                    validationSchema={validationSchemaStepSix}
                >
                    <FileInputField
                        name="fitnessCertificateUrl"
                        label="Fitness Certificate" />
                </FormStep>
                <FormStep
                    stepName="State Permit Certificate"
                    onSubmit={(values) => uploadDocumentFormSubmit('/' + vehicleId, '/VEHICLE', '/STATE_PERMIT', values.statePermitUrl)}
                    validationSchema={validationSchemaStepSeven}
                >
                    <FileInputField
                        name="statePermitUrl"
                        label="State Permit Certificate" />
                </FormStep>
                <FormStep
                    stepName="National Permit Certificate"
                    onSubmit={(values) => uploadDocumentFormSubmit('/' + vehicleId, '/VEHICLE', '/NATIONAL_PERMIT', values.nationalPermitUrl)}
                    validationSchema={validationSchemaStepEight}
                >
                    <FileInputField
                        name="nationalPermitUrl"
                        label="National Permit Certificate" />
                </FormStep>
                <FormStep
                    stepName="Medical Certificate"
                    validationSchema={validationSchemaStepNine}
                >
                    <FileInputField
                        name="medicalCertificateUrl"
                        label="Medical Certificate" />
                </FormStep>
            </MultiStepForm>
        </div >
    )
}

export default AddNewVehicle;