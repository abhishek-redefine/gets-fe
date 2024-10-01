import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";



const BillingIssuesTable = ({ list, vehicleIdClicked }) => {
  const [data, setData] = useState([]);

  const handleTripClick = (tripId,row) => {
    console.log("Billing Issues Vehicle ID clicked");
    vehicleIdClicked(tripId,row.original);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'tripId',
        header: 'Trip ID',
        size: 150,
        Cell: ({ cell,row }) => {
          return <div>
            <a
              onClick={()=>handleTripClick(cell.getValue(),row)}
              style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
            >TRIP-{cell.getValue()}
            </a>
          </div>;
        },
      },
      // {
      //   accessorKey: 'vehicleId',
      //   header: 'Vehicle ID',
      //   size: 150,
      //   Cell: ({ cell }) => {
      //     const vehicleId = cell.getValue();
      //     return (
      //       <a
      //         // onClick={handleTripClick}
      //         // style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
      //       >
      //         {vehicleId}
      //       </a>
      //     );
      //   }
      // },
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
        accessorKey: 'date',
        header: 'Date',
        size: 100,
      },
      {
        accessorKey: 'km',
        header: 'Km.',
        size: 100,
      },
      {
        accessorKey: 'hrs',
        header: 'Hrs',
        size: 100,
      },
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

export default BillingIssuesTable;