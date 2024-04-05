import withAuthLayout from '@/layouts/auth';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const compliance = (WrappedComponent) => {
    const Compliance = (props) => {

        const router = useRouter();
        const [currentActiveState, setCurrentActiveState] = useState('');

        const changeRoute = (routeName) => {
            router.push(routeName);
            setCurrentActiveState(routeName);
        };

        useEffect(() => {
            try{
                let routeName = router?.pathname?.split("/");
                routeName = routeName?.[routeName?.length - 1];
                if (routeName) {
                    setCurrentActiveState(routeName);
                }
            }
            catch(err){
                console.log(err);
            }
            
        }, []);
    
        return (
            <div className='mainSettingsContainer'>
                <div className='currentStateContainer'>
                    <button onClick={() => changeRoute('driver-profile')} className={`btn btn-secondary ${currentActiveState === 'driver-profile' ? 'btn-blk' : ''}`}>Driver Profile</button>
                    <button onClick={() => changeRoute('vehicle-profile')} className={`btn btn-secondary ${currentActiveState === 'vehicle-profile' ? 'btn-blk' : ''}`}>Vehicle Profile</button>
                    <button onClick={() => changeRoute('driver-compliance')} className={`btn btn-secondary ${currentActiveState === 'driver-compliance' ? 'btn-blk' : ''}`}>Driver Compliance</button>
                    <button onClick={() => changeRoute('vehicle-compliance')} className={`btn btn-secondary ${currentActiveState === 'vehicle-compliance' ? 'btn-blk' : ''}`}>Vehicle Compliance</button>
                    {/* <button onClick={() => changeRoute('gps-devices')} className={`btn btn-secondary ${currentActiveState === 'gps-devices' ? 'btn-blk' : ''}`}>GPS Devices</button> */}
                    <button onClick={() => changeRoute('ehs')} className={`btn btn-secondary ${currentActiveState === 'ehs' ? 'btn-blk' : ''}`}>EHS</button>
                    <button onClick={() => changeRoute('ehsEntry')} className={`btn btn-secondary ${currentActiveState === 'ehsEntry' ? 'btn-blk' : ''}`}>EHS Entry</button>
                    <button onClick={() => changeRoute('vendor')} className={`btn btn-secondary ${currentActiveState === 'vendor' ? 'btn-blk' : ''}`}>Vendor</button>
                    <button onClick={() => changeRoute('vehicle-driver-mapping')} className={`btn btn-secondary ${currentActiveState === 'vehicle-driver-mapping' ? 'btn-blk' : ''}`}>Vehicle Driver Mapping</button>
                    <button onClick={() => changeRoute('pending-approvals')} className={`btn btn-secondary ${currentActiveState === 'pending-approvals' ? 'btn-blk' : ''}`}>Pending Approvals</button>
                </div>
                <div>
                    <WrappedComponent {...props} />
                </div>
            </div>
        );
    };
    return withAuthLayout(Compliance);
}

export default compliance;