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
import AddIcon from '@mui/icons-material/Add';

const validationSchemaStepOneA = object({
    vendorOfficeId: string().required('Vendor Office Id is required'),
    name: string().required('Vendor Name is required'),
    address: string().required('Vendor Address is required'),
    gst: string().required('Vendor GST is required'),
    pan: string().required('Pan Card is required'),
    contactPersonName: string().required('Contact Person Name is required'),
    contactPersonMobile: string().required('Contact Person No is required'),
    contactPersonEmail: string().required('Contact Person Email Id is required'),
    businessNotificationMobile: string().required('Business Notification Mobile No is required'),
    businessNotificationEmail: string().required('Business Notification Email Id is required'),
    complianceNotificationMobile: string().required('Compliance Notification Mobile No is required'),
    complianceNotificationEmail: string().required('Compliance Notification Email Id is required'),
    escalationMatrixL1Name: string().required('Escalation Matrix L1 Name is required'),
    escalationMatrixL1Designation: string().required('Escalation Matrix L1 Designation is required'),
    escalationMatrixL1Email: string().required('Escalation Matrix L1 Email is required'),
    escalationMatrixL1MobileNo: string().required('Escalation Matrix L1 Mobile No is required'),
});

const validationSchemaStepOneB = object({
    vendorOfficeId: string().required('Vendor Office Id is required'),
    name: string().required('Vendor Name is required'),
    address: string().required('Vendor Address is required'),
    gst: string().required('Vendor GST is required'),
    pan: string().required('Pan Card is required'),
    contactPersonName: string().required('Contact Person Name is required'),
    contactPersonMobile: string().required('Contact Person No is required'),
    contactPersonEmail: string().required('Contact Person Email Id is required'),
    businessNotificationMobile: string().required('Business Notification Mobile No is required'),
    businessNotificationEmail: string().required('Business Notification Email Id is required'),
    complianceNotificationMobile: string().required('Compliance Notification Mobile No is required'),
    complianceNotificationEmail: string().required('Compliance Notification Email Id is required'),
    escalationMatrixL1Name: string().required('Escalation Matrix L1 Name is required'),
    escalationMatrixL1Designation: string().required('Escalation Matrix L1 Designation is required'),
    escalationMatrixL1Email: string().required('Escalation Matrix L1 Email is required'),
    escalationMatrixL1MobileNo: string().required('Escalation Matrix L1 Mobile No is required'),
    escalationMatrixL2Name: string().required('Escalation Matrix L2 Name is required'),
    escalationMatrixL2Designation: string().required('Escalation Matrix L2 Designation is required'),
    escalationMatrixL2Email: string().required('Escalation Matrix L2 Email is required'),
    escalationMatrixL2MobileNo: string().required('Escalation Matrix L2 Mobile No is required')
});

const validationSchemaStepOneC = object({
    vendorOfficeId: string().required('Vendor Office Id is required'),
    name: string().required('Vendor Name is required'),
    address: string().required('Vendor Address is required'),
    gst: string().required('Vendor GST is required'),
    pan: string().required('Pan Card is required'),
    contactPersonName: string().required('Contact Person Name is required'),
    contactPersonMobile: string().required('Contact Person No is required'),
    contactPersonEmail: string().required('Contact Person Email Id is required'),
    businessNotificationMobile: string().required('Business Notification Mobile No is required'),
    businessNotificationEmail: string().required('Business Notification Email Id is required'),
    complianceNotificationMobile: string().required('Compliance Notification Mobile No is required'),
    complianceNotificationEmail: string().required('Compliance Notification Email Id is required'),
    escalationMatrixL1Name: string().required('Escalation Matrix L1 Name is required'),
    escalationMatrixL1Designation: string().required('Escalation Matrix L1 Designation is required'),
    escalationMatrixL1Email: string().required('Escalation Matrix L1 Email is required'),
    escalationMatrixL1MobileNo: string().required('Escalation Matrix L1 Mobile No is required'),
    escalationMatrixL2Name: string().required('Escalation Matrix L2 Name is required'),
    escalationMatrixL2Designation: string().required('Escalation Matrix L2 Designation is required'),
    escalationMatrixL2Email: string().required('Escalation Matrix L2 Email is required'),
    escalationMatrixL2MobileNo: string().required('Escalation Matrix L2 Mobile No is required'),
    escalationMatrixL3Name: string().required('Escalation Matrix L3 Name is required'),
    escalationMatrixL3Designation: string().required('Escalation Matrix L3 Designation is required'),
    escalationMatrixL3Email: string().required('Escalation Matrix L3 Email is required'),
    escalationMatrixL3MobileNo: string().required('Escalation Matrix L3 Mobile No is required')
});

