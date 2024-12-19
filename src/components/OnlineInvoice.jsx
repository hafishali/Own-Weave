import React from 'react'
import { Box, Typography, Grid, Paper } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import logos from '../assets/logo own weave 24-10 new main.png';
import qr from '../assets/WhatsApp Image 2024-11-25 at 14.18.09_acd59df3.jpg';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import Container from '@mui/material/Container';

const OnlineInvoice = React.forwardRef(({ orderDetails = [], logo }, ref) => {
  const getCurrentDateIST = () => {
    const date = new Date();
    const options = { timeZone: 'Asia/Kolkata' };
    const istDate = new Date(date.toLocaleString('en-US', options)); // Convert to IST
    return istDate;
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

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

  const itemCodes = orderDetails?.order_products
    ?.map(product => product?.product_details?.['product_code']) 
    .concat(
      orderDetails?.order_products
        ?.map(product => product?.free_product_details?.['product_code']) 
        .filter(code => code) 
    )
    .join(', ');

    const numberToWords = (num) => {
      const a = [
        '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
        'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen',
      ];
      const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
      const c = ['hundred', 'thousand', 'lakh', 'crore'];
    
      if (num === 0) return 'zero rupees only';
    
      const toWords = (n) => {
        if (n < 20) return a[n];
        if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
        if (n < 1000) return a[Math.floor(n / 100)] + ' ' + c[0] + (n % 100 !== 0 ? ' ' + toWords(n % 100) : '');
        if (n < 100000) return toWords(Math.floor(n / 1000)) + ' ' + c[1] + (n % 1000 !== 0 ? ' ' + toWords(n % 1000) : '');
        if (n < 10000000) return toWords(Math.floor(n / 100000)) + ' ' + c[2] + (n % 100000 !== 0 ? ' ' + toWords(n % 100000) : '');
        return toWords(Math.floor(n / 10000000)) + ' ' + c[3] + (n % 10000000 !== 0 ? ' ' + toWords(n % 10000000) : '');
      };
    
      // Split the number into integer and fractional parts
      const [integerPart, fractionalPart] = num.toString().split('.');
    
      let words = toWords(Number(integerPart)) + ' rupees';
    
      if (fractionalPart && Number(fractionalPart) > 0) {
        words += ' and ' + toWords(Number(fractionalPart)) + ' paise';
      }
    
      return words + ' only';
    };
  // const itemCodes = userObject.items
  //   ?.flatMap(item => [
  //     item.product_code,                     
  //     item.free_product?.product_code        
  //   ])
  //   .filter(code => code)                    
  //   .join(', ');                            


//  console.log(ordersArray)
  return (
    <Container maxWidth={false}  
    sx={{
      width: '100%',
      height: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 0,
      margin: 0,
    }}>
      {orderDetails.map((userObject, index) => {  
        const itemCodes = userObject?.order_products
        ?.map(product => product?.product_details?.['product_code']) 
        .filter(code => code) 
        .concat(
          orderDetails?.order_products
            ?.map(product => product?.free_product_details?.['product_code']) 
            .filter(code => code) 
        )
        .join(', ');                            
        return (
      <Paper
      ref={ref}
      elevation={0}
      sx={{
        width: '95%',       
        height: '95%',      
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
              <Typography variant="body1" fontWeight="bold" sx={{ mb: 0.5, fontSize: '0.9rem' }}>
                Shipping To:
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-line', fontSize: '1rem', lineHeight: 1.4 }}>
                {userObject?.name || 'NA'}
                {'\n'}
                Ph {userObject?.phone_number || 'NA'}
                {'\n'}
                {userObject?.address? formatAddress(userObject.address) : 'NA' }
                {'\n'}
                {/* {userObject.shipping_address?.post_office || 'NA'}
                {'\n'}
                {userObject.shipping_address?.pincode || 'NA'}
                {'\n'}
                {userObject.shipping_address?.district}, {userObject.shipping_address?.state} */}
                
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'right' }}>
              {/* Length */}
              {/* <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                  Size: {userObject.items?.[0]?.product?.name || 'NA'}
                </Typography> */}
              {/* COD */}
              <Typography variant="body1" sx={{ fontSize: '1.3rem' }}>
  {userObject.payment_method	 || 'NA'} Rs :{' '}
  <Box component="span" sx={{ fontSize: '2rem', fontWeight: 'bold', display: 'block' }}>
    {userObject.total_price || '0000'}
  </Box>
  <Box 
    component="span" 
    sx={{ 
      fontSize: '0.9rem', 
      fontWeight: 'bold', 
      textTransform: 'capitalize', 
      display: 'block', // Ensures the text starts on a new line
      marginTop: '0.5rem' // Optional: Adds some spacing between price and words
    }}
  >
    {userObject.total_price 
      ? numberToWords(Number(userObject.total_price)) 
      : 'zero rupees only'}
  </Box>
</Typography>
              {/* Order ID */}
              <Typography sx={{ fontSize: '1rem' }}>
                Order ID: {userObject.id || 'NA'}
              </Typography>
              
             {userObject?.payment_method==='COD' && <Typography sx={{ fontSize: '1rem' }}>
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
                      <a style={{textDecoration:"none",color:"black"}} href="https://www.facebook.com/profile.php?id=61554730378425">ownweave</a>
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <InstagramIcon sx={{ fontSize: 16 }} />
                    <Typography sx={{ fontSize: '0.8rem' }}>
                      <a style={{textDecoration:"none",color:"black"}} href="https://www.instagram.com/ownweave/"> @ownweave</a>
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              {/* Packing Details */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
                  <Typography sx={{ fontSize: '0.8rem' }}>
                    Packing Date: {formatDate(getCurrentDateIST())}
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
                        maxWidth: 150,
                        height: 'auto'
                      }}
                    />
                    <Typography sx={{ fontSize: '0.8rem',marginTop:'-28px' }}>
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
       );
      })}
    </Container>
  );
});

OnlineInvoice.displayName = 'OnlineInvoice';

export default OnlineInvoice;