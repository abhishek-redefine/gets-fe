import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import LoaderComponent from "../loader";

const TripCompletionVendorWiseTable = ({ list, isLoading }) => {
  const [data, setData] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "bunitId",
        header: "Bunit Id",
        size: 150,
      },
      {
        accessorKey: "office",
        header: "Office",
        size: 100,
      },
      {
        accessorKey: "vendorId",
        header: "Vendor Id",
        size: 150,
      },
      {
        accessorKey: "tripDate",
        header: "Trip Date",
        size: 150,
      },
      {
        accessorKey: "tripId",
        header: "Trip Id",
        size: 150,
      },
      {
        accessorKey: "tripDirection",
        header: "Trip Direction",
        size: 150,
      },
      {
        accessorKey: "shift",
        header: "Shift",
        size: 150,
      },
      {
        accessorKey: "source",
        header: "Source",
        size: 150,
      },
      {
        accessorKey: "tripStatus",
        header: "Trip Status",
        size: 150,
      },
      {
        accessorKey: "delayReason",
        header: "Delay Reason",
        size: 100,
      },
      {
        accessorKey: "cabType",
        header: "Cab Type",
        size: 100,
      },
      {
        accessorKey: "actualVendorCabId",
        header: "Actual Vendor Cab Id",
        size: 250,
      },
      {
        accessorKey: "actualCabRegistration",
        header: "Actual Cab Registration",
        size: 250,
      },
      {
        accessorKey: "traveledKm",
        header: "Traveled Km",
        size: 150,
      },
      {
        accessorKey: "tripStatusReason",
        header: "Trip Status Reason",
        size: 150,
      },
      {
        accessorKey: "billingZone",
        header: "Billing Zone",
        size: 150,
      },
      {
        accessorKey: "actualEscort",
        header: "Actual Escort",
        size: 100,
      },
      {
        accessorKey: "landmark",
        header: "Landmark",
        size: 150,
      },
      {
        accessorKey: "plannedcabRegistration",
        header: "Planned cab Registration",
        size: 280,
      },					
      {
        accessorKey: "plannedkm",
        header: "Planned km",
        size: 150,
      },
      {
        accessorKey: "plannedEmpCount",
        header: "Planned Emp Count",
        size: 150,
      },
      {
        accessorKey: "travelledEmpCount",
        header: "Travelled Emp Count",
        size: 150,
      },
      {
        accessorKey: "nodalPoint",
        header: "Nodal Point",
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

export default TripCompletionVendorWiseTable;
