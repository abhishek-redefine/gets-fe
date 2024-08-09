import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const TripsTable = ({ list, tripsTripIdClicked }) => {
  const [data, setData] = useState([]);

  const handleTripClick = () => {
    console.log("Trips trip clicked");
    tripsTripIdClicked();
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Trip ID",
        size: 150,
        Cell: ({ cell }) => {
          const tripId = cell.getValue();
          return (
            <a
              onClick={handleTripClick}
              style={{
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              TRIP-{tripId}
            </a>
          );
        },
      },
      {
        accessorKey: "tripState",
        header: "Trip Status",
        size: 150,
      },
      {
        accessorKey: "shiftTime",
        header: "Shift Time",
        size: 150,
      },
      {
        accessorKey: "shiftType",
        header: "Shift Type",
        size: 150,
      },
      {
        accessorKey: "vehicleNumber",
        header: "Cab Details",
        size: 150,
      },
      {
        accessorKey: "signIn",
        header: "Sign In",
        size: 100,
      },
      {
        accessorKey: "signOut",
        header: "Sign Out",
        size: 100,
      },
    ],
    []
  );

  const tableInstance = useMaterialReactTable({
    columns,
    data,
    getRowId: (row) => row.tripId,
  });

  useEffect(() => {
    setData(list);
  }, [list]);

  return (
    <div>
      <div
        style={{
          padding: "8px 20px 0",
        }}
      >
        <MaterialReactTable table={tableInstance} />
      </div>
    </div>
  );
};

export default TripsTable;
