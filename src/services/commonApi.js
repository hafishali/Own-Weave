import axios from "axios";
import { refreshAccessToken } from "./allApi";




const getAccessToken = () => localStorage.getItem('access');
const getRefreshToken = () => localStorage.getItem('refresh');

const setTokens = (accessToken, refreshToken) => {
    localStorage.setItem('access', accessToken);
    localStorage.setItem('refresh', refreshToken);
};
export const commonApi = async (httprequest, url, reqBody, reqHeader) => {
    const reqConfig = {
        method: httprequest,
        url,
        data: reqBody,
        ...(reqHeader && Object.keys(reqHeader).length === 0
        ? {} // Omit the headers key if reqHeader is an empty object
        : { headers: reqHeader ?? { 'Authorization': `Bearer ${getAccessToken()}` } }
    ),    };
    try {
    
        const result = await axios(reqConfig);
        return result;
    } catch (error) {
         if (error.response && error.response.status === 401) {
            try {
                const refresh_token = getRefreshToken();
                console.log("Refresh token used:", refresh_token);

                const refreshed = await refreshAccessToken({ refresh: refresh_token });

                if (refreshed && refreshed.data) {
                    const newAccessToken = refreshed.data.access;
                    const newRefreshToken = refreshed.data.refresh;
                    setTokens(newAccessToken, newRefreshToken); 
                    reqConfig.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return await axios(reqConfig); 
                } else {
                    console.log("Refresh token is invalid. Redirecting to login.");
                    // window.location.href = "/"; 
                }
            } catch (refreshError) {
                console.log("Error refreshing token:", refreshError);
                // window.location.href = "/"; 
                return refreshError;
            }
        } else {
            console.log("API request failed:", error);
            return error.response ? error.response : error;
        }
       
    
    }
};