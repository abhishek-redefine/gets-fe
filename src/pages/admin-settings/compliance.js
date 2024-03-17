import React, { useEffect, useState } from 'react';
import AdminSettings from '@/layouts/admin-settings';
import { COMPLIANCE_TYPES } from '@/constants/app.constants.';
import EHS from '@/components/compliance/ehs';
import Penalty from '@/components/compliance/penalty';

const Compliance = () => {
    const [currentState, setCurrentState] = useState(COMPLIANCE_TYPES.EHS);

    const ComplianceType = [
        {
            defaultValue: "EHS",
            displayName: "Ehs",
            value: "EHS"
        },
        {
            defaultValue: "PENALTY",
            displayName: "Penalty",
            value: "PENALTY"
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
                {currentState === COMPLIANCE_TYPES.EHS && <EHS onSuccess={onSuccess} />}
                {currentState === COMPLIANCE_TYPES.PENALTY && <Penalty onSuccess={onSuccess} />}
            </div>
        </div>
    );
}

export default AdminSettings(Compliance);