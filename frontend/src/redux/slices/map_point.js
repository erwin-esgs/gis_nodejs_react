import { createSlice } from '@reduxjs/toolkit';
// import sum from 'lodash/sum';
// import uniqBy from 'lodash/uniqBy';
// utils
import axios from '../../utils/axios';
import { dispatch } from '../store';
import { setSession } from '../../utils/jwt';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  map_points: {
    type: 'FeatureCollection',
    features: [],
  },
  map_point: null,
};

const slice = createSlice({
  name: 'map_point',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET DATAS
    setDatas(state, action) {
      state.isLoading = false;
      state.map_points = action.payload;
    },

    // GET DATA
    setData(state, action) {
      state.isLoading = false;
      state.map_point = action.payload;
    },

  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  getCart,
  addCart,
  resetCart,
  onGotoStep,
  onBackStep,
  onNextStep,
  deleteCart,
  createBilling,
  applyShipping,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity,
  sortByProducts,
  filterProducts,
} = slice.actions;

// ----------------------------------------------------------------------

export function getAll(radius , longlat) {
  return async () => {
    try {
      dispatch(slice.actions.startLoading());
      const response = await axios.post('/query', {radius ,longlat});
      console.log(response?.data)
      if(response?.data?.data){
        dispatch(slice.actions.setDatas(response.data.data));
      }else{
        dispatch(slice.actions.hasError(response?.data));
      }
    } catch (error) {
      console.log(error)
      dispatch(slice.actions.hasError(error));
    }
  };
  // return async () => {
  //   console.log("asd")
  //   dispatch(slice.actions.startLoading());
  //   try {
  //     const response = await axios.post('/query' , {radius ,longlat});
  //     console.log(response?.data)
  //     if(response?.data?.data){
  //       dispatch(slice.actions.getDatas(response.data.data))
  //       // if(response.data.token){
  //       //   Promise.resolve().then( () => setSession(response.data.token) )
  //       //   .then( () => dispatch(slice.actions.getProductsSuccess(response.data.data)) )
  //       // }
  //     }
  //   } catch (error) {
  //     console.log(error)
  //     dispatch(slice.actions.hasError(error));
  //   }
  // };
}

// ----------------------------------------------------------------------

export function getDetail(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/license/${id}`);
      if(response.data){
        dispatch(slice.actions.setData(response.data.data))
        // if(response.data.token){
        //   Promise.resolve().then( () => setSession(response.data.token) )
        //   .then( () => dispatch(slice.actions.getProductSuccess(response.data.data)) )
        // }
      }
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function addData(data) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/license` , data);
      if(response.data){
        if(response.data.token){
          Promise.resolve().then( () => setSession(response.data.token) )
          .then( () => dispatch(getAll()) )
        }
      }
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function editData(id,data) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`/license/${id}` , data);
      if(response.data){
        if(response.data.token){
          Promise.resolve().then( () => setSession(response.data.token) )
          .then( () => dispatch(getAll()) )
        }
      }
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteData(data) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/license` , {id:data});
      if(response.data){
        if(response.data.token){
          Promise.resolve().then( () => setSession(response.data.token) )
          .then( () => dispatch(getAll()) )
        }
      }
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addOneData(data) {
  return async () => {
    dispatch(slice.actions.getProductSuccess(data));
  };
}