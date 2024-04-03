import React, { useEffect, useState } from 'react';
import Grid from '../grid';
import UploadButton from '../buttons/uploadButton';
import AddEHS from './addEHS';
import ComplianceService from '@/services/compliance.service';
import { display } from '@mui/system';

const EHS = () => {
    const headers = [
        {
            key: "ehsTitle",
            display: "EHS Title"
        },
        {
            key: "ehsCategory",
            display: "EHS Category"
        },
        {
            key: "ehsMandate",
            display: "EHS Mandate"
        },
        {
            key: "ehsFrequency",
            display: "EHS Frequency"
        },
        {
            key: "createdAt",
            display: "Created At"
        },
        {
            key: 'updatedAt',
            display:'Updated At'
        },
        {
            key: "vehicleType",
            display: "Vehicle Type"
        },
        {
            key: "hamburgerMenu",
            html: <><span className="material-symbols-outlined">more_vert</span></>,
            navigation: true,
            menuItems: [{
                display: "Edit",
                key: "edit"
            },
            {
                display: "Deactivate",
                key: "deactivate"
            }]
        }];

    const [isAddEHS, setIsAddEHS] = useState(false);
    const [ehsListing, setEhsListing] = useState();
    const [editEhsData, setEditEhsData] = useState({});
    const [pagination ,setPagination] = useState({
        pageNo : 0,
        pageSize : 10
    })

    const fetchAllEHS = async () => {
        try {
            let params = new URLSearchParams(pagination);
            const response = await ComplianceService.getAllEHS(params, {});
            setEhsListing(response.data.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchAllEHS();
    }, [isAddEHS]);

    const onMenuItemClick = (key, values) => {
        if (key === "edit") {
            setEditEhsData(values);
            setIsAddEHS(true);
        }
    };

    return (
        <div className='internalSettingContainer'>
            {!isAddEHS && <div>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <div className='btnContainer'>
                        <button onClick={() => setIsAddEHS(true)} className='btn btn-primary'>Add EHS</button>
                    </div>
                </div>
                <div className='gridContainer'>
                    <Grid onMenuItemClick={onMenuItemClick} headers={headers} listing={ehsListing} />
                </div>
            </div>}
            {
                isAddEHS && <div>
                    <AddEHS EditEhsData={editEhsData} SetIsAddEhs={setIsAddEHS} />
                </div>
            }
        </div>
    );
}

export default EHS;