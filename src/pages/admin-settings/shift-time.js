import React, { useEffect, useState } from 'react';
import AdminSettings from '@/layouts/admin-settings';
import ShiftTeamMapping from '@/components/shift-time/shift_team_mapping';
import ShiftCutoff from '@/components/shift-time/shift_cutoff';
import ViewShiftTime from '@/components/shift-time/view_shift_time';
import { useDispatch, useSelector } from 'react-redux';
import MasterDataService from '@/services/masterdata.service';
import { setMasterData } from '@/redux/master.slice';
import { MASTER_DATA_TYPES, ROLE_TYPES, SHIFT_TYPES } from '@/constants/app.constants.';
import CreateShiftTime from '@/components/shift-time/create_shift_time';

const ShiftTime = () => {
    const [currentState, setCurrentState] = useState(SHIFT_TYPES.CREATE_SHIFT_TIME);
    const [selectedRoleType, setSelectedRoleType] = useState(ROLE_TYPES.EMPLOYEE);

    // const { UserType } = useSelector((state) => state.master);
    const UserType = [
        { displayName: 'Create Shift Time', value: 'CREATE_SHIFT_TIME' },
        { displayName: 'Shift Team Mapping', value: 'SHIFT_TEAM_MAPPING' },
        { displayName: 'Shift cutoff', value: 'SHIFT_CUTOFF' },
        { displayName: 'View Shift Time', value: 'VIEW_SHIFT_TIME' }
    ];
    const dispatch = useDispatch();
    const fetchMasterData = async (type) => {
        try {
            const response = await MasterDataService.getMasterData(type);
            const { data } = response || {};
            if (data?.length) {
                dispatch(setMasterData({ data, type }));
            }
        } catch (e) {

        }
    };

    useEffect(() => {
        if (!UserType?.length) {
            fetchMasterData(MASTER_DATA_TYPES.USER_TYPE);
        }
    }, []);


    const changeState = (newState) => {
        console.log("newState", newState.defaultValue);
        setCurrentState(newState.value);
        setSelectedRoleType(newState.defaultValue);
    }

    const onSuccess = () => {
        setCurrentState('VIEW_SHIFT_TIME');
        //setSelectedRoleType(newState.defaultValue);
    };

    return (
        <div className='mainSettingsContainer'>
            <h2>Shift Time</h2>
            <div className='currentStateContainer'>
                {!!UserType?.length &&
                    UserType.map((userType, idx) => (
                        userType.value !== SHIFT_TYPES.DRIVER && <button key={idx} onClick={() => changeState(userType)} className={`btn btn-secondary ${currentState === userType.value ? 'btn-blk' : ''}`}>{userType.displayName}</button>
                    ))}
            </div>
            <div>
                {currentState === SHIFT_TYPES.CREATE_SHIFT_TIME && <CreateShiftTime onSuccess={onSuccess} />}
                {currentState === SHIFT_TYPES.SHIFT_TEAM_MAPPING && <ShiftTeamMapping onSuccess={onSuccess} />}
                {currentState === SHIFT_TYPES.SHIFT_CUTOFF && <ShiftCutoff onSuccess={onSuccess} roleType={selectedRoleType} />}
                {currentState === SHIFT_TYPES.VIEW_SHIFT_TIME && <ViewShiftTime onSuccess={onSuccess} roleType={selectedRoleType} />}
            </div>
        </div>
    );
}

export default AdminSettings(ShiftTime);