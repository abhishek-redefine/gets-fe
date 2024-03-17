import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import ComplianceService from '@/services/compliance.service';
import { toggleToast } from '@/redux/company.slice';

const AddDriverPendingApproval = ({ ViewDetailsData }) => {
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
        "complianceStatus": "COMPLIANT",
        "ehsStatus": "true",
        "id": ""
    });

    const dispatch = useDispatch();

    function base64ToArrayBuffer(base64) {
        // var binaryString = window.atob(base64);
        var binaryLen = base64.length;
        var bytes = new Uint8Array(binaryLen);
        for (var i = 0; i < binaryLen; i++) {
            var ascii = base64.charCodeAt(i);
            bytes[i] = ascii;
        }
        return bytes;
    }

    const convertToBinary = (base64) => {
        var raw = window.btoa((encodeURIComponent(base64)));
        
        var rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength));

        for (var i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array;
    }

    const  base64ToPDF=(base64String, filename)=> {
        // Decode base64 string to byte array
        const byteCharacters = window.atob(encodeURIComponent(base64String));
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
    
        // Use one of the methods described earlier to convert byteArray to PDF
        // For example, you can use jsPDF:
        const doc = new jsPDF();
        doc.addPage();
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
        doc.addImage(byteArray, 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height);
        
        // Save or download the PDF
        if (typeof filename === 'string') {
            doc.save(filename);
        } else {
            // If no filename provided, open the PDF in a new window
            doc.output('dataurlnewwindow');
        }
    }
    
    // Example usage:
   
    
    const downloadFile = async (name) => {
        const response = await ComplianceService.downloadAWSFile(name)

        var data = convertToBinary(response.data)
        // base64ToPDF(response.data,"ABC")
        const blob = new Blob([data]);
        // window.open("data:application/pdf;base64," + window.base64topdf(data)
        // const linkSource = `data:application/pdf;base64,${data}`;
        const fileUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', 'downloaded_report.pdf'); // Set desired filename
        link.click();
        
    }

    const approveDriver = async (approveOrReject) => {
        const response = await ComplianceService.approveDriver(initialValues.id, approveOrReject);
        if (response.status === 200) {
            if (approveOrReject) {
                dispatch(toggleToast({ message: 'Driver approved successfully!', type: 'success' }));
            } else {
                dispatch(toggleToast({ message: 'Driver rejected successfully!', type: 'success' }));
            }
        }
    }

    useState(() => {
        if (ViewDetailsData?.id) {
            let newEditInfo = Object.assign(initialValues, ViewDetailsData);
            console.log('addDriverPendingApproval', newEditInfo)
            setInitialValues(newEditInfo);
        }
    }, [ViewDetailsData]);

    return (
        <div>
            <h4 className='pageSubHeading'>User Summary</h4>
            <div className='addUpdateFormContainer'>
                <div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>Name</div>
                        <div>{initialValues.name}</div>
                    </div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>Vendor</div>
                        <div>{initialValues.vendorName}</div>
                    </div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>Driver Id</div>
                        <div>{initialValues.id}</div>
                    </div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>Office Id</div>
                        <div>{initialValues.officeId}</div>
                    </div>
                </div>
                <div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>License No.</div>
                        <div>{initialValues.licenseNo}</div>
                    </div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>Phone No.</div>
                        <div>{initialValues.mobile}</div>
                    </div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>Gender</div>
                        <div>{initialValues.gender}</div>
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
                        <div style={{ fontWeight: '700' }}>License</div>
                        <div onClick={() => downloadFile(initialValues.licenseUrl.split('gets-dev')[2].slice(1))}>Click to Download</div>
                    </div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>Photo</div>
                        <div onClick={() => downloadFile(initialValues.photoUrl.split('gets-dev')[2].slice(1))}>Click to Download</div>
                    </div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>BGV</div>
                        <div onClick={() => downloadFile(initialValues.bgvUrl.split('gets-dev')[2].slice(1))}>Click to Download</div>
                    </div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>Police Verification</div>
                        <div onClick={() => downloadFile(initialValues.policeVerificationUrl.split('gets-dev')[2].slice(1))}>Click to Download</div>
                    </div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>Badge</div>
                        <div onClick={() => downloadFile(initialValues.badgeUrl.split('gets-dev')[2].slice(1))}>Click to Download</div>
                    </div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>Undertaking</div>
                        <div onClick={() => downloadFile(initialValues.undertakingUrl.split('gets-dev')[2].slice(1))}>Click to Download</div>
                    </div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>Driver Training Certificate</div>
                        <div onClick={() => downloadFile(initialValues.driverTrainingCertUrl.split('gets-dev')[2].slice(1))}>Click to Download</div>
                    </div>
                    <div className='form-control-input'>
                        <div style={{ fontWeight: '700' }}>Medical Certificate</div>
                        <div onClick={() => downloadFile(initialValues.medicalCertUrl.split('gets-dev')[2].slice(1))}>Click to Download</div>
                    </div>
                </div>
                <div className='addBtnContainer' style={{ justifyContent: 'end' }}>
                    <button className='btn btn-secondary' onClick={() => approveDriver(false)}>Reject</button>
                    <button className='btn btn-primary' onClick={() => approveDriver(true)}>Approve</button>
                </div>
            </div>
        </div>
    );
}

export default AddDriverPendingApproval;