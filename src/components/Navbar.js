// components/Navbar.js
import React from "react";
import styles from '../styles/navbar.module.css'; // Import the CSS module
import logo from "../utils/assets/logo-ganga.jpg"
const Navbar = () => {
  return (
    <div className={styles.navbar}>
    <div className={styles.navbar}> {/* Apply the CSS class */}
      <img src={logo.src} alt="Logo" className={styles.logo} /> {/* Logo */}
      <a href="#Dashboard">Dashboard</a>
      <a href="#Helpdesk">Helpdesk</a>
      <a href="#Bookings">Bookings</a>
      <a href="#Dishpatch">Dishpatch</a>
      <a href="#Tracking">Tracking</a>
      <a href="#Billing">Billing</a>
      <a href="#Reports">Reports</a>
      <a href="#Compilance">Compilance</a>
      <a href="#Admin">Admin Settings</a>
    </div>
 <div className={styles.icons}>
 <span className={styles.notificationIcon}>
   {/* Placeholder content for notification icon */}
   <svg
     xmlns="http://www.w3.org/2000/svg"
     className="icon icon-tabler icon-tabler-bell"
     width="24"
     height="24"
     viewBox="0 0 24 24"
     strokeWidth="1.5"
     stroke="#000000"
     fill="none"
     strokeLinecap="round"
     strokeLinejoin="round"
   >
     <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
     <path d="M3 3a2 2 0 0 1 2 2v.1m-.589 4.914c-1.383 1.382-2.058 3.73-1.414 5.586a3 3 0 0 0 .417 1.586l.177 .293m2.724 .427c.562 .087 1.153 .134 1.75 .134s1.188 -.047 1.75 -.134l2.75 -.427m3.918 -1.957a7 7 0 0 0 -1.17 -1.93c-1.173 -1.173 -1.82 -2.716 -1.828 -4.314c-.01 -1.455 .458 -2.899 1.314 -3.955a6 6 0 0 1 8.514 8.442c-1.23 1.23 -3.023 1.613 -4.616 1.758a9.127 9.127 0 0 0 -2.41 .408" />
     <circle cx="19" cy="19" r="2" />
   </svg>
 </span>
 <span className={styles.profileIcon}>
   {/* Placeholder content for profile icon */}
   <svg
     xmlns="http://www.w3.org/2000/svg"
     className="icon icon-tabler icon-tabler-user"
     width="24"
     height="24"
     viewBox="0 0 24 24"
     strokeWidth="1.5"
     stroke="#000000"
     fill="none"
     strokeLinecap="round"
     strokeLinejoin="round"
   >
     <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
     <circle cx="12" cy="7" r="4" />
     <path d="M6.5 20h11a1.5 1.5 0 0 0 1.5 -1.5v-2.5a4 4 0 0 0 -4 -4h-5a4 4 0 0 0 -4 4v2.5a1.5 1.5 0 0 0 1.5 1.5" />
   </svg>
 </span>
</div>
</div>
    
  );
};

export default Navbar;
