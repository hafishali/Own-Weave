import React, { useEffect } from 'react'
import { useState } from 'react';
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
  TextField, Grid, MenuItem, Select, FormControl, InputLabel,CircularProgress,ListItemText,ListItem,List
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';
import DescriptionIcon from '@mui/icons-material/Description';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import dayjs from 'dayjs'
import { editOrder, returnProducts, viewReturn, ViewreturnProducts } from '../../services/allApi';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { toast, ToastContainer } from 'react-toastify';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Label } from 'recharts';

function ViewReturn() {
  const [openCustomer, setOpenCustomer] = useState(false)
  const [open, setOpen] = useState(false);
  const [returnModal, setReturnModal] = useState(false);
  const [trackmodal, setTrackmodal] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [addressModal, setAddressModal] = useState(false)
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [status, setStatus] = useState('');
  const [returnOrders, setReturnOrders] = useState([])
  const [selectedReturn, setSelectedReturn] = useState('')
  const [filterstatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterTrackingID, setFilterTrackingID] = useState("")
  const [searchQuery, setSearchQuery] = useState('')
  const [returnedProduct,setReturnedProduct]=useState([])
  const [returnproducts, setReturnproducts] = useState([]);
  const [returnproductCode, setReturnproductCode] = useState('');
  const [returnlength, setReturnLength] = useState('');


  // State to manage date pickers
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  

  const [updatedReturns,setUpdatedReturns]=useState({
    return_status:""
  })
  const handleClose = () => {
    setOpen(false);

  };
  const openConfirmDialog = () => {
    setConfirmDialogOpen(true);
  };
  const handleAddProduct = () => {
    if (!returnproductCode || !returnlength) return alert('Please enter a valid product code and length');
  
    setReturnproducts((prevProducts) => ({
      returns: [
        ...prevProducts.returns || [],
        { product_code: returnproductCode, returned_length: parseFloat(returnlength) },
      ],
    }));
    
    setReturnproductCode(''); // Reset product code field
    setReturnLength(''); // Reset length field
  };
  
  const handleRemoveProduct = (index) => {
    setReturnproducts((prevProducts) => ({
      returns: prevProducts.returns.filter((_, i) => i !== index),
    }));
  };



  const handleGetReturnorders = async () => {
    try {
      const response = await ViewreturnProducts()
      if (response.status === 200) {
        const sortedReturns = response.data?.sort((a, b) => {
          return new Date(b['updated at']) - new Date(a['updated at']);
      });
        setReturnedProduct(sortedReturns)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    handleGetReturnorders()
  }, [])
  console.log(returnedProduct)

  const downloadExcel = () => {
    if (!returnOrders || returnOrders.length === 0) {
      console.error("No data available for export.");
      return;
    }
  
    // Prepare the worksheet data dynamically
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
        'Track ID',
        'Order Status',
        'Return Status',
        'Order Date',
        'Order Time',
      ], // Header row
      ...returnOrders.flatMap((order) => {
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
          return_status,
          created_at,
        } = order || {};
  
        // Format the shipping address into a single string
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
          Track_id || 'N/A', // Track ID
          status || 'N/A', // Order Status
          return_status || 'N/A', // Return Status
          created_at?.split('T')?.[0] || 'N/A', // Order Date
          created_at?.split('T')?.[1]?.split('.')?.[0] || 'N/A', // Order Time
        ]) || []; // Ensure `items` exists
      }),
    ];
  
    // Create a new workbook and add the worksheet data
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Return Orders Report');
  
    // Trigger the download
    XLSX.writeFile(workbook, 'Return_orders_report.xlsx');
  };
  const handleCustomerOpen = (item) => {
    setOpenCustomer(true)
    setSelectedReturn(item)

  }
  const handleReturnopen=(item)=>{
    setReturnModal(true)
    setSelectedReturn(item)
  }
  const handleReturnClose=()=>{
    setReturnModal(false)
    setSelectedReturn(null)
  }
  const handleaddressOpen = (item) => {
    setSelectedReturn(item)
    setAddressModal(true)
  }
  const handleaddressClose = () => {
    setAddressModal(false)
    setSelectedReturn(null)
  }
  const handleopenorder = (item) => {
    setSelectedReturn(item)
    setOpen(true)
  }
  const handlecloseorder = () => {
    setSelectedReturn(null)
    setOpen(false)
  }
  const handleEdit = (order) => {
    setTrackmodal(true)
    setSelectedReturn(order)
    setUpdatedReturns({
      return_status: order.return_status || "",  
    });
  }
  const handleCloseEdit=()=>{
    setTrackmodal(false)
    setSelectedReturn(null)
    setReturnproducts([])
    setReturnproductCode('')
    setReturnLength('') 
  }

  // edit return status
  const handleEditorders=async(id)=>{
    try {
      const response=await editOrder(id,updatedReturns)
      if(response.status===200){
        toast.success("order return has been edited successfully")
        handleCloseEdit()
        handleGetReturnorders()
      }
    } catch (error) {
      console.log(error)
      toast.error("something went wrong at editing return orders")
    }
    
  }

  const handleReturns = async (id) => {
    try {
      const results = await returnProducts(id, returnproducts);
      if (results.status === 200) {
        toast.success("Order has been edited successfully");
        handleCloseEdit();
        handleGetReturnorders();
        setReturnproducts([]);
        setReturnproductCode('');
        setReturnLength('');
          
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message); // Display backend error message
      } else {
        toast.error("Something went wrong while returning products.");
      }
    }
  };

  const getStatusColor = (return_status) => {
    switch (return_status) {
      case 'Return Initiated':
        return 'blue';  
      case 'Pending':
        return 'orange'; 
      case 'Completed':
        return 'green';   
      default:
        return 'black';  
    }
  };

  const handleStatusChangeFilter = (event) => {
    setFilterStatus(event.target.value);
  };

  const filteredorders = returnedProduct.filter(order => {
    // Status filter
    const statusMatch = filterstatus === 'All' || order.status === filterstatus;

    // Date range filter
    const orderDate = dayjs(order['updated at'].split("T")[0]);

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
  // if (!Array.isArray(returnOrders)) {
  //   return (
  //     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  //       <CircularProgress />
  //     </Box>
  //   );
  // }
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          View Return products
        </Typography>
        {/* <Button variant="contained" color="primary" onClick={downloadExcel}>
          Export as excel <DescriptionIcon sx={{ ml: 1 }} />
        </Button> */}

      </Box>

      {/* Date filters */}
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
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Order ID</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Customer</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Date</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Time</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Return Products</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Shipping Address</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Payment Method</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Payment Status</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Track id</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b> Order Status</b></TableCell>
              

              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {currentItems.length > 0 ? (  // Check if currentItems has data
    currentItems.map((item, index) => (<TableRow key={index}>
              <TableCell
                style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                sx={{ color: "blue", cursor: "pointer" }}
                onClick={() => handleopenorder(item)}
              >
                <u>{item.order_id}</u>
              </TableCell>

              {/* Customer Name Column */}
              <TableCell
                style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                sx={{ color: "blue", cursor: "pointer" }}
                onClick={() => handleCustomerOpen(item)}
              >
                <u>{item.user?.name}</u>
              </TableCell>

              {/* Additional Empty Columns */}
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{item['updated at'].split("T")[0]}</TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{item['updated at'].split("T")[1].split(".")[0]}</TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center', color: "blue", cursor: "pointer" }} onClick={() => handleReturnopen(item)}><u>View</u></TableCell>

              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center', color: "blue", cursor: "pointer" }} onClick={() => handleaddressOpen(item)}><u>View</u></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{item['paymet method']}</TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{item['payment status']}</TableCell>


              {/* Track ID Column */}
              <TableCell
                style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                sx={{ color: "blue", cursor: "pointer" }}

              >
                {item.Track_id}
              </TableCell>

              {/* Status Dropdown */}
              <TableCell style={{ textAlign: 'center' }}>
                {item['order status']}
              </TableCell>
             

              {/* Action Buttons Based on Status */}
              <TableCell><IconButton aria-label="Edit" onClick={() => handleEdit(item)}>
                <EditIcon />
              </IconButton>

                {/* <IconButton aria-label="Delete">
                  <DeleteIcon />
                </IconButton> */}
                </TableCell>
            </TableRow>))
          ) : (
            // Fallback Message when there are no orders
            <TableRow>
              <TableCell colSpan={11} style={{ textAlign: 'center' }}>  {/* Adjust colSpan based on total columns */}
                No Returns
              </TableCell>
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
      <Modal open={open} onClose={handlecloseorder}>
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
            onClick={handlecloseorder}
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
          <Typography><b>Order ID:</b> {selectedReturn?.order_id}</Typography>
          <Typography><b>Customer:</b> {selectedReturn?.user?.name}</Typography>
          <Typography><b>Status:</b> {selectedReturn?.['order status']}</Typography>
          <Typography><b>Payment Method:</b>{selectedReturn?.['paymet method']}</Typography>
          <Typography><b>Total Price:</b> RS. {selectedReturn?.total_price}</Typography>
          

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
                <TableCell><b>Quantity</b></TableCell>
                <TableCell><b>Size</b></TableCell>
                <TableCell><b>Sleeve</b></TableCell>
                <TableCell><b>Price</b></TableCell>
                <TableCell><b> Offer Price</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {selectedReturn?.['ordered product details'] && selectedReturn?.['ordered product details'].length > 0 ? (
  selectedReturn['ordered product details'].map((item, index) => (
    <React.Fragment key={index}>
      <TableRow>
        <TableCell>{item?.id}</TableCell>
        <TableCell>{item?.product_code}</TableCell>
        <TableCell>{item?.product_name}</TableCell>
        <TableCell>{item?.quantity}</TableCell>
        <TableCell>{item?.size}</TableCell>
        <TableCell>{item?.sleeve}</TableCell>
        <TableCell>RS. {item?.price}</TableCell>
        <TableCell>RS. {item?.offer_price_per_meter}</TableCell>
      </TableRow>
      {item.free_product && (
        <TableRow>
          <TableCell colSpan={9} sx={{ backgroundColor: '#f0f0f0', color: '#4caf50' }}>
            <Typography variant="body2">
              <b>Free Product: </b> NAME: {item.free_product?.name} || CODE: {item.free_product?.product_code} {/* || PRICE: {item.free_product?.offer_price_per_meter} */}
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
              <b>Customer Name:</b>{selectedReturn?.user?.name}
            </Typography>
            
            <Typography>
              <b>Phone:</b>{selectedReturn?.user?.mobile_number}
            </Typography>
          </>

        </Box>
      </Modal>

      {/* modal for view address */}
      <Modal open={addressModal} onClose={handleaddressClose}>
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
            onClick={handleaddressClose}
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
              <b> Name:</b>{selectedReturn?.shipping_address?.name}
            </Typography>
            <Typography>
              <b>Phone:</b>{selectedReturn?.shipping_address?.mobile_number}
            </Typography>
            <Typography>
              <b>Address:</b>{selectedReturn?.shipping_address?.address}
            </Typography>
            <Typography>
              <b>pincode:</b>{selectedReturn?.shipping_address?.pincode}
            </Typography>
            <Typography>
              <b>Post office:</b>{selectedReturn?.shipping_address?.post_office}
            </Typography>
            <Typography>
              <b>Block:</b>{selectedReturn?.shipping_address?.block}
            </Typography>
            <Typography>
              <b>District:</b>{selectedReturn?.shipping_address?.district}
            </Typography>
            <Typography>
              <b>State:</b>{selectedReturn?.shipping_address?.state}
            </Typography>
            <Typography>
              <b>Country:</b>{selectedReturn?.shipping_address?.country}
            </Typography>
            <Typography>
              <b>Home Address:</b>{selectedReturn?.shipping_address?.is_home === true ? 'yes' : 'No'}
            </Typography>
            <Typography>
              <b>Office Address:</b>{selectedReturn?.shipping_address?.is_office === true ? 'yes' : 'No'}
            </Typography>
            <Typography>
              <b>Other Address:</b>{selectedReturn?.shipping_address?.is_other === true ? 'yes' : 'No'}
            </Typography>
            <Typography>
              <b>Defualt Address:</b>{selectedReturn?.shipping_address?.is_default === true ? 'yes' : 'No'}
            </Typography>

          </>

        </Box>
      </Modal>
      {/* modal for track id */}
      <Modal open={trackmodal} onClose={() => setTrackmodal(false)}>
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
              Edit Return Orders
            </Typography>
            <Box sx={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
  <Box sx={{ display: 'flex', gap: '5px' }}>
    <Grid item xs={5}>
      <TextField
        fullWidth
        label="Product Code"
        variant="outlined"
        placeholder="Enter product code"
        value={returnproductCode}
        onChange={(e) => setReturnproductCode(e.target.value)}
      />
    </Grid>
    <Grid item xs={5}>
      <TextField
        fullWidth
        label="Length"
        variant="outlined"
        placeholder="Enter product length"
        value={returnlength}
        onChange={(e) => setReturnLength(e.target.value)}
      />
    </Grid>
    <Grid item xs={2}>
      <Button
        sx={{ width: '100%', height: '100%', backgroundColor: 'lightblue' }}
        variant="contained"
        onClick={handleAddProduct}
      >
        Add
      </Button>
    </Grid>
  </Box>

  {/* List of added products */}
  <List>
    {returnproducts.returns?.map((product, index) => (
      <ListItem
        key={index}
        secondaryAction={
          <IconButton edge="end" onClick={() => handleRemoveProduct(index)}>
            <DeleteIcon />
          </IconButton>
        }
      >
        <ListItemText
          primary={`Product Code: ${product.product_code}, Length: ${product.returned_length}`}
        />
      </ListItem>
    ))}
  </List>
</Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='success' sx={{ backgroundColor: "green", marginTop: '5px' }} onClick={()=>handleReturns(selectedReturn.id)}   > save Changes</Button>
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
            <TableCell>{item['return product code']}</TableCell>
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
      <ToastContainer/>
    </Box>
  )
}

export default ViewReturn
