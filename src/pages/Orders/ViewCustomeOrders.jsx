import React, { useEffect, useState } from 'react'
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
  TextField, Grid, MenuItem, Select, FormControl, InputLabel, FormControlLabel, List, ListItem, ListItemText,

} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { toast, ToastContainer } from 'react-toastify';
import { addCustomeOrders, editCustomOrders, viewCustomOrders } from '../../services/allApi';
import * as XLSX from 'xlsx';
import Switch from '@mui/material/Switch';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import BillComponent from '../../components/BillComponent';
import { useRef } from 'react';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Label } from 'recharts';
import CustomInvoice from '../../components/CustomInvoice';
function ViewCustomeOrders() {
  const [addOrderModal, setAddOrderModal] = useState(false)
  const [customOrder, setCustomOrder] = useState([])
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openofferProduct, setOpenofferProduct] = useState(false)
  const [addressModal, setAddressModal] = useState(false)
  const [trackmodal, setTrackmodal] = useState(false)
  const [checked, setChecked] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    address: '',
    products: [],
    custom_total_price: "",
    payment_status: '',
    payment_method: '',
    Order_options: "",
    Track_id: "",

  });
  const [updatedCustom, setUpdatedCustom] = useState({
    payment_status: ""
  })
  const [filterstatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [billType, setBillType] = useState("")
  const [filterTrackingID, setFilterTrackingID] = useState("")
  const [searchQuery, setSearchQuery] = useState('')
  const [currentProduct, setCurrentProduct] = useState({
    product_code: '',
    custom_length: '',
    free_product_code: '',
  });
  console.log(currentProduct)

  const handleAddProduct = () => {
    if (!currentProduct.product_code || !currentProduct.custom_length) {
      toast.error("Product code and Length are required");
      return;
    }

    setFormData((prevData) => {
      if (!prevData || !Array.isArray(prevData.products)) {
        // Initialize products if it's undefined or not an array
        return {
          ...prevData,
          products: [currentProduct],
        };
      }

      return {
        ...prevData,
        products: [...prevData.products, currentProduct],
      };
    });

    // Reset the current product fields
    setCurrentProduct({
      product_code: '',
      custom_length: '',
      free_product_code: '',
    });
  };

  const handleDeleteProduct = (index) => {
    const updatedProducts = formData.products.filter((_, i) => i !== index);
    setFormData({ ...formData, products: updatedProducts });
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleChangeOffer = (e) => {
    setChecked(e.target.checked);
  };
  const handleopenorder = (item) => {
    setSelectedOrder(item)
    setOpen(true)
  }
  const handleopenoffer = (item) => {
    setSelectedOrder(item)
    setOpenofferProduct(true)
  }

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };
  const handleCloseoffer = () => {
    setOpenofferProduct(false);
    setSelectedOrder(null);
  };
  const handleaddressOpen = (item) => {
    setSelectedOrder(item)
    setAddressModal(true)
  }
  const handleaddModalClose = () => {
    setAddOrderModal(false)
    setFormData({
      name: '',
      phone_number: '',
      address: '',
      state: '',
      pincode: '',
      city: '',
      district: '',
      product_code: '',
      /*  size: '', */
      custom_length: '',
      /*   quantity: '', */
      /*   sleeve: '', */
      free_product_code: "",
      custom_total_price: "",
      payment_method: '',
      payment_status: '',
    })
  }
  console.log(checked)
  const handleEdit = (order) => {
    setTrackmodal(true)
    setSelectedOrder(order)
  }
  const handleCloseEdit = () => {
    setTrackmodal(false)
    setSelectedOrder(null)
  }
  console.log(formData)
  const handleGetCustom = async () => {
    try {
      const response = await viewCustomOrders()
      if (response.status === 200) {
        const sortedreturns = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setCustomOrder(sortedreturns)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    handleGetCustom()
  }, [])


  const handleAddCustomeorder = async () => {
    const { name, phone_number, address, state, pincode, city, district, product_code, custom_length, payment_method, payment_status, custom_total_price } = formData;

    try {
      if (!address) {
        toast.error("Please fill the user details completely");
      }
      else if (!payment_method || !payment_status || !custom_total_price) {
        toast.error("Payment details are required");
      } else {
        const response = await addCustomeOrders(formData);

        if (response.status === 201) {
          toast.success("Order created successfully");
          handleClose();
          if (response?.data?.order_details?.Order_options === "False") {
            generatePDF(response.data.order_details);
          }
          // generatePDF(response.data.order_details );

          setCurrentProduct({
            product_code: '',
            custom_length: '',
            free_product_code: '',
          });

          setFormData({
            name: '',
            phone_number: '',
            address: '',
            products: [],
            custom_total_price: '',
            payment_method: '',
            payment_status: '',
            Track_id: '',
            Order_options: ""
          });
          handleGetCustom();
          setAddOrderModal(false)
        }

      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message); // Display backend error message
      } else {
        // Fallback error message for unexpected cases
        toast.error("Something went wrong while adding the category.");
      }
    }
  };
  const pdfRef = useRef();
  console.log(billType)

  const generatePDF = (orderDetails) => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const BillComponentToRender = CustomInvoice;

    // Dynamically style the container to match the PDF page size
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth(); // Width in mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // Height in mm

    const mmToPx = (mm) => mm * (96 / 25.4); // Convert mm to px (96 DPI)
    const pageWidthPx = mmToPx(pdfWidth);
    const pageHeightPx = mmToPx(pdfHeight);

    container.style.width = `${pageWidthPx - 50}px`;
    container.style.height = `${pageHeightPx + 50}px`;
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';

    ReactDOM.render(<BillComponentToRender orderDetails={orderDetails} />, container);

    setTimeout(() => {
      html2canvas(container, {
        scale: 3, // Scale for better quality
        useCORS: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');

        // Add the image to fill the entire PDF page
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Save the PDF with the order number
        pdf.save(`order-${orderDetails.phone_number}.pdf`);

        // Clean up
        ReactDOM.unmountComponentAtNode(container);
        document.body.removeChild(container);
      });
    }, 1000); // Wait for rendering to complete
  };








  console.log(formData)

  const handleEditCustomer = async (id) => {
    try {
      const response = await editCustomOrders(id, updatedCustom)
      if (response.status === 200) {
        toast.success("payment status updated successfully ")
        handleGetCustom()
        handleCloseEdit()
        setUpdatedCustom({
          payment_status: ""
        })
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
  }

  const downloadExcel = () => {
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
        'custome size',
        'Price',
        'Total Price',
        'Payment Option',
        'Payment Status',
        'Track id',
        'Order Status',
        'Order Date',
        'Order Time',
      ], // Header row
      ...customOrder.flatMap((order) => {
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
  const handleStatusChangeFilter = (event) => {
    setFilterStatus(event.target.value);
  };
  const filteredorders = customOrder.filter(order => {
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

      String(order?.phone_number)?.toLowerCase().includes(searchQuery.toLowerCase());

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
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Add Custome Orders
        </Typography>
        <Box sx={{ display: 'flex', mb: 2, gap: 2 }} >
          <Button variant="contained" sx={{ marginTop: '10px' }} color="success" onClick={() => setAddOrderModal(true)} >
            Add custom order
          </Button>


        </Box>
        {/*  <Button variant="contained" color="primary" onClick={downloadExcel}>
          Export as excel <DescriptionIcon sx={{ ml: 1 }} />
        </Button> */}
      </Box>

      {/* Date filters */}
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
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>SI</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Name</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Mobile Number</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Products</b></TableCell>
              {/* <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b> Offer products</b></TableCell> */}

              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Date</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Address</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Payment Method</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Payment Status</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b> Track ID</b></TableCell>
              {/* <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Actions</b></TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>

            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <TableRow >
                  <TableCell
                    style={{ whiteSpace: 'nowrap', textAlign: 'center' }}

                  >
                    {startCustomerIndex + index}
                  </TableCell>
                  <TableCell
                    style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                  >
                    {item.name}
                  </TableCell>
                  <TableCell
                    style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                  >
                    {item.phone_number}
                  </TableCell>
                  <TableCell
                    style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                    sx={{ color: "blue", cursor: "pointer" }}
                    onClick={() => handleopenorder(item)}
                  >
                    <u>Product</u>
                  </TableCell>
                  {/* <TableCell
                    style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                    sx={{ color: "blue", cursor: "pointer" }}
                    onClick={() => handleopenoffer(item)}
                  >
                    <u> Offer Product</u>
                  </TableCell> */}

                  {/* Additional Empty Columns */}

                  <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{new Date(item?.created_at).toLocaleString()}</TableCell>
                  <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center', color: "blue", cursor: "pointer" }} onClick={() => handleaddressOpen(item)}><u>View</u></TableCell>
                  <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{item.payment_method}</TableCell>


                  {/* Track ID Column */}
                  <TableCell
                    style={{ whiteSpace: 'nowrap', textAlign: 'center' }}

                  >
                    {item.payment_status}
                  </TableCell>


                  <TableCell style={{ textAlign: 'center' }}>
                    {item.Track_id}

                  </TableCell>


                  {/* Action Buttons Based on Status */}
                  {/* <TableCell><IconButton aria-label="Edit" onClick={() => handleEdit(item)}>
                    <EditIcon />
                  </IconButton>
                  </TableCell> */}
                </TableRow>))
            ) : (
              // Fallback Message when there are no orders
              <TableRow>
                <TableCell colSpan={11} style={{ textAlign: 'center' }}>  {/* Adjust colSpan based on total columns */}
                  No Custom order
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

      {/* modal for customer details */}
      {/* <Modal open={openCustomer} onClose={() => setOpenCustomer(false)}>
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
      </Modal> */}

      {/* modal for add orders */}
      <Modal open={addOrderModal} onClose={handleaddModalClose}>
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
            onClick={handleaddModalClose}
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
              Add Orders
            </Typography>
            <Grid item xs={12}>
              <Box mt={2}>
                <Typography variant="h6">User Details:</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      name='name'
                      variant="outlined"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name='phone_number'
                      label="Phone Number"
                      variant="outlined"
                      type="text"
                      value={formData.phone_number}
                      onChange={handleChange}

                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name='address'
                      label="Address"
                      variant="outlined"
                      type="text"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </Grid>
                  {/* <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name='state'
                      label="state"
                      variant="outlined"
                      type="text"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name='pincode'
                      label="Pincode"
                      variant="outlined"
                      type="text"
                      value={formData.pincode}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name='city'
                      label="City"
                      variant="outlined"
                      type="text"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name='district'
                      label="District"
                      variant="outlined"
                      type="text"
                      value={formData.district}
                      onChange={handleChange}
                    />

                  </Grid> */}
                </Grid>
              </Box>
              <Box mt={2}>
                <Typography variant="h6">Product Details:</Typography>
                <Grid container spacing={2}>

                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      name='product_code'
                      label="Product Code"
                      variant="outlined"
                      type="text"
                      value={currentProduct.product_code}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, product_code: e.target.value })}
                    />
                  </Grid>
                  {/* <Grid item xs={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Size</InputLabel>
                      <Select
                        name='size'
                        label="Size"
                        defaultValue=""
                        value={formData.size}
                        onChange={handleChange}
                      >
                        <MenuItem value="L">L</MenuItem>
                        <MenuItem value="XL">XL</MenuItem>
                        <MenuItem value="XXL">XXL</MenuItem>
                        <MenuItem value="XXXL">XXXL</MenuItem>
                        <MenuItem value="4XL">4XL</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid> */}


                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      name='custom_length'
                      label="Custom Length"
                      variant="outlined"
                      type="number"
                      value={currentProduct.custom_length}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, custom_length: e.target.value })}
                    />
                  </Grid>
                  {/* <Grid item xs={4}>
                    <FormControlLabel
                      label="Enable Offer"
                      control={
                        <Switch
                          checked={checked}
                          onChange={handleChangeOffer}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      }

                    />
                  </Grid> */}
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      name='free_product_code'
                      label="Free Product Code"
                      variant="outlined"
                      type="text"
                      value={currentProduct.free_product_code}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, free_product_code: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleAddProduct}>
                      Add Product
                    </Button>
                  </Grid>
                  <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
                    {formData.products?.map((product, index) => (
                      <ListItem
                        key={index}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleDeleteProduct(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={`Product ${index + 1}: ${product.product_code}`}
                          secondary={`Custom Length: ${product.custom_length || 'N/A'} ${product.free_product_code ? `, Free Product: ${product.free_product_code}` : ''}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name='custom_total_price'
                      label="Price"
                      variant="outlined"
                      type="number"
                      value={formData.custom_total_price}
                      onChange={handleChange}
                    />
                  </Grid>
                  {/* <Grid item xs={4}>
                    <TextField
                      fullWidth
                      name='quantity'
                      label="Quantity"
                      variant="outlined"
                      type="number"
                      value={formData.quantity}
                      onChange={handleChange}
                    />
                  </Grid> */}
                  {/* <Grid item xs={4}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Sleeve Type</InputLabel>
                      <Select
                        label="Sleeve Type"
                        name='sleeve'
                        defaultValue=""
                        value={formData.sleeve}
                        onChange={(e) => setFormData({ ...formData, sleeve: e.target.value })}
                      >
                        <MenuItem value="full">Full Sleeve</MenuItem>
                        <MenuItem value="half">Half Sleeve</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid> */}
                  <Grid item xs={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Payment Method</InputLabel>
                      <Select
                        label="Payment Method"
                        name='payment_method'
                        defaultValue=""
                        value={formData.payment_method}
                        onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                      >
                        <MenuItem value="ShopPayment">Shop Payment</MenuItem>
                        <MenuItem value="COD">COD</MenuItem>
                        <MenuItem value="Online">UPI</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Payment Status</InputLabel>
                      <Select
                        label="Payment Status"
                        name='payment_status'
                        defaultValue=""
                        value={formData.payment_status}
                        onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })}
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Paid">Paid</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Select Order Type</InputLabel>
                      <Select
                        label="Order Type"
                        value={formData.Order_options}
                        onChange={(e) => setFormData({ ...formData, Order_options: e.target.value })}
                      >
                        <MenuItem value="True">ONLINE ORDER</MenuItem>
                        <MenuItem value="False">SHOP INVOICE</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name='Track_id'
                      label="Track id"
                      variant="outlined"
                      type="text"
                      disabled={formData.Order_options === 'False'}
                      value={formData.Track_id}
                      onChange={handleChange}
                    />
                  </Grid>

                  {/* <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name='return'
                      label="Price"
                      variant="outlined"
                      type="number"
                      value={formData.custom_total_price}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name='custom_total_price'
                      label="Price"
                      variant="outlined"
                      type="number"
                      value={formData.custom_total_price}
                      onChange={handleChange}
                    />
                  </Grid> */}
                </Grid>
              </Box>
            </Grid>




            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='success' sx={{ backgroundColor: "green", marginTop: '5px' }} onClick={handleAddCustomeorder} > save</Button>
            </Box>
          </>

        </Box>
      </Modal>

      {/* Modal to display product details */}
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

          <Typography variant="h4" gutterBottom>
            Product Details
          </Typography>

          {/* Order Information */}
          <Typography><b>Order ID:</b> {selectedOrder?.id}</Typography>
          {/* <Typography><b>Length:</b> {selectedOrder?.custom_length}</Typography> */}
          <Typography><b>Total Price:</b> RS. {selectedOrder?.total_price}</Typography>
          <Typography><b>Discounted Price:</b> RS. {selectedOrder?.custom_total_price}</Typography>
          <Typography><b>Order Time:</b> {new Date(selectedOrder?.created_at).toLocaleString()}</Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Products:
          </Typography>

          {/* Product Table */}
          <Table>
            <TableHead>
              <TableRow>

                <TableCell><b>Product Code</b></TableCell>
                <TableCell><b>Product Name</b></TableCell>
                <TableCell><b>Category</b></TableCell>
                <TableCell><b>Length</b></TableCell>
                <TableCell><b>Price</b></TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {selectedOrder?.order_products?.map((item) => (<><TableRow>

                <TableCell>{item?.product_details?.product_code}</TableCell>
                <TableCell>{item?.product_details?.name}</TableCell>
                <TableCell>{item?.product_details?.category_name}</TableCell>
                <TableCell>RS.{item?.length}</TableCell>
                <TableCell>RS.{item?.product_details?.price_per_meter}</TableCell>


              </TableRow>
                {item?.product_details?.free_product_details && <TableRow sx={{ backgroundColor: 'green' }}>
                  <TableCell >{item?.product_details?.free_product_details?.product_code}</TableCell>
                  <TableCell>{item?.product_details?.free_product_details?.name}</TableCell>
                  <TableCell>{item?.product_details?.free_product_details?.category_name}</TableCell>
                  <TableCell>RS.{item?.length}</TableCell>
                  <TableCell>RS.{item?.product_details?.free_product_details?.price_per_meter}</TableCell>
                </TableRow>}

              </>))}


            </TableBody>
          </Table>
        </Box>
      </Modal>
      {/* Modal to display product details */}
      <Modal open={openofferProduct} onClose={handleCloseoffer}>
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
            onClick={handleCloseoffer}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'grey.500',
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h4" gutterBottom>
            Offer Product Details
          </Typography>

          {/* Order Information */}
          <Typography><b>Order ID:</b> {selectedOrder?.id}</Typography>
          <Typography><b>Length:</b> {selectedOrder?.custom_length}</Typography>
          <Typography><b>Order Time:</b> {new Date(selectedOrder?.created_at).toLocaleString()}</Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Offer Products:
          </Typography>

          {/* Product Table */}
          <Table>
            <TableHead>
              <TableRow>

                <TableCell><b>Product Code</b></TableCell>
                <TableCell><b>Product Name</b></TableCell>
                <TableCell><b>Product Color</b></TableCell>
                <TableCell><b>Category</b></TableCell>
                <TableCell><b>Price</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

              <TableRow>

                <TableCell>{selectedOrder?.free_product_details?.['product code']}</TableCell>
                <TableCell>{selectedOrder?.free_product_details?.name}</TableCell>
                <TableCell>{selectedOrder?.free_product_details?.color}</TableCell>
                <TableCell>{selectedOrder?.free_product_details?.['category name']}</TableCell>
                <TableCell>RS.{selectedOrder?.free_product_details?.price_per_meter}</TableCell>

              </TableRow>

            </TableBody>
          </Table>
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
              <b> Name:</b>{selectedOrder?.name}
            </Typography>

            <Typography>
              <b>Phone:</b>{selectedOrder?.phone_number}
            </Typography>
            <Typography>
              <b>Address:</b>{selectedOrder?.address}
            </Typography>
            {/* <Typography>
              <b>pincode:</b>{selectedOrder?.pincode}
            </Typography>
            <Typography>
              <b>City:</b>{selectedOrder?.city}
            </Typography>

            <Typography>
              <b>District:</b>{selectedOrder?.district}
            </Typography>
            <Typography>
              <b>State:</b>{selectedOrder?.state}
            </Typography> */}
          </>

        </Box>
      </Modal>
      {/* modal for edit*/}
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
              Edit Custom Orders
            </Typography>
            <Grid container mt={2} >
              <Grid item xs={12} mt={3} sx={{ "marginLeft": "5px" }}>
                <TextField
                  fullWidth
                  label="Track Id"
                  variant="outlined"
                  placeholder='paste track id here'
                /* value={updatedCustomer.Track_id}
                onChange={(e) => setUpdatedCustomer({ ...updatedCustomer, Track_id: e.target.value })} */
                />
              </Grid>

              <Grid item xs={12} mt={3} sx={{ "marginLeft": "5px" }}>
                <FormControl fullWidth>
                  <InputLabel id="status-select-label">Payment Status</InputLabel>
                  <Select
                    labelId="status-select-label"
                    label="Choose Payment Status"
                    value={updatedCustom.payment_status}
                    onChange={(e) => setUpdatedCustom({ ...updatedCustom, payment_status: e.target.value })}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Paid">Paid</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='success' sx={{ backgroundColor: "green", marginTop: '5px' }} onClick={() => handleEditCustomer(selectedOrder.id)}   > save Changes</Button>
            </Box>
          </>

        </Box>
      </Modal>
      <ToastContainer />
    </>
  )
}

export default ViewCustomeOrders
