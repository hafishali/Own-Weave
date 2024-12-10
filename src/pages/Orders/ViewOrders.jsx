import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  Modal,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField, Grid, MenuItem, Select, FormControl, InputLabel, Checkbox

} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';
import DescriptionIcon from '@mui/icons-material/Description';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { BulkEditOrder, editOrder, ViewallOrder } from '../../services/allApi';
import { Label } from 'recharts';
import { toast, ToastContainer } from 'react-toastify';
import html2canvas from 'html2canvas';
import BillComponentOrders from '../../components/BillComponentOrders';
import { createRoot } from 'react-dom/client';




const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openCustomer, setOpenCustomer] = useState(false)
  const [open, setOpen] = useState(false);
  const [trackmodal, setTrackmodal] = useState(false)
  const [addOrderModal, setAddOrderModal] = useState(false)
  const [addressModal, setAddressModal] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [filterTrackingID, setFilterTrackingID] = useState("")
  const [updatedCustomer, setUpdatedCustomer] = useState({
    payment_status: "",
    status: "",
    Track_id: "",
    rejected_reason: ""
  })
  const [isEnabled, setIsEnabled] = useState(false)
  const [status, setStatus] = useState("")
  const [filterstatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState([]);  // To track selected orders
  const [selectAll, setSelectAll] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExcelDisable, setIsExcelDisable] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')


  const handleGetallorders = async () => {
    try {
      const response = await ViewallOrder()
      if (response.status === 200) {
        const sortedOrders = response.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))  // Sorting by created_at
          .filter(order => order.status === 'pending');  // Filtering based on the status

        setOrders(sortedOrders);
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    handleGetallorders()
  }, [])

  const downloadExcel = (exportAll = false) => {
    // Determine which orders to export
    const ordersToExport = exportAll ? orders : orders.filter(order => {
      const orderDate = dayjs(order.created_at.split("T")[0]);
      const startDateMatch = startDate ? orderDate.isAfter(dayjs(startDate).subtract(1, 'day')) : true;
      const endDateMatch = endDate ? orderDate.isBefore(dayjs(endDate).add(1, 'day')) : true;
      return startDateMatch && endDateMatch;
    });

    const worksheetData = [
      [
        'Order ID',
        'Customer Name',
        'Customer Mobile',
        'Shipping Address',
        'Product Name',
        'Product Code',
        'Product Color',
        'Quantity',
        'Size',
        'Sleeve',
        'Price',
        'Free Product Name',  // New field for free product
        'Free Product Code',
        'Free Product Color',
        'Total Price',
        'Payment Option',
        'Payment Status',
        'Track ID',
        'Order Status',
        'Order Date',
        'Order Time',
      ],
      ...ordersToExport.flatMap((order) => {
        const {
          id,
          user,
          shipping_address,
          items,
          total_price,
          payment_option,
          payment_status,
          Track_id,
          status,
          created_at,
        } = order || {};

        const formattedAddress = shipping_address
          ? `${shipping_address.address || 'N/A'}, ${shipping_address.block || 'N/A'}, ${shipping_address.district || 'N/A'}, ${shipping_address.state || 'N/A'}, ${shipping_address.country || 'N/A'} - ${shipping_address.pincode || 'N/A'}`
          : 'N/A';

        // Create a row for each item and include free product details if available
        return items?.map((item) => {
          const freeProduct = item?.free_product || {};

          return [
            id || 'N/A',
            user?.name || 'N/A',
            user?.mobile_number || 'N/A',
            formattedAddress,
            item?.product?.name || 'N/A',
            item?.product_code || 'N/A',
            item?.product_color || 'N/A',
            item?.quantity || 0,
            item?.size || 'N/A',
            item?.sleeve || 'N/A',
            item?.price || 0,
            freeProduct?.name || 'N/A',          // Free Product Name
            freeProduct?.product_code || 'N/A',  // Free Product Code
            freeProduct?.color || 'N/A',         // Free Product Color
            total_price || 0,
            payment_option || 'N/A',
            payment_status || 'N/A',
            Track_id || 'N/A',
            status || 'N/A',
            created_at?.split('T')?.[0] || 'N/A',
            created_at?.split('T')?.[1]?.split('.')?.[0] || 'N/A',
          ];
        });
      }),
    ];

    // Create a new workbook and add the worksheet data
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders Report');

    // Trigger download
    XLSX.writeFile(workbook, 'orders_report.xlsx');
  };



  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };
  const handleStatusChangeFilter = (event) => {
    setFilterStatus(event.target.value);
  };

  const filteredorders = orders.filter(order => {
    // Status filter
    const statusMatch = filterstatus === 'All' || order.status === filterstatus;

    // Date range filter
    const orderDate = dayjs(order.created_at.split("T")[0]);
    const startDateMatch = startDate ? orderDate.isAfter(dayjs(startDate).subtract(1, 'day')) : true;
    const endDateMatch = endDate ? orderDate.isBefore(dayjs(endDate).add(1, 'day')) : true;

    // Tracking ID filter
    const trackingIDMatch =
      filterTrackingID === '' ||
      (order.Track_id?.toLowerCase().includes(filterTrackingID.toLowerCase()));

    // Order ID or Mobile number filter
    const searchQueryMatch = searchQuery === '' ||

      String(order.user?.mobile_number)?.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && startDateMatch && endDateMatch && trackingIDMatch && searchQueryMatch;
  });

  // Function to clear all filters
  const clearFilters = () => {
    setFilterStatus("All");
    setStartDate(null);
    setEndDate(null);
    setFilterTrackingID("");
    setSearchQuery(""); // Clear search query
  };





  console.log(orders)
  const handleopenorder = (item) => {
    setSelectedOrder(item)
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };
  const openConfirmDialog = () => {
    setConfirmDialogOpen(true);
  };
  const handleCustomerOpen = (item) => {
    setOpenCustomer(true)
    setSelectedOrder(item)

  }
  const handleaddressOpen = (item) => {
    setSelectedOrder(item)
    setAddressModal(true)
  }
  const handleEdit = (order) => {
    setTrackmodal(true)
    setSelectedOrder(order)
    setUpdatedCustomer({
      payment_status: order.payment_status || "", // Initialize with existing values
      status: order.status || "",  // Existing status value
      Track_id: order.Track_id || "",

    });
    if (order?.payment_option === 'Razorpay') {
      setIsEnabled(true);
    } else {
      setIsEnabled(false); // Reset to default if not Razorpay
    }

  }
  const handleCloseEdit = () => {
    setTrackmodal(false)
    setUpdatedCustomer({
      payment_status: "",
      status: "",
      Track_id: ""
    })
    setIsEnabled(false)
  }

  const handlePaymentStatusChange = (event) => {
    setUpdatedCustomer(prevState => ({
      ...prevState,
      payment_status: event.target.value // Update the status in the updatedCustomer state
    }));
  };

  const handleEditorders = async (id) => {
    console.log(id)
    console.log(updatedCustomer)
    try {
      const response = await editOrder(id, updatedCustomer)
      if (response.status === 200) {
        toast.success("order has been edited successfully")
        handleCloseEdit()
        handleGetallorders()
      }
    } catch (error) {
      console.log(error)
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message); // Display backend error message
      } else {
        // Fallback error message for unexpected cases
        toast.error("Something went wrong while adding the category.");
      }
    }
    finally {
      setUpdatedCustomer({
        payment_status: "",
        status: "",
        Track_id: "",
        rejected_reason: ""
      })

    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'green';
      case 'pending':
        return 'orange';
      case 'Accept':
        return 'blue';
      case 'Reject':
        return 'red';
      case 'Return':
        return 'blue';
      default:
        return 'black';
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter(id => id !== orderId)
        : [...prevSelected, orderId]
    );
  };

  const handleBulkEdit = async (id) => {
    try {
      // Prepare the request body with selected order IDs and new status
      const reqBody = {
        order_ids: id,
        status: "Completed",  // Update status to 'Completed'
      };

      // Send the request using the BulkEditOrder function (ensure it's properly implemented)
      const response = await BulkEditOrder(reqBody);

      // Check if the response status is 200 (indicating success)
      if (response.status === 200) {
        toast.success("Orders have been completed successfully");
      } else {
        // Handle non-200 responses, in case there’s an issue
        toast.error("Failed to update order status.");
      }
    } catch (error) {
      // Improved error handling for different error types
      const errorMessage = error.response
        ? error.response.data.message || error.message
        : error.message || "An unknown error occurred";

      toast.error(`Error: ${errorMessage}`);
    }
  };


  // Handle select all functionality
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders);  // Select all orders
    }
    setSelectAll(!selectAll);
  };

  const generateSelectedPDF = () => {
    console.log('printing initiated');
    generatePDF(selectedOrders);
  };

  const generatePDF = async (selectedOrders) => {
    if (isGenerating) return; // Prevent multiple calls during generation

    try {
      setIsGenerating(true); // Prevent multiple calls during generation
      const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, A4 size
      const margin = 10; // Margins around the page
      const pageWidth = 190; // A4 width minus margins
      const pageHeight = 277; // A4 height minus margins
      const ordersPerPage = 2; // Number of orders per page
      const selectedOrderIds = selectedOrders.map(order => order.id);

      // Loop through the orders in batches of 2
      for (let i = 0; i < selectedOrders.length; i += ordersPerPage) {
        const batchOrders = selectedOrders.slice(i, i + ordersPerPage); // Get two orders for this page

        // Create a container div for rendering the batch of orders
        const container = document.createElement('div');
        container.style.width = `${pageWidth}mm`;
        container.style.height = `${pageHeight}mm`;
        container.style.padding = `${margin}mm`;
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.justifyContent = 'space-between'; // Space between orders

        // Add each order to the container
        batchOrders.forEach((order, index) => {
          const orderElement = document.createElement('div');
          orderElement.style.marginBottom = '10mm'; // Space between orders
          ReactDOM.render(<BillComponentOrders ordersArray={[order]} />, orderElement);
          container.appendChild(orderElement);
        });

        // Append the container to the body for rendering
        document.body.appendChild(container);

        // Convert the container to a canvas image
        const canvas = await html2canvas(container, { scale: 2 });
        const imgData = canvas.toDataURL('image/png'); // Convert canvas to image

        // Add the image of the rendered orders to the PDF
        pdf.addImage(imgData, 'PNG', margin, margin, pageWidth, pageHeight);

        // Clean up by removing the container from the DOM
        document.body.removeChild(container);

        // If there are more orders, add a new page for the next batch
        if (i + ordersPerPage < selectedOrders.length) {
          pdf.addPage(); // Add a new page only if necessary
        }
      }
      pdf.save('Orders_Batch.pdf');
      // calling the api for update status
      await handleBulkEdit(selectedOrderIds);
      handleGetallorders()

    } catch (error) {
      toast.error("something went wrong")
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false); // Reset generating state
      setSelectedOrders([])
    }
  };



  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredorders.slice(indexOfFirstItem, indexOfLastItem);

  const count = filteredorders.length;
  const totalPages = Math.ceil(count / itemsPerPage);
  const startCustomerIndex = indexOfFirstItem + 1;
  const endCustomerIndex = Math.min(indexOfLastItem, count);
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };
  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };
  console.log(selectedOrders)

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          View Orders
        </Typography>
        <Box sx={{ gap: 5 }}>
          <Button sx={{ marginRight: "10px" }} variant="contained" color="primary" onClick={generateSelectedPDF} disabled={selectedOrders.length === 0}>
            Print Selected Orders
          </Button>
          <Button variant="contained" sx={{ marginRight: "10px" }} disabled={endDate === null || startDate === null} onClick={() => downloadExcel(false)}>Export Filtered Orders <DescriptionIcon sx={{ ml: 1, }} /></Button>
          <Button variant="contained" color="primary" onClick={() => downloadExcel(true)}>
            Export All Orders <DescriptionIcon sx={{ ml: 1 }} />
          </Button>
        </Box>

      </Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 3 }}>
        <Grid container spacing={2}>
          {/* <Grid item xs={3} ><FormControl fullWidth>
          <InputLabel id="status-select-label">Status</InputLabel>
          <Select
            labelId="status-select-label"
            value={filterstatus}
            onChange={handleStatusChangeFilter}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Accept">Accepted</MenuItem>
            <MenuItem value="Reject">Rejected</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="Return">Returned</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl></Grid> */}
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Tracking ID"
              value={filterTrackingID}
              onChange={(e) => setFilterTrackingID(e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by  Mobile Number"
            />
          </Grid>

          <Grid item xs={6} sx={{ display: "flex", justifyContent: "space-around" }}><LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid item xs={3}> <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              sx={{ width: '100%' }}
            /></Grid>
            <Grid item xs={3}><DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              sx={{ width: '100%' }}
            /></Grid>
            <Grid item xs={3} sx={{ display: "flex", justifyContent: "center" }}> <Button variant="outlined" onClick={clearFilters} color="primary">Clear Filters</Button></Grid>


          </LocalizationProvider></Grid>

        </Grid>
      </Box>


      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: 'lightblue' }}>
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell><b>SI</b></TableCell>
              <TableCell><b>Order ID</b></TableCell>
              <TableCell><b>Customer</b></TableCell>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Time</b></TableCell>
              <TableCell><b>Shipping Address</b></TableCell>
              <TableCell><b>Payment Method</b></TableCell>
              <TableCell><b>Payment Status</b></TableCell>
              <TableCell><b>Track id</b></TableCell>
              <TableCell><b> Order Status</b></TableCell>

              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox
                      checked={selectedOrders.includes(item)}
                      onChange={() => handleSelectOrder(item)}
                    />
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <u>{startCustomerIndex + index}</u>
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }} onClick={() => handleopenorder(item)}>
                    <u>{item.id}</u>
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }} onClick={() => handleCustomerOpen(item)}>
                    <u>{item.user?.name}</u>
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{item.created_at.split("T")[0]}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{item.created_at.split("T")[1].split(".")[0]}</TableCell>
                  <TableCell style={{ textAlign: 'center', color: "blue", cursor: "pointer" }} onClick={() => handleaddressOpen(item)}>
                    <u>View</u>
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{item.payment_option}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{item.payment_status}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <a href={item.Track_id} target='_blank'>{item.Track_id}</a>
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <Button style={{ color: getStatusColor(item.status) }}>{item.status}</Button>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(item)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12} style={{ textAlign: 'center' }}>No Orders Available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

      </TableContainer>
      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
        <Button
          variant="contained"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        <Typography sx={{ mx: 2 }}>
          {`Showing ${startCustomerIndex} to ${endCustomerIndex} of ${count}`}
        </Typography>

        <Button
          variant="contained"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Box>

      {/* Modal to display order details */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            p: 4,
            boxShadow: 24,
            maxHeight: '80vh', // Limit height of modal
            overflowY: 'auto',  // Enable vertical scrolling
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'grey.500',
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" gutterBottom>
            Order Details
          </Typography>

          {/* Order Information */}
          <Typography><b>Order ID:</b> {selectedOrder?.id}</Typography>
          <Typography><b>Customer:</b> {selectedOrder?.user?.name}</Typography>
          <Typography><b>Status:</b> {selectedOrder?.status}</Typography>
          <Typography><b>Total Price:</b> RS. {selectedOrder?.total_price}</Typography>
          <Typography><b>Order Time:</b> {new Date(selectedOrder?.created_at).toLocaleString()}</Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Products:
          </Typography>

          {/* Product Table */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Product Id</b></TableCell>
                <TableCell><b>Product Code</b></TableCell>
                <TableCell><b>Product Name</b></TableCell>
                <TableCell><b>Product Color</b></TableCell>
                <TableCell><b>Quantity</b></TableCell>
                <TableCell><b>Size</b></TableCell>
                <TableCell><b>Sleeve</b></TableCell>
                <TableCell><b>Price</b></TableCell>
                <TableCell><b> Offer Price</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedOrder?.items && selectedOrder?.items.length > 0 ? (
                selectedOrder.items.map((item, index) => (
                  <React.Fragment key={index}>
                    {/* Main Product Row */}
                    <TableRow>
                      <TableCell>{item.product?.id}</TableCell>
                      <TableCell>{item.product?.product_code}</TableCell>
                      <TableCell>{item.product?.name}</TableCell>
                      <TableCell>{item.product?.color}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell>{item.sleeve}</TableCell>
                      <TableCell>RS. {item.price}</TableCell>
                      <TableCell>RS. {item.product?.offer_price_per_meter}</TableCell>
                    </TableRow>

                    {/* Free Product Row (if available) */}
                    {item.free_product && (
                      <TableRow>
                        <TableCell colSpan={9} sx={{ backgroundColor: '#f0f0f0', color: '#4caf50' }}>
                          <Typography variant="body2">
                            <b>Free Product:  </b> NAME: {item.free_product?.name} ||  CODE: {item.free_product?.product_code} || PRICE:{item.free_product?.offer_price_per_meter}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">No products for this order</TableCell>
                </TableRow>
              )}
            </TableBody>

          </Table>
        </Box>
      </Modal>

      {/* modal for customer details */}
      <Modal open={openCustomer} onClose={() => setOpenCustomer(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            p: 4,
            boxShadow: 24,
            position: 'relative',
            maxHeight: '80vh', // Limit height of modal
            overflowY: 'auto',  // Enable vertical scrolling
          }}
        >
          <IconButton
            aria-label="close"
            onClick={() => setOpenCustomer(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'grey.500',
            }}
          >
            <CloseIcon />
          </IconButton>
          <>
            <Typography sx={{ display: "flex", justifyContent: "center" }} variant="h6" gutterBottom>
              Customer Details
            </Typography>

            <Typography>
              <b>Customer Name:</b>{selectedOrder?.user?.name}
            </Typography>
            <Typography>
              <b>Email:</b>{selectedOrder?.user?.email}
            </Typography>
            <Typography>
              <b>Phone:</b>{selectedOrder?.user?.mobile_number}
            </Typography>
          </>

        </Box>
      </Modal>
      {/* modal for view address */}
      <Modal open={addressModal} onClose={() => setAddressModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            p: 4,
            boxShadow: 24,
            position: 'relative',
            maxHeight: '80vh', // Limit height of modal
            overflowY: 'auto',  // Enable vertical scrolling
          }}
        >
          <IconButton
            aria-label="close"
            onClick={() => setAddressModal(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'grey.500',
            }}
          >
            <CloseIcon />
          </IconButton>
          <>
            <Typography sx={{ display: "flex", justifyContent: "center" }} variant="h6" gutterBottom>
              Shipping Address:
            </Typography>

            <Typography>
              <b>Name:</b> {selectedOrder?.shipping_address?.name || selectedOrder?.user?.name}
            </Typography>

            <Typography>
              <b>Phone:</b>{selectedOrder?.shipping_address?.mobile_number || selectedOrder?.user?.mobile_number}
            </Typography>
            <Typography>
              <b>Address:</b>{selectedOrder?.shipping_address?.address}
            </Typography>
            <Typography>
              <b>pincode:</b>{selectedOrder?.shipping_address?.pincode}
            </Typography>
            <Typography>
              <b>Post office:</b>{selectedOrder?.shipping_address?.post_office}
            </Typography>
            <Typography>
              <b>Block:</b>{selectedOrder?.shipping_address?.block}
            </Typography>
            <Typography>
              <b>District:</b>{selectedOrder?.shipping_address?.district}
            </Typography>
            <Typography>
              <b>State:</b>{selectedOrder?.shipping_address?.state}
            </Typography>
            <Typography>
              <b>Country:</b>{selectedOrder?.shipping_address?.country}
            </Typography>
            <Typography>
              <b>Home Address:</b>{selectedOrder?.shipping_address?.is_home === true ? 'yes' : 'No'}
            </Typography>
            <Typography>
              <b>Office Address:</b>{selectedOrder?.shipping_address?.is_office === true ? 'yes' : 'No'}
            </Typography>
            <Typography>
              <b>Other Address:</b>{selectedOrder?.shipping_address?.is_other === true ? 'yes' : 'No'}
            </Typography>
            <Typography>
              <b>Defualt Address:</b>{selectedOrder?.shipping_address?.is_default === true ? 'yes' : 'No'}
            </Typography>

          </>

        </Box>
      </Modal>
      {/* modal for track id */}
      <Modal open={trackmodal} onClose={handleCloseEdit}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            p: 4,
            boxShadow: 24,
            position: 'relative',
            maxHeight: '80vh', // Limit height of modal
            overflowY: 'auto',  // Enable vertical scrolling
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCloseEdit}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'grey.500',
            }}
          >
            <CloseIcon />
          </IconButton>
          <>
            <Typography sx={{ display: "flex", justifyContent: "center" }} variant="h6" gutterBottom>
              Edit Orders
            </Typography>

            <Grid container mt={2} >
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Track Id"
                  variant="outlined"
                  placeholder='paste track id here'
                  value={updatedCustomer.Track_id}
                  onChange={(e) => setUpdatedCustomer({ ...updatedCustomer, Track_id: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} mt={3}>
                <Label>Order status</Label>
                <FormControl fullWidth>
                  <InputLabel id="status-select-label"> Order Status</InputLabel>
                  <Select
                    labelId="status-select-label"
                    label="Choose Status"
                    value={updatedCustomer.status} // Dynamically set the value
                    onChange={(e) => setUpdatedCustomer({ ...updatedCustomer, status: e.target.value })} // Update state on change
                  >
                    <MenuItem value="Reject">Reject</MenuItem>
                    <MenuItem value="Return">Return</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>


              <Grid item xs={12} mt={3} sx={{ "marginLeft": "5px" }}>
                <Label>Payment status</Label>
                <FormControl fullWidth>
                  <InputLabel id="status-select-label"> Payment Status</InputLabel>
                  <Select
                    labelId="status-select-label"
                    label="Choose Status"
                    disabled={isEnabled}
                    value={updatedCustomer.payment_status} // Dynamically set the value
                    onChange={handlePaymentStatusChange}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Paid">Paid</MenuItem>
                    <MenuItem value="Failed">Failed</MenuItem>



                  </Select>
                </FormControl>
              </Grid>
              {updatedCustomer.status === 'Reject' && (
  <Grid item xs={12} mt={3}>
    <TextField
      fullWidth
      label="Reason for Reject"
      variant="outlined"
      multiline
      rows={4} // Adjust the number of rows to control the height of the textarea
      placeholder="Enter the reason here"
      value={updatedCustomer.rejected_reason}
      onChange={(e) =>
        setUpdatedCustomer({ ...updatedCustomer, rejected_reason: e.target.value })
      }
    />
  </Grid>
)}


            </Grid>



            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='success' sx={{ backgroundColor: "green", marginTop: '5px' }} onClick={() => handleEditorders(selectedOrder.id)}  > save Changes</Button>
            </Box>




          </>

        </Box>
      </Modal>



      {/* Delete Confirmation Dialog */}
      {/* <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this order?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog> */}
      <ToastContainer />
    </Box>
  );
};



export default ViewOrders;
