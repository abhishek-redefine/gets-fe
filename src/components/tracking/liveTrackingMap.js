import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useRef, useState, useMemo } from "react";
import L from "leaflet";
import io from "socket.io-client";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import DispatchService from "@/services/dispatch.service";
import moment from "moment";
import OfficeService from "@/services/office.service";
import LoaderComponent from "../loader";

const createRotatedIcon = (angle) => {
  const carIconUrl = "/images/cab.png"; // Path to your local icon

  const adjustedAngle = angle - 270;

  const carIcon = new L.DivIcon({
    html: `<img src="${carIconUrl}" style="transform: rotate(${adjustedAngle}deg); width: 60px; height: 60px;" />`,
    className: "custom-icon", // Optional custom class if you want to add extra styling
    iconSize: [60, 60],
    iconAnchor: [30, 30], // Adjust anchor for rotated icon
    popupAnchor: [0, -60],
  });

  return carIcon;
};

const createOfficeIcon = () => {
  const officeUrl = "/images/office.png";
  const officeIcon = new L.DivIcon({
    html: `<img src="${officeUrl}" style="width: 60px; height: 60px;" />`,
    className: "custom-icon", // Optional custom class if you want to add extra styling
    iconSize: [60, 60],
    iconAnchor: [30, 30], // Adjust anchor for rotated icon
    popupAnchor: [0, -60],
  });
  return officeIcon;
};

