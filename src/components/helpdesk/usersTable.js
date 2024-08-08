import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";



const UsersTable = ({list}) => {
  const [data, setData] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id', 
        header: 'Trip ID',
        size: 150,
        Cell: ({ cell }) => {
          return <div>TRIP-{cell.getValue()}</div>;
        },
      },
    //   {
    //     accessorKey: 'empIds',
    //     header: 'Trip Status',
    //     size: 150,
    //   },
      {
        accessorKey: 'shiftTime', 
        header: 'Shift Time',
        size: 150,
      },
      {
        accessorKey: 'shiftType',
        header: 'Shift Type',
        size: 150,
      },
      {
        accessorKey: 'vehicleNumber',
        header: 'Cab Details',
        size: 150,
      },
    //   {
    //     accessorKey: 'pickupTime',
    //     header: 'Sign In',
    //     size: 100,
    //   },
    //   {
    //     accessorKey: 'pickupPoint',
    //     header: 'Sign Out',
    //     size: 100,
    //   },
    ],
    [],
  );

  const tableInstance = useMaterialReactTable({
    columns,
    data,
    getRowId: row => row.tripId,
  });

  useEffect(()=>{
    setData(list)
  },[list])

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




