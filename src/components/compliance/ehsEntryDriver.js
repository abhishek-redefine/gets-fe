import React, { useEffect, useState } from 'react';
import Grid from '@/components/grid';
import ComplianceService from '@/services/compliance.service';
import { useDispatch } from 'react-redux';
import AddEhsEntryDriver from './addEhsEntryDriver';

const EhsEntryDriver = ({ EhsDriverData }) => {
    console.log('EhsEntryDriver', EhsDriverData);
    const headers = [
        {
            key: "ehsTitle",
            display: "Ehs Name"
        },
        {
            key: "ehsMandate",
            display: "Mandatory Status"
        },
        {
            key: "ehsFrequency",
            display: "Frequency"
        },

        {
            key: "ehsStatus",
            display: "EHS Status"

        },
        // {
        //     key: "ehsDueDate",
        //     display: "EHS Due Date"
        // },
        {
            key: "remarks",
            display: "Remarks"
        },
        {
            key: "hamburgerMenu",
            html: <><span className="material-symbols-outlined">more_vert</span></>,
            navigation: true,
            menuItems: [
                {
                    display: "Add values",
                    key: "addValues"
                }
            ]
        }];

    const dispatch = useDispatch();

    const [editEhsEntryDriverOpen, setEditEhsEntryDriverOpen] = useState(false)
    const [editEhsEntryDriver, setEditEhsEntryDriver] = useState(false)
    const [ehsDriverData, setEhsDriverData] = useState()

    const onMenuItemClick = async (key, clickedItem) => {
        if (key === "addValues") {
            setEditEhsEntryDriver(clickedItem);
            setEditEhsEntryDriverOpen(true);
        }
    };

    const initializer = async () => {
        try {
            const response = await ComplianceService.getAllEHS();
            var data = response.data.paginatedResponse.content.filter((item) => {
                return item.ehsAppliedOnDriver == true
            });
            const response1 = await ComplianceService.getSelectedDriverEHS(EhsDriverData.id);
            var alreadyAvailableData = response1.data.driverEhsDTO;
            data.map((item) => {
                item.specialId = ""
                var dataToMap = alreadyAvailableData.filter((data) => data.ehsId === item.id);
                if (dataToMap.length > 0) {
                    item.ehsStatus = dataToMap[0].ehsStatus;
                    item.ehsDueDate = dataToMap[0].ehsDueDate;
                    item.remarks = dataToMap[0].remarks;
                    item.specialId = dataToMap[0].id
                } else {
                    item.ehsStatus = "";
                    item.ehsDueDate = "";
                    item.remarks = "";
                }
            })
            setEhsDriverData(data);
        } catch (e) {
        }
    }

    useEffect(() => {
        initializer();
    }, []);

    return (
        <div className='internalSettingContainer'>
            {!editEhsEntryDriverOpen && <div>
                <h4 className='pageSubHeading'>User Summary</h4>
                <div className='addUpdateFormContainer'>
                    <div>
                        <div className='form-control-input'>
                            <div style={{ fontWeight: '700' }}>Name</div>
                            <div>{EhsDriverData.name}</div>
                        </div>
                        <div className='form-control-input'>
                            <div style={{ fontWeight: '700' }}>Vendor</div>
                            <div>{EhsDriverData.vendorName}</div>
                        </div>
                        <div className='form-control-input'>
                            <div style={{ fontWeight: '700' }}>Driver Id</div>
                            <div>{EhsDriverData.id}</div>
                        </div>
                        <div className='form-control-input'>
                            <div style={{ fontWeight: '700' }}>Office Id</div>
                            <div>{EhsDriverData.officeId}</div>
                        </div>
                    </div>
                    <div>
                        <div className='form-control-input'>
                            <div style={{ fontWeight: '700' }}>License No.</div>
                            <div>{EhsDriverData.licenseNo}</div>
                        </div>
                        <div className='form-control-input'>
                            <div style={{ fontWeight: '700' }}>Phone No.</div>
                            <div>{EhsDriverData.mobile}</div>
                        </div>
                        <div className='form-control-input'>
                            <div style={{ fontWeight: '700' }}>Gender</div>
                            <div>{EhsDriverData.gender}</div>
                        </div>
                        <div className='form-control-input'>
                            <div style={{ fontWeight: '700' }}>Status</div>
                            <div>{EhsDriverData.complianceStatus}</div>
                        </div>
                    </div>
                </div>
                <div className='gridContainer'>
                    <Grid headers={headers} listing={ehsDriverData} onMenuItemClick={onMenuItemClick} />
                </div>
            </div>}
            {
                editEhsEntryDriverOpen && <AddEhsEntryDriver EditEhsEntryDriver={editEhsEntryDriver} DriverId={EhsDriverData.id} UpdateId={editEhsEntryDriver.specialId !== "" ? editEhsEntryDriver.specialId : false} />
            }
        </div>
    );
}

export default EhsEntryDriver;


