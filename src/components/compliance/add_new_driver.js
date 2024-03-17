import OfficeService from '@/services/office.service';
import { getFormattedLabel } from '@/utils/utils';
import React, { useEffect, useState } from 'react';
import { toggleToast } from '@/redux/company.slice';
import { useDispatch } from 'react-redux';
import ComplianceService from '@/services/compliance.service';
import { object, string } from 'yup';
import TextInputField from '@/components/multistepForm/TextInputField';
import MultiStepForm, { FormStep } from '@/components/multistepForm/MultiStepForm';
import SelectInputField from '../multistepForm/SelectInputField';
import FileInputField from '../multistepForm/FileInputField';
import DateInputField from '../multistepForm/DateInputField';

const validationSchemaStepOne = object({
    name: string().required('Driver Name is required'),
    mobile: string()
        .matches(/^[0-9]+$/, "Driver Mobile Number must be numeric")
        .min(10, 'Driver Mobile Number must be exactly 10 numbers')
        .max(10, 'Driver Mobile Number must be exactly 10 numbers'),
    dob: string().required('Date is required'),
    gender: string().required('Gender is required'),
    officeId: string().required('Office ID is required'),
    vendorName: string().required('Vendor Name is required'),
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
    email: string().required('Email is required').email('Email is not in correct format')
});

const validationSchemaStepTwo = object({
    licenseUrl: string().required('License is required')
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

const AddNewDriver = ({ EditDriverData, SetAddDriverOpen }) => {
    const dispatch = useDispatch();

    const [genderList, setGenderList] = useState([]);
    const [officeList, setOfficeList] = useState([]);
    const [driverId, setDriverId] = useState(EditDriverData ? EditDriverData.id : '')
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
        "ehsDoneBy": "Sultan",
        "ehsDoneAt": "2024-03-13",
        "complianceStatus": "NON_COMPLIANT",
        "ehsStatus": "true"
    });

    const addNewDriverDetailsSubmit = async (values) => {
        try {
            if (EditDriverData) {
                values.id = driverId;
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
                const response = await ComplianceService.createDriver({ "driver": values });
                if (response.status === 200) {
                    setDriverId(response.data.driver.id);
                    dispatch(toggleToast({ message: 'Driver details added successfully!', type: 'success' }));
                    return true;
                } else if (response.status === 500) {
                    dispatch(toggleToast({ message: 'Driver details not added. Please try again after some time.', type: 'error' }));
                    return false;
                }
            }
        } catch (e) {
        }
    }

    const completeNewDriverFormSubmit = async () => {
        try {
            dispatch(toggleToast({ message: EditDriverData ? 'Driver details edited successfully' : 'Driver details added successfully!', type: 'success' }));
            SetAddDriverOpen(false);
        } catch (e) {
        }
    }

    const uploadDocumentFormSubmit = async (id, role, documentToUpload, data) => {
        try {
            var formData = new FormData()
            formData.append('file', data);
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

    useEffect(() => {
        initializer();
    }, []);

    useState(() => {
        if (EditDriverData?.id) {
            let newEditInfo = Object.assign(initialValues, EditDriverData);
            setInitialValues(newEditInfo);
        }
    }, [EditDriverData]);

    return (
        <div>
            <MultiStepForm initialValues={initialValues}
                onSubmit={async (values) => {
                    const response = await uploadDocumentFormSubmit('/' + driverId, '/DRIVER', '/DRIVER_MEDICAL_CERTIFICATE', values.medicalCertUrl);
                    if (response) {
                        completeNewDriverFormSubmit();
                    }
                }}
            >
                <FormStep
                    stepName="Driver Details"
                    onSubmit={(values) => addNewDriverDetailsSubmit(values)}
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
                        <TextInputField
                            name="vendorName"
                            label="Vendor Name" />
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
                    </div>
                </FormStep>
                <FormStep
                    stepName="Driver License"
                    onSubmit={(values) => uploadDocumentFormSubmit('/' + driverId, '/DRIVER', '/LICENSE_CERTIFICATE', values.licenseUrl)}
                    validationSchema={validationSchemaStepTwo}
                >
                    <FileInputField
                        name="licenseUrl"
                        label="License" />
                </FormStep>
                <FormStep
                    stepName="Driver Photo"
                    onSubmit={(values) => uploadDocumentFormSubmit('/' + driverId, '/DRIVER', '/DRIVER_PHOTO', values.photoUrl)}
                    validationSchema={validationSchemaStepThree}
                >
                    <FileInputField
                        name="photoUrl"
                        label="Photo" />
                </FormStep>
                <FormStep
                    stepName="Driver BGV"
                    onSubmit={(values) => uploadDocumentFormSubmit('/' + driverId, '/DRIVER', '/BGV_CERTIFICATE', values.bgvUrl)}
                    validationSchema={validationSchemaStepFour}
                >
                    <FileInputField
                        name="bgvUrl"
                        label="BGV" />
                </FormStep>
                <FormStep
                    stepName="Driver Police Verification"
                    onSubmit={(values) => uploadDocumentFormSubmit('/' + driverId, '/DRIVER', '/POLICE_VERIFICATION_CERTIFICATE', values.policeVerificationUrl)}
                    validationSchema={validationSchemaStepFive}
                >
                    <FileInputField
                        name="policeVerificationUrl"
                        label="Police Verification" />
                </FormStep>
                <FormStep
                    stepName="Driver Badge"
                    onSubmit={(values) => uploadDocumentFormSubmit('/' + driverId, '/DRIVER', '/BADGE_CERTIFICATE', values.badgeUrl)}
                    validationSchema={validationSchemaStepSix}
                >
                    <FileInputField
                        name="badgeUrl"
                        label="Badge" />
                </FormStep>
                <FormStep
                    stepName="Driver Undertaking"
                    onSubmit={(values) => uploadDocumentFormSubmit('/' + driverId, '/DRIVER', '/UNDERTAKING_CERTIFICATE', values.undertakingUrl)}
                    validationSchema={validationSchemaStepSeven}
                >
                    <FileInputField
                        name="undertakingUrl"
                        label="Undertaking" />
                </FormStep>
                <FormStep
                    stepName="Driver Training Certificate"
                    onSubmit={(values) => uploadDocumentFormSubmit('/' + driverId, '/DRIVER', '/TRAINING_CERTIFICATE', values.driverTrainingCertUrl)}
                    validationSchema={validationSchemaStepEight}
                >
                    <FileInputField
                        name="driverTrainingCertUrl"
                        label="Driver Training Certificate" />
                </FormStep>
                <FormStep
                    stepName="Driver Medical Certificate"
                    validationSchema={validationSchemaStepNine}
                >
                    <FileInputField
                        name="medicalCertUrl"
                        label="Medical Certificate" />
                </FormStep>
            </MultiStepForm>
        </div >
    )
}

export default AddNewDriver;