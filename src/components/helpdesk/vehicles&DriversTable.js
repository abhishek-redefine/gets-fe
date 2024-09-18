import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const VehiclesNDriversTable = ({ list, vehicleTripIdClicked }) => {
  const [data, setData] = useState([]);

  const handleTripClick = (id) => {
    if (vehicleTripIdClicked) {
      // console.log(`Trip-${id} clicked`);
      vehicleTripIdClicked(id);
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
        accessorKey: "officeId",
        header: "Office ID",
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
        accessorKey: "pickupTime",
        header: "Pickup Time",
        size: 150,
      },
      {
        accessorKey: "tripDistance",
        header: "Trip Distance",
        size: 150,
      },
    ],
    []
  );

  const tableInstance = useMaterialReactTable({
    columns,
    data,
    getRowId: (row) => row.id,
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
        <MaterialReactTable table={tableInstance} getRowId={(row) => row.id}/>
      </div>
    </div>
  );
};

export default VehiclesNDriversTable;
