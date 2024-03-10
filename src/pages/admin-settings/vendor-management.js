import React, { useEffect, useState } from 'react';
import AdminSettings from '@/layouts/admin-settings';
import EmployeeManagement from '@/components/user-management/employee';
import EscortManagement from '@/components/user-management/escort';
import AdminManagement from '@/components/user-management/admin';
import VendorTeamManagement from '@/components/user-management/vendor-team';
import TeamManagement from '@/components/user-management/team-managment';
import { useDispatch, useSelector } from 'react-redux';
import MasterDataService from '@/services/masterdata.service';
import { setMasterData } from '@/redux/master.slice';
import { MASTER_DATA_TYPES, ROLE_TYPES, USER_TYPES } from '@/constants/app.constants.';

const VendorManagement = () => {
    
    const [currentState, setCurrentState] = useState(USER_TYPES.EMPLOYEE);
    const [selectedRoleType, setSelectedRoleType] = useState(ROLE_TYPES.EMPLOYEE);

    const { UserType } = useSelector((state) => state.master);
    const dispatch = useDispatch();
    const fetchMasterData = async (type) => {
        try {
            const response = await MasterDataService.getMasterData(type);
            const { data } = response || {};
            if (data?.length) {
                dispatch(setMasterData({data, type}));
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
        setCurrentState(newState.value);
        setSelectedRoleType(newState.defaultValue);
    }

    const onSuccess = () => {

    };

    return (
        <div className='mainSettingsContainer'>
            <h2>User Management</h2>
            <div className='currentStateContainer'>
                
                {!!UserType?.length && 
                UserType.map((userType, idx) => (
                    userType.value !== USER_TYPES.DRIVER && <button key={idx} onClick={() => changeState(userType)} className={`btn btn-secondary ${currentState === userType.value ? 'btn-blk' : ''}`}>{userType.displayName}</button>
                ))}
            </div>
            <div>
                {currentState === USER_TYPES.EMPLOYEE && <EmployeeManagement onSuccess={onSuccess} roleType={selectedRoleType} />}
                {currentState === USER_TYPES.ESCORT && <EscortManagement onSuccess={onSuccess} />}
                {currentState === USER_TYPES.ADMIN && <AdminManagement onSuccess={onSuccess} roleType={selectedRoleType} />}
                {currentState === USER_TYPES.VENDOR_TEAM && <VendorTeamManagement onSuccess={onSuccess} roleType={selectedRoleType} />}
                {currentState === USER_TYPES.TEAM && <TeamManagement onSuccess={onSuccess} />}
            </div>
        </div>
    );
}

export default AdminSettings(VendorManagement);