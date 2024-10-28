import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Radio, RadioGroup, FormControlLabel, FormLabel, TextField
} from '@mui/material';


function Stocks() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); 
  const [expandedRows, setExpandedRows] = useState({}); 

  const resultsPerPage = 10;

  const startProductIndex = (currentPage - 1) * resultsPerPage + 1;
  const endProductIndex = Math.min(startProductIndex + resultsPerPage - 1, count);

 

  



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

  const toggleRowExpansion = (productId) => {
    setExpandedRows((prevExpandedRows) => ({
      ...prevExpandedRows,
      [productId]: !prevExpandedRows[productId]
    }));
  };

  

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          View Stocks
        </Typography>

        {/* Radio Buttons for filtering */}
        <Box>
          <FormLabel component="legend">Filter Products</FormLabel>
          <RadioGroup
            row
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1); // Reset to first page on filter change
            }}
          >
            <FormControlLabel value="all" control={<Radio />} label="All Products" />
            <FormControlLabel value="lowStock" control={<Radio />} label="Less than 10 Quantity" />
          </RadioGroup>
        </Box>
      </Box>

      {/* Search Field and Button */}
      <Box sx={{ display: 'flex', mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search Products"
          value={searchQuery}
         
          sx={{ mr: 1, flex: 1 }}
        />
        <Button variant="contained" >
          Search
        </Button>
      </Box>

      {/* Stocks Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "lightblue" }}>
            <TableRow>
              <TableCell><b>SI No</b></TableCell>
              <TableCell><b>Product</b></TableCell>
              <TableCell><b>Category Name</b></TableCell>
              <TableCell><b>Sub Category</b></TableCell>
              <TableCell><b>Quantity</b></TableCell>
              <TableCell><b>Weight Measurement</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            
              <TableRow >
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  <ul>
                   
                       
                     
                  </ul>
                 
                    <Button 
                    
                      size="small"
                     
                    >
                      
                    </Button>
                 
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
        <Button variant="contained" onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 2 }}>
            {`Products ${startProductIndex} to ${endProductIndex} of ${count}`}
          </Typography>
        </Box>
        <Button variant="contained" onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </Button>
      </Box>
    </Box>
  );
}

export default Stocks;
