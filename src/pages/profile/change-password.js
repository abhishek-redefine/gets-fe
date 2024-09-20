import React, { useEffect, useState } from "react";
import Profile from "../../layouts/profile";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Box, Grid, Modal, TextField } from "@mui/material";
import OfficeService from "@/services/office.service";
import { ACCESS_TOKEN } from "@/constants/app.constants.";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,
  bgcolor: "background.paper",
  height: "auto",
  borderRadius: 5,
};

const ProfileOverview = () => {
  const [userDetails, setUserDetails] = useState({});
  const [userEmail, setUserEmail] = useState("");

  const fetchUserDetails = async (e) => {
    try {
      const response = await OfficeService.getUserByEmail(userEmail);
      console.log("User Details>>>", response.data);
      setUserDetails(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  const [userInformation, setUserInformation] = useState({
    "Old Password": "",
    "New Password": "",
    "Confirm New Password": "",
  });

  const handleChange = (key, event) => {
    setUserInformation({
      ...userInformation,
      [key]: event.target.value,
    });
  };

  useEffect(() => {
    let token = localStorage.getItem(ACCESS_TOKEN);
    let localUserDetails = JSON.parse(
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
    console.log("user email>>", userEmail);
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
          src=""
          alt="profile-img"
          style={{
            borderRadius: "50%",
            width: "80px",
            height: "80px",
            marginRight: "20px",
            backgroundColor: "pink",
          }}
        />
        <div>
          <h3>{userDetails.name}</h3>
          <p style={{ marginTop: 2 }}>Joined {userDetails.startDate}</p>
        </div>
      </div>

      <div>
        <Box
          sx={{
            fontFamily: "DM Sans",
            padding: "25px 10px 25px",
            // backgroundColor: "pink",
          }}
        >
          <Grid
            container
            alignItems="stretch"
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            xs={12}
          >
            {Object.entries(userInformation).map(([key, value], index) => (
              <Grid key={index} item xs={12} style={{ marginBottom: "25px" }}>
                <p
                  style={{
                    fontWeight: "bold",
                    marginRight: 50,
                  }}
                >
                  {key}
                </p>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  value={value}
                  size="small"
                  onChange={(e) => handleChange(key, e)}
                  style={{ width: "250px", marginTop: 8, overflow: 'hidden' }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
    </div>
  );
};

export default Profile(ProfileOverview);
