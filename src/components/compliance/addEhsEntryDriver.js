import OfficeService from '@/services/office.service';
import { getFormattedLabel } from '@/utils/utils';
import React, { useEffect, useState } from 'react';
import { toggleToast } from '@/redux/company.slice';
import { useDispatch } from 'react-redux';
import ComplianceService from '@/services/compliance.service';
import { object, string } from 'yup';
import TextInputField from '@/components/multistepForm/TextInputField';
import MultiStepForm, { FormStep } from '@/components/multistepForm/MultiStepForm';
import FileInputField from '../multistepForm/FileInputField';

const validationSchemaStepOne = object({
    ehsDueDate: string().required('EHS Due Date is required'),
    ehsStatus: string().required('Vendor Office Id is required'),
    remarks: string().required('Vendor Name is required'),
});

const validationSchemaStepTwo = object({
    file: string().required('File is required')
});

const AddEhsEntryDriver = ({ EditEhsEntryDriver, DriverId, UpdateId  }) => {
    const dispatch = useDispatch();

    const [initialValues, setInitialValues] = useState({
        ehsDueDate: "",
        ehsStatus: "",
        remarks: "",
        file: ""
    });

    useState(() => {
        if (UpdateId) {
            var obj = {
                ehsDueDate: EditEhsEntryDriver.ehsDueDate,
                ehsStatus: EditEhsEntryDriver.ehsStatus,
                remarks:EditEhsEntryDriver.remarks,
                file: ""
            }
            setInitialValues(obj);
        }
    }, [EditEhsEntryDriver]);

    useEffect(() => {
    }, []);

    return (
        <div>
            <MultiStepForm
                initialValues={initialValues}
                onSubmit={async (values) => {
                    var jsonData
                    if(UpdateId) {
                        jsonData = {
                            ehsMandatoryStatus: EditEhsEntryDriver.ehsMandate,
                            ehsFrequency: EditEhsEntryDriver.ehsFrequency,
                            ehsId: EditEhsEntryDriver.id,
                            driverId: DriverId,
                            ehsFileUrl: "",
                            id: UpdateId
    
                        }
                    } else {
                        jsonData = {
                            ehsMandatoryStatus: EditEhsEntryDriver.ehsMandate,
                            ehsFrequency: EditEhsEntryDriver.ehsFrequency,
                            ehsId: EditEhsEntryDriver.id,
                            driverId: DriverId,
                            ehsFileUrl: ""
    
                        }
                    }
                    
                    jsonData = { ...jsonData, ...values };
                    console.log({ "driverEhsDTO": jsonData }, values)
                    var formData = new FormData()
                    formData.append('model', JSON.stringify({ "driverEhsDTO": jsonData }));
                    formData.append('file', new Blob([values.file], {
                        type: "multipart/form-data"
                    }));
                    const response = await ComplianceService.addEhsEntryDriver(formData);
                    if(UpdateId) {
                        if (response.status === 201) {
                            dispatch(toggleToast({ message: 'Driver EHS details updated successfully!', type: 'success' }));
                        } else {
                            dispatch(toggleToast({ message: 'Driver EHS details not added. Please try again later!', type: 'success' }));
                        }
                    }else  {
                        if (response.status === 201) {
                            dispatch(toggleToast({ message: 'Driver EHS details added successfully!', type: 'success' }));
                        } else {
                            dispatch(toggleToast({ message: 'Driver EHS details not added. Please try again later!', type: 'success' }));
                        }
                    }
                }}
            >
                <FormStep
                    stepName="EHS Details"
                    onSubmit={() => { return true; }}
                    validationSchema={validationSchemaStepOne}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextInputField
                            name="ehsDueDate"
                            label="Checked Due Date" />
                        <TextInputField
                            name="ehsStatus"
                            label="EHS Status" />
                        <TextInputField
                            name="remarks"
                            label="Enter Admin Remarks" />
                    </div>
                </FormStep>
                <FormStep
                    stepName="Upload Files"
                    validationSchema={validationSchemaStepTwo}
                >
                    <FileInputField
                        name="file"
                        label="File" />
                </FormStep>
            </MultiStepForm>
        </div >
    )
}

export default AddEhsEntryDriver;