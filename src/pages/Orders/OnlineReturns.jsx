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
  TextField, Grid, MenuItem, Select, FormControl, InputLabel,Checkbox

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
import { editOrder, ViewallOrder, ViewreturnProductsCustom } from '../../services/allApi';
import { Label } from 'recharts';
import { toast, ToastContainer } from 'react-toastify';
import html2canvas from 'html2canvas';
import BillComponentOrders from '../../components/BillComponentOrders';
import { createRoot } from 'react-dom/client';

function OnlineReturns() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
  const [openCustomer, setOpenCustomer] = useState(false)
  const [open, setOpen] = useState(false);
  const [trackmodal, setTrackmodal] = useState(false)
  const [addOrderModal, setAddOrderModal] = useState(false)
  const [addressModal, setAddressModal] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [returnModal, setReturnModal] = useState(false);
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
  const [filterTrackingID, setFilterTrackingID] = useState("")
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedReturn, setSelectedReturn] = useState('')

    const handleGetallorders = async () => {
        try {
          const response = await ViewreturnProductsCustom()
          if (response.status === 200) {
            const sortedOrders = response.data
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))  
            setOrders(sortedOrders);
          }
        } catch (error) {
          console.log(error)
        }
      }
      useEffect(() => {
        handleGetallorders()
      }, [])

      const downloadExcel = () => {
        
        const worksheetData = [
          [
            'Order ID',
            'Customer Name',
            'Customer Email',
            'Customer Mobile',
            'Shipping Address',
            'Product Name',
            'Product Code',
            'Product Color',
            'Product Size',
            'Product Sleeve',
            'Quantity',
            'Price',
            'Total Price',
            'Payment Option',
            'Payment Status',
            'Track id',
            'Order Status',
            'Order Date',
            'Order Time',
          ], // Header row
          ...orders.flatMap((order) => {
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
            } = order || {}; // Ensure `order` exists
    
            // Format shipping address as a single string, using optional chaining
            const formattedAddress = shipping_address
              ? `${shipping_address?.address || 'N/A'}, ${shipping_address?.block || 'N/A'}, ${shipping_address?.district || 'N/A'}, ${shipping_address?.state || 'N/A'}, ${shipping_address?.country || 'N/A'} - ${shipping_address?.pincode || 'N/A'}`
              : 'N/A';
    
            // Map each product in the items array to a row
            return items?.map((item) => [
              id || 'N/A', // Order ID
              user?.name || 'N/A', // Customer Name
              user?.email || 'N/A', // Customer Email
              user?.mobile_number || 'N/A', // Customer Mobile
              formattedAddress, // Shipping Address
              item?.product?.name || 'N/A', // Product Name
              item?.product_code || 'N/A', // Product Code
              item?.product_color || 'N/A', // Product Color
              item?.size || 'N/A', // Product Size
              item?.sleeve || 'N/A', // Product Sleeve
              item?.quantity || 0, // Quantity
              item?.price || 0, // Price per item
              total_price || 0, // Total Price
              payment_option || 'N/A', // Payment Option
    
              payment_status || 'N/A', // Payment Status
              Track_id || 'N/A',
              status || 'N/A', // Order Status
              created_at?.split('T')?.[0] || 'N/A', // Order Date
              created_at?.split('T')?.[1]?.split('.')?.[0] || 'N/A', // Order Time
            ]) || []; // Ensure `items` exists
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

      const handleReturnopen=(item)=>{
        setReturnModal(true)
        setSelectedReturn(item)
      }
      const handleReturnClose=()=>{
        setReturnModal(false)
        setSelectedReturn(null)
      }
    
      const filteredorders = orders.filter(order => {
        // Status filter
        const statusMatch = filterstatus === 'All' || order.status === filterstatus;
    
        // Date range filter
        const orderDate = dayjs(order?.updated_at.split("T")[0]);
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
    
      const getStatusColor = (custom_status) => {
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
    <>
      <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Returned Orders
        </Typography>
        <Box sx={{gap:5}}>
       
      {/* <Button variant="contained" color="primary" onClick={downloadExcel}>
          Export as excel <DescriptionIcon sx={{ ml: 1 }} />
        </Button> */}
        </Box>
        
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 ,mt:3}}>
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
           
            <TableCell><b>SI</b></TableCell>
            <TableCell><b>Order ID</b></TableCell>
            <TableCell><b>Name</b></TableCell>
            <TableCell><b>Phone</b></TableCell>
            <TableCell><b>Date</b></TableCell>
            <TableCell><b>Time</b></TableCell>
            <TableCell><b>Return product</b></TableCell>
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
                
                
                <TableCell style={{ textAlign: 'center' }}>
                  <u>{startCustomerIndex + index}</u>
                </TableCell>
                <TableCell style={{ textAlign: 'center' }} onClick={() => handleopenorder(item)}>
                  <u>{item.admin_order_id}</u>
                </TableCell>
                <TableCell style={{ textAlign: 'center' }} >
                  {item.customer_name}
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  {item.phone_number}
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>{item?.updated_at.split("T")[0]}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{item?.updated_at.split("T")[1].split(".")[0]}</TableCell>
                <TableCell style={{  textAlign: 'center', color: "blue", cursor: "pointer" }} onClick={() => handleReturnopen(item)}><u>View</u></TableCell>
                <TableCell style={{ textAlign: 'center', color: "blue", cursor: "pointer" }} onClick={() => handleaddressOpen(item)}>
                  <u>View</u>
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>{item.payment_method}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{item.payment_status}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <a href={item.Track_id} target='_blank'>{item.Track_id}</a>
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <Button style={{ color: getStatusColor(item.custom_status) }}>{item.custom_status}</Button>
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
          <Typography><b>Order ID:</b> {selectedOrder?.admin_order_id}</Typography>
          <Typography><b>Customer:</b> {selectedOrder?.customer_name}</Typography>
          <Typography><b>Status:</b> {selectedOrder?.custom_status}</Typography>
          <Typography><b>Total Price:</b> RS. {selectedOrder?.total_price}</Typography>
          <Typography><b>Discounted Price:</b> RS. {selectedOrder?.custom_price}</Typography>
          

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Products:
          </Typography>

          {/* Product Table */}
          <Table>
            <TableHead>
              <TableRow>
                
                <TableCell><b>Product Code</b></TableCell>
                <TableCell><b>Product Name</b></TableCell>
              
                <TableCell><b>Length</b></TableCell>
                <TableCell><b>Price</b></TableCell>
                
              </TableRow>
            </TableHead>
            <TableBody>
  {selectedOrder?.['ordered product details'] && selectedOrder?.['ordered product details'].length > 0 ? (
    selectedOrder['ordered product details'].map((item, index) => (
      <React.Fragment key={index}>
        {/* Main Product Row */}
        <TableRow>
          <TableCell>{item.product_code}</TableCell>
          <TableCell>{item.product_name}</TableCell>
          <TableCell>{item.length}</TableCell>
          <TableCell>RS. {item.offer_price_per_meter}</TableCell>
          
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
               {selectedOrder?.address?.street_address }
            </Typography>
          </>

        </Box>
      </Modal>
      {/* modal for edit */}
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
      {/* modal for return products */}

      <Modal open={returnModal} onClose={handleReturnClose}>
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
            onClick={handleReturnClose}
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
          Return Products
          </Typography>

          {/* Order Information */}
      {/*     <Typography><b>Order ID:</b> {selectedReturn?.id}</Typography>
          <Typography><b>Customer:</b> {selectedReturn?.user?.name}</Typography>
          <Typography><b>Status:</b> {selectedReturn?.status}</Typography>
          <Typography><b>Payment Method:</b> payment</Typography>
          <Typography><b>Total Price:</b> RS. {selectedReturn?.total_price}</Typography>
          <Typography><b>Order Time:</b> {new Date(selectedReturn?.created_at).toLocaleString()}</Typography> */}

         

          {/* Product Table */}
          <Table>
            <TableHead>
              <TableRow>
              {/* <TableCell><b>Return id</b></TableCell> */}
                <TableCell><b>Product Code</b></TableCell>
                <TableCell><b>Product Name</b></TableCell>
                <TableCell><b>Length</b></TableCell>
                <TableCell><b>Price</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
    {selectedReturn?.returns && selectedReturn?.returns.length > 0 ? (
      selectedReturn.returns.map((returnItem, returnIndex) =>
        returnItem.items.map((item, itemIndex) => (
          <TableRow key={`${returnIndex}-${itemIndex}`}>
            <TableCell>{item.product_code}</TableCell>
            <TableCell>{item.product_name}</TableCell>
            <TableCell>{item.returned_length}</TableCell>
            <TableCell>{item.refund_price}</TableCell>
          </TableRow>
        ))
      )
    ) : (
      <TableRow>
        <TableCell colSpan={3} align="center">
          No products for this order
        </TableCell>
      </TableRow>
    )}
  </TableBody>
          </Table>
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
    </>
  )
}

export default OnlineReturns
