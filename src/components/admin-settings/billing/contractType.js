import React, { useEffect, useState } from "react";
import Grid from "@/components/grid";
import { display } from "@mui/system";
import AddContract from "./addContract";
import ContractService from "@/services/contract.service";

const ContractType = () => {
  const headers = [
    {
      key: "id",
      display: "ID",
    },
    {
      key: "contractId",
      display: "Contract ID",
    },
    {
      key: "contractName",
      display: "Contract Name",
    },
    {
      key: "contractType",
      display: "Type",
    },
    {
      key: "startDate",
      display: "Start Date",
    },
    {
      key: "sittingCapacity",
      display: "Sitting Capacity",
    },
    {
      key: "hamburgerMenu",
      html: (
        <>
          <span className="material-symbols-outlined">more_vert</span>
        </>
      ),
      navigation: true,
      menuItems: [
        {
          display: "Edit Contract",
          key: "edit",
        },
        // {
        //   display: "Deactivate",
        //   key: "deactivate",
        // },
      ],
    },
  ];

  const [isAddContract, setIsAddContract] = useState(false);
  const [contractListing, setContractListing] = useState();
  const [editContractData, setEditContractData] = useState({});

  const [paginationData, setPaginationData] = useState();
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
  });
  const [loading, setLoading] = useState(false);

  const handlePageChange = (page) => {
    console.log(page);
    let updatedPagination = { ...pagination };
    updatedPagination.page = page;
    setPagination(updatedPagination);
  };

  const onUserSuccess = () => {
    setIsAddContract(false);
    setEditContractData({});
    fetchAllContract();
  };

  const fetchAllContract = async () => {
    try {
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      // let params = new URLSearchParams(pagination);
      const response = await ContractService.GetAllContract();
      console.log("response>>>", response);
      const { data } = response || {};
      // console.log("data>>>", data);
      setContractListing(data);
      // let localPaginationData = {
      //   ...data,
      //   // pageSize: 5,
      //   // last: true,
      // };
      // delete localPaginationData?.data;
      // setPaginationData(localPaginationData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllContract();
  }, [pagination]);

  const onMenuItemClick = (key, values) => {
    console.log("values>>>", values);
    if (key === "edit") {
      setEditContractData(values);
      setIsAddContract(true);
    }
  };

  return (
    <div className="internalSettingContainer">
      {!isAddContract && (
        <div>
          <div style={{ display: "flex", justifyContent: "end" }}>
            <div className="btnContainer">
              <button
                onClick={() => setIsAddContract(true)}
                className="btn btn-primary"
              >
                Add Contract
              </button>
            </div>
          </div>
          <div className="gridContainer">
            <Grid
              onMenuItemClick={onMenuItemClick}
              headers={headers}
              listing={contractListing}
              pageNoText="pageNumber"
              handlePageChange={handlePageChange}
              pagination={paginationData}
              isLoading={loading}
            />
          </div>
        </div>
      )}
      {isAddContract && (
        <div>
          <AddContract
            EditContractData={editContractData}
            onUserSuccess={onUserSuccess}
          />
        </div>
      )}
    </div>
  );
};

export default ContractType;
