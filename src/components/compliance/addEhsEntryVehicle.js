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

const AddEhsEntryVehicle = ({ EditEhsEntryVehicle, VehicleId, UpdateId }) => {
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
                ehsDueDate: EditEhsEntryVehicle.ehsDueDate,
                ehsStatus: EditEhsEntryVehicle.ehsStatus,
                remarks:EditEhsEntryVehicle.remarks,
                file: ""
            }
            setInitialValues(obj);
        }
    }, [EditEhsEntryVehicle]);

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
                            ehsMandatoryStatus: EditEhsEntryVehicle.ehsMandate,
                            ehsFrequency: EditEhsEntryVehicle.ehsFrequency,
                            ehsId: EditEhsEntryVehicle.id,
                            vehicleId: VehicleId,
                            ehsFileUrl: "",
                            id: UpdateId
                        }
                    } else {
                        jsonData = {
                            ehsMandatoryStatus: EditEhsEntryVehicle.ehsMandate,
                            ehsFrequency: EditEhsEntryVehicle.ehsFrequency,
                            ehsId: EditEhsEntryVehicle.id,
                            vehicleId: VehicleId,
                            ehsFileUrl: ""
                        }
                    }
                    
                    jsonData = { ...jsonData, ...values };
                    var formData = new FormData()
                    formData.append('model', JSON.stringify({ "vehicleEhsDTO": jsonData }));
                    formData.append('file', new Blob([values.file], {
                        type: "multipart/form-data"
                    }));
                    const response = await ComplianceService.addEhsEntryVehicle(formData);
                    if(UpdateId) {
                        if (response.status === 201) {
                            dispatch(toggleToast({ message: 'Vehicle EHS details updated successfully!', type: 'success' }));
                        } else {
                            dispatch(toggleToast({ message: 'Vehicle EHS details not added. Please try again later!', type: 'success' }));
                        }
                    }else  {
                        if (response.status === 201) {
                            dispatch(toggleToast({ message: 'Vehicle EHS details added successfully!', type: 'success' }));
                        } else {
                            dispatch(toggleToast({ message: 'Vehicle EHS details not added. Please try again later!', type: 'success' }));
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
                >
                    <FileInputField
                        name="file"
                        label="File" />
                </FormStep>
            </MultiStepForm>
        </div>
    )
}

export default AddEhsEntryVehicle;