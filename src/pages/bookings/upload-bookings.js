import bookings from "@/layouts/bookings";
import React, { useEffect, useState } from "react";
import Grid from "@/components/grid";
import UploadButton from "@/components/buttons/uploadButton";
import BookingService from "@/services/booking.service";
import { toggleToast } from "@/redux/company.slice";
import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import LoaderComponent from "@/components/common/loading";

const UploadBooking = ({}) => {
  const headers = [
    {
      key: "importFileName",
      display: "File Name",
    },
    {
      key: "createdBy",
      display: "Created By",
    },
    {
      key: "createdAt",
      display: "Created At",
    },
    {
      key: "isSuccessFul",
      display: "Upload Status",
    },
    {
      key: "totalRecords",
      display: "Total Records",
    },
    {
      key: "successRecords",
      display: "Success Records",
    },
    {
      key: "failRecords",
      display: "Fail Records",
    },
    {
      key: "hamburgerMenu",
      html: (
        <>
          <span className="material-symbols-outlined">more_vert</span>
        </>
      ),
      navigation: true,
      menuItems: [
        {
          display: "Download Failed Booking List",
          key: "download",
        },
      ],
    },
  ];

  const dispatch = useDispatch();

  const [bookingListing, setBookingListing] = useState();
  const [loading, setLoading] = useState(false);

  const fetchAllUploadBookings = async () => {
    try {
      setLoading(true);
      const response = await BookingService.listAllBookings();
      setBookingListing(response.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const uploadFunction = async (item) => {
    try {
      setLoading(true);
      var form = new FormData();
      form.append(
        "model",
        '{"importJobDTO": {"importType": "IMPORT_TYPE_BOOKING","entityName": "BOOKING"}}'
      );
      form.append("file", item);
      const response = await BookingService.uploadForm(form);
      console.log(response);
      if (response?.data?.isSuccessFul) {
        dispatch(
          toggleToast({
            message: "All Booking records uploaded successfully!",
            type: "success",
          })
        );
        fetchAllUploadBookings();
      } else {
        console.log(
          response?.data?.successRecords,
          response?.data?.successRecords > 0
        );
        if (response?.data?.successRecords > 0) {
          dispatch(
            toggleToast({
              message: `${response?.data?.successRecords} out of ${response?.data?.totalRecords} Booking records uploaded successfully!`,
              type: "success",
            })
          );
        } else {
          dispatch(
            toggleToast({
              message: `Booking records failed to upload. Please try again later.`,
              type: "error",
            })
          );
        }
        fetchAllUploadBookings();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const onMenuItemClick = (key, values) => {
    if (key === "download") {
      const s3Link = values.errorFilePath.replace("gets-dev.", "");
      // Split the URL by '/'
      const parts = s3Link.split("/");

      // Get the last part which should be the filename
      const filename = parts.pop();
      console.log(filename);
      const downloadLink = document.createElement("a");
      downloadLink.href = s3Link;
      downloadLink.setAttribute("download", filename);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  useEffect(() => {
    fetchAllUploadBookings();
  }, []);

  return (
    <div>
      <div className="internalSettingContainer">
        <div style={{ display: "flex", justifyContent: "end" }}>
          <UploadButton uploadFunction={uploadFunction} />
        </div>
        <div className="gridContainer">
          <Grid
            headers={headers}
            listing={bookingListing}
            onMenuItemClick={onMenuItemClick}
          />
        </div>
      </div>
      {loading ? (
        <div
          style={{
            position: "absolute",
            // backgroundColor: "pink",
            zIndex: "1",
            top: "55%",
            left: "50%",
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

export default bookings(UploadBooking);
