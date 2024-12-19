import React from 'react';
import { Box, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider } from '@mui/material';
import logos from '../assets/logo own weave 24-10 new main.png';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import qr from '../assets/WhatsApp Image 2024-11-25 at 14.18.09_acd59df3.jpg';

const CustomInvoice = React.forwardRef(({ orderDetails = {}, logo }, ref) => {
  const getCurrentDateIST = () => {
    const date = new Date();
    const options = { timeZone: 'Asia/Kolkata' };
    const istDate = new Date(date.toLocaleString('en-US', options)); 
    return istDate;
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const discount = orderDetails.total_price - orderDetails.custom_total_price

  const formatAddress = (address) => {
    const addressParts = address.split(',');
    
    // Assuming address is split into different parts like this:
    // "AKP House", "thannerpanthal", "ayyapankaav", "karakurssi", "kerala", "986756"
  
    return (
      <>
        {addressParts[0] && <Typography sx={{ fontSize: '1rem', lineHeight: 1.4 }}>{addressParts[0]}</Typography>}
        {addressParts[1] && <Typography sx={{ fontSize: '1rem', lineHeight: 1.4 }}>{addressParts[1]}</Typography>}
        {addressParts[2] && <Typography sx={{ fontSize: '1rem', lineHeight: 1.4 }}>{addressParts[2]}</Typography>}
        {addressParts[3] && <Typography sx={{ fontSize: '1rem', lineHeight: 1.4 }}>{addressParts[3]}</Typography>}
        {addressParts[4] && <Typography sx={{ fontSize: '1rem', lineHeight: 1.4 }}>{addressParts[4]}</Typography>}
        {addressParts[5] && <Typography sx={{ fontSize: '1rem', lineHeight: 1.4 }}>{addressParts[5]}</Typography>}
      </>
    );
  };
  return (
    <Box sx={{ width: '85%', height: '100%', margin: 'auto', padding: 4, backgroundColor: '#f9f9f6', borderRadius: 2 }} ref={ref}>
      <Box sx={{ height: '100%' }}>
        <Grid container justifyContent="center" alignItems="center">
          {/* Logo and Manufacturer Info */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Box
              component="img"
              src={logos}
              alt="Own Weave"
              sx={{
                width: '100%',
                maxWidth: 150,
                height: 'auto',
              }}
            />
            <Typography sx={{ fontSize: '0.7rem', mt: -3.5 }}>
              Handloom Cloth Manufacturer
            </Typography>
          </Box>

          {/* Invoice Title */}
          
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "end", alignItems: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>INVOICE</Typography>
          </Box>

        {/* User and Invoice Details */}
        <Grid container justifyContent="end" mt={2}>
          {/* <Box>
            <Typography variant="subtitle1" fontWeight="bold">BILLED TO:</Typography>
            <Box>
              
              <Typography sx={{ fontSize: '1rem', lineHeight: 1.4 }}>
                {orderDetails?.name || 'NA'}
              </Typography>
              <Typography sx={{ fontSize: '1rem', lineHeight: 1.4 }}>
                Ph: {orderDetails?.mobile_number || 'NA'}
              </Typography>

             
              {orderDetails?.address && (
                <Box sx={{ marginTop: 2 }}>
                  
                  <Typography sx={{ fontSize: '1rem', lineHeight: 1.4 }}>
                    {formatAddress(orderDetails?.address)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box> */}
          <Box>
            <Typography variant="body1" fontWeight="bold">Invoice No.{orderDetails.id || 'NA'}</Typography>
            <Typography variant="body1">{formatDate(getCurrentDateIST())}</Typography>
          </Box>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Items Table */}
        <TableContainer component={Paper} elevation={0} sx={{ width: '100%' }}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell><Typography fontWeight="bold">Item</Typography></TableCell>
        <TableCell><Typography fontWeight="bold">Code</Typography></TableCell>
        <TableCell align="center"><Typography fontWeight="bold">Length</Typography></TableCell>
        <TableCell align="center"><Typography fontWeight="bold">Price</Typography></TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {/* Iterate through the order_products array */}
      {orderDetails?.order_products?.map((product, index) => (
        <React.Fragment key={index}>
          {/* Main Product Row */}
          <TableRow>
            <TableCell>{product.product_details?.name || `Product ${index + 1}`}</TableCell>
            <TableCell>{product.product_details?.product_code}</TableCell>
            <TableCell align="center">{product.custom_length}</TableCell>
            <TableCell align="center">₹{product.total_price || '-'}</TableCell>
          </TableRow>

          {/* Free Product Row (if free product details are available) */}
          {product.free_product_details && (
            <TableRow>
              <TableCell sx={{ color: '#4caf50' }}>
                {product.free_product_details?.name || 'Free Product'}
              </TableCell>
              <TableCell>{product.free_product_details?.product_code}</TableCell>
              <TableCell align="center">{product.custom_length}</TableCell>
              <TableCell align="center">₹0</TableCell> {/* Free product price assumed to be ₹0 */}
            </TableRow>
          )}
        </React.Fragment>
      ))}
    </TableBody>
  </Table>
</TableContainer>





        <Divider sx={{ my: 2 }} />

        {/* Totals Section */}
        <Grid container justifyContent="flex-end" spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body1" fontWeight="bold">Total Amount</Typography>
            <Typography variant="body1" fontWeight="bold">Discount</Typography>
            <Typography variant="h6" fontWeight="bold" mt={1}>Amount Payable</Typography>
          </Grid>
          <Grid item xs={3} textAlign="right">
            <Typography variant="body1"> ₹{orderDetails.total_price || '0000'}/-</Typography>
            <Typography variant="body1"> ₹{discount}</Typography>
            <Typography fontWeight="bold" mt={1}> ₹{orderDetails.custom_total_price || '0000'}/-</Typography>
          </Grid>
        </Grid>

        {/* Footer */}
        <Typography mt={4} textAlign="center" fontWeight="bold">THANK YOU FOR BEING AN AMAZING CUSTOMER!</Typography>

        <Divider sx={{ my: 2 }} />

        {/* Payment Information */}
        {/* <Typography variant="body2" fontWeight="bold">PAYMENT INFORMATION</Typography>
      <Typography variant="body2">Briard Bank</Typography>
      <Typography variant="body2">Account Name: Samira Hadid</Typography>
      <Typography variant="body2">Account No.: 123-456-7890</Typography>
      <Typography variant="body2">Pay by: 5 July 2025</Typography>

      <Typography mt={2} textAlign="right" fontWeight="bold">Samira Hadid</Typography>
      <Typography textAlign="right">123 Anywhere St., Any City, ST 12345</Typography> */}

        <Grid container alignItems="center" justifyContent="center" spacing={2}>
          {/* Social Media Icons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FacebookIcon sx={{ fontSize: 16 }} />
                <Typography sx={{ fontSize: '0.8rem', ml: 1 }}>
                  <a
                    style={{ textDecoration: 'none', color: 'black' }}
                    href="https://www.facebook.com/profile.php?id=61554730378425"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ownweave
                  </a>
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <InstagramIcon sx={{ fontSize: 16 }} />
                <Typography sx={{ fontSize: '0.8rem', ml: 1 }}>
                  <a
                    style={{ textDecoration: 'none', color: 'black' }}
                    href="https://www.instagram.com/ownweave/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @ownweave
                  </a>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2} alignItems="center">
          {/* QR Code 1 */}
          <Grid item xs={4} /* sx={{ textAlign: 'center' }} */>
            <Typography sx={{ fontSize: '0.7rem', mb: 0.5 }}>Scan to chat:</Typography>
            <Box
              component="img"
              src={qr}
              alt="Own Weave"
              sx={{
                width: '100%',
                maxWidth: 100,
                height: 'auto'
              }}
            />
          </Grid>

          {/* QR Code 2 */}
          <Grid item xs={4} sx={{ textAlign: 'center' }}>
            <Box sx={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <Box
                component="img"
                src={logos}
                alt="Own Weave"
                sx={{
                  width: '100%',
                  maxWidth: 150,
                  height: 'auto'
                }}
              />
              <Typography sx={{ fontSize: '0.7rem', mt: -2.5 }}>
                Handloom Cloth Manufactor
              </Typography>
            </Box>
          </Grid>

          {/* QR Code 3 */}
          <Grid item xs={4} sx={{
            pl: { sm: 1 },
            borderLeft: { sm: '1px solid #000' },
            minHeight: '100px'
          }}>
            <Box>
              {/* <Typography variant="body1" fontWeight="bold" sx={{ mb: 0.5, fontSize: '0.9rem' }}>
                From:
              </Typography> */}
              <Typography sx={{ whiteSpace: 'pre-line', fontSize: '0.8rem', lineHeight: 1.4 }}>
                <b>OWN WEAVE</b>
                {'\n'}
                KPKH Tower, New overbridge
                {'\n'}
                Tirur, Malappuram
                {'\n'}
                pin: 676101
                {'\n'}
                Mob: 9995 195 731
              </Typography>
            </Box>
          </Grid>
        </Grid>

      </Box>
      {/* Header Section */}



    </Box>
  );
});

CustomInvoice.displayName = 'CustomInvoice';

export default CustomInvoice;
