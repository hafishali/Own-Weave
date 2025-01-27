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
import { deleteProduct, viewAllproducts } from '../../services/allApi';

function ViewProduct() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
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
  const [isInStock, setIsInStock] = useState(true);
  const [stockFilter, setStockFilter] = useState('all'); // New stock filter state
  const [openFeatures, setOpenFeatures] = useState(false)
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStock, setFilterStock] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [imageOpen, setImageOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

 
  const handleGetallProducts = async () => {
    try {
      const response = await viewAllproducts();
      console.log(response); // Check response data in the console
      if (response.status === 200) {
        const sortedProducts = response.data.sort((a, b) => new Date(b.created_at	) - new Date(a.created_at));
        setProducts(sortedProducts); // Set products data
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenDeleteDialog = (product) => {
    setSelectedProduct(product);
    setOpenDeleteDialog(true);
  };

  // Close delete dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedProduct(null);
  };

  // Handle delete action
  const handleDelete = async () => {
    if (selectedProduct) {
      try {
        await deleteProduct(selectedProduct.id); // Assuming the API expects an ID
        setProducts(products.filter((p) => p.id !== selectedProduct.id));
        handleCloseDeleteDialog();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };
  useEffect(() => {
    handleGetallProducts()
  }, [])
  const handleEditChange = (name, value) => {
    setEditProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleOpenFeatures = (product) => {
    setSelectedProduct(product);  // Set the selected product data
    setOpenFeatures(true);        // Open the modal
  };
  const reqHeader = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_token_here',
  };

  const handleCloseFeatures = () => {
    setOpenFeatures(false);
    setSelectedProduct(null);
  };
  const handleEditProduct = (selectedProduct) => {
    setProducts(selectedProduct); // Set the selected product data
    setOpen(true); // Open the modal
  };
  const handleOpenEditDialog = (product) => {
    setEditProductData(product); // Set the selected product to the modal data
    setOpenEditDialog(true); // Open the modal
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false); // Close the modal
  };

  // Function to handle closing the modal
  const onClose = () => {
    setOpen(false); // Close the modal
  };
  
  const filteredProducts = products
  .filter((product) => {
    // Filter by category
    if (filterCategory !== "all" && product.category_name !== filterCategory) {
      return false;
    }
    // Filter by stock status
    if (
      filterStock !== "all" &&
      ((filterStock === "inStock" && product.stock_length <= 0) ||
        (filterStock === "outOfStock" && product.stock_length > 0))
    ) {
      return false;
    }
    // Filter by type (e.g., offers or popular)
    if (filterType === "offer" && !product.offer) {
      return false;
    }
    if (filterType === "popular" && !product.isPopular) {
      return false;
    }
    return true;
  })
  .filter((product) => {
    // Search by product name or product code
    return (
      product.product_code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  // if (loading && currentPage === 1) {
  //   return (
  //     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  //       <CircularProgress />
  //     </Box>
  //   );
  // }
  useEffect(() => {
    const timeout = setTimeout(() => {
        // Implement search logic here
    }, 500);
    return () => clearTimeout(timeout);
}, [searchQuery]);
const itemsPerPage = 10;
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

const count = filteredProducts.length; // Total number of items after filtering
const totalPages = Math.ceil(count / itemsPerPage); // Calculate the total number of pages

const startCustomerIndex = indexOfFirstItem + 1;  // Starting item index
const endCustomerIndex = Math.min(indexOfLastItem, count);  // Ending item index // Ending item index

// Function to handle the 'Previous' button click
const handlePrevPage = () => {
  setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));  // Ensure page is not less than 1
};

// Function to handle the 'Next' button click
const handleNextPage = () => {
  setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));  // Ensure page does not exceed totalPages
};


const handleImageClick = (imageUrl) => {
  setSelectedImage(imageUrl);
  setImageOpen(true);
};

const handleClose = () => {
  setImageOpen(false);
};
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
          <Select
            label="Filter Products"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="all">All Products</MenuItem>
            <MenuItem value="offer">Offer Products</MenuItem>
            <MenuItem value="popular">Popular Products</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {Array.from(new Set(products.map((p) => p.category_name))).map(
              (category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel>Stock Status</InputLabel>
          <Select
            label="Stock Status"
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="inStock">In Stock</MenuItem>
            <MenuItem value="outOfStock">Out of Stock</MenuItem>
          </Select>
        </FormControl>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Search Products"
          variant="outlined"
          sx={{ flexGrow: 1, maxWidth: "300px" }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by product code"
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ minWidth: "100px" }}
          onClick={() => console.log("Search clicked")}
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
        <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Product code</b></TableCell>

        <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Product Name</b></TableCell>
        <TableCell><b>Category</b></TableCell>
        {/* <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Sub Category</b></TableCell> */}
        <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Wholesale Price</b></TableCell>
        <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Price (Length)</b></TableCell>
        <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Offer Price</b></TableCell>
        <TableCell><b>Offer Type</b></TableCell>
        <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Stock Status</b></TableCell>
        <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Stock length</b></TableCell>
        <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>width</b></TableCell>
        <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>gsm</b></TableCell>
        {/* <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>size</b></TableCell> */}


        <TableCell><b>Features</b></TableCell>
        <TableCell><b>Actions</b></TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
    {currentItems.map((product, index) =>  (
        <TableRow key={product.id}>
          <TableCell style={{ textAlign: 'center' }}>{startCustomerIndex + index}</TableCell>
          
          {/* Display single image */}
          <TableCell>
        <img
          src={product.images[0]?.image || 'placeholder-image.jpg'}
          alt={product.name}
          style={{ width: 50, height: 50, objectFit: 'cover', cursor: 'pointer' }}
          loading="lazy"
          onClick={() => handleImageClick(product.images[0]?.image || 'placeholder-image.jpg')}
        />
      </TableCell>
          <TableCell style={{ textAlign: 'center' }}>{product.product_code}</TableCell>

          <TableCell style={{ textAlign: 'center' }}>{product.name}</TableCell>
          <TableCell>{product.category_name}</TableCell>
          {/* <TableCell style={{ textAlign: 'center' }}>{product.sub_category_name || 'N/A'}</TableCell> */}
          <TableCell style={{ textAlign: 'center' }}>{product.wholesale_price_per_meter}</TableCell>

          <TableCell style={{ textAlign: 'center' }}>{product.price_per_meter}</TableCell>

         
          <TableCell style={{ textAlign: 'center' }}>{product.offer_price_per_meter || 'N/A'}</TableCell>
          
          {/* Display offer name as discount if available */}
          <TableCell>{product.offer?.name || 'No Offer'}</TableCell>

          <TableCell style={{ textAlign: 'center' }}>{product.stock_length >= 1.5 ? 'In Stock' : 'Out of Stock'}</TableCell>
          <TableCell style={{ textAlign: 'center',color: product.stock_length < 10 ? 'red' : 'inherit' }}>{product.stock_length || 'N/A'}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>{product.width || 'N/A'}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>{product.gsm || 'N/A'}</TableCell>
          {/* <TableCell style={{ textAlign: 'center' }}>{product.size || 'N/A'}</TableCell> */}

          <TableCell 
  sx={{ color: 'blue', textAlign: 'center', cursor: "pointer" }} 
  onClick={() => handleOpenFeatures(product)}  // Pass the product to the function
>
  <u>View</u>
</TableCell>


          <TableCell style={{ textAlign: 'center' }}>
          <IconButton onClick={() => handleOpenEditDialog(product)} aria-label="Edit">
  <EditIcon />
</IconButton>

            <IconButton onClick={() => handleOpenDeleteDialog(product)} aria-label="Delete">
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
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



      {/* Edit Product Modal */}
      {openEditDialog && (
  <EditProductModal
    open={openEditDialog}             
    onClose={handleCloseEditDialog}     
    product={editProductData}          
    categories={categories}            
    reqHeader={reqHeader}  
    allProducts={handleGetallProducts}             
  />
)}

      {/* modal for view features */}
      <Modal open={openFeatures} onClose={handleCloseFeatures}>
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
      maxHeight: '80vh',
      overflowY: 'auto',
    }}
  >
    <IconButton
      aria-label="close"
      onClick={handleCloseFeatures}
      sx={{
        position: 'absolute',
        right: 8,
        top: 8,
        color: 'grey.500',
      }}
    >
      <CloseIcon />
    </IconButton>

    {selectedProduct && (
      <>
        <Typography sx={{ display: "flex", justifyContent: "center" }} variant="h6" gutterBottom>
          Product Features
        </Typography>
        {/* <Typography><b>Description:</b> {selectedProduct.description || 'N/A'}</Typography> */}
        <Typography><b>Fabric:</b> {selectedProduct.fabric || 'N/A'}</Typography>
        <Typography><b>Pattern:</b> {selectedProduct.pattern || 'N/A'}</Typography>
        <Typography><b>Fabric Composition:</b> {selectedProduct.fabric_composition || 'N/A'}</Typography>
        <Typography><b>Fit:</b> {selectedProduct.fit || 'N/A'}</Typography>
        <Typography><b>Style:</b> {selectedProduct.style || 'N/A'}</Typography>
        {/* <Typography><b>Size L full length:</b> {selectedProduct.available_lengths.size_L_full_length || 'N/A'}</Typography>
        <Typography><b>Size L half length:</b> {selectedProduct.available_lengths.size_L_half_length || 'N/A'}</Typography> */}
      {selectedProduct?.available_lengths?.length > 0 ? (
  selectedProduct?.available_lengths.map((item) => (
    <div key={item.id}> {/* Assuming each item has a unique id */}
      <Typography><b>Size XL full length:</b> {item.size_XL_full_length || 'N/A'}</Typography>
      <Typography><b>Size XL half length:</b> {item.size_XL_half_length || 'N/A'}</Typography>
      <Typography><b>Size XXL full length:</b> {item.size_XXL_full_length || 'N/A'}</Typography>
      <Typography><b>Size XXL half length:</b> {item.size_XXL_half_length || 'N/A'}</Typography>
      <Typography><b>Size XXXL full length:</b> {item.size_XXXL_full_length || 'N/A'}</Typography>
      <Typography><b>Size XXXL half length:</b> {item.size_XXXL_half_length || 'N/A'}</Typography>
    </div>
  ))
) : (
  <Typography>no sizes</Typography>
)}

        

        {/* <Typography><b>State:</b> {selectedProduct.state || 'N/A'}</Typography>
        <Typography><b>Sleeve Type:</b> {selectedProduct.sleeve_type || 'N/A'}</Typography> */}

      </>
    )}
  </Box>
</Modal>


      {/* Delete Product Confirmation Modal */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the product "
            {selectedProduct?.name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDeleteDialog}
            color="primary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="secondary"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog for Enlarged Image */}
      <Dialog open={imageOpen} onClose={handleClose} maxWidth="md">
        <DialogContent>
          <Box display="flex" justifyContent="center">
            <img
              src={selectedImage}
              
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default ViewProduct;
