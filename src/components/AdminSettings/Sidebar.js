// Sidebar.js

import React from 'react';
import Link from 'next/link';
import Button from '@mui/material/Button';

import styles from '../../styles/Sidebar.module.css';



const Sidebar = () => {
  

  return (
    <div className={styles.sidebar}>
      <Link href="/client">
        <Button className={`${styles.button}`}>Client</Button>
      </Link>
      <Link href="/office">
        <Button className={`${styles.button} `}>Office</Button>
      </Link>
      <Link href="/shift">
        <Button className={`${styles.button} `}>Shift</Button>
      </Link>
      <Link href="/usermanagement">
        <Button className={`${styles.button}`}>User Management</Button>
      </Link>
      <Link href="/invoice">
        <Button className={`${styles.button} `}>Invoice</Button>
      </Link>
      <Link href="/compliance">
        <Button className={`${styles.button} `}>Compliance</Button>
      </Link>
      <Link href="/DriverApp">
        <Button className={`${styles.button}`}>Driver App</Button>
      </Link>
      <Link href="/EmployeeApp">
        <Button className={`${styles.button} `}>Employee App</Button>
      </Link>
      <Link href="/shift">
        <Button className={`${styles.button} `}>Access Control</Button>
      </Link>
      <Link href="/client">
        <Button className={`${styles.button}`}>Vender Management</Button>
      </Link>
      <Link href="/office">
        <Button className={`${styles.button} `}>Communication</Button>
      </Link>
      <Link href="/shift">
        <Button className={`${styles.button} `}>Reports</Button>
      </Link>
      <Link href="/client">
        <Button className={`${styles.button}`}>Security</Button>
      </Link>
      
      {/* Add more links here */}
    </div>
  );
};

export default Sidebar;
