import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
  Button, CircularProgress,Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {  DeleteSubadmin,  getSubadmins } from '../../services/allApi';
import { toast,ToastContainer } from 'react-toastify';


function ViewSubAdmin() {
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const [selectedSubAdmin, setSelectedSubAdmin] = useState(null);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [count, setCount] = useState(0); // Track total sub-admin count
  const resultsPerPage = 10;

  const startSubAdminIndex = (currentPage - 1) * resultsPerPage + 1;
  const endSubAdminIndex = Math.min(startSubAdminIndex + resultsPerPage - 1, count);





 

 

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleGetsubadmins=async()=>{
    try {
      const response=await getSubadmins()
      if(response.status===200){
        setSubAdmins(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    handleGetsubadmins()
  },[])

  const handleDelete=(item)=>{
    setOpenDialog(true);
    setSelectedSubAdmin(item)
  }
  const handleConfirmDelete=async()=>{
   
    try {
      const response=await DeleteSubadmin(selectedSubAdmin.mobile_number)
      if(response.status===204){
        toast.success("subadmin has been deleted successfully")
        handleGetsubadmins()
        setSelectedSubAdmin(null)
        cancelDelete()
      }
    } catch (error) {
      console.log(error)
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message); // Display backend error message
      } else {
        // Fallback error message for unexpected cases
        toast.error("Something went wrong ");
      }
    }
   
  }
    const cancelDelete = () => {
      setOpenDialog(false);
      setSelectedSubAdmin(null);
    };
  

  // if (loading) {
  //   return (
  //     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  //       <CircularProgress />
  //     </Box>
  //   );
  // }
console.log(subAdmins)
  return (
    <Box sx={{ maxWidth: '100%', margin: 'auto' }}>
      {/* Error Alert */}
      
        <Box mb={2}>
          <Typography variant="body1" color="error">
            
          </Typography>
        </Box>
      

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          <b>View Sub Admins</b>
        </Typography>
      </Box>

      {/* Sub Admins Table */}
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead sx={{backgroundColor:"lightblue"}}>
            <TableRow>
              <TableCell><b>SI NO</b></TableCell>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Phone Number</b></TableCell>
              <TableCell><b>Permissions</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {subAdmins && subAdmins.length > 0 ? (
  subAdmins
    .filter((item) => item.is_staff)  // Filter only items with is_staff: true
    .map((item, index) => (
      <TableRow key={index}>
        <TableCell>{index + 1}</TableCell>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.email}</TableCell>
        <TableCell>{item.mobile_number}</TableCell>
        <TableCell>
  <ul style={{ margin: 0, padding: "0 16px" }}>
    {item.permissions && item.permissions.length > 0
      ? item.permissions.map((permission, idx) => (
          <li key={idx} style={{ listStyleType: "disc" }}>{permission}</li>
        ))
      : <li>No permissions assigned</li>
    }
  </ul>
</TableCell>

        <TableCell>
          {/* <IconButton onClick={() => handleOpenEditDialog(true)} aria-label={`Edit `}>
            <EditIcon />
          </IconButton> */}
          <IconButton aria-label="Delete" color="secondary" onClick={() => handleDelete(item)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    ))
) : (
  <TableRow>
    <TableCell colSpan={5} align="center">No sub-admins</TableCell>
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
            {`Showing ${startSubAdminIndex} to ${endSubAdminIndex} of ${count}`}
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
      {/* delete Sub Admin Modal */}
      <Dialog open={openDialog} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this category? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button  color="secondary" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>


<ToastContainer/>
    </Box>
  );
}

export default ViewSubAdmin;
