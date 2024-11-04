import React, { useState, useEffect } from 'react';
import Configurations from "@/layouts/configurations";
import BillingService from "@/services/billing.service";
import AddInvoice from '@/components/configurations/invoice/createInvoice';
import Grid from '../../components/grid';

const Invoice = () => {
  const headers = [
    {
      key: "month",
      display: "Month"
    },
    {
      key: "fromDate",
      display: "Start Date"
    },
    {
      key: "toDate",
      display: "End Date"
    },
  ];

  const [isAddConfig, setIsAddConfig] = useState(false);
  const [configListing, setConfigListing] = useState();
  const [paginationData, setPaginationData] = useState();
  const [pagination, setPagination] = useState({
    pageNo: 0,
    pageSize: 10,
  })
  const [loading, setLoading] = useState(false);
  const handlePageChange = (page) => {
    console.log(page);
    let updatedPagination = { ...pagination };
    updatedPagination.pageNo = page;
    setPagination(updatedPagination);
  };

  const fetchAllConfig = async () => {
    try {
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      let params = new URLSearchParams(pagination);
      const response = await BillingService.getAllConfig(params);
      setConfigListing(response.data.paginatedResponse.content);

      const data = response.data.paginatedResponse;
      let localPaginationData = { ...data };
      delete localPaginationData?.data;
      setPaginationData(localPaginationData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllConfig();
  }, [isAddConfig, pagination]);

  return (
    <div className='mainSettingsContainer'>
      <div className='internalSettingContainer'>
        {!isAddConfig && <div>
          <div style={{ display: 'flex', justifyContent: 'end' }}>
            <div className='btnContainer'>
              <button onClick={() => setIsAddConfig(true)} className='btn btn-primary'>Add Config</button>
            </div>
          </div>
          <div className='gridContainer'>
            <Grid
              headers={headers}
              listing={configListing}
              pageNoText="pageNumber"
              handlePageChange={handlePageChange}
              pagination={paginationData}
              isLoading={loading}
            />
          </div>
        </div>}
        {
          isAddConfig && <div>
            <AddInvoice SetIsAddConfig={setIsAddConfig} />
          </div>
        }
      </div>
    </div>

  )
}

export default Configurations(Invoice);