import withAuthLayout from '@/layouts/auth';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const bookings = (WrappedComponent) => {
    const Bookings = (props) => {

        const router = useRouter();
        const [currentActiveState, setCurrentActiveState] = useState('');

        const changeRoute = (routeName) => {
            localStorage.removeItem('editBooking');
            router.push(routeName);
            setCurrentActiveState(routeName);
        };

        useEffect(() => {
            let routeName = router?.pathname?.split("/");
            routeName = routeName?.[routeName?.length - 1];
            if (routeName) {
                setCurrentActiveState(routeName);
            }
        }, []);
    
        return (
            <div className='mainSettingsContainer'>
                <div className='currentStateContainer'>
                    <button onClick={() => changeRoute('search-bookings')} className={`btn btn-secondary ${currentActiveState === 'search-bookings' ? 'btn-blk' : ''}`}>Search Bookings</button>
                    <button onClick={() => changeRoute('create-booking')} className={`btn btn-secondary ${currentActiveState === 'create-booking' ? 'btn-blk' : ''}`}>Create Booking</button>
                    {/* <button onClick={() => changeRoute('upload-bookings')} className={`btn btn-secondary ${currentActiveState === 'upload-bookings' ? 'btn-blk' : ''}`}>Upload Bookings</button> */}
                    <button onClick={() => changeRoute('booking-change-logs')} className={`btn btn-secondary ${currentActiveState === 'booking-change-logs' ? 'btn-blk' : ''}`}>Booking Change Logs</button>
                    {/* <button onClick={() => changeRoute('booking-approvals')} className={`btn btn-secondary ${currentActiveState === 'booking-approvals' ? 'btn-blk' : ''}`}>Booking Approvals</button> */}
                </div>
                <div>
                    <WrappedComponent {...props} />
                </div>
            </div>
        );
    };
    return withAuthLayout(Bookings);
}

export default bookings;