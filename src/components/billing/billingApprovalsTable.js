import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";



const BillingApprovalsTable = ({ list, vehicleIdClicked }) => {
  const [data, setData] = useState([]);

  const handleTripClick = (tripId, row) => {
    console.log("Billing approvals Vehicle ID clicked");
    vehicleIdClicked(tripId,row.original);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'tripId',
        header: 'Trip ID',
        size: 150,
        Cell: ({ cell,row }) => {
          return (
          <a
            onClick={()=>handleTripClick(cell.getValue(),row)}
            style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
          >
            TRIP-{cell.getValue()}
          </a>)
          // return <div>TRIP-{cell.getValue()}</div>;
        },
      },
      {
        accessorKey: 'vehicleNumber',
        header: 'Vehicle Registration',
        size: 250,
      },
      {
        accessorKey: 'vehicleType',
        header: 'Vehicle Type',
        size: 150,
      },
      {
        accessorKey: 'actualVendor',
        header: 'Vendor',
        size: 150,
      },
      {
        accessorKey: 'tripDate',
        header: 'Date',
        size: 100,
      },
      // {
      //   accessorKey: 'km',
      //   header: 'Km.',
      //   size: 100,
      // },
      // {
      //   accessorKey: 'hrs',
      //   header: 'Hrs',
      //   size: 100,
      // },
      {
        accessorKey: 'issueName',
        header: 'Issue Type',
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
    ],
    [],
  );

  const tableInstance = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    getRowId: row => row.tripId,
  });

  useEffect(() => {
    setData(list)
  }, [list])

  return (
    <div>
      <MaterialReactTable table={tableInstance} />
    </div>
  );
};

export default BillingApprovalsTable;