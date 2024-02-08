// pages/login.js
import React from "react";
import Head from "next/head";
import styles from "../../styles/Login.module.css";
import car from "../../utils/assets/car.png"; // Make sure this path is correct

const ForgetPassword = () => {

  return (
    <div className={styles.container}>
      <Head>
        <title>Forget Password | Ganga Tourism</title>
      </Head>
      <div className={styles.leftContainer}>
        <img className={styles.loginImage} src={car.src} alt="Ganga Tourism" />
      </div>
      <div className={styles.rightContainer}>
        <h1 className={styles.loginHeading}>Forget Password ?</h1>
        <p className={styles.loginText}>Type your Email Id to Reset your Password</p>
        <form className={styles.loginForm}>
          <div className={styles.formGroup}>
          <label className={styles.loginLabel} htmlFor="email">Email ID</label>
            <input
              className={styles.inputField}
              type="email"
              id="email"
              placeholder="Email ID"
            />
          </div>
          
         
          <button className={styles.loginButton} type="submit">
            Submit
          </button>
          <br></br>
          <div className={styles.checkbox}>
            
            <label className={styles.checkboxLabel} htmlFor="keepLoggedIn">
              Back to Login
            </label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
