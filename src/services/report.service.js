import { API_PATH } from "@/constants/api.constants";
import axiosInstance from "../utils/axios";

const RawBillingReport = async (body) => {
  ///api/v1/report/rawBilling
  return axiosInstance
    .post(
      `${API_PATH.API_VERSION}${API_PATH.REPORT}${API_PATH.RAW_BILLING}`,
      body
    )
    .then((response) => {
      return response;
    });
};

const NoShowSummaryReport = async (body) => {
    ///api/v1/report/tripNoShowRosterReportSummary
    return axiosInstance
      .post(
        `${API_PATH.API_VERSION}${API_PATH.REPORT}${API_PATH.NO_SHOW_SUMMARY_REPORT}`,
        body
      )
      .then((response) => {
        return response;
      });
  };

const ReportService = {
    RawBillingReport,
    NoShowSummaryReport
};

export default ReportService;
