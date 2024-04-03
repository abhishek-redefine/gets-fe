import React, { useEffect, useState } from 'react';
import { EHS_ENTRY_TYPES, PENDING_APPROVAL_TYPES } from '@/constants/app.constants.';
import compliance from '@/layouts/compliance';
import DriverEhsEntry from '@/components/compliance/driverEhsEntry';
import VehicleEhsEntry from '@/components/compliance/vehicleEhsEntry';

const EHSEntry = () => {
    const [currentState, setCurrentState] = useState(PENDING_APPROVAL_TYPES.DRIVER);

    const ComplianceType = [
        {
            defaultValue: "DRIVER",
            displayName: "Driver",
            value: "DRIVER"
        },
        {
            defaultValue: "VEHICLE",
            displayName: "Vehicle",
            value: "VEHICLE"
        }
    ]

    const changeState = (newState) => {
        setCurrentState(newState.value);
    }

    const onSuccess = () => {

    };

    return (
        <div className='mainSettingsContainer'>
            <div className='currentStateContainer'>
                {
                    ComplianceType.map((complianceType, idx) => (
                        <button key={idx} onClick={() => changeState(complianceType)} className={`btn btn-secondary ${currentState === complianceType.value ? 'btn-blk' : ''}`}>{complianceType.displayName}</button>
                    ))
                }
            </div>
            <div>
                {currentState === EHS_ENTRY_TYPES.DRIVER && <DriverEhsEntry onSuccess={onSuccess} />}
                {currentState === EHS_ENTRY_TYPES.VEHICLE && <VehicleEhsEntry onSuccess={onSuccess} />}
            </div>
        </div>
    );
}

export default compliance(EHSEntry);