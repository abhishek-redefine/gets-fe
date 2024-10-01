import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import LoaderComponent from "../loader";

const RawBillingDataTable = ({ list, isLoading }) => {
  const [data, setData] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "facility",
        header: "Facility",
        size: 150,
      },
      {
        accessorKey: "offices",
        header: "Offices",
        size: 100,
      },
      {
        accessorKey: "tripOffice",
        header: "Trip Office",
        size: 150,
      },
      {
        accessorKey: "vendor",
        header: "Vendor",
        size: 150,
      },
      {
        accessorKey: "billingContract",
        header: "Billing Contract",
        size: 150,
      },
      {
        accessorKey: "cabId",
        header: "Cab ID",
        size: 150,
      },
      {
        accessorKey: "registration",
        header: "Registration",
        size: 150,
      },
      {
        accessorKey: "seatingCapacity",
        header: "Seating Capacity",
        size: 150,
      },
      {
        accessorKey: "dutyStart",
        header: "Duty Start",
        size: 100,
      },
      {
        accessorKey: "dutyEnd",
        header: "Duty End",
        size: 150,
      },
      {
        accessorKey: "tripSource",
        header: "Trip Source",
        size: 150,
      },
      {
        accessorKey: "tripType",
        header: "Trip Type",
        size: 150,
      },
      {
        accessorKey: "shift",
        header: "Shift",
        size: 150,
      },
      {
        accessorKey: "direction",
        header: "Direction",
        size: 150,
      },
      {
        accessorKey: "tripId",
        header: "Trip ID",
        size: 150,
      },
      {
        accessorKey: "tripDate",
        header: "Trip Date",
        size: 150,
      },
      {
        accessorKey: "tripStartTime",
        header: "Trip Start Time",
        size: 150,
      },
      {
        accessorKey: "tripEndTime",
        header: "Trip End Time",
        size: 150,
      },
      {
        accessorKey: "traveledEmployeeCount",
        header: "Traveled Employee Count",
        size: 280,
      },
      {
        accessorKey: "plannedTripEmployees",
        header: "Planned Trip Employees",
        size: 250,
      },
      {
        accessorKey: "garageKM",
        header: "Garage KM",
        size: 150,
      },
      {
        accessorKey: "auditResults",
        header: "Audit Results",
        size: 150,
      },
      {
        accessorKey: "billingComment",
        header: "Billing Comment",
        size: 150,
      },
      {
        accessorKey: "issueResolvedBy",
        header: "Issue Resolved By",
        size: 150,
      },
      {
        accessorKey: "auditDoneBy",
        header: "Audit Done By",
        size: 150,
      },
      {
        accessorKey: "location",
        header: "Location",
        size: 150,
      },
      {
        accessorKey: "startLocationAddress",
        header: "Start Location Address",
        size: 250,
      },
      {
        accessorKey: "startLocationLandmark",
        header: "Start Location Landmark",
        size: 250,
      },
      {
        accessorKey: "endLocationAddress",
        header: "End Location Address",
        size: 250,
      },
      {
        accessorKey: "endLocationLandmark",
        header: "End Location Landmark",
        size: 250,
      },
      {
        accessorKey: "traveledEscortCount",
        header: "Traveled Escort Count",
        size: 250,
      },
      {
        accessorKey: "plannedEscortCount",
        header: "Planned Escort Count",
        size: 250,
      },
      {
        accessorKey: "escortTraveled",
        header: "Escort Traveled",
        size: 150,
      },
      {
        accessorKey: "physicalId",
        header: "Physical ID",
        size: 150,
      },
      {
        accessorKey: "tripReferenceKMs",
        header: "Trip Reference KM",
        size: 150,
      },
      {
        accessorKey: "emptyLegReferenceKM",
        header: "Empty Leg Reference KM",
        size: 280,
      },
      {
        accessorKey: "tripDistanceApprovedKMs",
        header: "Trip Distance Approved KMs",
        size: 280,
      },
      {
        accessorKey: "emptyLegApprovedKM",
        header: "Empty Leg Approved KM",
        size: 280,
      },
      {
        accessorKey: "dutyKM",
        header: "Duty KM",
        size: 150,
      },
      {
        accessorKey: "tripAudited",
        header: "Trip Audited",
        size: 150,
      },
      {
        accessorKey: "tripStatus",
        header: "Trip Status",
        size: 150,
      },
      {
        accessorKey: "tripSheetComment",
        header: "Tripsheet Comment",
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

export default RawBillingDataTable;
