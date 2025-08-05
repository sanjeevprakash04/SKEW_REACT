// src/utils/dataUtils.js
import axios from "axios";

export const fetchData = async (hours, fromTime, toTime) => {
    try {
        const requestBody = { hours, from_time: fromTime, to_time: toTime };

        const response = await axios.post("http://127.0.0.1:8000/show-data-df", requestBody, {
            headers: { "Content-Type": "application/json" },
        });

        return response.data;
    } catch (error) {
        alert("Error fetching data");
        return [];
    }
};

export const fetchGraphData = async (hours, fromTime, toTime) => {
    try {
        const requestBody = {
            hours,
            from_time: fromTime,
            to_time: toTime,
        };

        const response = await axios.post("http://127.0.0.1:8000/show-graph-df", requestBody, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Optional: console.log("Data received:", response.data);
        return response.data;

    } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
        alert("Error fetching data from server.");
        return [];
    }
};

export const exportData = async (hours, fromTime, toTime) => {
    try {
        const requestData = { hours, from_time: fromTime, to_time: toTime };

        const response = await axios.post("http://127.0.0.1:8000/export-data-Xl", requestData, {
            responseType: "blob",
        });

        const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "Historical_Data.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert("File downloaded successfully!");
    } catch (error) {
        console.error("Error exporting data:", error);
    }
};

// export const downloadReport = async (hours, fromTime, toTime) => {
//     try {
//         // console.log("📦 Sending export-report request with:");
//         // console.log("hours:", hours);
//         // console.log("from_time:", fromTime);
//         // console.log("to_time:", toTime);

//         const requestData = { hours };
//         if (fromTime) requestData.from_time = fromTime;
//         if (toTime) requestData.to_time = toTime;

//         const response = await axios.post("http://127.0.0.1:8000/export-report", requestData, {
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             responseType: "blob"
//         });

//         const contentDisposition = response.headers['content-disposition'];
//         const filenameMatch = contentDisposition && contentDisposition.match(/filename="?(.+)"?/);
//         const filename = filenameMatch ? filenameMatch[1] : "Report.pdf";

//         const url = window.URL.createObjectURL(new Blob([response.data]));
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = filename;
//         document.body.appendChild(a);
//         a.click();
//         a.remove();
//         window.URL.revokeObjectURL(url);
//     } catch (error) {
//         console.error("Error exporting data:", error);
//         alert("Failed to download the report.");
//     }
// };

