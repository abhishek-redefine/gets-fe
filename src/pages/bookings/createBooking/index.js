import React, { useEffect, useState } from "react";
import BookingsPage from "..";

import DropdownLayout from "@/components/BookingCards/DropdownLayout";

const CreateBooking = () => {
  const [radio, setRadio] = useState(1);
  const [transportType, setTransportType] = useState(0);
  const [placeHolder, setPlaceHolder] = useState(false);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    if (radio === 1 || radio === 2) {
      setPlaceHolder(true);
    } else {
      setPlaceHolder(false);
    }
  }, [radio]);
  const nextBtnHandler = () => {
    console.log("Clicked!!!createBooking");
  };
  return (
    <>
      <div>
        <BookingsPage />
        <DropdownLayout/>
      </div>
     
    </>
  );
};

export default CreateBooking;
