import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import ComplianceService from '@/services/compliance.service';
import { saveAs } from 'file-saver';

const AddVehiclePendingApproval = ({ ViewDetailsData }) => {
    const [initialValues, setInitialValues] = useState({
        "vehicleId": "",
        "vehicleRegistrationNumber": "",
        "stickerNumber": "",
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
        "insuranceExpiryDate": "",
        "roadTaxExpiryDate": "",
        "pollutionExpiryDate": "",
        "statePermitExpiryDate": "",
        "nationalPermitExpiryDate": "",
        "fitnessExpiryDate": "",
        "fitnessDate": "",
        "garageLocation": "",
        "ehsStatus": "",
        "garageGeoCode": "",
        "rfidStatus": "",
        "acStatus": "",
        "gpsStatus": "",
        "vehicleRemarks": "",
        "insuranceUrl": "",
        "registrationCertificateUrl": "",
        "driverId": "",
        "ehsDoneBy": "Sultan",
        "ehsDoneAt": "2024-03-13",
        "pollutionCertificateUrl": "",
        "roadTaxCertificateUrl": "",
        "fitnessCertificateUrl": "",
        "statePermitUrl": "",
        "nationalPermitUrl": "",
        "medicalCertificateUrl": "",
        "complianceStatus": "NON_COMPLIANT"
    });

    const dispatch = useDispatch();

    const downloadFile = async (name) => {
        const response = await ComplianceService.downloadAWSFile(name)
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const fileUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', 'downloaded_report.pdf'); // Set desired filename
        link.click();
    }

    const approveVehicle = async (approveOrReject) => {
        const response = await ComplianceService.approveVehicle(initialValues.id, approveOrReject);
        if (response.status === 200) {
            if (approveOrReject) {
                dispatch(toggleToast({ message: 'Vehicle approved successfully!', type: 'success' }));
            } else {
                dispatch(toggleToast({ message: 'Vehicle rejected successfully!', type: 'success' }));
            }
        }
    }

    useState(() => {
        if (ViewDetailsData?.id) {
            let newEditInfo = Object.assign(initialValues, ViewDetailsData);
            console.log('AddVehiclePendingApproval', newEditInfo)
            setInitialValues(newEditInfo);
        }
    }, [ViewDetailsData]);

    return (
        <div>
            <h4 className='pageSubHeading'>Vehicle Summary</h4>
            <div className='addUpdateFormContainer'>
                <div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>Vehicle Id</div>
                        <div>{initialValues.vehicleId}</div>
                    </div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>Vehicle Make</div>
                        <div>{initialValues.vehicleMake}</div>
                    </div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>Vehicle Model</div>
                        <div>{initialValues.vehicleModel}</div>
                    </div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>Vehicle Owner Name</div>
                        <div>{initialValues.vehicleOwnerName}</div>
                    </div>
                </div>
                <div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>Fuel Type</div>
                        <div>{initialValues.fuelType}</div>
                    </div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>Induction Date</div>
                        <div>{initialValues.inductionDate}</div>
                    </div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>Manufacturing Date</div>
                        <div>{initialValues.manufacturingDate}</div>
                    </div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>Status</div>
                        <div>{initialValues.complianceStatus}</div>
                    </div>
                </div>
            </div>
            <h4 className='pageSubHeading' style={{ marginTop: '20px' }}>Documents</h4>
            <div className='addUpdateFormContainer'>
                <div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>Registration Certificate</div>
                        <div onClick={() => downloadFile(initialValues.registrationCertificateUrl.split('gets-dev')[2].slice(1))}>Click to Download</div>
                    </div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>Insurance</div>
                        <div onClick={() => downloadFile(initialValues.insuranceUrl.split('gets-dev')[2].slice(1))}>Click to Download</div>
                    </div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>Road Tax</div>
                        <div onClick={() => downloadFile(initialValues.roadTaxCertificateUrl.split('gets-dev')[2].slice(1))}>Click to Download</div>
                    </div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>Pollution Certificate</div>
                        <div onClick={() => downloadFile(initialValues.pollutionCertificateUrl.split('gets-dev')[2].slice(1))}>Click to Download</div>
                    </div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>Fitness Certificate</div>
                        <div onClick={() => downloadFile(initialValues.fitnessCertificateUrl.split('gets-dev')[2].slice(1))}>Click to Download</div>
                    </div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>National Permit</div>
                        <div onClick={() => downloadFile(initialValues.nationalPermitUrl.split('gets-dev')[2].slice(1))}>Click to Download</div>
                    </div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>State Permit</div>
                        <div onClick={() => downloadFile(initialValues.statePermitUrl.split('gets-dev')[2].slice(1))}>Click to Download</div>
                    </div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>Medical Certificate</div>
                        <div onClick={() => downloadFile(initialValues.medicalCertificateUrl.split('gets-dev')[2].slice(1))}>Click to Download</div>
                    </div>
                </div>
                <div className='addBtnContainer' style={{ justifyContent: 'end' }}>
                    <button className='btn btn-secondary' onClick={() => approveVehicle(false)}>Reject</button>
                    <button className='btn btn-primary' onClick={() => approveVehicle(true)}>Approve</button>
                </div>
            </div>
        </div>
    );
}

export default AddVehiclePendingApproval;