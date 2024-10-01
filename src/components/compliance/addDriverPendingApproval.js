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
import { PDFDocument } from "pdf-lib";
import pako from "pako";
import IframeComponent from "../iframe/Iframe";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import LoaderComponent from "../loader";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  height: 600,
};

const AddDriverPendingApproval = ({
  ViewDetailsData,
  SetAddDriverOpen,
  isView,
}) => {
  const [initialValues, setInitialValues] = useState({
    name: "",
    mobile: "",
    dob: "",
    gender: "",
    officeId: "",
    vendorName: "",
    licenseNo: "",
    licenseExpiry: "",
    altMobile: "",
    address: "",
    aadharId: "",
    panNo: "",
    email: "",
    remarks: "",
    licenseUrl: "",
    photoUrl: "",
    bgvUrl: "",
    policeVerificationUrl: "",
    badgeUrl: "",
    undertakingUrl: "",
    driverTrainingCertUrl: "",
    medicalCertUrl: "",
    role: "DRIVER",
    enabled: true,
    // ehsDoneBy: "Sultan",
    // ehsDoneAt: "2024-03-13",
    complianceStatus: "COMPLIANT",
    ehsStatus: "NEW",
    id: "",
  });
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState();

  const [openModal, setOpenModal] = useState(false);
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);
  const [documentUrl, setDocumentUrl] = useState();
  const [documentTitle, setDocumentTitle] = useState();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function uint8ArrayToPDF(uint8Array) {
    // Load the existing PDF
    console.log(uint8Array);
    const pdfDoc = await PDFDocument.load(uint8Array);

    // Create a new PDF
    const newPdfDoc = await PDFDocument.create();

    // Add pages from existing PDF to the new PDF
    const pages = await newPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
    pages.forEach((page) => newPdfDoc.addPage(page));

    // Serialize the new PDF to a Uint8Array
    const pdfBytes = await newPdfDoc.save();

    // Return the Uint8Array representation of the new PDF
    return pdfBytes;
  }

  function base64ToArrayBuffer(base64) {
    // var binaryString = window.atob(base64);
    var binaryLen = base64.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
      var ascii = base64.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  const convertToBinary = (base64) => {
    var raw = window.btoa(encodeURI(base64));

    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  };

  // Example usage:
  async function decodeFlateToPDF(flateEncodedUint8Array) {
    // Decompress the FlateDecode data
    const inflated = pako.inflate(flateEncodedUint8Array);

    // Load the decompressed data into a PDFDocument
    const pdfDoc = await PDFDocument.load(inflated);

    // Serialize the PDFDocument to a Uint8Array
    const pdfBytes = await pdfDoc.save();

    // Return the Uint8Array representation of the PDF
    return pdfBytes;
  }

  const approveDriver = async (approveOrReject, msg = "approved") => {
    try {
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      const response = await ComplianceService.approveDriver(
        initialValues.id,
        approveOrReject,
        msg
      );
      if (response.status === 200) {
        if (approveOrReject) {
          dispatch(
            toggleToast({
              message: "Driver approved successfully!",
              type: "success",
            })
          );
          SetAddDriverOpen();
        } else {
          dispatch(
            toggleToast({
              message: "Driver rejected successfully!",
              type: "success",
            })
          );
          SetAddDriverOpen();
        }
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setMsg(e.target.value);
  };

  useState(() => {
    if (ViewDetailsData?.id) {
      let newEditInfo = Object.assign(initialValues, ViewDetailsData);
      setInitialValues(newEditInfo);
    }
  }, [ViewDetailsData]);

  return (
    <div>
      <h4 className="pageSubHeading">User Summary</h4>
      <div className="addUpdateFormContainer">
        <div>
          <div className="form-control-input">
            <div style={{ fontWeight: "700" }}>Name</div>
            <div>{initialValues.name}</div>
          </div>
          <div className="form-control-input">
            <div style={{ fontWeight: "700" }}>Vendor</div>
            <div>{initialValues.vendorName}</div>
          </div>
          <div className="form-control-input">
            <div style={{ fontWeight: "700" }}>Driver Id</div>
            <div>{initialValues.id}</div>
          </div>
          <div className="form-control-input">
            <div style={{ fontWeight: "700" }}>Office Id</div>
            <div>{initialValues.officeId}</div>
          </div>
        </div>
        <div>
          <div className="form-control-input">
            <div style={{ fontWeight: "700" }}>License No.</div>
            <div>{initialValues.licenseNo}</div>
          </div>
          <div className="form-control-input">
            <div style={{ fontWeight: "700" }}>Phone No.</div>
            <div>{initialValues.mobile}</div>
          </div>
          <div className="form-control-input">
            <div style={{ fontWeight: "700" }}>Gender</div>
            <div>{initialValues.gender}</div>
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
            <div style={{ fontWeight: "700" }}>License</div>
            {ViewDetailsData?.licenseUrl !== "" && (
              <button
                type="button"
                onClick={() => {
                  setDocumentUrl(
                    ViewDetailsData.licenseUrl.replace("/getsdev1/", "/")
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
            <div style={{ fontWeight: "700" }}>Photo</div>
            {ViewDetailsData?.photoUrl !== "" && (
              <button
                type="button"
                onClick={() => {
                  setDocumentUrl(
                    ViewDetailsData?.photoUrl.replace("/getsdev1/", "/")
                  );
                  handleModalOpen();
                }}
                style={{
                  width: "50%",
                  marginLeft: 0,
                  marginTop: 10,
                  padding: "10px",
                }}
                className="btn btn-secondary    "
              >
                View
              </button>
            )}
          </div>
          <div className="form-control-input">
            <div style={{ fontWeight: "700" }}>BGV</div>
            {ViewDetailsData?.bgvUrl !== "" && (
              <button
                type="button"
                onClick={() => {
                  setDocumentUrl(
                    ViewDetailsData?.bgvUrl.replace("/getsdev1/", "/")
                  );
                  handleModalOpen();
                }}
                style={{
                  width: "50%",
                  marginLeft: 0,
                  marginTop: 10,
                  padding: "10px",
                }}
                className="btn btn-secondary    "
              >
                View
              </button>
            )}
          </div>
          <div className="form-control-input">
            <div style={{ fontWeight: "700" }}>Police Verification</div>
            {ViewDetailsData?.policeVerificationUrl !== "" && (
              <button
                type="button"
                onClick={() => {
                  setDocumentUrl(
                    ViewDetailsData?.policeVerificationUrl.replace(
                      "gets-dev.",
                      ""
                    )
                  );
                  handleModalOpen();
                }}
                style={{
                  width: "50%",
                  marginLeft: 0,
                  marginTop: 10,
                  padding: "10px",
                }}
                className="btn btn-secondary    "
              >
                View
              </button>
            )}
          </div>
          <div className="form-control-input">
            <div style={{ fontWeight: "700" }}>Badge</div>
            {ViewDetailsData?.badgeUrl !== "" && (
              <button
                type="button"
                onClick={() => {
                  setDocumentUrl(
                    ViewDetailsData?.badgeUrl.replace("/getsdev1/", "/")
                  );
                  handleModalOpen();
                }}
                style={{
                  width: "50%",
                  marginLeft: 0,
                  marginTop: 10,
                  padding: "10px",
                }}
                className="btn btn-secondary    "
              >
                View
              </button>
            )}
          </div>
          <div className="form-control-input">
            <div style={{ fontWeight: "700" }}>Undertaking</div>
            {ViewDetailsData?.undertakingUrl !== "" && (
              <button
                type="button"
                onClick={() => {
                  setDocumentUrl(
                    ViewDetailsData?.undertakingUrl.replace("/getsdev1/", "/")
                  );
                  handleModalOpen();
                }}
                style={{
                  width: "50%",
                  marginLeft: 0,
                  marginTop: 10,
                  padding: "10px",
                }}
                className="btn btn-secondary    "
              >
                View
              </button>
            )}
          </div>
          <div className="form-control-input">
            <div style={{ fontWeight: "700" }}>Driver Training Certificate</div>
            {ViewDetailsData?.driverTrainingCertUrl !== "" && (
              <button
                type="button"
                onClick={() => {
                  setDocumentUrl(
                    ViewDetailsData?.driverTrainingCertUrl.replace(
                      "gets-dev.",
                      ""
                    )
                  );
                  handleModalOpen();
                }}
                style={{
                  width: "50%",
                  marginLeft: 0,
                  marginTop: 10,
                  padding: "10px",
                }}
                className="btn btn-secondary    "
              >
                View
              </button>
            )}
          </div>
          <div className="form-control-input">
            <div style={{ fontWeight: "700" }}>Medical Certificate</div>
            {ViewDetailsData?.medicalCertUrl !== "" && (
              <button
                type="button"
                onClick={() => {
                  setDocumentUrl(
                    ViewDetailsData?.medicalCertUrl.replace("/getsdev1/", "/")
                  );
                  handleModalOpen();
                }}
                style={{
                  width: "50%",
                  marginLeft: 0,
                  marginTop: 10,
                  padding: "10px",
                }}
                className="btn btn-secondary    "
              >
                View
              </button>
            )}
          </div>
        </div>
        {!isView ? (
          <div className="addBtnContainer" style={{ justifyContent: "end" }}>
            <button className="btn btn-secondary" onClick={() => handleOpen()}>
              Reject
            </button>
            <button
              className="btn btn-primary"
              onClick={() => approveDriver(true)}
            >
              Approve
            </button>
          </div>
        ) : (
          <div className="addBtnContainer" style={{ justifyContent: "end" }}>
            <button
              className="btn btn-primary"
              onClick={() => SetAddDriverOpen()}
            >
              Back
            </button>
          </div>
        )}
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
          Please mention the reason for rejection of driver
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
          <Button
            type="submit"
            onClick={() => {
              msg != "" && approveDriver(false, msg);
            }}
          >
            Reject Driver
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
        ""
      )}
    </div>
  );
};

export default AddDriverPendingApproval;
