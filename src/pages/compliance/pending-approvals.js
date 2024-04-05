import React, { useEffect, useState } from 'react';
import { PENDING_APPROVAL_TYPES } from '@/constants/app.constants.';
import DriverPendingApproval from '@/components/compliance/driverPendingApproval';
import compliance from '@/layouts/compliance';
import VehiclePendingApproval from '@/components/compliance/vehiclePendingApproval';

const Compliance = () => {
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
                {currentState === PENDING_APPROVAL_TYPES.DRIVER && <DriverPendingApproval onSuccess={onSuccess} isView={false}/>}
                {currentState === PENDING_APPROVAL_TYPES.VEHICLE && <VehiclePendingApproval onSuccess={onSuccess} isView={false}/>}
            </div>
        </div>
    );
}

export default compliance(Compliance);