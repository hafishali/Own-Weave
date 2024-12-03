import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import logos from '../assets/logo own weave 24-10 new main.png';
import qr from '../assets/WhatsApp Image 2024-11-25 at 14.18.09_acd59df3.jpg';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import Container from '@mui/material/Container';

const BillComponent = React.forwardRef(({ orderDetails = {}, logo }, ref) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // const itemCodes = [
  //   orderDetails?.product_details["product code"],
  //   orderDetails?.free_product_details["product code"]
  // ].filter(code => code).join(', ');
  const formatAddress = (address) => {
    const addressParts = address.split(',');

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

  // Combine all available product codes
  const itemCodes = orderDetails?.order_products
    ?.map(product => product?.product_details?.['product_code']) // Extract product code from product_details
    .filter(code => code) // Remove null/undefined values
    .concat(
      orderDetails?.order_products
        ?.map(product => product?.free_product_details?.['product_code']) // Extract product code from free_product_details
        .filter(code => code) // Remove null/undefined values
    )
    .join(', '); // Combine all codes into a comma-separated string

  return (
   <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center', width: '70%', height: 'auto', margin: 'auto', padding: 4, }}>
     <Paper
        ref={ref}
        elevation={0}
        sx={{
          width: '70%',       
          height: 'auto',      
          padding: 2,
          border: '2px solid #000',
          borderRadius: '12px',
          position: 'relative',
          boxSizing: 'border-box',
          transform: 'scale(1)',
          transformOrigin: 'center',
        }}
      >
        <Grid container spacing={1}>
          {/* Shipping and COD Section */}
          <Grid item xs={8}>
            <Box>
              <Typography variant="body1" fontWeight="bold" sx={{ mb: 0.5, fontSize: '1.2rem' }}>
                Shipping To:
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-line', fontSize: '1rem', lineHeight: 1.4 }}>
                {orderDetails.name || 'NA'}
                {'\n'}
                Ph {orderDetails.phone_number || 'NA'}
                {'\n'}
                {orderDetails.address ? formatAddress(orderDetails.address) : 'NA'}
                {'\n'}


              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'right' }}>
              {/* Length */}
              {/* <Typography variant="body1" sx={{ fontSize: '1rem' }}>
              Length: {orderDetails.length || 'NA'}
            </Typography> */}
              {/* COD */}
              <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                {orderDetails.payment_method || 'COD'}: Rs -{' '}
                {/*  <Box component="span" sx={{ textDecoration: 'line-through', color: 'red', display: 'inline-block' }}>
                {orderDetails.total_price || '0000'}/-
              </Box> */}
                <br />
                Rs - {orderDetails.custom_total_price || '0000'}/-
              </Typography>
              {/* co.ID */}
              <Typography sx={{ fontSize: '1rem' }}>
                co.ID: {orderDetails.id || 'NA'}
              </Typography>
             {orderDetails.payment_method==='COD' && <Typography sx={{ fontSize: '1rem' }}>
                Post Code: 55220
              </Typography>}
            </Box>
          </Grid>

          {/* Horizontal Line */}
          <Grid item xs={12}>
            <Box
              sx={{
                borderTop: '1px solid #000',
                width: '100%',
                my: 1
              }}
            />
          </Grid>

          {/* Social Media and Packing Details Section */}
          <Grid item xs={12}>
            <Grid container alignItems="center" justifyContent="space-between" spacing={1}>
              {/* Social Media Icons */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FacebookIcon sx={{ fontSize: 16 }} />
                    <Typography sx={{ fontSize: '0.8rem' }}>
                      <a style={{ textDecoration: "none", color: "black" }} href="https://www.facebook.com/profile.php?id=61554730378425">ownweave</a>
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <InstagramIcon sx={{ fontSize: 16 }} />
                    <Typography sx={{ fontSize: '0.8rem' }}>
                      <a style={{ textDecoration: "none", color: "black" }} href="https://www.instagram.com/ownweave/"> @ownweave</a>
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              {/* Packing Details */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
                  <Typography sx={{ fontSize: '0.8rem' }}>
                    Packing Date: {orderDetails.created_at ? formatDate(orderDetails.created_at) : 'NA'}
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem' }}>
                    Item co: {itemCodes || 'NA'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Horizontal Line */}
          <Grid item xs={12}>
            <Box
              sx={{
                borderTop: '1px solid #000',
                width: '100%',
                my: 1
              }}
            />
          </Grid>

          {/* QR Code, Logo, and Company Info Section */}
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
            <Grid item xs={12} sm={3}>
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
            <Grid item xs={12} sm={9}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12} sm={6}>
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
                        maxWidth: 120,
                        height: 'auto'
                      }}
                    />
                    <Typography sx={{ fontSize: '0.7rem' }}>
                      Handloom Cloth Manufactor
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} sx={{
                  pl: { sm: 1 },
                  borderLeft: { sm: '1px solid #000' },
                  minHeight: '100px'
                }}>
                  <Box>
                    <Typography variant="body1" fontWeight="bold" sx={{ mb: 0.5, fontSize: '0.9rem' }}>
                      From:
                    </Typography>
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
            </Grid>
          </Grid>

          {/* Horizontal Line */}
          <Grid item xs={12}>
            <Box
              sx={{
                borderTop: '1px solid #000',
                width: '100%',
                my: 1
              }}
            />
          </Grid>

          {/* Thank You Message */}
          <Grid item xs={12}>
            <Typography
              align="center"
              fontWeight="bold"
              sx={{
                fontSize: '0.8rem'
              }}
            >
              THANK YOU FOR BEING AN AMAZING CUSTOMER
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                borderTop: '1px solid #000',
                width: '100%',
                my: 1
              }}
            />
          </Grid>
        </Grid>
      </Paper>
   </Box>
     
    
  );
});

BillComponent.displayName = 'BillComponent';

export default BillComponent;