import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { dispatchNotificationData } from "@/sampleData/dispatchNotificationData";



const DispatchNotificationTable = ({list}) => {
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
      {
        accessorKey: 'empIds',
        header: 'Employee ID',
        size: 150,
      },
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
      {
        accessorKey: 'pickupTime',
        header: 'Pickup Time',
        size: 150,
      },
      {
        accessorKey: 'pickupPoint',
        header: 'Pickup Point',
        size: 200,
      },
      {
        accessorKey: 'dropPoint',
        header: 'Drop Point',
        size: 200,
      },
      {
        accessorKey: 'smsStatus',
        header: 'SMS Status',
        size: 150,
      },
      {
        accessorKey: 'emailStatus',
        header: 'Email Status',
        size: 150,
      },
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

export default DispatchNotificationTable;




