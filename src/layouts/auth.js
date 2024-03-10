import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Alert, Menu, MenuItem, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { toggleToast } from '@/redux/company.slice';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ACCESS_TOKEN, USER_ROLES } from '@/constants/app.constants.';
import AuthService from '@/services/auth.service';
import RoleService from '@/services/role.service';
import { setAllUserPermissions } from '@/redux/user.slice';
import { MODULE_NAMES } from '@/constants/url.constants';

const withAuthLayout = (WrappedComponent) => {

  const WithAuthLayout = (props) => {

    const router = useRouter();
    const { allUserPermissions = {} } = useSelector((state) => state.user);
    const [userDetails, setUserDetails] = useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    const handleMenuClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (e) => {
      setAnchorEl(null);
    };

    useEffect(() => {
      let token = localStorage.getItem(ACCESS_TOKEN);
      let localUserDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
      let userRoles = JSON.parse(localStorage.getItem(USER_ROLES) || "{}");
      let isSAdmin = localStorage.getItem("isSuperAdmin");
      setIsSuperAdmin(isSAdmin === "true");
      if (!token) {
        router.push("/");
      }
      if (localUserDetails?.userId) {
        setUserDetails(localUserDetails);
      }
      let routeName = router?.pathname?.split("/")
      routeName = routeName[1];
      if (routeName) {
        setCurrentActiveState(routeName);
      }
      if (userRoles?.roleName) {
        fetchUserRoleModules(userRoles.roleName);
      }
    }, []);

    const [currentActiveState, setCurrentActiveState] = useState('');
    const dispatch = useDispatch();
    const { toast, toastDuration } = useSelector((state) => state.company);

    const closeToast = () => {
      dispatch(toggleToast({ message: '', type: 'success' }));
    };

    const changeRoute = (routeName) => {
      setCurrentActiveState(routeName);
    };

    const logoutUser = async () => {
      try {
        await AuthService.logout();
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/";
      } catch (e) {
        console.error(e);
      }
    };

    const fetchUserRoleModules = async (role) => {
      try {
        const roleName = role.split("ROLE_")[1];
        const response = await RoleService.getRolePermissions(roleName);
        const { data } = response || {};
        let userPermObj = {};
        if (data.length) {
          data.forEach(element => {
            userPermObj[element.name] = element;
          });
        }
        dispatch(setAllUserPermissions({ response: userPermObj }));
      } catch (e) {
        console.error(e);
      }
    };

    const getModulePermissions = (module) => {
      if (module === MODULE_NAMES.ADMIN_SETTINGS) {
        return isSuperAdmin;
      } else {
        console.log('auth', Object.keys(allUserPermissions))
        return isSuperAdmin || Object.keys(allUserPermissions).includes(module);
      }
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
              {/* <Link onClick={() => changeRoute('helpdesk')} className={currentActiveState === 'helpdesk' && 'selected' || ''} href='/helpdesk'>Helpdesk</Link> */}
              {getModulePermissions(MODULE_NAMES.BOOKING) && <Link onClick={() => changeRoute('bookings')} className={currentActiveState === 'bookings' && 'selected' || ''} href='/bookings/search-bookings'>Bookings</Link>}
              {/* <Link onClick={() => changeRoute('dispatch')} className={currentActiveState === 'dispatch' && 'selected' || ''} href='/dispatch'>Dispatch</Link>
              <Link onClick={() => changeRoute('tracking')} className={currentActiveState === 'tracking' && 'selected' || ''} href='/tracking'>Tracking</Link>
              <Link onClick={() => changeRoute('billing')} className={currentActiveState === 'billing' && 'selected' || ''} href='/billing'>Billing</Link> */}
              {getModulePermissions(MODULE_NAMES.ADMIN_SETTINGS) && <Link onClick={() => changeRoute('admin-settings')} className={currentActiveState === 'admin-settings' && 'selected' || ''} href='/admin-settings/access-control'>Admin Settings</Link>}
              {getModulePermissions(MODULE_NAMES.ADMIN_SETTINGS) && <Link onClick={() => changeRoute('compliance')} className={currentActiveState === 'compliance' && 'selected' || ''} href='/compliance/driver-profile'>Compliance</Link>}
              {/* <Link onClick={() => changeRoute('configurations')} className={currentActiveState === 'configurations' && 'selected' || ''} href='/configurations'>Configurations</Link> */}
            </nav>
          </div>
          <div className='headerBellContainer'>
            {/* <span className="material-symbols-outlined">notifications</span> */}
            {userDetails && <p onClick={handleMenuClick} style={{ textTransform: "uppercase" }}>{userDetails.name[0]}</p>}
            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              open={isMenuOpen}
              onClose={handleMenuClose}
              MenuListProps={{
                'aria-labelledby': 'menu-buttons',
              }}
            >
              <MenuItem onClick={logoutUser}>Logout</MenuItem>
            </Menu>
          </div>
        </header>
        <main>
          <WrappedComponent {...props} />
        </main>
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={toast.message ? true : false} onClose={(e) => closeToast()} autoHideDuration={toastDuration}>
          <Alert severity={toast.type}>{toast.message}</Alert>
        </Snackbar>
      </div>
    )
  };

  return WithAuthLayout;
};

export default withAuthLayout;