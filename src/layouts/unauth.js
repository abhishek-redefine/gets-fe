import React, { useEffect } from 'react';
import Head from 'next/head';
import { Alert, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { toggleToast } from '@/redux/company.slice';
import { useRouter } from 'next/router';
import { ACCESS_TOKEN } from '@/constants/app.constants.';
import { ADMIN_AUTH_URLS } from '@/constants/url.constants';

const withLayout = (WrappedComponent) => {
  const WithLayout = (props) => {

    const router = useRouter();

    useEffect(() => {
      let userToken = localStorage.getItem(ACCESS_TOKEN);
      if (userToken) {
        router.push(ADMIN_AUTH_URLS.ACCESS_CONTROL);
      }
    }, []);

    const dispatch = useDispatch();
    const { toast, toastDuration } = useSelector((state) => state.company);

    const closeToast = () => {
      dispatch(toggleToast({ message: '', type: 'success' }));
    };
    
    return (
      <div>
        <Head>
          <title>Ganga Tourism</title>
          <meta name="description" content="Ganga Tourism" />
          <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <WrappedComponent {...props} />
        <Snackbar open={toast.message ? true : false} onClose={(e) => closeToast()} autoHideDuration={toastDuration}>
          <Alert severity={toast.type}>{toast.message}</Alert>
        </Snackbar>
      </div>
    )
};

  return WithLayout;
};

export default withLayout;