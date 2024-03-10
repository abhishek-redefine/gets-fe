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

const validationSchemaStepOne = object({
    // vehicleId: string().required('Vehicle ID is required'),
    // vehicleRegistrationNo: string().required('Vehicle Registration No is required'),
    // stickerNo: string().required('Sticker No is required'),
    // vehicleType: string().required('Vehicle Type is required'),
    // vehicleOwnerName: string().required('Vehicle Owner Name is required'),
    // modelYear: string().required('Model Year is required'),
    // vehicleMake: string().required('Vehicle Make is required'),
    // vehicleModel: string().required('Vehicle Model is required'),
    // fuelType: string().required('Fuel Type is required'),
    // vendorName: string().required('Vendor Name is required'),
    // officeId: string().required('Office ID is required'),
    // registrationDate: string().required('Registration Date is required'),
    // manufacturingDate: string().required('Manufacturing Date is required'),
    // inductionDate: string().required('Induction Date is required'),
    // insuranceExpiry: string().required('Insurance Expiry is required'),
    // roadTaxExpiry: string().required('Road Tax Expiry is required'),
    // pollutionCertificateExpiry: string().required('Pollution Certificate Expiry is required'),
    // statePermitExpiry: string().required('State Permit Expiry is required'),
    // nationalPermitExpiry: string().required('National Permit Expiry is required'),
    // fitnessExpiry: string().required('Fitness Expiry is required'),
    // fitnessDate: string().required('Fitness Date is required'),
    // garageLocation: string().required('Garage Location is required'),
    // eHSStatus: string().required('EHS Status is required'),
    // garageGeocodes: string().required('Garage Geocodes is required'),
    // rFIDStatus: string().required('RFID Status is required'),
    // aCAvailableStatus: string().required('AC Available Status is required'),
    // gPSFittedStatus: string().required('GPS Fitted Status is required'),
    // vehicleRemarks: string().required('Vehicle Remarks is required')
})