const LiveTrackingMap = ({ officeId, fullMapShow }) => {
  const [officeList, setOfficeList] = useState([]);
  const [cabsList, setCabsList] = useState([]);
  const [loading, setLoading] = useState(false);
  //   const [loading, setLoading] = useState(false);
  // const columns = useMemo(
  //     () => [
  //         {
  //             accessorKey: 'vehicle_number',
  //             header: 'Vehicle Number',
  //             size: 150,
  //         },
  //         {
  //             accessorKey: 'trip_id',
  //             header: 'Trip Id',
  //             size: 150,
  //             Cell: ({ cell }) => {
  //                 return <div>TRIP-{cell.getValue()}</div>;
  //             },
  //         },
  //         {
  //             accessorKey: 'shift_time',
  //             header: 'Shift Time',
  //             size: 150,
  //         },
  //         {
  //             accessorKey: 'shift_type',
  //             header: 'Shift Type',
  //             size: 150,
  //         },
  //         {
  //             accessorKey: 'empCount',
  //             header: 'Employee',
  //             size: 150,
  //         },
  //         {
  //             accessorKey: 'tripStartTime',
  //             header: 'Trip Start Time',
  //             size: 150,
  //         },
  //         {
  //             accessorKey: 'Route',
  //             header: 'Route Name',
  //             size: 150,
  //         },
  //         {
  //             accessorKey: 'officeId',
  //             header: 'Office',
  //             size: 150,
  //         },
  //         {
  //             accessorKey: 'eta',
  //             header: 'ETA',
  //             size: 150,
  //         }
  //     ],
  //     [],
  // );

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Trip ID",
        size: 150,
        Cell: ({ cell }) => {
          return <div>TRIP-{cell.getValue()}</div>;
        },
      },
      {
        accessorKey: "vehicleNumber",
        header: "Vehicle Number",
        size: 100,
      },
      {
        accessorKey: "officeId",
        header: "Office",
        size: 170,
      },
      {
        accessorKey: "tripState",
        header: "Trip State",
        size: 100,
      },
      {
        accessorKey: "shiftTime",
        header: "Shift Time",
        size: 100,
      },
      {
        accessorKey: "shiftType",
        header: "shift Type",
        size: 100,
      },
      {
        accessorKey: "empIds",
        header: "Employee",
        size: 100,
      },
      {
        accessorKey: "tripStartTime",
        header: "Trip Start Time",
        size: 100,
      },
      {
        accessorKey: "routeName",
        header: "Route",
        size: 150,
      },
      {
        accessorKey: "pickupTime",
        header: "ETA",
        size: 50,
      },
      // {
      //     accessorKey: "noOfSeats",
      //     header: "Vehicle Type",
      //     size: 130,
      //     Cell: ({ cell }) => {
      //         return <div>{cell.getValue()}s</div>;
      //     },
      // },
    ],
    []
  );

  const [data, setData] = useState([]);

  //socket io implementation
  const socketRef = useRef(null);
  useEffect(() => {
    // Check if socketRef.current is null before creating a new connection
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3001", {
        auth: {
          token: "json-web-token",
        },
      });
      socketRef.current.emit("adminJoin", () => {
        console.log("Admin Room joined");
      });

      // Set up event listeners
      // socketRef.current.on('locationUpdate', (data) => {
      //     console.log(data);
      // });

      socketRef.current.on("AllVehicleLocation", (data) => {
        if (data && data.length > 0) {
          console.log(data);
          setCabsList(data);
        }
      });
    }

    console.log("Socket connected:", socketRef.current);

    const locationInterval = setInterval(() => {
      if (socketRef.current) {
        socketRef.current.emit("getLocation", (data) => {
          console.log(data);
        });
      }
    }, 10000);

    // Clean up the socket connection when the component unmounts
    return () => {
      clearInterval(locationInterval);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null; // Reset the ref
      }
    };
  }, []);

  useEffect(() => {
    // Fix for marker icons not showing correctly
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }, []);

  const tableInstance = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    enableTopToolbar: false,
    initialState: { density: "compact" },
    muiTableBodyCellProps: {
      sx: {
        fontFamily: "DM Sans",
        fontSize: "14px",
        height: "60px",
      },
    },
    state: {  isLoading: loading },
    muiCircularProgressProps: {
      Component: <LoaderComponent />,
    },
  });

  const fetchSummary = async () => {
    try {
      setLoading(true);
    //   await new Promise((resolve) => setTimeout(resolve, 5000));
      const pagination = {
        page: 0,
        size: 10,
      };
      const queryParams = new URLSearchParams(pagination);
      let allSearchValues = {
        officeId: officeId,
        tripDateStr: moment().format("YYYY-MM-DD"),
      };

      const response = await DispatchService.getTripSearchByBean(
        queryParams,
        allSearchValues
      );
      const data = response.data.data;
      if (data.length > 0) {
        let temp = [];
        data.map((val) => {
          if (!val.isCabAllocated) {
            return;
          }
          temp.push(val);
        });
        console.log(temp);
        setData(temp);
      } else {
        setData([]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOffice = async () => {
    try {
      const response = await OfficeService.getAllOffices();
      const { data } = response;
      const { clientOfficeDTO } = data;
      console.log(clientOfficeDTO);
      setOfficeList(clientOfficeDTO);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllOffice();
    fetchSummary();
  }, []);

  return (
    <div className="d-flex">
      {!fullMapShow && (
        <div style={{ height: "90vh", width: "35%" }}>
          <MaterialReactTable
            table={tableInstance}
            muiTableContainerProps={{
              style: {
                height: "90vh",
                textAlign: "center",
              },
            }}
          />
        </div>
      )}
      <div
        style={{
          height: "90vh",
          width: !fullMapShow ? "64%" : "100%",
          marginLeft: "1%",
          borderRadius: 40,
        }}
      >
        <MapContainer
          center={[28.58, 77.3]}
          zoom={15}
          style={{ height: "90vh", width: "100%", borderRadius: 40 }}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          {cabsList &&
            cabsList?.length > 0 &&
            cabsList.map((item, index) => {
              return (
                <Marker
                  key={index}
                  position={[item.latitude, item.longitude]}
                  icon={createRotatedIcon(item.heading)}
                >
                  <Popup>
                    <div>
                      <p>Trip Id : TRIP-{item.trip_id}</p>
                      <p>Shift Time : {item.shift_time}</p>
                      <p>Shift Type : {item.shift_type}</p>
                      <p>Vehicle Number : {item.vehicle_number}</p>
                      <p>Driver License : {item.driver_license}</p>
                      <p>
                        Trip State : {item.trip_ended ? "Completed" : "Ongoing"}
                      </p>
                      <p>Vehicle Speed : {item.speed}</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          {officeList &&
            officeList.length > 0 &&
            officeList.map((val, index) => {
              const geocode = val.geoCode.split(",");
              const lat = geocode[0];
              const long = geocode[1];
              return (
                <Marker
                  key={index}
                  position={[lat, long]}
                  icon={createOfficeIcon()}
                >
                  <Popup>
                    <div>
                      <p>Office Id : {val.officeId}</p>
                      <p>Address : {val.address}</p>
                      <p>Contact : {val.contact}</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </div>
    </div>
  );
};

export default LiveTrackingMap;
