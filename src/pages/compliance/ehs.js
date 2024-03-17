import React, { useEffect, useState } from 'react';
import { PENDING_APPROVAL_TYPES } from '@/constants/app.constants.';
import compliance from '@/layouts/compliance';
import EhsDriverProfile from '@/components/compliance/ehsDriverProfile';
import EhsVehicleProfile from '@/components/compliance/ehsVehicleProfile';

const EHS = () => {
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
                {currentState === PENDING_APPROVAL_TYPES.DRIVER && <EhsDriverProfile onSuccess={onSuccess} />}
                {currentState === PENDING_APPROVAL_TYPES.VEHICLE && <EhsVehicleProfile onSuccess={onSuccess} />}
            </div>
        </div>
    );
}

export default compliance(EHS);