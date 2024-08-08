import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ComplianceService from "@/services/compliance.service";
import { toggleToast } from "@/redux/company.slice";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IframeComponent from "../iframe/Iframe";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  height: 600,
};

const AddVehiclePendingApproval = ({ ViewDetailsData,viewVehicleOpen,isView }) => {
  const [initialValues, setInitialValues] = useState({
    vehicleId: "",
    vehicleRegistrationNumber: "",
    stickerNumber: "",
    vehicleType: "",
    vehicleOwnerName: "",
    modelYear: "",
    vehicleMake: "",
    vehicleModel: "",
    fuelType: "",
    vendorName: "",
    officeId: "",
    registrationDate: "",
    manufacturingDate: "",
    inductionDate: "",
    insuranceExpiryDate: "",
    roadTaxExpiryDate: "",
    pollutionExpiryDate: "",
    statePermitExpiryDate: "",
    nationalPermitExpiryDate: "",
    fitnessExpiryDate: "",
    fitnessDate: "",
    garageLocation: "",
    ehsStatus: "",
    garageGeoCode: "",
    rfidStatus: "",
    acStatus: "",
    gpsStatus: "",
    vehicleRemarks: "",
    insuranceUrl: "",
    registrationCertificateUrl: "",
    driverId: "",
    // ehsDoneBy: "Sultan",
    // ehsDoneAt: "2024-03-13",
    pollutionCertificateUrl: "",
    roadTaxCertificateUrl: "",
    fitnessCertificateUrl: "",
    statePermitUrl: "",
    nationalPermitUrl: "",
    medicalCertificateUrl: "",
    complianceStatus: "NON_COMPLIANT",
  });
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState();

  const [openModal, setOpenModal] = useState(false);
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);
  const [documentUrl, setDocumentUrl] = useState();
  const [documentTitle, setDocumentTitle] = useState();

  const dispatch = useDispatch();

  const downloadFile = async (name) => {
    const response = await ComplianceService.downloadAWSFile(name);
    const blob = new Blob([response.data], { type: "application/pdf" });
    const fileUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", "downloaded_report.pdf"); // Set desired filename
    link.click();
  };

  const approveVehicle = async (approveOrReject,msg="approved") => {
    const response = await ComplianceService.approveVehicle(
      initialValues.id,
      approveOrReject,
      msg
    );
    if (response.status === 200) {
      if (approveOrReject) {
        dispatch(
          toggleToast({
            message: "Vehicle approved successfully!",
            type: "success",
          })
        );
        viewVehicleOpen();
      } else {
        dispatch(
          toggleToast({
            message: "Vehicle rejected successfully!",
            type: "success",
          })
        );
        viewVehicleOpen();
      }
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setMsg(e.target.value);
  };

  useState(() => {
    if (ViewDetailsData?.id) {
      let newEditInfo = Object.assign(initialValues, ViewDetailsData);
      console.log("AddVehiclePendingApproval", newEditInfo);
      setInitialValues(newEditInfo);
    }
  }, [ViewDetailsData]);

  return (
    <div>
      <h4 className="pageSubHeading">Vehicle Summary</h4>
      <div className="addUpdateFormContainer">
        <div>
          <div className="form-control-input">
            <div style={{ fontWeight: "700" }}>Vehicle Id</div>
            <div>{initialValues.vehicleId}</div>
          </div>
          <div className="form-control-input">
            <div style={{ fontWeight: "700" }}>Vehicle Make</div>
            <div>{initialValues.vehicleMake}</div>
          </div>
          <div className="form-control-input">
            <div style={{ fontWeight: "700" }}>Vehicle Model</div>
            <div>{initialValues.vehicleModel}</div>
          </div>
          <div className="form-control-input">
            <div style={{ fontWeight: "700" }}>Vehicle Owner Name</div>
            <div>{initialValues.vehicleOwnerName}</div>
          </div>
        </div>
        <div>
          <div className="form-control-input">
            <div style={{ fontWeight: "700" }}>Fuel Type</div>
            <div>{initialValues.fuelType}</div>
          </div>
          <div className="form-control-input">
            <div style={{ fontWeight: "700" }}>Induction Date</div>
            <div>{initialValues.inductionDate}</div>
          </div>
          <div className="form-control-input">
            <div style={{ fontWeight: "700" }}>Manufacturing Date</div>
            <div>{initialValues.manufacturingDate}</div>
          </div>
          <div className="form-control-input">
            <div style={{ fontWeight: "700" }}>Status</div>
            <div>{initialValues.complianceStatus}</div>
          </div>
        </div>
      </div>
      <h4 className="pageSubHeading" style={{ marginTop: "20px" }}>
        Documents
      </h4>
      <div className="addUpdateFormContainer">
        <div>
          <div className="form-control-input">
            <div style={{ fontWeight: "700" }}>Registration Certificate</div>
            {ViewDetailsData?.registrationCertificateUrl !== "" && (
              <button
                type="button"
                onClick={() => {
                  setDocumentUrl(
                    ViewDetailsData.registrationCertificateUrl.replace("/getsdev1/", "/")
                  );
                  handleModalOpen();
                }}
                style={{
                  width: "50%",
                  marginLeft: 0,
                  marginTop: 10,
                  padding: "10px",
                }}
                className="btn btn-secondary"
              >
                View
              </button>
            )}
          </div>
          <div className="form-control-input">
            <div style={{ fontWeight: "700" }}>Insurance</div>
            {ViewDetailsData?.insuranceUrl !== "" && (
              <button
                type="button"
                onClick={() => {
                  setDocumentUrl(
                    ViewDetailsData.insuranceUrl.replace("/getsdev1/", "/")
                  );
                  handleModalOpen();
                }}
                style={{
                  width: "50%",
                  marginLeft: 0,
                  marginTop: 10,
                  padding: "10px",
                }}
                className="btn btn-secondary"
              >
                View
              </button>
            )}
          </div>
          <div className="form-control-input">
            <div style={{ fontWeight: "700" }}>Road Tax</div>
            {ViewDetailsData?.roadTaxCertificateUrl !== "" && (
              <button
                type="button"
                onClick={() => {
                  setDocumentUrl(
                    ViewDetailsData.roadTaxCertificateUrl.replace("/getsdev1/", "/")
                  );
                  handleModalOpen();
                }}
                style={{
                  width: "50%",
                  marginLeft: 0,
                  marginTop: 10,
                  padding: "10px",
                }}
                className="btn btn-secondary"
              >
                View
              </button>
            )}
          </div>
          <div className="form-control-input">
            <div style={{ fontWeight: "700" }}>Pollution Certificate</div>
            {ViewDetailsData?.pollutionCertificateUrl !== "" && (
              <button
                type="button"
                onClick={() => {
                  setDocumentUrl(
                    ViewDetailsData.pollutionCertificateUrl.replace("/getsdev1/", "/")
                  );
                  handleModalOpen();
                }}
                style={{
                  width: "50%",
                  marginLeft: 0,
                  marginTop: 10,
                  padding: "10px",
                }}
                className="btn btn-secondary"
              >
                View
              </button>
            )}
          </div>
          <div className="form-control-input">
            <div style={{ fontWeight: "700" }}>Fitness Certificate</div>
            {ViewDetailsData?.fitnessCertificateUrl !== "" && (
              <button
                type="button"
                onClick={() => {
                  setDocumentUrl(
                    ViewDetailsData.fitnessCertificateUrl.replace("/getsdev1/", "/")
                  );
                  handleModalOpen();
                }}
                style={{
                  width: "50%",
                  marginLeft: 0,
                  marginTop: 10,
                  padding: "10px",
                }}
                className="btn btn-secondary"
              >
                View
              </button>
            )}
          </div>
          <div className="form-control-input">
            <div style={{ fontWeight: "700" }}>National Permit</div>
            {ViewDetailsData?.nationalPermitUrl !== "" && (
              <button
                type="button"
                onClick={() => {
                  setDocumentUrl(
                    ViewDetailsData.nationalPermitUrl.replace("/getsdev1/", "/")
                  );
                  handleModalOpen();
                }}
                style={{
                  width: "50%",
                  marginLeft: 0,
                  marginTop: 10,
                  padding: "10px",
                }}
                className="btn btn-secondary"
              >
                View
              </button>
            )}
          </div>
          <div className="form-control-input">
            <div style={{ fontWeight: "700" }}>State Permit</div>
            {ViewDetailsData?.statePermitUrl !== "" && (
              <button
                type="button"
                onClick={() => {
                  setDocumentUrl(
                    ViewDetailsData.statePermitUrl.replace("/getsdev1/", "/")
                  );
                  handleModalOpen();
                }}
                style={{
                  width: "50%",
                  marginLeft: 0,
                  marginTop: 10,
                  padding: "10px",
                }}
                className="btn btn-secondary"
              >
                View
              </button>
            )}
          </div>
        </div>
        {
          !isView ?
            <div className="addBtnContainer" style={{ justifyContent: "end" }}>
              <button className="btn btn-secondary" onClick={() => handleOpen()}>
                Reject
              </button>
              <button
                className="btn btn-primary"
                onClick={() => approveVehicle(true)}
              >
                Approve
              </button>
            </div>
            :
            <div className="addBtnContainer" style={{ justifyContent: "end" }}>
              <button
                className="btn btn-primary"
                onClick={() => viewVehicleOpen()}
              >
                Back
              </button>
            </div>
        }
        
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>
          Please mention the reason for rejection of vehicle
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Enter the reason</DialogContentText>
          <TextField
            onChange={handleChange}
            required
            id="rejectionMsg"
            name="rejectionMsg"
            value={msg}
            label="Rejection Message"
            variant="outlined"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" onClick={() => approveVehicle(false,msg)}>
            Reject Vehicle
          </Button>
        </DialogActions>
      </Dialog>
      <Modal
        open={openModal}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <IframeComponent url={documentUrl} title={documentTitle} />
        </Box>
      </Modal>
    </div>
  );
};

export default AddVehiclePendingApproval;
