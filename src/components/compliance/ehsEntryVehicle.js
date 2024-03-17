import React, { useEffect, useState } from 'react';
import Grid from '@/components/grid';
import ComplianceService from '@/services/compliance.service';
import { useDispatch } from 'react-redux';
import AddEhsEntryVehicle from './addEhsEntryVehicle';

const EhsEntryVehicle = ({ EhsVehicleData }) => {
    console.log('EhsEntryVehicle', EhsVehicleData);
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
        {
            key: "ehsDueDate",
            display: "EHS Due Date"
        },
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
    console.log("EhsEntryVehicle", EhsVehicleData)
    const [editEhsEntryVehicleOpen, setEditEhsEntryVehicleOpen] = useState(false)
    const [editEhsEntryVehicle, setEditEhsEntryVehicle] = useState(false)
    const [ehsVehicleData, setEhsVehicleData] = useState()

    const onMenuItemClick = async (key, clickedItem) => {
        if (key === "addValues") {
            setEditEhsEntryVehicle(clickedItem);
            setEditEhsEntryVehicleOpen(true);
        }
    };

    const initializer = async () => {
        try {
            const response = await ComplianceService.getAllEHS();
            var data = response.data.paginatedResponse.content.filter((item) => {
                return item.ehsAppliedOnDriver == false
            });
            const response1 = await ComplianceService.getSelectedVehicleEHS(EhsVehicleData.id);
            var alreadyAvailableData = response1.data.vehicleEhsDTO;
            data.map((item) => {
                item.specialId =""
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
            setEhsVehicleData(data);
        } catch (e) {
        }
    }

    useEffect(() => {
        initializer();
    }, []);

    return (
        <div className='internalSettingContainer'>
            {!editEhsEntryVehicleOpen && <div>
                <h4 className='pageSubHeading'>Vehicle Summary</h4>
                <div className='addUpdateFormContainer'>
                    <div>
                        <div className='form-control-input'>
                            <div style={{ fontWeight: '700' }}>Vehicle Id</div>
                            <div>{EhsVehicleData.vehicleId}</div>
                        </div>
                        <div className='form-control-input'>
                            <div style={{ fontWeight: '700' }}>Vehicle Make</div>
                            <div>{EhsVehicleData.vehicleMake}</div>
                        </div>
                        <div className='form-control-input'>
                            <div style={{ fontWeight: '700' }}>Vehicle Model</div>
                            <div>{EhsVehicleData.vehicleModel}</div>
                        </div>
                        <div className='form-control-input'>
                            <div style={{ fontWeight: '700' }}>Vehicle Owner Name</div>
                            <div>{EhsVehicleData.vehicleOwnerName}</div>
                        </div>
                    </div>
                    <div>
                        <div className='form-control-input'>
                            <div style={{ fontWeight: '700' }}>Fuel Type</div>
                            <div>{EhsVehicleData.fuelType}</div>
                        </div>
                        <div className='form-control-input'>
                            <div style={{ fontWeight: '700' }}>Induction Date</div>
                            <div>{EhsVehicleData.inductionDate}</div>
                        </div>
                        <div className='form-control-input'>
                            <div style={{ fontWeight: '700' }}>Manufacturing Date</div>
                            <div>{EhsVehicleData.manufacturingDate}</div>
                        </div>
                        <div className='form-control-input'>
                            <div style={{ fontWeight: '700' }}>Status</div>
                            <div>{EhsVehicleData.complianceStatus}</div>
                        </div>
                    </div>
                </div>
                <div className='gridContainer'>
                    <Grid headers={headers} listing={ehsVehicleData} onMenuItemClick={onMenuItemClick} />
                </div>
            </div>}
            {
                editEhsEntryVehicleOpen && <AddEhsEntryVehicle EditEhsEntryVehicle={editEhsEntryVehicle} VehicleId={EhsVehicleData.id} UpdateId={editEhsEntryVehicle.specialId !== "" ? editEhsEntryVehicle.specialId : false} />
            }
        </div>
    );
}

export default EhsEntryVehicle;


