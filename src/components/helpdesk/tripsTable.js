import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import LoaderComponent from "../loader";

const TripsTable = ({ list, tripIdClicked, isLoading }) => {
  const [data, setData] = useState([]);

  const handleTripClick = (id) => {
    if (tripIdClicked) {
      // console.log(`Trip-${id} clicked`);
      tripIdClicked(id);
    } else {
      console.log("tripIdClicked function not working");
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Trip ID",
        size: 150,
        Cell: ({ cell }) => {
          const id = cell.getValue();
          return (
            <a
              onClick={() => handleTripClick(id)}
              style={{
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              TRIP-{id}
            </a>
          );
        },
      },
      {
        accessorKey: "date",
        header: "Date",
        size: 150,
      },
      {
        accessorKey: "shiftType",
        header: "Shift Type",
        size: 150,
      },
      {
        accessorKey: "shiftTime",
        header: "Shift Time",
        size: 150,
      },
      {
        accessorKey: "tripState",
        header: "Trip Status",
        size: 150,
      },
      {
        accessorKey: "vendorName",
        header: "Vendor Name",
        size: 150,
      },
      {
        accessorKey: "vehicleNumber",
        header: "Vehicle Number",
        size: 150,
      },
      {
        accessorKey: "driverName",
        header: "Driver Name",
        size: 150,
      },
    ],
    []
  );

  const tableInstance = useMaterialReactTable({
    columns,
    data,
    getRowId: (row) => {
      row.id;
      console.log("row.id", row.id);
    },
    state: { isLoading },
    muiCircularProgressProps: {
      Component: <LoaderComponent />,
    },
  });

  useEffect(() => {
    console.log("TripsTable data updated:", list);
    setData(list);
  }, [list]);

  return (
    <div>
      <div
        style={{
          padding: "8px 20px 0",
        }}
      >
        <MaterialReactTable table={tableInstance} getRowId={(row) => row.id} />
      </div>
    </div>
  );
};

export default TripsTable;
