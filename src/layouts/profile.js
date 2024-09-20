import React, { useEffect, useState } from "react";
import styles from "@/styles/AdminSettings.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import withAuthLayout from "@/layouts/auth";

const ProfilePage = (WrappedComponent) => {
  const Profile = (props) => {
    const route = useRouter();
    const [currentActiveState, setCurrentActiveState] = useState("");

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
      <div
        style={{
          display: "flex",
        }}
      >
        <div className={styles.leftMenuContainer}>
          <nav>
            <Link
              onClick={() => changeRoute("profile-overview")}
              className={
                (currentActiveState === "profile-overview" &&
                  styles.selected) ||
                ""
              }
              href="profile-overview"
            >
              Profile Overview
            </Link>
            <br />
            <Link
              onClick={() => changeRoute("change-password")}
              className={
                (currentActiveState === "change-password" && styles.selected) ||
                ""
              }
              href="change-password"
            >
              Change Password
            </Link>
            <br />
          </nav>
        </div>
        <div className={styles.rightContainer}>
          <WrappedComponent {...props} />
        </div>
      </div>
    );
  };
  return withAuthLayout(Profile);
};

export default ProfilePage;
