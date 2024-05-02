import React, { useEffect, useState } from 'react';
import styles from '@/styles/AdminSettings.module.css';
import WithAuthLayout from '@/layouts/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';

const adminSettings = (WrappedComponent) => {
    const AdminSettings = (props) => {

        const route = useRouter();
        const [currentActiveState, setCurrentActiveState] = useState('');

        const changeRoute = (routeName) => {
            setCurrentActiveState(routeName);
        };

        useEffect(() => {
            let routeName = route?.pathname?.split("/");
            routeName = routeName?.[routeName?.length - 1];
            if (routeName) {
                setCurrentActiveState(routeName);
            }
        }, []);

        return (
            <div className={styles.adminContainer}>
                <div className={styles.leftMenuContainer}>
                    <nav>
                        <Link onClick={() => changeRoute('client')} className={currentActiveState === 'client' && styles.selected || ''} href='client'>Client</Link><br />
                        <Link onClick={() => changeRoute('offices')} className={currentActiveState === 'offices' && styles.selected || ''} href='offices'>Offices</Link><br />
                        <Link onClick={() => changeRoute('shift-time')} className={currentActiveState === 'shift-time' && styles.selected || ''} href='shift-time'>Shift Time</Link><br />
                        <Link onClick={() => changeRoute('user-management')} className={currentActiveState === 'user-management' && styles.selected || ''} href='user-management'>User Management</Link><br />
                        <Link onClick={() => changeRoute('routing')} className={currentActiveState === 'routing' && styles.selected || ''} href='routing'>Routing</Link><br />
                        <Link onClick={() => changeRoute('compliance')} className={currentActiveState === 'compliance' && styles.selected || ''} href='compliance'>Compliance</Link><br />
                        {/* <Link onClick={() => changeRoute('booking')} className={currentActiveState === 'booking' && styles.selected || ''} href='booking'>Booking</Link><br />
                    <Link onClick={() => changeRoute('routing')} className={currentActiveState === 'routing' && styles.selected || ''} href='routing'>Routing</Link><br />
                    <Link onClick={() => changeRoute('billing')} className={currentActiveState === 'billing' && styles.selected || ''} href='billing'>Billing</Link><br />
                    <Link onClick={() => changeRoute('invoice')} className={currentActiveState === 'invoice' && styles.selected || ''} href='invoice'>Invoice</Link><br />
                    <Link onClick={() => changeRoute('driver-app')} className={currentActiveState === 'driver-app' && styles.selected || ''} href='driver-app'>Driver App</Link><br />
                    <Link onClick={() => changeRoute('employee-app')} className={currentActiveState === 'employee-app' && styles.selected || ''} href='employee-app'>Employee App</Link><br /> */}
                        <Link onClick={() => changeRoute('access-control')} className={currentActiveState === 'access-control' && styles.selected || ''} href='access-control'>Access Control</Link><br />
                        {/* <Link onClick={() => changeRoute('vendor-management')} className={currentActiveState === 'vendor-management' && styles.selected || ''} href='vendor-management'>Vendor Management</Link><br /> */}
                        {/*<Link onClick={() => changeRoute('communication')} className={currentActiveState === 'communication' && styles.selected || ''} href='communication'>Communication</Link><br />
                    <Link onClick={() => changeRoute('reports')} className={currentActiveState === 'reports' && styles.selected || ''} href='reports'>Reports</Link><br />
                    <Link onClick={() => changeRoute('security')} className={currentActiveState === 'security' && styles.selected || ''} href='security'>Security</Link><br />
                    <Link onClick={() => changeRoute('templates')} className={currentActiveState === 'templates' && styles.selected || ''} href='templates'>Templates</Link> */}
                    </nav>
                </div>
                <div className={styles.rightContainer}>
                    <WrappedComponent {...props} />
                </div>
            </div>
        );
    };

    return WithAuthLayout(AdminSettings);
};

export default adminSettings;