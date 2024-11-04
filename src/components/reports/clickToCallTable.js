import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import LoaderComponent from "../loader";

const ClickToCallTable = ({ list, isLoading }) => {
  const [data, setData] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "callID",
        header: "Call ID",
        size: 150,
      },
      {
        accessorKey: "tripId",
        header: "Trip ID",
        size: 150,
      },
      {
        accessorKey: "callStatus",
        header: "Call Status",
        size: 150,
      },
      {
        accessorKey: "vehicleID",
        header: "Vehicle ID",
        size: 150,
      },
      {
        accessorKey: "employeeID",
        header: "Employee ID",
        size: 150,
      },
      {
        accessorKey: "employeeName",
        header: "Employee Name",
        size: 150,
      },
      {
        accessorKey: "gender",
        header: "Gender",
        size: 150,
      },
      {
        accessorKey: "timeOfCall",
        header: "Time of Call",
        size: 150,
      },
      {
        accessorKey: "callInitiationLocation",
        header: "Call Initiation Location",
        size: 250,
      },
      {
        accessorKey: "callDistancefromPickUpPoint",
        header: "Call Distance from Pick-Up Point",
        size: 320,
      },
      {
        accessorKey: "driverPhoneNumber",
        header: "Driver Phone Number",
        size: 150,
      },
      {
        accessorKey: "employeePhoneNumber",
        header: "Employee Phone Number",
        size: 280,
      },
      {
        accessorKey: "callBilledUnits",
        header: "Call Billed Units",
        size: 150,
      },
      {
        accessorKey: "driverCallDuration",
        header: "Driver Call Duration",
        size: 250,
      },
      {
        accessorKey: "employeeCallDuration",
        header: "Employee Call Duration",
        size: 250,
      },
      {
        accessorKey: "callStartTime",
        header: "Call Start Time",
        size: 150,
      },
      {
        accessorKey: "callEndTime",
        header: "Call End Time",
        size: 150,
      },
      {
        accessorKey: "driverHangUpCause",
        header: "Driver Hang-Up Cause",
        size: 250,
      },
      {
        accessorKey: "employeeHangUpCause",
        header: "Employee Hang-Up Cause",
        size: 280,
      },
      {
        accessorKey: "callLogURL",
        header: "Call Log URL",
        size: 150,
      },
      {
        accessorKey: "travelledOffice",
        header: "Travelled Office",
        size: 150,
      },
    ],
    []
  );

  const tableInstance = useMaterialReactTable({
    columns,
    data,
    state: {
      isLoading,
    },
    muiCircularProgressProps: {
      Component: <LoaderComponent />,
    },
  });

  useEffect(() => {
    setData(list);
  }, [list]);

  return (
    <div>
      <MaterialReactTable table={tableInstance} />
    </div>
  );
};

export default ClickToCallTable;
