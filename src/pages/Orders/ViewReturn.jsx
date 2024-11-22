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
  TextField, Grid, MenuItem, Select, FormControl, InputLabel
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
import { editOrder, viewReturn } from '../../services/allApi';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { toast, ToastContainer } from 'react-toastify';

function ViewReturn() {
  const [openCustomer, setOpenCustomer] = useState(false)
  const [open, setOpen] = useState(false);
  const [trackmodal, setTrackmodal] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [addressModal, setAddressModal] = useState(false)
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [status, setStatus] = useState('');
  const [returnOrders, setReturnOrders] = useState([])
  const [selectedReturn, setSelectedReturn] = useState('')
  const [updatedReturns,setUpdatedReturns]=useState({
    return_status:""
  })
  const handleClose = () => {
    setOpen(false);

  };
  const openConfirmDialog = () => {
    setConfirmDialogOpen(true);
  };



  const handleGetReturnorders = async () => {
    try {
      const response = await viewReturn()
      if (response.status === 200) {
        setReturnOrders(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    handleGetReturnorders()
  }, [])
  console.log(returnOrders)

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
    finally{
      setReturnOrders({
        return_status:""
      })  
    }
  }

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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          View Return Orders
        </Typography>
        <Button variant="contained" color="primary" onClick={downloadExcel}>
          Export as excel <DescriptionIcon sx={{ ml: 1 }} />
        </Button>
      </Box>

      {/* Date filters */}
      {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', mb: 2, gap: 2 }}>
          <Typography gutterBottom>
            From
          </Typography>
          <input
            type="date"
            value={fromDate}

            style={{ padding: '10px', fontSize: '16px' }}
          />
          <Typography gutterBottom>
            To
          </Typography>
          <input
            type="date"
            value={toDate}

            style={{ padding: '10px', fontSize: '16px' }}
          />
          <Button variant="contained" color="secondary" >
            Filter Orders
          </Button>
        </Box>
      </Box> */}


      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: 'lightblue' }}>
            <TableRow>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Order ID</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Customer</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Date</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Time</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Shipping Address</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Payment Method</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Payment Status</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Track id</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b> Order Status</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b> Return Status</b></TableCell>

              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {returnOrders?.length > 0 ? returnOrders.map((item, index) => (<TableRow key={index}>
              <TableCell
                style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                sx={{ color: "blue", cursor: "pointer" }}
                onClick={() => handleopenorder(item)}
              >
                <u>{item.id}</u>
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
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{item.created_at.split("T")[0]}</TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{item.created_at.split("T")[1].split(".")[0]}</TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center', color: "blue", cursor: "pointer" }} onClick={() => handleaddressOpen(item)}><u>View</u></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{item.payment_option}</TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{item.payment_status}</TableCell>


              {/* Track ID Column */}
              <TableCell
                style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                sx={{ color: "blue", cursor: "pointer" }}

              >
                {item.Track_id}
              </TableCell>

              {/* Status Dropdown */}
              <TableCell style={{ textAlign: 'center' }}>
                {item.status}
              </TableCell>
              <TableCell style={{ textAlign: 'center'  }}>
    <Button  style={{color: getStatusColor(item.return_status)}}>{item.return_status}</Button>
  
</TableCell>

              {/* Action Buttons Based on Status */}
              <TableCell><IconButton aria-label="Edit" onClick={() => handleEdit(item)}>
                <EditIcon />
              </IconButton>

                {/* <IconButton aria-label="Delete">
                  <DeleteIcon />
                </IconButton> */}
                </TableCell>
            </TableRow>)) : <TableRow>No returns</TableRow>}


          </TableBody>
        </Table>
      </TableContainer>

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
          <Typography><b>Order ID:</b> {selectedReturn?.id}</Typography>
          <Typography><b>Customer:</b> {selectedReturn?.user?.name}</Typography>
          <Typography><b>Status:</b> {selectedReturn?.status}</Typography>
          <Typography><b>Payment Method:</b> payment</Typography>
          <Typography><b>Total Price:</b> RS. {selectedReturn?.total_price}</Typography>
          <Typography><b>Order Time:</b> {new Date(selectedReturn?.created_at).toLocaleString()}</Typography>

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
              {selectedReturn?.items && selectedReturn?.items.length > 0 ? (
                selectedReturn.items.map((item, index) => (
                  <TableRow key={index}>
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">No products for this order</TableCell>
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
              <b>Email:</b>{selectedReturn?.user?.email}
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
              <b>Email:</b>{selectedReturn?.shipping_address?.email}
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
            <Grid container mt={2} >
              <Grid item xs={12} mt={3} sx={{ "marginLeft": "5px" }}>
                <FormControl fullWidth>
                  <InputLabel id="status-select-label">Return Status</InputLabel>
                  <Select
                    labelId="status-select-label"
                    label="Choose Status"
                    value={updatedReturns.return_status} 
            onChange={(e)=>setUpdatedReturns({...updatedReturns,return_status:e.target.value})} 
                  >
                    <MenuItem value="Return Initiated">Return Initiated</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Completed">Return Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='success' sx={{ backgroundColor: "green", marginTop: '5px' }} onClick={()=>handleEditorders(selectedReturn.id)}   > save Changes</Button>
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
      <ToastContainer/>
    </Box>
  )
}

export default ViewReturn
