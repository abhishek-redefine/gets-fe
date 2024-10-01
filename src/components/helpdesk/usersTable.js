import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import LoaderComponent from "../loader";

const UsersTable = ({ list, isLoading }) => {
  const [data, setData] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Booking ID",
        size: 150,
      },
      {
        accessorKey: "bookingDate",
        header: "Booking Date",
        size: 150,
      },
      {
        accessorKey: "employeeId",
        header: "Employee ID",
        size: 150,
      },
      {
        accessorKey: "officeId",
        header: "Office ID",
        size: 150,
      },
      // {
      //   accessorKey: "teamName",
      //   header: "Team Name",
      //   size: 150,
      // },
      {
        accessorKey: "bookingType",
        header: "Shift Type",
        size: 150,
      },
      {
        accessorKey: "transportType",
        header: "Transport type",
        size: 150,
      },
      {
        accessorFn: (row) =>
          row.bookingType === "LOGIN" ? row.loginShift : row.logoutShift,
        header: "Shift Time",
        size: 150,
      },
    ],
    []
  );

  const tableInstance = useMaterialReactTable({
    columns,
    data,
    getRowId: (row) => row.id,
    state: { isLoading},
    muiCircularProgressProps: {
      Component: <LoaderComponent />,
    },
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

export default UsersTable;
