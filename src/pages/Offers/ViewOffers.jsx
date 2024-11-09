import React, { useEffect, useState } from 'react'
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  DialogContentText, Select, InputLabel, FormControl, MenuItem,Radio,FormControlLabel,RadioGroup,FormLabel
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast, ToastContainer } from 'react-toastify';
import { createNewoffers, deleteOffer, editOffer, getAlloffers } from '../../services/allApi';
import 'react-toastify/dist/ReactToastify.css';

function ViewOffers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedoffer, setSelectedoffer] = useState(null)
  const [addOffers, setAddOffers] = useState({
    name: "",
    offer_type: "",
    discount_value: "",
    is_active: true
  })
 
  const [alloffers, setAlloffers] = useState([])
  const ITEMS_PER_PAGE = 10;

  const viewallOffers = async () => {
    try {
      const response = await getAlloffers()
      console.log(response)
      if (response.status === 200) {
        setAlloffers(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    viewallOffers()
  }, [])
  useEffect(() => {
    setTotalPages(Math.ceil(alloffers.length / ITEMS_PER_PAGE));
  }, [alloffers]);
  const paginatedOffers = alloffers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Determine the start and end indices for display
  const startCustomerIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endCustomerIndex = Math.min(currentPage * ITEMS_PER_PAGE, alloffers.length);
  const count = alloffers.length;

  // add offer
  const handleAddoffer = async () => {
    try {
      const { name, offer_type } = addOffers
      if (!name || !offer_type) {
        toast.error("name and offer type are mandatory fields")

      } else {
        const response = await createNewoffers(addOffers)
        console.log(response)
        if (response.status === 201) {
          setAddOffers({
            name: "",
            offer_type: "",
            discount_value: "",
            is_active: true
          })
          toast.success(" offer added successfully ")
          setOpenAddDialog(false)
          viewallOffers()

        }
      }
    } catch (error) {
      toast.error("Something went Wrong")
      console.log(error)
    }
    finally{
      setAddOffers({
        name: "",
        offer_type: "",
        discount_value: "",
        is_active: true
      })
    }
  }
  const handlecloseadd = () => {
    setOpenAddDialog(false)
  }


  // edit offer
  const handleEditChange = (item) => {
    setAddOffers(item); 
    setSelectedoffer(item);
    setOpenEditDialog(true);
  };

  // Handle offer update
  const handleEditoffer = async () => {
    try {
      const response = await editOffer(selectedoffer.id, addOffers);
      if (response.status === 200) {
        toast.success("Offer has been edited successfully");
        setAddOffers({
          name: "",
          offer_type: "",
          discount_value: "",
          is_active: true
        });
        setOpenEditDialog(false);
        viewallOffers();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while editing the offer");
    }
  };

  const handleCloseEdit=()=>{
    setOpenEditDialog(false)
    
  }


  // delete offer
  const handleDelete = (id) => {
    setOpenDeleteDialog(true);
    setSelectedoffer(id)
  };
  const handleConfirmDelete = async () => {
    try {
      const response = await deleteOffer(selectedoffer)
      if (response.status === 204) {
        toast.success('product deleted successfully')
        setOpenDeleteDialog(false)
        viewallOffers()
      }
    } catch (error) {
      console.log(error)
      toast.error('something went wrong at deleting product')
    }
    finally {
      setSelectedoffer('')
    }
  }

  const cancelDelete = () => {
    setOpenDeleteDialog(false);
  };
  console.log(addOffers)



  return (
    <div>
      <Box sx={{ maxWidth: '100%', margin: 'auto', p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            View Offers
          </Typography>

          {/* Filter Dropdown on Right Side */}
          <Button variant="contained" sx={{ marginTop: '10px' }} color="success" onClick={() => setOpenAddDialog(true)} >
            Add offers
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "lightblue" }}>
              <TableRow>
                <TableCell><b>SI Number</b></TableCell>
                <TableCell><b>Offer Name</b></TableCell>
                <TableCell><b>Offer Type</b></TableCell>
                <TableCell><b>Discount Value</b></TableCell>
                <TableCell><b>Offer Status</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedOffers.length > 0 ? (
                paginatedOffers.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.offer_type}</TableCell>
                    <TableCell>{item.discount_value}</TableCell>
                    <TableCell>{item.is_active === true ? 'valid' : 'invalid'}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEditChange(item)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="secondary" onClick={() => handleDelete(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">No offers</TableCell>
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

          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
            <Typography sx={{ mr: 2 }}>
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
        </Box>

        {/* add offer dialog */}
        <Dialog
          open={openAddDialog}
          onClose={() => setOpenAddDialog(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            Add Offer
          </DialogTitle>

          <DialogContent>
            <TextField
              label="Offer Name"
              fullWidth
              variant="outlined"
              sx={{ marginTop: "10px" }}
              placeholder="Enter  offer Name"

              onChange={(e) => setAddOffers({ ...addOffers, name: e.target.value })}
            />
           <FormControl fullWidth>
              <InputLabel>Select Offer</InputLabel>
              <Select
                label="Select offer"
                required
                value={addOffers.offer_type}
                onChange={(e) => setAddOffers({ ...addOffers, offer_type: e.target.value })}
                sx={{marginTop:'10px'}}
              >
                <MenuItem value="BOGO">
                  BOGO
                </MenuItem>
                <MenuItem value="PERCENTAGE">
                  PERCENTAGE
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Discount Value "
              fullWidth
              variant="outlined"
              sx={{ marginTop: "10px" }}
              placeholder="Enter  Discount Value"

              onChange={(e) => setAddOffers({ ...addOffers, discount_value: e.target.value })}
            />

            
       
        

          </DialogContent>

          <DialogActions>
            <Button onClick={handlecloseadd} color="primary">
              Close
            </Button>
            <Button onClick={handleAddoffer} >
              Add
            </Button>
          </DialogActions>
        </Dialog>

        {/*edit offer dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseEdit} fullWidth maxWidth="sm">
          <DialogTitle>Edit Offer</DialogTitle>
          <DialogContent>
            <TextField
              label="Offer Name"
              fullWidth
              variant="outlined"
              sx={{ marginTop: "10px" }}
              value={addOffers.name}
              onChange={(e) => setAddOffers({ ...addOffers, name: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Select Offer Type</InputLabel>
              <Select
                label="Select Offer Type"
                value={addOffers.offer_type}
                onChange={(e) => setAddOffers({ ...addOffers, offer_type: e.target.value })}
                sx={{ marginTop: '10px' }}
              >
                <MenuItem value="BOGO">BOGO</MenuItem>
                <MenuItem value="PERCENTAGE">PERCENTAGE</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Discount Value"
              fullWidth
              variant="outlined"
              sx={{ marginTop: "10px" }}
              value={addOffers.discount_value}
              onChange={(e) => setAddOffers({ ...addOffers, discount_value: e.target.value })}
            />
            <FormControl component="fieldset" sx={{ marginTop: '10px' }}>
              <FormLabel component="legend">Is Active</FormLabel>
              <RadioGroup
                row
                value={addOffers.is_active}
                onChange={(e) => setAddOffers({ ...addOffers, is_active: e.target.value === 'true' })}
              >
                <FormControlLabel value={true} control={<Radio />} label="Yes" />
                <FormControlLabel value={false} control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEdit} color="primary">Close</Button>
            <Button onClick={handleEditoffer} color="primary">Edit</Button>
          </DialogActions>
        </Dialog>





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
            <Button color="secondary" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>




        {/* Send Notification Dialog */}

      </Box>
      <ToastContainer />
    </div>
  )
}

export default ViewOffers
