import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import AssignTransporter from '../../AssignTransporter/AssignTransporter';
import MessageDialog from '../../Dialog/MessageDialog';
import TrackingDialog from '../../Dialog/TrackingDialog';
import ConfirmationDialog from '../../Dialog/ConfirmationDialog';
import { InfoCircleOutlined } from "@ant-design/icons";
import { notification } from "antd";
import { updateRawMaterialRequestStatus, moveCurrentToPrevious } from '../../../api/rawMaterialRequestAPI';
import { MessageOutlined } from '@ant-design/icons';
import { DataGrid } from '@mui/x-data-grid';
import "./RequestsTable.css";

// The RequestsTable component receives and displays a list of data such as previous and current requests.
function RequestsTable({ data }) {

  //Prepare the state for each request individually.
  const [requests, setRequests] = useState(data.map(request => ({
    ...request,//A new object is created containing all the properties in the request.
    statusClass: `status-${request.status}`,//Add a new property to the object, statusClass to style the drop-down list status.
  })));

  // Unified state to manage all dialogs
  const [dialogState, setDialogState] = useState({
    assignTransporterDialog: false,
    messageDialog: false,
    trackingDialog: false,
    confirmationDialog: false,
  });
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    setRequests(data); // Update requests when data changes
  }, [data]);

  // Helper function to toggle dialog states (open or close)
  const toggleDialog = (dialogName, value, requestId = null, status = "") => {
    setDialogState(prev => ({ ...prev, [dialogName]: value }));
    if (requestId) setSelectedRequestId(requestId);
    if (status) setSelectedStatus(status);
  };

  // Unified method to update request status
  const updateRequestStatus = async (id, newStatus) => {
    try {
      //update in DB, get the request info after update
      const updatedRequest = await updateRawMaterialRequestStatus(id, newStatus);

      if (!updatedRequest || updatedRequest.error) {
        throw new Error("Failed to update status in the backend");
      }
      //update in front-end
      setRequests(prevRequests =>
        prevRequests.map(request =>// Check each request in the list; update if shortId matches, else keep unchanged.
          request.shortId === id//Check if the shortId of the request matches the ID we want to update.
            ? { ...request, status: updatedRequest.data.status, statusClass: `status-${updatedRequest.data.status}` }
            : request//Returns the request as is if the condition is false.
        )
      );
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to update status. Please contact support.",
        placement: "top",
        icon: <InfoCircleOutlined style={{ color: "#f4d53f" }} />,
      });
    }
  };

  // Handle status change from drop-down list (open dialog or update directly)
  const handleStatusChange = (id, newStatus) => {
    switch (newStatus) {
      case "accepted":
        toggleDialog("assignTransporterDialog", true, id);
        break;
      case "rejected":
      case "delivered":
        toggleDialog("confirmationDialog", true, id, newStatus);
        break;
      default:
        updateRequestStatus(id, newStatus);
    }
  };

  // Handle confirmation for delete or reject, called after clicking confirm in the dialog "onConfirm()"
  const handleConfirmAction = async () => {
    const previousStatus = requests.find(request => request.shortId === selectedRequestId)?.status;
    let errorMoveCurrentToPrevious = false;
    let errorUpdateStatus = false;
    try {
      //update state in back-end
      const statusUpdateResult = await updateRequestStatus(selectedRequestId, selectedStatus);
      if (!statusUpdateResult || statusUpdateResult.error) {
        errorUpdateStatus = true;
        throw new Error("Status update failed");
      }
      ////remove request from current table to previous
      const moveResult = await moveCurrentToPrevious(selectedRequestId);
      if (moveResult.error || !moveResult) {
        errorMoveCurrentToPrevious = true;
        throw new Error("Move request to previous failed");
      }

      //remove state in front-end
      setRequests(prevRequests =>
        prevRequests.filter(request => request.shortId !== selectedRequestId)
      );

    } catch (error) {
      if (errorUpdateStatus) {
        // Restore the original state of the request in the back-end
        await updateRequestStatus(selectedRequestId, previousStatus);

        // Restore the original state of the request in the front-end
        setRequests(prevRequests =>
          prevRequests.map(request =>
            request.shortId === selectedRequestId
              ? { ...request, status: previousStatus, statusClass: `status-${previousStatus}` }
              : request
          )
        );
        notification.error({
          message: "Error",
          description: "Failed to move request to previous. Please contact support.",
          placement: "top",
          icon: <InfoCircleOutlined style={{ color: "#f4d53f" }} />,
        });
      }

      if (errorMoveCurrentToPrevious) {
        // Restore the original state of the request in the back-end 
        await updateRequestStatus(selectedRequestId, previousStatus);
        // Restore the original state of the request in the front-end
        setRequests(prevRequests =>
          prevRequests.map(request =>
            request.shortId === selectedRequestId
              ? { ...request, status: previousStatus, statusClass: `status-${previousStatus}` }
              : request
          )
        );
        notification.error({
          message: "Error",
          description: "Failed to move request to previous. Please contact support.",
          placement: "top",
          icon: <InfoCircleOutlined style={{ color: "#f4d53f" }} />,
        });
      }

    } finally {
      // set state of dialog to false "close" 
      toggleDialog("confirmationDialog", false);
    }
  };

  // Handle "AssignTransporter" dialog close and updating request if necessary
  const handleDialogClose = async (wasRequestSent) => {
    // set state of dialog to false "close" 
    toggleDialog("assignTransporterDialog", false);
    //If the transport request is sent successfully, the status updates to "accepted".
    if (wasRequestSent) {
      updateRequestStatus(selectedRequestId, "accepted");
    }
  };

  //If there are no requests in DB, the message is displayed.
  if (!requests.length) {
    return <div className='ManageRawMaterial-background-message'>No results found</div>;
  }

  // Define columns for the DataGrid
  const columns = [
    { field: 'shortId', headerName: 'ID', width: 120, headerAlign: 'left', renderCell: (params) => `#${params.value}` },
    { field: 'manufacturerName', headerName: 'Manufacturer Name', width: 150, headerAlign: 'left' },
    {
      field: 'createdAt', headerName: 'Request Date', width: 100, headerAlign: 'left',
      renderCell: (params) => moment(params.row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      field: 'supplyingRawMaterials', headerName: 'Supplying Items', width: 140, headerAlign: 'left',
      renderCell: (params) => (
        <div className="ManageRawMaterial-cell-content">
          {params.row.supplyingRawMaterials.map((item, index) => (
            <div key={item.rawMaterial_id} className={`ManageRawMaterial-supplying-item ${index !== params.row.supplyingRawMaterials.length - 1 ? 'item-with-border' : ''}`}>
              {item.rawMaterial_name}
            </div>
          ))}
        </div>
      ),
    },
    {
      field: 'quantity', headerName: 'Quantity', type: 'number', width: 80, headerAlign: 'left',
      renderCell: (params) => (
        <div className="ManageRawMaterial-cell-content">
          {params.row.supplyingRawMaterials.map((item, index) => (
            <div key={item.rawMaterial_id} className="ManageRawMaterial-supplying-item">
              {item.quantity} {item.unit}
            </div>
          ))}
        </div>
      ),
    },
    {
      field: 'options',
      headerName: 'Options',
      width: 150,
      headerAlign: 'left',
      renderCell: (params) => (
        <div className="ManageRawMaterial-cell-content">
          {params.row.supplyingRawMaterials.map((item, index) => (
            <div key={`${item.rawMaterial_id}-${index}`} className="ManageRawMaterial-supplying-item">
              {item.options && item.options.length > 0 ? (
                // If options exist, display them
                item.options.map((option, optionIndex) => (
                  <span key={`${option.optionType}-${optionIndex}`}>
                    <strong>{option.optionType}:</strong> {option.values.join(", ")} {/* Format name and values */}
                    {index < item.options.length - 1 && ", "} {/* Add a comma between options */}
                  </span>
                ))
              ) : (
                // If no options, display "No option"
                <span>No option</span>
              )}
            </div>
          ))}
        </div>
      ),
    },
    {
      field: 'total_price', headerName: 'Total Price', type: 'number', width: 70, headerAlign: 'left',
      renderCell: (params) => {
        const price = params.row.total_price;
        return (
          <div className="ManageRawMaterial-cell-content">
            {price !== undefined ? `${price} SAR` : 'Price not available'}
          </div>
        );
      }
    },
    {
      field: 'status', headerName: 'Status', width: 130, headerAlign: 'left',
      renderCell: (params) => {
        const statusClass = `status-${params.row.status}`;
        if (params.row.status === 'rejected' || params.row.status === 'delivered') {
          return <div className={`ManageRawMaterial-status-text ${statusClass}`}>{params.row.status}</div>;
        }
        return (
          <select
            value={params.row.status}
            className={`ManageRawMaterial-status-select ${statusClass}`}
            onChange={(e) => handleStatusChange(params.row.shortId, e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="inProgress">In Progress</option>
            <option value="delivered">Delivered</option>
            <option value="rejected">Rejected</option>
          </select>
        );
      },
    },
    {
      field: 'arrivalAddress', headerName: 'Arrival Address', width: 110, headerAlign: 'left',
      renderCell: (params) => {
        const address = params.row.arrivalAddress;
        return (
          <div className="ManageRawMaterial-cell-content">
            {address ? `${address.street}, ${address.neighborhood}, ${address.city}, ${address.postal_code}, ${address.country}` : 'No Address'}
          </div>
        );
      }
    },
    {
      field: 'action', headerName: 'Action', width: 140, headerAlign: 'left',
      renderCell: (params) => (
        <div className="ManageRawMaterial-action-buttons">
          <MessageOutlined className='ManageRawMaterial-table-icon message-icon' onClick={() => toggleDialog("messageDialog", true, params.row.shortId)} />
          <button className='ManageRawMaterial-tracking-icon' onClick={() => toggleDialog("trackingDialog", true, params.row.shortId, params.row.status)}></button>
        </div>
      ),
    },
  ];

  return (
    <div className='ManageRawMaterial'>
      <DataGrid
        rows={requests}
        disableRowSelectionOnClick
        getRowHeight={() => 'auto'}
        columns={columns}
        getRowId={(row) => row.shortId}
        autoHeight
        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
        pageSizeOptions={[5, 10]}
        sx={{
          '& .MuiDataGrid-cell': { textAlign: 'left' },
          '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' },
          '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '10px' },
          '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '22px' },
          '& .css-1qb993p-MuiDataGrid-columnHeaderTitle': {
            whiteSpace: 'normal',
            lineHeight: '1.2',
            overflow: 'hidden',
            textOverflow: 'clip',
            wordBreak: 'keep-all',
            overflowWrap: 'normal',
            wordWrap: 'normal',

          },
        }}
      />
      {dialogState.confirmationDialog && (
        <ConfirmationDialog
          title={`Confirm ${selectedStatus === "rejected" ? "Rejection" : "Delivery"}`}
          message={`Are you sure you want to ${selectedStatus === "rejected" ? "reject" : "mark as delivered"} this request?`}
          onConfirm={handleConfirmAction}
          onCancel={() => toggleDialog("confirmationDialog", false)}
          stepType={selectedStatus === "viewOrder" ? "viewOrder" : "default"}

        />
      )}
      {dialogState.assignTransporterDialog && (
        <AssignTransporter
          requestId={selectedRequestId}
          onClose={() => handleDialogClose(false)}
          onRequestSent={() => handleDialogClose(true)}
        />
      )}
      {dialogState.messageDialog && (
        <MessageDialog
          requestId={selectedRequestId}
          onClose={() => toggleDialog("messageDialog", false)}
        />
      )}
      {dialogState.trackingDialog && (
        <TrackingDialog
          requestId={selectedRequestId}
          onClose={() => toggleDialog("trackingDialog", false)}
          currentStatus={selectedStatus}
        />
      )}
    </div>
  );
}

RequestsTable.propTypes = {
  data: PropTypes.array.isRequired,// Ensures that Prop 'data' is an array and is required to be provided.
};

export default RequestsTable;
