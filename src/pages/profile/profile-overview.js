import React, { useEffect, useState } from "react";
import Profile from "../../layouts/profile";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Box, Grid, Modal, TextField } from "@mui/material";
import AddressChangeModal from "@/components/profile/changeAddressModal";
import MobileChangeModal from "@/components/profile/changeMobileNoModal";
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
  const [openModal, setOpenModal] = useState(false);
  const [addressFlag, setAddressFlag] = useState(false);
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
    "Full Name": "",
    "Mobile No.": "",
    "Work Email": "",
    Address: "",
  });

  const handleEditIconClick = (key) => {
    if (key === "Address") {
      setAddressFlag(true);
      console.log("Request Type is address");
    } else if (key === "Mobile No.") {
      setAddressFlag(false);
      console.log("Request Type is mobile");
    }
    setOpenModal(true);
    console.log("Change Request modal is opened");
  };

  const handleModalClose = () => {
    setOpenModal(false);
    console.log("Change Request modal is closed");
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

  useEffect(() => {
    // console.log("inside useeffect User Details>>>", userDetails);
    if (userDetails) {
      setUserInformation((prev) => ({
        ...prev,
        "Full Name": userDetails.name || "-",
        "Mobile No.": userDetails.mob || "-",
        "Work Email": userDetails.email || "-",
        Address: userDetails.address || "-",
      }));
    }
  }, [userDetails]);

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
        {userDetails.gender === "MALE" ? (
          <img
            src="/images/maleUserIcon.svg"
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
        ) : (
          <img
            src="/images/femaleUserIcon.svg"
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
        )}
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
              <Grid key={index} item xs={6} style={{ marginBottom: "25px" }}>
                <p
                  style={{
                    fontWeight: "bold",
                    marginRight: 50,
                  }}
                >
                  {key}
                </p>
                <p
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: 8,
                    width: "80%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    backgroundColor: "#f4f4f4",
                    color: "#333",
                    overflow: "hidden",
                  }}
                >
                  {value}
                  {(key === "Mobile No." || key === "Address") && (
                    <ModeEditIcon
                      name={key}
                      onClick={() => handleEditIconClick(key)}
                      style={{ marginLeft: "auto", cursor: "pointer" }}
                    />
                  )}
                </p>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Modal
          open={openModal}
          onClose={handleModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {addressFlag ? (
              <AddressChangeModal
                onClose={handleModalClose}
                userDetails={userDetails}
              />
            ) : (
              <MobileChangeModal
                onClose={handleModalClose}
                userDetails={userDetails}
              />
            )}
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Profile(ProfileOverview);
