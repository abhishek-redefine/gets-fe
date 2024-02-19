import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Alert, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { toggleToast } from '@/redux/company.slice';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ACCESS_TOKEN } from '@/constants/app.constants.';

const withAuthLayout = (WrappedComponent) => {

  const WithAuthLayout = (props) => {

    const router = useRouter();

    useEffect(() => {
      let token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        router.push("/");
      }
    }, []);

    const [currentActiveState, setCurrentActiveState] = useState('admin-settings');
    const dispatch = useDispatch();
    const { toast, toastDuration } = useSelector((state) => state.company);

    const closeToast = () => {
      dispatch(toggleToast({ message: '', type: 'success' }));
    };

    const changeRoute = (routeName) => {
      setCurrentActiveState(routeName);
    };

    return (
      <div>
        <Head>
          <title>Ganga Tourism</title>
          <meta name="description" content="Ganga Tourism" />
          <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <header>
          <div className='headerLogoContainer'>
            <img src='/images/logo_blk.png' width={150} />
          </div>
          <div className='headerNavContainer'>
            <nav>
              <Link onClick={() => changeRoute('dashboard')} className={currentActiveState === 'dashboard' && 'selected' || ''} href='/dashboard'>Dashboard</Link>
              <Link onClick={() => changeRoute('helpdesk')} className={currentActiveState === 'helpdesk' && 'selected' || ''} href='/helpdesk'>Helpdesk</Link>
              <Link onClick={() => changeRoute('bookings')} className={currentActiveState === 'bookings' && 'selected' || ''} href='/bookings'>Bookings</Link>
              <Link onClick={() => changeRoute('dispatch')} className={currentActiveState === 'dispatch' && 'selected' || ''} href='/dispatch'>Dispatch</Link>
              <Link onClick={() => changeRoute('tracking')} className={currentActiveState === 'tracking' && 'selected' || ''} href='/tracking'>Tracking</Link>
              <Link onClick={() => changeRoute('billing')} className={currentActiveState === 'billing' && 'selected' || ''} href='/billing'>Billing</Link>
              <Link onClick={() => changeRoute('admin-settings')} className={currentActiveState === 'admin-settings' && 'selected' || ''} href='/admin-settings/access-control'>Admin Settings</Link>
              <Link onClick={() => changeRoute('configurations')} className={currentActiveState === 'configurations' && 'selected' || ''} href='/configurations'>Configurations</Link>
            </nav>
          </div>
          <div className='headerBellContainer'>
            <span className="material-symbols-outlined">notifications</span>
            <p>GETS</p>
          </div>
        </header>
        <main>
          <WrappedComponent {...props} />
        </main>
        <Snackbar open={toast.message ? true : false} onClose={(e) => closeToast()} autoHideDuration={toastDuration}>
          <Alert severity={toast.type}>{toast.message}</Alert>
        </Snackbar>
      </div>
    )
  };

  return WithAuthLayout;
};

export default withAuthLayout;