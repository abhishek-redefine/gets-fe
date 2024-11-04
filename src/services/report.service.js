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

const TripCompletionVendorReport = async (body) => {
  ///api/v1/report/tripCompletionReportVendor
  return axiosInstance
    .post(
      `${API_PATH.API_VERSION}${API_PATH.REPORT}${API_PATH.TRIP_COMPLETION_REPORT_VENDOR}`,
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

const NoShowDetailedReport = async (body) => {
  ///api/v1/report/noShowDetailedReport
  return axiosInstance
    .post(
      `${API_PATH.API_VERSION}${API_PATH.REPORT}${API_PATH.NO_SHOW_DETAILED_REPORT}`,
      body
    )
    .then((response) => {
      return response;
    });
};

const ReportService = {
  RawBillingReport,
  TripCompletionVendorReport,
  NoShowSummaryReport,
  NoShowDetailedReport,
};

export default ReportService;
