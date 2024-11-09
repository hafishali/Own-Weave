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
// add category
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



// ------------------------------------------------------------------------------------------------------------------------

// products
// view products
export const viewAllproducts=async()=>{
    return await commonApi('GET', `${BASE_URL}product/products/`,"")
}