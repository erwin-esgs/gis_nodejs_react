const axios = require('axios');

// ----------------------------------------------------------------------

const axiosElastic = axios.create({
  baseURL: process.env.ELASTICSEARCH_URL,
});

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
// );

module.exports = { 
    axiosElastic
}