import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { liveTrackingData } from "@/sampleData/liveTrackingData";
import LoaderComponent from "../loader";

const LiveTrackingTable = ({ tripData, isLoading }) => {
  const [data, setData] = useState(tripData || []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Trip ID",
        size: 150,
        Cell: ({ cell }) => {
          return <div>TRIP-{cell.getValue()}</div>;
        },
      },
      {
        accessorKey: "vehicleNumber",
        header: "Vehicle Number",
        size: 100,
      },
      {
        accessorKey: "officeId",
        header: "Office",
        size: 170,
      },
      {
        accessorKey: "tripState",
        header: "Trip State",
        size: 100,
      },
      {
        accessorKey: "isCabAllocated",
        header: "Cab Allocated",
        size: 100,
        Cell: ({ cell }) => {
          return <div>{cell.getValue() ? "True" : "False"}</div>;
        },
      },
      {
        accessorKey: "shiftTime",
        header: "Shift Time",
        size: 100,
      },
      {
        accessorKey: "shiftType",
        header: "shift Type",
        size: 100,
      },
      {
        accessorKey: "empIds",
        header: "Employee",
        size: 100,
      },
      {
        accessorKey: "tripStartTime",
        header: "Trip Start Time",
        size: 100,
      },
      {
        accessorKey: "routeName",
        header: "Route",
        size: 150,
      },
      {
        accessorKey: "pickupTime",
        header: "ETA",
        size: 170,
      },
      {
        accessorKey: "noOfSeats",
        header: "Vehicle Type",
        size: 130,
        Cell: ({ cell }) => {
          return <div>{cell.getValue()}s</div>;
        },
      },
    ],
    []
  );

  const tableInstance = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    state: { isLoading },
    muiCircularProgressProps: {
      Component: <LoaderComponent />,
    },
  });

  useEffect(() => {
    if (tripData) {
      console.log(tripData);
      setData(tripData);
    }
  }, [tripData]);

  return (
    <div>
      <div
        style={{
          backgroundColor: "#f9f9f9",
          padding: "16px 20px",
          borderRadius: "10px",
        }}
      >
        <MaterialReactTable table={tableInstance} />
      </div>
    </div>
  );
};

export default LiveTrackingTable;
