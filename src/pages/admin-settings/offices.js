import React, { useEffect, useState } from 'react';
import AdminSettings from '@/layouts/admin-settings';
import { useDispatch } from 'react-redux';
import MasterDataService from '@/services/masterdata.service';
import { setMasterData } from '@/redux/master.slice';
import OfficesListing from '@/components/offices/offices-listing';
import OfficesMapping from '@/components/offices/offices-mapping';
import OfficeService from '@/services/office.service';

const Client = () => {
    
    const [currentState, setCurrentState] = useState(1);

    const [officeListing, setOfficeListing] = useState();
    
    const fetchAllOffices = async () => {
        try {
            const response = await OfficeService.getAllOffices();
            const { data } = response || {};
            const { clientOfficeDTO } = data || {};
            setOfficeListing(clientOfficeDTO);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() =>{
        fetchAllOffices();
    }, []);


    const changeState = (newState) => {
        setCurrentState(newState);
    }

    const onSuccess = () => {

    };

    return (
        <div className='mainSettingsContainer'>
            <h2>Offices</h2>
            <div className='currentStateContainer'>
            <button onClick={() => changeState(1)} className={`btn btn-secondary ${currentState === 1 ? 'btn-blk' : ''}`}>Office Listing</button>
            <button onClick={() => changeState(2)} className={`btn btn-secondary ${currentState === 2 ? 'btn-blk' : ''}`}>Office Mappings</button>
            </div>
            <div>
                {currentState === 1 && <OfficesListing officeListing={officeListing} onSuccess={onSuccess} />}
                {currentState === 2 && <OfficesMapping officeListing={officeListing} onSuccess={onSuccess} />}
            </div>
        </div>
    );
}

export default AdminSettings(Client);