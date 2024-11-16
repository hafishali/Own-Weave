import axios from "axios";
import { commonApi } from "./commonApi";
import { BASE_URL } from "./baseUrl";


// admin login
export const adminLogin = async (reqBody) => {
    return await commonApi('POST', `${BASE_URL}/accounts/admin-staff-login/`,reqBody,{})
}

// admin logout
export const adminLogout = async (reqBody) => {
    return await commonApi('POST', `${BASE_URL}accounts/logout/`,reqBody,null)
}

// refresh tokens
export const refreshAccessToken = async (reqBody) => {
    return await commonApi('POST', `${BASE_URL}api/token/refresh/`,reqBody,"")
}

// ------------------------------------------------------------------------------------------------------------------------

// offers
// add offer
export const createNewoffers=async(reqBody)=>{
    return await commonApi('POST', `${BASE_URL}product/offers/`,reqBody,null)
}
// get offers
export const getAlloffers=async()=>{
    return await commonApi('GET', `${BASE_URL}product/offers/`,"",null)
}
// edit offers
export const editOffer=async(id,reqBody)=>{
    return await commonApi('PATCH', `${BASE_URL}product/offers/${id}/`,reqBody,null)
}

// delete offers
export const deleteOffer=async(id)=>{
    return await commonApi('DELETE', `${BASE_URL}product/offers/${id}/`,"",null)
}

// ------------------------------------------------------------------------------------------------------------------------

// category
export const addCategories=async(reqBody,reqHeader)=>{
    return await commonApi('POST', `${BASE_URL}product/categories/`,reqBody,reqHeader)
}
// get all category
export const viewAllCategories=async()=>{
    return await commonApi('GET', `${BASE_URL}product/categories/`,"",null)
}
// edit category
export const editCategories=async(id,reqBody,reqHeader)=>{
    return await commonApi('PATCH', `${BASE_URL}product/categories/${id}/`,reqBody,reqHeader)
}
// delete category
export const deleteCategories=async(id)=>{
    return await commonApi('DELETE', `${BASE_URL}product/categories/${id}/`,"",null)
}

// add category sizes
export const addCategorysizes=async(reqBody,reqHeader)=>{
    return await commonApi('POST', `${BASE_URL}product/categorysizes/`,reqBody,reqHeader)
}



// ------------------------------------------------------------------------------------------------------------------------

// products
// view products
export const viewAllproducts=async()=>{
    return await commonApi('GET', `${BASE_URL}product/products/`,"")
}


export const addProduct=async(reqBody,reqHeader)=>{
    return await commonApi('POST', `${BASE_URL}product/products/`,reqBody,reqHeader)
}


export const editProduct=async(id,reqBody,reqHeader)=>{
    return await commonApi('PATCH', `${BASE_URL}product/products/${id}/`,reqBody,reqHeader)
}
  





// ------------------------------------------------------------------------------------------------------------------------
// orders
// get all orders
export const ViewallOrder=async()=>{
    return await commonApi('GET', `${BASE_URL}orders/`,"",null)
}
// edit orders

export const editOrder=async(id,reqBody)=>{
    return await commonApi('PATCH', `${BASE_URL}orders/orders/${id}/update/`,reqBody,null)
}


// view returns-------------------------------------------------------------------------------------------------------------
export const viewReturn=async()=>{
    return await commonApi('GET', `${BASE_URL}orders/orders/returns/`,"",null)
}




// -------------------------------------------------------------------------------------------------------------------------
// get all customers
export const ViewallCustomers=async()=>{
    return await commonApi('GET', `${BASE_URL}accounts/customers`,"",null)
}

// edit adress of the customer
export const EditAddressCustomers=async(id,reqBody)=>{
    return await commonApi('PATCH', `${BASE_URL}accounts/customers/${id}/update-address/`,reqBody,null)
}
// edit details of the customer
export const EditCustomerdts=async(id,reqBody)=>{
    return await commonApi('PATCH', `${BASE_URL}accounts/customers/${id}/`,reqBody,null)
}

// delete customers
export const deleteCustomer=async(id,)=>{
    return await commonApi('DELETE', `${BASE_URL}accounts/customers/${id}/`,"",null)
}

// ---------------------------------------------------------------------------------------------------------------------------
// get all payments
export const ViewallPayments=async()=>{
    return await commonApi('GET', `${BASE_URL}orders/orders/payment-details/`,"",null)
}