const validationSchemaStepTwo = object({
    gstFilePath: string().required('GST Document is required')
});

const validationSchemaStepThree = object({
    panFilePath: string().required('Pan Card Document is required')
});

const AddVendor = ({ EditVendorData, SetAddVendorOpen }) => {
    const dispatch = useDispatch();

    const [genderList, setGenderList] = useState([]);
    const [officeList, setOfficeList] = useState([]);
    const [escalationNumber, setEscalationNumber] = useState(1);
    const [vendorId, setVendorId] = useState(EditVendorData ? EditVendorData.id : '')
    const [initialValues, setInitialValues] = useState({
        vendorOfficeId: "",
        name: "",
        address: "",
        gst: "",
        pan: "",
        contactPersonName: "",
        contactPersonMobile: "",
        contactPersonEmail: "",
        businessNotificationMobile: "",
        businessNotificationEmail: "",
        complianceNotificationMobile: "",
        complianceNotificationEmail: "",
        escalationMatrixL1Name: "",
        escalationMatrixL1Designation: "",
        escalationMatrixL1Email: "",
        escalationMatrixL1MobileNo: "",
        gstFilePath: "",
        panFilePath: ""
    });
    const [initialValuesB, setInitialValuesB] = useState({
        vendorOfficeId: "",
        name: "",
        address: "",
        gst: "",
        pan: "",
        contactPersonName: "",
        contactPersonMobile: "",
        contactPersonEmail: "",
        businessNotificationMobile: "",
        businessNotificationEmail: "",
        complianceNotificationMobile: "",
        complianceNotificationEmail: "",
        escalationMatrixL1Name: "",
        escalationMatrixL1Designation: "",
        escalationMatrixL1Email: "",
        escalationMatrixL1MobileNo: "",
        escalationMatrixL2Name: "",
        escalationMatrixL2Designation: "",
        escalationMatrixL2Email: "",
        escalationMatrixL2MobileNo: "",
        gstFilePath: "",
        panFilePath: ""
    });
    const [initialValuesC, setInitialValuesC] = useState({
        vendorOfficeId: "",
        name: "",
        address: "",
        gst: "",
        pan: "",
        contactPersonName: "",
        contactPersonMobile: "",
        contactPersonEmail: "",
        businessNotificationMobile: "",
        businessNotificationEmail: "",
        complianceNotificationMobile: "",
        complianceNotificationEmail: "",
        escalationMatrixL1Name: "",
        escalationMatrixL1Designation: "",
        escalationMatrixL1Email: "",
        escalationMatrixL1MobileNo: "",
        escalationMatrixL2Name: "",
        escalationMatrixL2Designation: "",
        escalationMatrixL2Email: "",
        escalationMatrixL2MobileNo: "",
        escalationMatrixL3Name: "",
        escalationMatrixL3Designation: "",
        escalationMatrixL3Email: "",
        escalationMatrixL3MobileNo: "",
        gstFilePath: "",
        panFilePath: ""
    });

    const addNewVendorDetailsSubmit = async (values) => {
        try {
            if (EditVendorData.id) {
                values.id = vendorId;
                if (escalationNumber === 1) {
                    values.escalationMatrices = [{
                        "name": values.escalationMatrixL1Name,
                        "email": values.escalationMatrixL1Email,
                        "designation": values.escalationMatrixL1Designation,
                        "contact": values.escalationMatrixL1MobileNo
                    }]
                } else if (escalationNumber === 2) {
                    values.escalationMatrices = [{
                        "name": values.escalationMatrixL1Name,
                        "email": values.escalationMatrixL1Email,
                        "designation": values.escalationMatrixL1Designation,
                        "contact": values.escalationMatrixL1MobileNo
                    },
                    {
                        "name": values.escalationMatrixL2Name,
                        "email": values.escalationMatrixL2Email,
                        "designation": values.escalationMatrixL2Designation,
                        "contact": values.escalationMatrixL2MobileNo
                    }]
                } else if (escalationNumber === 3) {
                    values.escalationMatrices = [{
                        "name": values.escalationMatrixL1Name,
                        "email": values.escalationMatrixL1Email,
                        "designation": values.escalationMatrixL1Designation,
                        "contact": values.escalationMatrixL1MobileNo
                    },
                    {
                        "name": values.escalationMatrixL2Name,
                        "email": values.escalationMatrixL2Email,
                        "designation": values.escalationMatrixL2Designation,
                        "contact": values.escalationMatrixL2MobileNo
                    },
                    {
                        "name": values.escalationMatrixL3Name,
                        "email": values.escalationMatrixL3Email,
                        "designation": values.escalationMatrixL3Designation,
                        "contact": values.escalationMatrixL3MobileNo
                    }]
                }
                const response = await ComplianceService.updateVendorCompany({ "vendorCompany": values });
                if (response.status === 200) {
                    setVendorId(response.data.vendorCompany.id);
                    dispatch(toggleToast({ message: 'Vendor details updated successfully!', type: 'success' }));
                    return true;
                } else if (response.status === 500) {
                    dispatch(toggleToast({ message: 'Vendor details not updated. Please try again after some time.', type: 'error' }));
                    return false;
                }
            } else {
                if (escalationNumber === 1) {
                    values.escalationMatrices = [{
                        "name": values.escalationMatrixL1Name,
                        "email": values.escalationMatrixL1Email,
                        "designation": values.escalationMatrixL1Designation,
                        "contact": values.escalationMatrixL1MobileNo
                    }]
                } else if (escalationNumber === 2) {
                    values.escalationMatrices = [{
                        "name": values.escalationMatrixL1Name,
                        "email": values.escalationMatrixL1Email,
                        "designation": values.escalationMatrixL1Designation,
                        "contact": values.escalationMatrixL1MobileNo
                    },
                    {
                        "name": values.escalationMatrixL2Name,
                        "email": values.escalationMatrixL2Email,
                        "designation": values.escalationMatrixL2Designation,
                        "contact": values.escalationMatrixL2MobileNo
                    }]
                } else if (escalationNumber === 3) {
                    values.escalationMatrices = [{
                        "name": values.escalationMatrixL1Name,
                        "email": values.escalationMatrixL1Email,
                        "designation": values.escalationMatrixL1Designation,
                        "contact": values.escalationMatrixL1MobileNo
                    },
                    {
                        "name": values.escalationMatrixL2Name,
                        "email": values.escalationMatrixL2Email,
                        "designation": values.escalationMatrixL2Designation,
                        "contact": values.escalationMatrixL2MobileNo
                    },
                    {
                        "name": values.escalationMatrixL3Name,
                        "email": values.escalationMatrixL3Email,
                        "designation": values.escalationMatrixL3Designation,
                        "contact": values.escalationMatrixL3MobileNo
                    }]
                }
                const response = await ComplianceService.createVendorCompany({ "vendorCompany": values });
                if (response.status === 201) {
                    setVendorId(response.data.vendorCompany.id);
                    dispatch(toggleToast({ message: 'Vendor details added successfully!', type: 'success' }));
                    return true;
                } else if (response.status === 500) {
                    dispatch(toggleToast({ message: 'Vendor details not added. Please try again after some time.', type: 'error' }));
                    return false;
                }
            }
        } catch (e) {
        }
    }

    const completeNewVendorFormSubmit = async () => {
        try {
            dispatch(toggleToast({ message: EditVendorData?.id ? 'Vendor details edited successfully!' : 'Vendor details added successfully!', type: 'success' }));
            SetAddVendorOpen(false);
        } catch (e) {
        }
    }

    const addMoreEscalations = () => {
        if (escalationNumber + 1 === 2) {
            setInitialValues(initialValuesB);
        }
        if (escalationNumber + 1 === 3) {
            setInitialValues(initialValuesC);
        }

        setEscalationNumber(escalationNumber + 1)
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

    useState(() => {
        if (EditVendorData?.id) {
            var newEditInfo
            if (EditVendorData.escalationMatrices.length === 1) {
                newEditInfo = Object.assign(initialValues, EditVendorData);
                newEditInfo.escalationMatrixL1Name = EditVendorData.escalationMatrices[0].name
                newEditInfo.escalationMatrixL1Designation = EditVendorData.escalationMatrices[0].designation
                newEditInfo.escalationMatrixL1Email = EditVendorData.escalationMatrices[0].email
                newEditInfo.escalationMatrixL1MobileNo = EditVendorData.escalationMatrices[0].contact
            } else if (EditVendorData.escalationMatrices.length === 2) {
                newEditInfo = Object.assign(initialValues, EditVendorData);
                newEditInfo.escalationMatrixL1Name = EditVendorData.escalationMatrices[0].name
                newEditInfo.escalationMatrixL1Designation = EditVendorData.escalationMatrices[0].designation
                newEditInfo.escalationMatrixL1Email = EditVendorData.escalationMatrices[0].email
                newEditInfo.escalationMatrixL1MobileNo = EditVendorData.escalationMatrices[0].contact
                newEditInfo.escalationMatrixL2Name = EditVendorData.escalationMatrices[1].name
                newEditInfo.escalationMatrixL2Designation = EditVendorData.escalationMatrices[1].designation
                newEditInfo.escalationMatrixL2Email = EditVendorData.escalationMatrices[1].email
                newEditInfo.escalationMatrixL2MobileNo = EditVendorData.escalationMatrices[1].contact
                setEscalationNumber(2)
            } else if (EditVendorData.escalationMatrices.length === 3) {
                newEditInfo = Object.assign(initialValues, EditVendorData);
                newEditInfo.escalationMatrixL1Name = EditVendorData.escalationMatrices[0].name
                newEditInfo.escalationMatrixL1Designation = EditVendorData.escalationMatrices[0].designation
                newEditInfo.escalationMatrixL1Email = EditVendorData.escalationMatrices[0].email
                newEditInfo.escalationMatrixL1MobileNo = EditVendorData.escalationMatrices[0].contact
                newEditInfo.escalationMatrixL2Name = EditVendorData.escalationMatrices[1].name
                newEditInfo.escalationMatrixL2Designation = EditVendorData.escalationMatrices[1].designation
                newEditInfo.escalationMatrixL2Email = EditVendorData.escalationMatrices[1].email
                newEditInfo.escalationMatrixL2MobileNo = EditVendorData.escalationMatrices[1].contact
                newEditInfo.escalationMatrixL3Name = EditVendorData.escalationMatrices[2].name
                newEditInfo.escalationMatrixL3Designation = EditVendorData.escalationMatrices[2].designation
                newEditInfo.escalationMatrixL3Email = EditVendorData.escalationMatrices[2].email
                newEditInfo.escalationMatrixL3MobileNo = EditVendorData.escalationMatrices[2].contact
                setEscalationNumber(3)
            }

            setInitialValues(newEditInfo);
        }
    }, [EditVendorData]);

    useEffect(() => {
        initializer();
    }, []);

    return (
        <div>
            <MultiStepForm
                initialValues={initialValues}
                onSubmit={async (values) => {
                    const response = await uploadDocumentFormSubmit('/' + vendorId, '/VENDOR', '/PAN_CERTIFICATE', values.panFilePath)
                    if (response.status === 200) {
                        completeNewVendorFormSubmit();
                    }
                }}
            >
                <FormStep
                    stepName="Vendor Details"
                    onSubmit={(values) => addNewVendorDetailsSubmit(values)}
                    validationSchema={escalationNumber === 1 ? validationSchemaStepOneA : (escalationNumber === 2 ? validationSchemaStepOneB : validationSchemaStepOneC)}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextInputField
                            name="vendorOfficeId"
                            label="Vendor Office Id" />
                        <TextInputField
                            name="name"
                            label="Vendor Name" />
                        <TextInputField
                            name="address"
                            label="Vendor Address" />
                        <TextInputField
                            name="gst"
                            label="Vendor GST" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextInputField
                            name="pan"
                            label="Pan Card" />
                        <TextInputField
                            name="contactPersonName"
                            label="Contact Person Name" />
                        <TextInputField
                            name="contactPersonMobile"
                            label="Contact Person No" />
                        <TextInputField
                            name="contactPersonEmail"
                            label="Contact Person Email Id" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <p style={{ fontWeight: '700', margin: '5px 20px' }}>Business Notification</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextInputField
                            name="businessNotificationMobile"
                            label="Mobile Number" />
                        <TextInputField
                            name="businessNotificationEmail"
                            label="Email Id" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <p style={{ fontWeight: '700', margin: '5px 20px' }}>Compliance Notification</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextInputField
                            name="complianceNotificationMobile"
                            label="Mobile Number" />
                        <TextInputField
                            name="complianceNotificationEmail"
                            label="Email Id" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <p style={{ fontWeight: '700', margin: '5px 20px' }}>Escalation Matrix</p>
                    </div>
                    {
                        escalationNumber === 1 &&
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p style={{ fontWeight: '700', margin: '5px 20px' }}>L1</p>
                            <TextInputField
                                name="escalationMatrixL1Name"
                                label="Name" />
                            <TextInputField
                                name="escalationMatrixL1Designation"
                                label="Designation" />
                            <TextInputField
                                name="escalationMatrixL1Email"
                                label="Email" />
                            <TextInputField
                                name="escalationMatrixL1MobileNo"
                                label="Mobile No" />
                            <p style={{ fontWeight: '700', margin: '5px 20px', border: 'solid 1px #000', alignItems: 'center', justifyContent: 'center', borderRadius: '5px' }} onClick={addMoreEscalations}><AddIcon /></p>
                        </div>
                    }
                    {
                        escalationNumber === 2 &&
                        <>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <p style={{ fontWeight: '700', margin: '5px 20px' }}>L1</p>
                                <TextInputField
                                    name="escalationMatrixL1Name"
                                    label="Name" />
                                <TextInputField
                                    name="escalationMatrixL1Designation"
                                    label="Designation" />
                                <TextInputField
                                    name="escalationMatrixL1Email"
                                    label="Email" />
                                <TextInputField
                                    name="escalationMatrixL1MobileNo"
                                    label="Mobile No" />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <p style={{ fontWeight: '700', margin: '5px 20px' }}>L2</p>
                                <TextInputField
                                    name="escalationMatrixL2Name"
                                    label="Name" />
                                <TextInputField
                                    name="escalationMatrixL2Designation"
                                    label="Designation" />
                                <TextInputField
                                    name="escalationMatrixL2Email"
                                    label="Email" />
                                <TextInputField
                                    name="escalationMatrixL2MobileNo"
                                    label="Mobile No" />
                                <p style={{ fontWeight: '700', margin: '5px 20px', border: 'solid 1px #000', alignItems: 'center', justifyContent: 'center', borderRadius: '5px' }} onClick={addMoreEscalations}><AddIcon /></p>
                            </div>
                        </>
                    }
                    {
                        escalationNumber === 3 &&
                        <>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <p style={{ fontWeight: '700', margin: '5px 20px' }}>L1</p>
                                <TextInputField
                                    name="escalationMatrixL1Name"
                                    label="Name" />
                                <TextInputField
                                    name="escalationMatrixL1Designation"
                                    label="Designation" />
                                <TextInputField
                                    name="escalationMatrixL1Email"
                                    label="Email" />
                                <TextInputField
                                    name="escalationMatrixL1MobileNo"
                                    label="Mobile No" />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <p style={{ fontWeight: '700', margin: '5px 20px' }}>L2</p>
                                <TextInputField
                                    name="escalationMatrixL2Name"
                                    label="Name" />
                                <TextInputField
                                    name="escalationMatrixL2Designation"
                                    label="Designation" />
                                <TextInputField
                                    name="escalationMatrixL2Email"
                                    label="Email" />
                                <TextInputField
                                    name="escalationMatrixL2MobileNo"
                                    label="Mobile No" />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <p style={{ fontWeight: '700', margin: '5px 20px' }}>L3</p>
                                <TextInputField
                                    name="escalationMatrixL3Name"
                                    label="Name" />
                                <TextInputField
                                    name="escalationMatrixL3Designation"
                                    label="Designation" />
                                <TextInputField
                                    name="escalationMatrixL3Email"
                                    label="Email" />
                                <TextInputField
                                    name="escalationMatrixL3MobileNo"
                                    label="Mobile No" />
                            </div>
                        </>
                    }
                </FormStep>
                <FormStep
                    stepName="GST Document"
                    onSubmit={(values) => uploadDocumentFormSubmit('/' + vendorId, '/VENDOR', '/GST_CERTIFICATE', values.gstFilePath)}
                    validationSchema={validationSchemaStepTwo}
                >
                    <FileInputField
                        name="gstFilePath"
                        label="GST Document" />
                </FormStep>
                <FormStep
                    stepName="Pan Card Document"
                    validationSchema={validationSchemaStepThree}
                >
                    <FileInputField
                        name="panFilePath"
                        label="Pan Card Document" />
                </FormStep>
            </MultiStepForm>
        </div >
    )
}

export default AddVendor;