const validationSchemaStepTwo = object({
    registrationCertificate: string().required('Registration Certificate is required'),
    // insurance: string().required('Insurance is required'),
    // roadTax: string().required('Road Tax is required'),
    // pollutionCertificate: string().required('Pollution Certificate is required'),
    // fitnessCertificate: string().required('Fitness Certificate is required'),
    // nationalPermit: string().required('National Permit is required'),
    // statePermit: string().required('State Permit is required'),
    // medicalCertificate: string().required('Medical Certificate is required')
})

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const AddNewVehicle = ({
    editEmployeeData,
    editValues,
    SetAddDriverOpen
}) => {
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    const dispatch = useDispatch();

    const [formValues1, setFormValues1] = useState({
        "vehicleId": "",
        "vehicleRegistrationNo": "",
        "stickerNo": "",
        "vehicleType": "",
        "vehicleOwnerName": "",
        "modelYear": "",
        "vehicleMake": "",
        "vehicleModel": "",
        "fuelType": "",
        "vendorName": "",
        "officeId": "",
        "registrationDate": "",
        "manufacturingDate": "",
        "inductionDate": "",
        "insuranceExpiry": "",
        "roadTaxExpiry": "",
        "pollutionCertificateExpiry": "",
        "statePermitExpiry": "",
        "nationalPermitExpiry": "",
        "fitnessExpiry": "",
        "fitnessDate": "",
        "garageLocation": "",
        "eHSStatus": "",
        "garageGeocodes": "",
        "rFIDStatus": "",
        "aCAvailableStatus": "",
        "gPSFittedStatus": "",
        "vehicleRemarks": "",
        "registrationCertificate": "",
        "insurance": "",
        "roadTax": "",
        "pollutionCertificate": "",
        "fitnessCertificate": "",
        "nationalPermit": "",
        "statePermit": "",
        "medicalCertificate": ""
    });

    //code
    const [officeList, setOfficeList] = useState([]);


    const addNewVehicleFormSubmit = async () => {
        try {
            const response = await ShiftService.createShift({ "shift": formValues });
            if (response.data === 'Shift has been created') {
                dispatch(toggleToast({ message: 'Driver added successfully!', type: 'success' }));
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

    useEffect(() => {
        initializer();
    }, []);

    return (
        <div>
            <MultiStepForm initialValues={{
                "vehicleId": "",
                "vehicleRegistrationNo": "",
                "stickerNo": "",
                "vehicleType": "",
                "vehicleOwnerName": "",
                "modelYear": "",
                "vehicleMake": "",
                "vehicleModel": "",
                "fuelType": "",
                "vendorName": "",
                "officeId": "",
                "registrationDate": "",
                "manufacturingDate": "",
                "inductionDate": "",
                "insuranceExpiry": "",
                "roadTaxExpiry": "",
                "pollutionCertificateExpiry": "",
                "statePermitExpiry": "",
                "nationalPermitExpiry": "",
                "fitnessExpiry": "",
                "fitnessDate": "",
                "garageLocation": "",
                "eHSStatus": "",
                "garageGeocodes": "",
                "rFIDStatus": "",
                "aCAvailableStatus": "",
                "gPSFittedStatus": "",
                "vehicleRemarks": "",
                "registrationCertificate": "",
                "insurance": "",
                "roadTax": "",
                "pollutionCertificate": "",
                "fitnessCertificate": "",
                "nationalPermit": "",
                "statePermit": "",
                "medicalCertificate": ""
            }}
                onSubmit={values => {
                    console.log('values', values);
                    addNewVehicleFormSubmit();
                }}
            >
                <FormStep
                    stepName="Vehicle Details"
                    onSubmit={() => console.log('Step1 submit')}
                    validationSchema={validationSchemaStepOne}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextInputField
                            name="vehicleId"
                            label="Vehicle ID" />
                        <TextInputField
                            name="vehicleRegistrationNo"
                            label="Vehicle Registration No" />
                        <TextInputField
                            name="stickerNo"
                            label="Sticker No" />
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
                        <TextInputField
                            name="officeId"
                            label="Office ID" />
                        <TextInputField
                            name="registrationDate"
                            label="Registration Date" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextInputField
                            name="manufacturingDate"
                            label="Manufacturing Date" />
                        <TextInputField
                            name="inductionDate"
                            label="Induction Date" />
                        <TextInputField
                            name="insuranceExpiry"
                            label="Insurance Expiry" />
                        <TextInputField
                            name="roadTaxExpiry"
                            label="Road Tax Expiry" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextInputField
                            name="pollutionCertificateExpiry"
                            label="Pollution Certificate Expiry" />
                        <TextInputField
                            name="statePermitExpiry"
                            label="State Permit Expiry" />
                        <TextInputField
                            name="nationalPermitExpiry"
                            label="National Permit Expiry" />
                        <TextInputField
                            name="fitnessExpiry"
                            label="Fitness Expiry" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextInputField
                            name="fitnessDate"
                            label="Fitness Date" />
                        <TextInputField
                            name="garageLocation"
                            label="Garage Location" />
                        <TextInputField
                            name="eHSStatus"
                            label="EHS Status" />
                        <TextInputField
                            name="garageGeocodes"
                            label="Garage Geocodes" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextInputField
                            name="rFIDStatus"
                            label="RFID Status" />
                        <TextInputField
                            name="aCAvailableStatus"
                            label="AC Available Status" />
                        <TextInputField
                            name="gPSFittedStatus"
                            label="GPS Fitted Status" />
                        <TextInputField
                            name="vehicleRemarks"
                            label="Vehicle Remarks" />
                    </div>
                </FormStep>
                <FormStep
                    stepName="Vehicle Documents"
                    onSubmit={() => console.log('Step2 submit')}
                    validationSchema={validationSchemaStepTwo}
                >
                    <FileInputField
                        name="registrationCertificate"
                        label="Registration Certificate" />
                    {/* <FileInputField
                        name="insurance"
                        label="Insurance" />
                    <FileInputField
                        name="roadTax"
                        label="Road Tax" />
                    <FileInputField
                        name="pollutionCertificate"
                        label="Pollution Certificate" />
                    <FileInputField
                        name="fitnessCertificate"
                        label="Fitness Certificate" />
                    <FileInputField
                        name="nationalPermit"
                        label="National Permit" />
                    <FileInputField
                        name="statePermit"
                        label="State Permit" />
                    <FileInputField
                        name="medicalCertificate"
                        label="Medical Certificate" /> */}
                </FormStep>
            </MultiStepForm>
        </div>
    )
}

export default AddNewVehicle;