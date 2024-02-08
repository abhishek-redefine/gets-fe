// pages/login.js
import React, { useState } from "react";
import Head from "next/head";
import styles from "../../styles/Login.module.css";
import car from "../../utils/assets/car.png"; // Make sure this path is correct

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Login | Ganga Tourism</title>
      </Head>
      <div className={styles.leftContainer}>
        <img className={styles.loginImage} src={car.src} alt="Ganga Tourism" />
      </div>
      <div className={styles.rightContainer}>
        <h1 className={styles.loginHeading}>Get Started</h1>
        <p className={styles.loginText}>Login to your account</p>
        <form className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label className={styles.loginLabel} htmlFor="email">
              Email ID
            </label>
            <input
              className={styles.inputField}
              type="email"
              id="email"
              placeholder="Email ID"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.loginLabel} htmlFor="password">
              Password
            </label>
            <div className={styles.passwordContainer}>
              <input
                className={styles.inputField}
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
              />
              <span
                className={styles.passwordToggle}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>
          <div className={styles.checkbox}>
            <input type="checkbox" id="keepLoggedIn" />
            <label className={styles.checkboxLabel} htmlFor="keepLoggedIn">
              Keep me logged in
            </label>
          </div>
          <button className={styles.loginButton} type="submit">
            Login Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
