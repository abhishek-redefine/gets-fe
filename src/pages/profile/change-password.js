import React, { useEffect, useState } from "react";
import Profile from "../../layouts/profile";
import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import OfficeService from "@/services/office.service";
import { ACCESS_TOKEN } from "@/constants/app.constants.";
import { toggleToast } from "@/redux/company.slice";
import { useDispatch } from "react-redux";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AuthService from "@/services/auth.service";
import LoaderComponent from "@/components/loader";

const ChangePassword = () => {
  const [userDetails, setUserDetails] = useState({});
  const [userEmail, setUserEmail] = useState("");
  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [error, setError] = useState(false);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const fetchUserDetails = async () => {
    try {
      const response = await OfficeService.getUserByEmail(userEmail);
      setUserDetails(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  const [values, setValues] = useState({
    userName: "",
    currentPassword: "",
    newPassword: "",
  });

  const handleChange = (key, event) => {
    setValues({
      ...values,
      [key]: event.target.value,
    });
  };

  const handleResetForm = () => {
    let allValues = {
      userName: "",
      currentPassword: "",
      newPassword: "",
    };
    setValues(allValues);
  };

  const onSubmitHandler = async () => {
    console.log("form values>>>", values);
    let hasError = false;

    if (!values.userName) {
      setError((prevError) => ({
        ...prevError,
        userName: "Username is mandatory.",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, userName: "" }));
    }
    if (!values.currentPassword) {
      setError((prevError) => ({
        ...prevError,
        currentPassword: "Current password is mandatory.",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, currentPassword: "" }));
    }
    if (!values.newPassword) {
      setError((prevError) => ({
        ...prevError,
        newPassword: "New password is mandatory.",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, newPassword: "" }));
    }

    if (!hasError) {
      try {
        let reqBody = { ...values };
        console.log("reqBody: ", reqBody);
        setLoading(true);
        // await new Promise((resolve) => setTimeout(resolve, 5000));
        const response = await AuthService.changePassword(reqBody);
        console.log("response>>>", response);
        if (response.status === 200) {
          handleResetForm();
          dispatch(
            toggleToast({
              message: "Password has changed successfully!",
              type: "success",
            })
          );
        }
        if (response.status === 500) {
          dispatch(
            toggleToast({
              message: "Failed! Try again later.",
              type: "error",
            })
          );
        }
      } catch (err) {
        console.log("Error change password: ", err);
        if (err.response.status === 400) {
          dispatch(
            toggleToast({
              message: "Invalid user ID or current password!",
              type: "error",
            })
          );
        } else {
          dispatch(
            toggleToast({
              message: "An error occurred. Please try again.",
              type: "error",
            })
          );
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleShowOldPwd = () => setShowOldPwd((prev) => !prev);
  const toggleShowNewPwd = () => setShowNewPwd((prev) => !prev);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    const localUserDetails = JSON.parse(
      localStorage.getItem("userDetails") || "{}"
    );
    if (!token) {
      router.push("/");
    }
    if (localUserDetails?.name) {
      setUserEmail(localUserDetails?.name);
    }
  }, []);

  useEffect(() => {
    if (userEmail) {
      fetchUserDetails();
    }
  }, [userEmail]);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "95vh",
        backgroundColor: "#f9f9f9",
        flexDirection: "column",
        padding: "20px 30px",
        alignItems: "flex-start",
        fontFamily: "DM Sans",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}
      >
        <img
          src={
            userDetails.gender === "MALE"
              ? "/images/maleUserIcon.svg"
              : "/images/femaleUserIcon.svg"
          }
          width={60}
          height={60}
          alt="profile-img"
          style={{
            borderRadius: "50%",
            marginRight: "20px",
            padding: "8px 5px 5px",
            backgroundColor: "#e5e5e5",
          }}
        />
        <div>
          <h3>{userDetails.name}</h3>
          <p style={{ marginTop: 2 }}>Joined {userDetails.startDate}</p>
        </div>
      </div>

      <div>
        <Box sx={{ fontFamily: "DM Sans", padding: "25px 10px 0px" }}>
          <Grid
            container
            alignItems="stretch"
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            {Object.entries(values).map(([key, value], index) => (
              <Grid key={index} item xs={12} style={{ marginBottom: "25px" }}>
                <p style={{ fontWeight: "bold", marginRight: 50 }}>
                  {key === "userName"
                    ? "User ID"
                    : key === "currentPassword"
                    ? "Current Password"
                    : key === "newPassword"
                    ? "New Password"
                    : ""}
                </p>
                <TextField
                  variant="outlined"
                  value={value}
                  size="small"
                  error={error[key]}
                  helperText={error[key]}
                  type={
                    key === "currentPassword"
                      ? showOldPwd
                        ? "text"
                        : "password"
                      : key === "newPassword"
                      ? showNewPwd
                        ? "text"
                        : "password"
                      : "text"
                  }
                  onChange={(e) => handleChange(key, e)}
                  style={{ width: "250px", marginTop: 8, overflow: "hidden" }}
                  autoComplete="new-password"
                  InputProps={{
                    endAdornment: (key === "currentPassword" ||
                      key === "newPassword") && (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={`toggle ${key.toLowerCase()} visibility`}
                          onClick={
                            key === "currentPassword"
                              ? toggleShowOldPwd
                              : key === "newPassword"
                              ? toggleShowNewPwd
                              : toggleShowConfirmNewPwd
                          }
                          edge="end"
                        >
                          {key === "currentPassword" ? (
                            showOldPwd ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )
                          ) : showNewPwd ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>

      <div style={{ padding: "0px 10px 25px" }}>
        <button
          type="button"
          style={{
            backgroundColor: "#f6ce47",
            color: "black",
            border: "none",
            borderRadius: "6px",
            fontSize: "15px",
            padding: "13px 50px",
            cursor: "pointer",
            marginTop: "20px",
          }}
          onClick={onSubmitHandler}
        >
          Submit
        </button>
      </div>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            // backgroundColor: "#000000",
            zIndex: 1,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            opacity: 1,
            color: "#000000",
            // height: "100vh",
            // width: "100vw",
          }}
        >
          <LoaderComponent />
        </div>
      ) : (
        " "
      )}
    </div>
  );
};

export default Profile(ChangePassword);
