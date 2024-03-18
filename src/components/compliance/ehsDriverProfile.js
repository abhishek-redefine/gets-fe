import React, { useEffect, useState } from 'react';
import Grid from '@/components/grid';
import ComplianceService from '@/services/compliance.service';
import { useDispatch } from 'react-redux';
import EhsEntryDriver from './ehsEntryDriver';

const EhsDriverProfile = () => {
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
                    display: "Add EHS Entry",
                    key: "addEhsEntry"
                }
            ]
        }];

    const dispatch = useDispatch();

    const [ehsDriverOpen, setEhsDriverOpen] = useState(false)
    const [ehsDriverData, setEhsDriverData] = useState(false)
    const [driverData, setDriverData] = useState()

    const onMenuItemClick = async (key, clickedItem) => {
        if (key === "addEhsEntry") {
            setEhsDriverData(clickedItem);
            setEhsDriverOpen(true);
        }
    };

    const initializer = async () => {
        try {
            const response = await ComplianceService.getAllDrivers();
            setDriverData(response.data.data)
        } catch (e) {
        }
    }

    useEffect(() => {
        initializer();
    }, []);

    return (
        <div className='internalSettingContainer'>
            {!ehsDriverOpen && <div>
                <div className='gridContainer'>
                    <Grid headers={headers} listing={driverData} onMenuItemClick={onMenuItemClick} enableDisableRow={true} />
                </div>
            </div>}
            {
                ehsDriverOpen && <EhsEntryDriver EhsDriverData={ehsDriverData} SetEhsDriverOpen={setEhsDriverOpen}/>
            }
        </div>
    );
}

export default EhsDriverProfile;


