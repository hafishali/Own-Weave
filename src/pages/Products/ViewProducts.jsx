import React, { useEffect, useState, useMemo } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogActions, DialogContent, DialogTitle, Button, Select, CircularProgress,
  DialogContentText, FormControl, InputLabel, MenuItem,
  TextField, Modal
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EditProductModal from './EditProductModal';
import { viewAllproducts } from '../../services/allApi';
import axios from "axios";


function ViewProduct() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editProductData, setEditProductData] = useState({});
  const [error, setError] = useState(null); // For error handling
  const [count, setCount] = useState(0); // Add this state to store total count
  const [isInStock, setIsInStock] = useState(true);
  const [stockFilter, setStockFilter] = useState('all'); // New stock filter state
  const [searchQuery, setSearchQuery] = useState(''); // New search query state
  const [openFeatures, setOpenFeatures] = useState(false)


  const resultsPerPage = 10;

  const totalPages = Math.ceil(count / resultsPerPage);

  const handleGetallProducts = async () => {
    try {
      const response = await viewAllproducts()
      console.log(response)
      if (response.status === 200) {
        setProducts(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    handleGetallProducts()
  }, [])

  const startProductIndex = (currentPage - 1) * resultsPerPage + 1;
  const endProductIndex = Math.min(startProductIndex + resultsPerPage - 1, count);


  const handleOpenDeleteDialog = () => {

    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedProduct(null);
  };

  const handleOpenEditDialog = () => {

    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditProductData({});
  };

  const handleEditChange = (name, value) => {
    setEditProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };





  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleNextPage = async () => {
    if (nextPageUrl) {
      setLoading(true);

    }
  };

  const handlePrevPage = async () => {
    if (prevPageUrl) {
      setLoading(true);

    }
  };



  const handleStockFilterChange = (e) => {
    setStockFilter(e.target.value);
  };

  // if (loading && currentPage === 1) {
  //   return (
  //     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  return (
    <Box sx={{ maxWidth: '100%', margin: 'auto' }}>

      {/* Error Alert */}

      <Box mb={2}>
        <Typography variant="body1" color="error">

        </Typography>
      </Box>


      {/* Header and Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          <b>View Products</b>
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel>Filter Products</InputLabel>
            <Select label="Filter Products">
              <MenuItem value="all">All Products</MenuItem>
              <MenuItem value="offer">Offer Products</MenuItem>
              <MenuItem value="popular">Popular Products</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select label="Category">
              <MenuItem value="all">All Categories</MenuItem>

              <MenuItem >
                option
              </MenuItem>

            </Select>
          </FormControl>
          <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel>Stock Status</InputLabel>
            <Select label="Stock Status">
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="inStock">In Stock</MenuItem>
              <MenuItem value="outOfStock">Out of Stock</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          label="Search Products"
          variant="outlined"
          sx={{ flexGrow: 1, maxWidth: '300px' }}  // Limit width of search field
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by product name..."
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ minWidth: '100px' }}  // Set a minimum width for the button

        >
          Search
        </Button>
      </Box>


      {/* Products Table */}
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table>

          <TableHead sx={{ backgroundColor: "lightblue" }}>
            <TableRow>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>SI NO</b></TableCell>
              <TableCell><b>Image</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Product Name</b></TableCell>
              <TableCell><b>Category</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Sub Category</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Price (Length)</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Offer Price</b></TableCell>
              <TableCell><b>Discount</b></TableCell>
              {/* <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Stock</b></TableCell> */}
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Stock Status</b></TableCell>
              <TableCell><b>Features</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>


            <TableRow >
              <TableCell></TableCell>
              <TableCell>
                {/* <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: 50, height: 50, objectFit: 'cover' }}
                    loading="lazy"
                  /> */}
              </TableCell>
              <TableCell></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}></TableCell>
              <TableCell style={{ textAlign: 'center' }}>

              </TableCell>
              <TableCell style={{ textAlign: 'center' }}></TableCell>
              <TableCell></TableCell>
              {/* <TableCell>{product.quantity}</TableCell> */}
              <TableCell style={{ textAlign: 'center' }}>
                {/* Display Stock Status */}
              </TableCell>
              <TableCell sx={{ color: 'blue', textAlign: 'center', cursor: "pointer" }} onClick={() => setOpenFeatures(true)} >
                <u>View</u>
              </TableCell>

              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                <IconButton
                  onClick={() => handleOpenEditDialog()}
                  aria-label={`Edit `}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleOpenDeleteDialog()}
                  aria-label={`Delete `}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>

          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
        <Button
          variant="contained"
          onClick={handlePrevPage}
          disabled={prevPageUrl === null}
        >
          Previous
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
          <Typography sx={{ mr: 2 }}>
            {`Products ${startProductIndex} to ${endProductIndex} of ${count}`}
          </Typography>
          <Button
            variant="contained"
            onClick={handleNextPage}
            disabled={nextPageUrl === null}
          >
            Next
          </Button>
        </Box>
      </Box>


      {/* Edit Product Modal */}
      {openEditDialog && (
        <EditProductModal
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          product={editProductData}
          categories={categories}

        />
      )}
      {/* modal for view features */}
      <Modal open={openFeatures} onClose={() => setOpenFeatures(false)}>
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
            onClick={() => setOpenFeatures(false)}
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
              Product Features
            </Typography>
            <Typography>
              <b>description: </b>
            </Typography>
            <Typography>
              <b>Fabric:</b>
            </Typography>
            <Typography>
              <b>Pattern:</b>
            </Typography>
            <Typography>
              <b>Fabric Composition:</b>
            </Typography>
            <Typography>
              <b>Fit:</b>
            </Typography>
            <Typography>
              <b>style:</b>
            </Typography>
            <Typography>
              <b>state:</b>
            </Typography>
            <Typography>
              <b>Sleeve type</b>
            </Typography>




          </>

        </Box>
      </Modal>

      {/* Delete Product Confirmation Modal */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the product "{selectedProduct?.name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button color="secondary" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ViewProduct;
