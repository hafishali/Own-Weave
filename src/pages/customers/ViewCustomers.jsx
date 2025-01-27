import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  DialogContentText, MenuItem, Select, FormControl, InputLabel, FormControlLabel, FormLabel, Radio, RadioGroup, Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmojiPicker from 'emoji-picker-react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import { deleteCustomer, EditAddressCustomers, EditCustomerdts, ViewallCustomers } from '../../services/allApi';
import { toast, ToastContainer } from 'react-toastify';
import * as XLSX from 'xlsx';


function ViewCustomers() {
  const [customers, setCustomers] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openadressDialog, setOpenadressDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [customerCategory, setCustomerCategory] = useState('');
  const [customerCategoryFilter, setCustomerCategoryFilter] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [updatedAddresses, setUpdatedAddresses] = useState(
    selectedCustomer?.addresses || []
  );
  const [addresses, setAddresses] = useState(updatedAddresses);
  const [originalAddresses, setOriginalAddresses] = useState(updatedAddresses); // Store original addresses
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [displayedCustomer, setDisplayedCustomer] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerdts, setCustomerdts] = useState({
    email: "",
    name: "",
    mobile_number: "",
    is_vip: false,
    is_favorite: false,
  })


  const pageSize = 10;

  // Fetch all customers and set to `customers` state
  const handleGetallCustomers = async () => {
    try {
      const response = await ViewallCustomers();
      if (response.status === 200) {
        const sortedreturns = response.data.sort((a, b) => new Date(b.created_at	) - new Date(a.created_at));

        setCustomers(sortedreturns);
        setDisplayedCustomer(sortedreturns); // Set to `customers` state
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Calculate total pages and slice data based on pagination
  const totalPages = Math.ceil(customers.length / pageSize);
  useEffect(() => {
    // Filter customers based on selected category
    let filteredCustomers = customers;

    // Apply category filter
    if (customerCategory) {
        filteredCustomers = customers.filter((customer) => {
            if (customerCategory === 'VIP') return customer.is_VIP;
            if (customerCategory === 'Favourite') return customer.is_favorite;
            return true; // If no category is selected, show all customers
        });
    }

    // Apply search filter
    if (searchTerm) {
        const searchLowerCase = searchTerm.toLowerCase();
        filteredCustomers = filteredCustomers.filter((customer) => {
            return (
                customer.name.toLowerCase().includes(searchLowerCase) ||
                customer.mobile_number.toString().includes(searchLowerCase)
            );
        });
    }

    // Paginate the filtered customers
    const paginatedCustomers = filteredCustomers.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    setDisplayedCustomer(paginatedCustomers); // Set paginated customers
}, [customerCategory, customers, currentPage, searchTerm]);

  const handleCategoryChange = (event) => {
    const value = event.target.value;
  
    setCustomerdts((prevState) => ({
      ...prevState,
      is_vip: value === "VIP",
      is_favorite: value === "Favourite",
    }));
  };

  useEffect(() => {
    handleGetallCustomers();
  }, []);


  useEffect(() => {
    if (selectedCustomer) {
      setUpdatedAddresses(selectedCustomer.addresses);
    }
  }, [selectedCustomer]);


  useEffect(() => {
    setAddresses(updatedAddresses);
    setOriginalAddresses(updatedAddresses);
  }, [updatedAddresses]);

  useEffect(() => {
    // Set initial form data when dialog opens
    if (selectedCustomer) {

      setCustomerdts({
        email: selectedCustomer.email || "",
        name: selectedCustomer.name || "",
        mobile_number: selectedCustomer.mobile_number || "",
        is_vip: selectedCustomer.is_vip || false,
        is_favorite: selectedCustomer.is_favorite || false
      });

      // setCustomerCategory(selectedCustomer.is_vip ? "VIP" : selectedCustomer.is_favorite ? "Favourite" : "Normal");
    }
  }, [selectedCustomer, openEditDialog]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerdts((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // const handleCategoryChange = (e) => {
  //   const value = e.target.value;
  //   setCustomerCategory(value);
  //   setCustomerdts((prevState) => ({
  //     ...prevState,
  //     is_vip: value === "VIP",
  //     is_favorite: value === "Favourite"
  //   }));
  // };


  const handleAddressChange = (index, field, value) => {
    // Update the addresses state with the modified field value
    const updatedAddresses = [...addresses];
    updatedAddresses[index][field] = value;
    setAddresses(updatedAddresses);

    // Check if there's any change compared to the original values
    const isChanged = isAnyFieldChanged(updatedAddresses, originalAddresses);
    setIsSaveEnabled(isChanged);
  };


  const isAnyFieldChanged = (updatedAddresses, originalAddresses) => {
    // Compare each address field to check if any value has changed
    return updatedAddresses.some((address, index) => {
      return Object.entries(address).some(([key, value]) => value !== originalAddresses[index][key]);
    });
  };
  console.log(updatedAddresses)



  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };
  const handleEditChange = (item) => {
    setOpenEditDialog(true)
    setSelectedCustomer(item)
    setCustomerNumber(item.mobile_number)
    
  };
  const canceledit = () => {
    setOpenEditDialog(false)
    setSelectedCustomer(null)
  };
  const handleEditadressChange = (item) => {
    setOpenadressDialog(true)
    setSelectedCustomer(item)
  };
  const canceleditadress = () => {
    setOpenadressDialog(false)
    setSelectedCustomer(null)
  };

  const handleDelete = (item) => {
    setOpenDeleteDialog(true);
    setSelectedCustomer(item)

  };

  const cancelDelete = () => {
    setOpenDeleteDialog(false);
    setSelectedCustomer(null)
  };

  // edit address
  const handleEditAddress = async (m_number, address, id) => {
    try {
      // Filter out fields that are null or empty strings
      const filteredAddress = Object.fromEntries(
        Object.entries(address).filter(([key, value]) => value !== null && value !== '')
      );
      const updatedAddress = {
        ...filteredAddress,  // Spread the filtered address fields
        address_id: id       // Add the address_id field with the given id
      };
      console.log('updated', updatedAddress)

      // Send the filtered address object in the API request
      const response = await EditAddressCustomers(m_number, updatedAddress);
      console.log(response);

      if (response.status === 200) {
        toast.success("address updated succesfully")
        canceleditadress()
        handleGetallCustomers()
      }
    } catch (error) {
      toast.error("Something went wrong at editing customer address")

      console.log(error);
      setSelectedCustomer(null)
    }
  };

  // edit customer details
  const handleEditdts = async (customerdts) => {
    try {
      // Filter out fields that are null or empty strings
      const filtereddts = Object.fromEntries(
        Object.entries(customerdts).filter(([key, value]) => value !== null && value !== '')
      );

      // Send the filtered address object in the API request
      const response = await EditCustomerdts(customerNumber, filtereddts);
      console.log(response);

      if (response.status === 200) {
        toast.success("customer details updated succesfully")
        canceledit()
        handleGetallCustomers()
        setCustomerNumber(null)
      }
    } catch (error) {
      toast.error("Something went wrong at editing customer details")

      console.log(error);
      setSelectedCustomer(null)
    }
  };

  // delete customers
  const handleDeleteCustomer = async () => {
    try {
      const response = await deleteCustomer(selectedCustomer.mobile_number)
      if (response.status === 204) {
        toast.success("customer deleted successfully")
        handleGetallCustomers()
        cancelDelete()
        
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong at deleting customers")
    }
  }

  const downloadExcelVip = () => {
    const vipCustomers = customers.filter(customer => customer.is_vip);
    const worksheetData = [
      ['Name', 'Email', 'Phone Number',],
      ...vipCustomers.map(customer => [customer.name, customer.email, customer.mobile_number])
      // Add more rows here
    ];

    // Create a new workbook and add the worksheet data
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vip customer report');

    // Trigger download
    XLSX.writeFile(workbook, 'VIP_Customers.xlsx');
  };
  const downloadExcelFavourite = () => {
    const vipCustomers = customers.filter(customer => customer.is_favorite);
    const worksheetData = [
      ['Name', 'Email', 'Phone Number',],
      ...vipCustomers.map(customer => [customer.name, customer.email, customer.mobile_number])
      // Add more rows here
    ];

    // Create a new workbook and add the worksheet data
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vip customer report');

    // Trigger download
    XLSX.writeFile(workbook, 'VIP_Customers.xlsx');
  };



  return (
    <Box sx={{ maxWidth: '100%', margin: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">View Customers</Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Filter</InputLabel>
          <Select value={customerCategory} onChange={(e) => setCustomerCategory(e.target.value)}>
            <MenuItem value="All">All</MenuItem>
            {/* <MenuItem value="Normal">Normal</MenuItem> */}
            <MenuItem value="VIP">VIP</MenuItem>
            <MenuItem value="Favourite">Favourite</MenuItem>
          </Select>
        </FormControl>
        <Grid item xs={3}>
                    <TextField
                        fullWidth
                        label="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Grid>
        <Box><Button variant="contained" sx={{ "marginRight": "10px" }} color="primary" onClick={downloadExcelVip}>
          Export VIP
        </Button>
          <Button variant="contained" color="primary" onClick={downloadExcelFavourite}>
            Export Favourite
          </Button></Box>

      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "lightblue" }}>
            <TableRow>
              <TableCell><b>SI Number</b></TableCell>
              <TableCell><b>Customer Id</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Name</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Mobile Number</b></TableCell>
              <TableCell><b>Address</b></TableCell>
              <TableCell><b>Customer Type</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedCustomer.length > 0 ? displayedCustomer.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.mobile_number}</TableCell>
                <TableCell onClick={() => handleEditadressChange(item)}><u style={{ color: "blue" }}>View</u> </TableCell>
                <TableCell>
                  {item.is_vip ? "VIP" : item.is_favorite ? "Favourite" : "Normal"}
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <IconButton color="primary" onClick={() => handleEditChange(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(item)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={7} align="center">No Customers</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
        <Button variant="contained" onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <Typography>{`Page ${currentPage} of ${totalPages}`}</Typography>
        <Button variant="contained" onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </Button>
      </Box>
      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this customer? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button color="secondary" onClick={handleDeleteCustomer}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Name"
            fullWidth
            variant="standard"
            value={customerdts.name}
            onChange={handleInputChange}

          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            fullWidth
            variant="standard"
            value={customerdts.email}
            onChange={handleInputChange}

          />
          <TextField
            margin="dense"
            name="mobile_number"
            label="Mobile Number"
            fullWidth
            variant="standard"
            value={customerdts.mobile_number}
            onChange={handleInputChange}

          />



<FormControl variant="standard" fullWidth className='mt-3'>
  <InputLabel id="demo-simple-select-label">Customer Type</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    value={
      customerdts.is_favorite ? "Favourite" :
      customerdts.is_vip ? "VIP" :
      "Normal"
    }
    onChange={handleCategoryChange}
  >
    <MenuItem value="Normal">Normal</MenuItem>
    <MenuItem value="VIP">VIP</MenuItem>
    <MenuItem value="Favourite">Favourite</MenuItem>
  </Select>
</FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={canceledit} >Cancel</Button>
          <Button onClick={() => handleEditdts(customerdts)} >Save</Button>
        </DialogActions>
      </Dialog>

      {/* edit address */}
      <Dialog open={openadressDialog} onClose={() => setOpenadressDialog(false)} maxWidth="md">
        <DialogTitle>Edit Address</DialogTitle>
        <DialogContent>
          <Box>

            {updatedAddresses.map((address, index) => (
              <div key={index}>
                <Typography variant="h6" sx={{ "textAlign": "center", "fontWeight": "10px" }}>{`Address ${index + 1}`}</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Email"
                      variant="outlined"
                      value={address.email || ''}
                      onChange={(e) => handleAddressChange(index, 'email', e.target.value)}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={4} > <TextField
                    fullWidth
                    label="Mobile number"
                    variant="outlined"
                    value={address.mobile_number || ''}
                    onChange={(e) => handleAddressChange(index, 'mobile_number', e.target.value)}
                    sx={{ mb: 2 }}
                  /></Grid>
                  <Grid item xs={4} ><TextField
                    fullWidth
                    label="Name"
                    variant="outlined"
                    value={address.name || ''}
                    onChange={(e) => handleAddressChange(index, 'name', e.target.value)}
                    sx={{ mb: 2 }}
                  /></Grid>
                  <Grid item xs={12} > <TextField
                    fullWidth
                    label="Address"
                    multiline
                    rows={2}
                    variant="outlined"
                    value={address.address || ''}
                    onChange={(e) => handleAddressChange(index, 'address', e.target.value)}
                    sx={{ mb: 2 }}
                  /></Grid>
                  <Grid item xs={4} > <TextField
                    fullWidth
                    label="Block"
                    variant="outlined"
                    value={address.block || ''}
                    onChange={(e) => handleAddressChange(index, 'block', e.target.value)}
                    sx={{ mb: 2 }}
                  /></Grid>
                  <Grid item xs={4} ><TextField
                    fullWidth
                    label="District"
                    variant="outlined"
                    value={address.district || ''}
                    onChange={(e) => handleAddressChange(index, 'district', e.target.value)}
                    sx={{ mb: 2 }}
                  /></Grid>
                  <Grid item xs={4} ><TextField
                    fullWidth
                    label="Country"
                    variant="outlined"
                    value={address.country || ''}
                    onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                    sx={{ mb: 2 }}
                  /></Grid>
                  <Grid item xs={4} >
                    <TextField
                      fullWidth
                      label="Post office"
                      variant="outlined"
                      value={address.post_office || ''}
                      onChange={(e) => handleAddressChange(index, 'post_office', e.target.value)}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={4} > <TextField
                    fullWidth
                    label="State"
                    variant="outlined"
                    value={address.state || ''}
                    onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                    sx={{ mb: 2 }}
                  /></Grid>
                  <Grid item xs={4} ><TextField
                    fullWidth
                    label="Pincode"
                    variant="outlined"
                    value={address.pincode || ''}

                    onChange={(e) => handleAddressChange(index, 'pincode', e.target.value)}
                    sx={{ mb: 2 }}
                  /></Grid>
                  <Grid item xs={3}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Default Address</FormLabel>
                      <RadioGroup
                        row
                        value={address.is_default ? 'true' : 'false'}
                        onChange={(e) => handleAddressChange(index, 'is_default', e.target.value === 'true')}
                      >
                        <FormControlLabel value="true" control={<Radio />} label="Yes" />
                        <FormControlLabel value="false" control={<Radio />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  <Grid item xs={3} ><FormControl component="fieldset">
                    <FormLabel component="legend">Home Address</FormLabel>
                    <RadioGroup
                      row
                      value={address.is_home === true ? 'true' : 'false'}
                      onChange={(e) => handleAddressChange(index, 'is_home', e.target.value === 'true')}
                    >
                      <FormControlLabel value="true" control={<Radio />} label="Yes" />
                      <FormControlLabel value="false" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl></Grid>
                  <Grid item xs={3} ><FormControl component="fieldset">
                    <FormLabel component="legend">Office Address</FormLabel>
                    <RadioGroup
                      row
                      value={address.is_office === true ? 'true' : 'false'}
                      onChange={(e) => handleAddressChange(index, 'is_office', e.target.value === 'true')}
                    >
                      <FormControlLabel value="true" control={<Radio />} label="Yes" />
                      <FormControlLabel value="false" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl></Grid>
                  <Grid item xs={3} > <FormControl component="fieldset">
                    <FormLabel component="legend">Other Address</FormLabel>
                    <RadioGroup
                      row
                      value={address.is_other === true ? 'true' : 'false'}
                      onChange={(e) => handleAddressChange(index, 'is_other', e.target.value === 'true')}
                    >
                      <FormControlLabel value="true" control={<Radio />} label="Yes" />
                      <FormControlLabel value="false" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl></Grid>

                </Grid>
                <Box sx={{ "display": "flex", "justifyContent": "center" }}><Button variant="contained"
                  color="primary" onClick={() => handleEditAddress(selectedCustomer.mobile_number, address, address.id)}  >Save</Button></Box>

              </div>
            ))}


          </Box>


        </DialogContent>
        <DialogActions>
          <Button onClick={canceleditadress} >Cancel</Button>
          {/* <Button onClick={()=>handleEditAddress(selectedCustomer.mobile_number)}  >Save</Button> */}
        </DialogActions>
      </Dialog>


      <ToastContainer />
    </Box>
  );
}

export default ViewCustomers;
