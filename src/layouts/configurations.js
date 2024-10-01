import React, { useEffect, useState } from 'react';
import styles from '@/styles/AdminSettings.module.css';
import WithAuthLayout from '@/layouts/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';

const configurations = (WrappedComponent) => {
    const Configurations = (props) => {

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
                        <Link onClick={() => changeRoute('offices')} className={currentActiveState === 'offices' && styles.selected || ''} href='offices'>Offices</Link><br />
                        <Link onClick={() => changeRoute('employee')} className={currentActiveState === 'employee' && styles.selected || ''} href='employee'>Employee</Link><br />
                        <Link onClick={() => changeRoute('compliance')} className={currentActiveState === 'compliance' && styles.selected || ''} href='compliance'>Compliance</Link><br />
                        <Link onClick={() => changeRoute('driver-app')} className={currentActiveState === 'driver-app' && styles.selected || ''} href='driver-app'>Driver App</Link><br />
                        <Link onClick={() => changeRoute('communication')} className={currentActiveState === 'communication' && styles.selected || ''} href='communication'>Communication</Link><br />
                    </nav>
                </div>
                <div className={styles.rightContainer}>
                    <WrappedComponent {...props} />
                </div>
            </div>
        );
    };

    return WithAuthLayout(Configurations);
};

export default configurations;