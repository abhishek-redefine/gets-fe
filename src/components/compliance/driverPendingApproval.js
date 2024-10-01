import React, { useEffect, useState } from 'react';
import Grid from '@/components/grid';
import ComplianceService from '@/services/compliance.service';
import xlsx from "json-as-xlsx";
import { useDispatch } from 'react-redux';
import AddDriverPendingApproval from '@/components/compliance/addDriverPendingApproval';
import { DEFAULT_PAGE_SIZE } from '@/constants/app.constants.';

const DriverPendingApproval = () => {
    const headers = [
        {
            key: "name",
            display: "Name"
        },
        {
            key: "licenseNo",
            display: "License No."
        },
        {
            key: "vendorName",
            display: "Vendor"
        },
        {
            key: "mobile",
            display: "Phone No."
        },
        {
            key: "id",
            display: "Driver ID"
        },
        {
            key: "officeId",
            display: "Office ID"
        },
        {
            key: "gender",
            display: "Gender"
        },
        {
            key: "aadharId",
            display: "Adhaar Id"
        },
        {
            key: "complianceStatus",
            display: "Compliance Status"
        },
        {
            key: "hamburgerMenu",
            html: <><span className="material-symbols-outlined">more_vert</span></>,
            navigation: true,
            menuItems: [
                {
                    display: "View Driver",
                    key: "viewDriver"
                }
            ]
        }];
    const dispatch = useDispatch();

    const [viewDriverOpen, setViewDriverOpen] = useState(false)
    const [editDriverData, setEditDriverData] = useState(false)
    const [driverData, setDriverData] = useState();
    const [loading, setLoading] = useState(false);

    //////////////////////////////////////////////////
    const [pagination, setPagination] = useState({
        page: 0,
        size: DEFAULT_PAGE_SIZE,
    });
    const [paginationData, setPaginationData] = useState();

    const handlePageChange = (page) => {
        let updatedPagination = {...pagination};
        updatedPagination.page = page;
        setPagination(updatedPagination);
    };

    //////////////////////////////////////////////////

    const downloadReport = () => {
        var data = [
            {
                sheet: "Driver Report",
                columns: [
                    { label: "Aadhar Id", value: "aadharId" },
                    { label: "Address", value: "address" },
                    { label: "Alt Mobile", value: "altMobile" },
                    { label: "Badge Url", value: "badgeUrl" },
                    { label: "BGV Url", value: "bgvUrl" },
                    { label: "Driving Training Certificate Url", value: "driverTrainingCertUrl" },
                    { label: "Email", value: "email" },
                    { label: "Enabled", value: "enabled" },
                    { label: "Gender", value: "gender" },
                    { label: "ID", value: "id" },
                    { label: "License No", value: "licenseNo" },
                    { label: "License Url", value: "licenseUrl" },
                    { label: "Medical Certificate Url", value: "medicalCertUrl" },
                    { label: "Mobile", value: "mobile" },
                    { label: "Name", value: "name" },
                    { label: "Office ID", value: "officeId" },
                    { label: "Pan No", value: "panNo" },
                    { label: "Police Verification Url", value: "policeVerificationUrl" },
                    { label: "Remarks", value: "remarks" },
                    { label: "Undertaking Url", value: "undertakingUrl" },
                    { label: "Vendor Name", value: "vendorName" },
                ],
                content: driverData,
            }
        ]

        var settings = {
            fileName: "Driver Report",
            extraLength: 20,
            writeMode: "writeFile",
            writeOptions: {},
            RTL: false,
        }

        xlsx(data, settings)
    }

    const onMenuItemClick = async (key, clickedItem) => {
        if (key === "viewDriver") {
            setEditDriverData(clickedItem);
            setViewDriverOpen(true);
        }
    };

    const initializer = async () => {
        try {
            setLoading(true);
            // await new Promise((resolve) => setTimeout(resolve, 5000));
            var filter = { complianceStatus : "PENDING"}
            let params = new URLSearchParams(pagination);
            const response = await ComplianceService.getAllDrivers(params.toString(),filter);
            const { data } = response || {};
            const { data: paginatedResponse } = data || {};
            setDriverData(paginatedResponse);
            let localPaginationData = {...data};
            delete localPaginationData?.data;
            setPaginationData(localPaginationData);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    const onSuccess = () =>{
        setViewDriverOpen(false);
    }

    useEffect(() => {
        initializer();
    }, [pagination,viewDriverOpen]);

    return (
        <div className='internalSettingContainer'>
            {!viewDriverOpen && <div>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <div className='btnContainer'>
                        <button onClick={() => downloadReport()} className='btn btn-download'>Download File</button>
                    </div>
                </div>
                <div className='gridContainer'>
                    <Grid headers={headers} listing={driverData} onMenuItemClick={onMenuItemClick} enableDisableRow={true} handlePageChange={handlePageChange} pagination={paginationData} isLoading={loading} />
                </div>
            </div>}
            {
                viewDriverOpen && <AddDriverPendingApproval ViewDetailsData={editDriverData} SetAddDriverOpen={onSuccess}/>
            }
        </div>
    );
}

export default DriverPendingApproval;


