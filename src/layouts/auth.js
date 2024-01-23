import React from 'react';
import Head from 'next/head';
import { Alert, Drawer, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { toggleToast } from '@/redux/company.slice';

const withAuthLayout = (WrappedComponent) => {

  const WithAuthLayout = (props) => {

    const dispatch = useDispatch();
    const { toast, toastDuration } = useSelector((state) => state.company);

    const closeToast = () => {
      dispatch(toggleToast({ message: '', type: 'success' }));
    };

    return (
      <div>
        <Head>
          <title>Gets FE</title>
          <meta name="description" content="gets fe" />
          <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0" />
          {/* <link rel="icon" href="/favicon.ico" /> */}
        </Head>
        <header>
          Header
        </header>
        <main>
          <WrappedComponent {...props} />
        </main>
        <footer>
          Footer
        </footer>
        <Snackbar open={toast.message ? true : false} onClose={(e) => closeToast()} autoHideDuration={toastDuration}>
          <Alert severity={toast.type}>{toast.message}</Alert>
        </Snackbar>
      </div>
    )
  };

  return WithAuthLayout;
};

export default withAuthLayout;