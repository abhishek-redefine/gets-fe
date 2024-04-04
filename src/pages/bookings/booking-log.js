import React, { useEffect, useState } from "react";
import Grid from "@/components/grid";
import { DEFAULT_PAGE_SIZE } from "@/constants/api.constants";
import BookingService from "@/services/booking.service";

const BookingLog = ({ bookingId = "" }) => {
  const headers = [
    {
      key: "id",
      display: "Booking Id",
    },
    {
      key: "changedField",
      display: "Title",
    },
    {
      key: "oldValue",
      display: "Old Value",
    },
    {
      key: "newValue",
      display: "New Value",
    },
    {
      key: "updatedBy",
      display: "Changed By",
    },
    {
      key: "updatedAt",
      display: "Changed At",
    },
    {
      key: "source",
      display: "Source",
    },
  ];
  const [paginationData, setPaginationData] = useState();
  const [bookingListing, setBookingListing] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: DEFAULT_PAGE_SIZE,
  });

  const onMenuItemClick = () => {};
  const handlePageChange = (page) => {
    let updatedPagination = { ...pagination };
    updatedPagination.page = page;
    setPagination(updatedPagination);
  };

  const getBookingHistory = async (id) => {
    try {
      const queryParams = `bookingId=${id}`;
      const response = await BookingService.getBookingHistory(queryParams);
      const { data } = response || {};
      console.log(data);
      var modifiedList = [];
      data.map((val) => {
        let newObj = val;
        if (val.oldValue === "") {
          newObj.oldValue = "-";
        }
        else if(val.newValue === ""){
          newObj.newValue = "-";
        }
        modifiedList.push(newObj);
      });
      setBookingListing(modifiedList);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log("booking change logs>>>", bookingId);
    if (bookingId) {
      getBookingHistory(bookingId);
    }
  }, []);

  return (
    <Grid
      pageNoText="pageNumber"
      onMenuItemClick={onMenuItemClick}
      headers={headers}
      handlePageChange={handlePageChange}
      pagination={paginationData}
      listing={bookingListing}
    />
  );
};

export default BookingLog;
