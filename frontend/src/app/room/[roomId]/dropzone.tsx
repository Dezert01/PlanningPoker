"use client";
import { useRef, useState } from "react";
import Dropzone from "react-dropzone";
import Papa from "papaparse";
import { Modal, Table } from "antd";
import { UserStoryApi } from "@/api/userstory-api";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { userStoryKeys } from "@/queries/userstory.queries";

const DropzoneComponent: React.FC = () => {
  const queryClient = useQueryClient();
  const [isUploadSuccessful, setIsUploadSuccessful] = useState(false);
  const [wrongFileFormatProvided, setwrongFileFormatProvided] = useState(false);
  const [csvData, setCsvData] = useState<any[]>([]); 
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const handleFileDrop = (acceptedFiles: any[]) => {
    const selectedFile = acceptedFiles[0];

    if (selectedFile.type === "text/csv") {
      console.log("Uploaded file:", selectedFile);
      setIsUploadSuccessful(true);
      setwrongFileFormatProvided(false);

      Papa.parse(selectedFile, {
        complete: (results) => {
          const parsedData = results.data;
          console.log("Parsed CSV data:", parsedData);
          setCsvData(parsedData);
          showModal();
        },
      });

      setCsvFile(selectedFile);
    } else {
      setIsUploadSuccessful(false);
      setwrongFileFormatProvided(true);
    }
  };

  const showModal = () => {
    setModalVisible(true);
    if (tableRef.current) {
      const tableWidth = tableRef.current.offsetWidth;
      setModalWidth(tableWidth);
    }
  };

  const importUserStories = async () => {
    const url = window.location.href;
    const roomIdMatch = url.match(/\/room\/(\d+)/);
    const roomId = roomIdMatch ? parseInt(roomIdMatch[1]) : null;
    if (roomId && csvFile != null) {
      const result = await UserStoryApi.importUserStories(roomId, csvFile);
      console.log(result);
    } else {
      console.error("Error: Could not extract room ID from URL");
    }
    queryClient.invalidateQueries({
      queryKey: userStoryKeys.userStories(roomId!),
    });
  };

  const exportUserStories = async () => {
    const url = window.location.href;
    const roomIdMatch = url.match(/\/room\/(\d+)/);
    const roomId = roomIdMatch ? parseInt(roomIdMatch[1]) : null;

    if (!roomId) {
      console.error("Error: Could not extract room ID from URL");
      return;
    }

    try {
      const result = UserStoryApi.exportUserStories(roomId);
      const csvContent =
        "data:text/csv;charset=utf-8," + encodeURIComponent(await result);

      const blob = new Blob([await result], { type: "text/csv;charset=utf-8" });

      const downloadLink = document.createElement("a");
      downloadLink.href = csvContent;
      downloadLink.download = `user_stories_${roomId}.csv`;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      console.log("User stories exported successfully!");
    } catch (error) {
      console.error("Error exporting user stories:", error);
    }
  };

  const [modalWidth, setModalWidth] = useState(0);

  const closeModal = () => {
    setModalVisible(false);
  };

  const tableColumns = csvData[0]
    ? csvData[0].slice(0).map((header: any, index: string | number) => {
        const dataIndex =
          csvData[1] && csvData[1][index] !== undefined ? header : index;

        return {
          title: header,
          dataIndex,
          key: index,
        };
      })
    : [];

  const mappedData = csvData.slice(1).map((rowData) => {
    return rowData.reduce(
      (obj: { [x: string]: any }, value: any, index: string | number) => {
        obj[csvData[0][index]] = value;
        return obj;
      },
      {},
    );
  });

  return (
    <div>
      <Dropzone onDrop={handleFileDrop}>
        {({ getRootProps, getInputProps }) => (
          <section {...getRootProps()}>
            <div className="dropzone-inner flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-4 py-8 hover:border-gray-500">
              <input {...getInputProps()} />
              <p className="dropzone-prompt mt-4 text-center text-gray-500">
                Drag and drop a CSV file from JIRA here, or click to select
              </p>
              {isUploadSuccessful && (
                <div className="checkmark-container mt-4">
                  <svg
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
              {wrongFileFormatProvided && (
                <p className="upload-error text-red-500 mt-4 text-center">
                  Please upload a CSV file.
                </p>
              )}
            </div>
          </section>
        )}
      </Dropzone>
      <div className="flex flex-row justify-between mt-4">
      <Button onClick={showModal} disabled={!isUploadSuccessful}>
        View CSV Data
      </Button>
      <Button onClick={importUserStories} disabled={!isUploadSuccessful}>
        Import
      </Button>
      <Button onClick={exportUserStories}>Export</Button>
      </div>
      <Modal
        title="CSV Data"
        open={modalVisible}
        onCancel={closeModal}
        footer={[
          <Button key="close" onClick={closeModal}>
            Cancel
          </Button>,
          <Button key="confirm" onClick={closeModal}>
            Confirm
          </Button>,
        ]}
        width={modalWidth || "auto"}
      >
        <div ref={tableRef}>
          <Table
            dataSource={mappedData}
            pagination={false}
            columns={tableColumns}
          />
        </div>
      </Modal>
    </div>
  );
};
export default DropzoneComponent;
