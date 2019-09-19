import * as actionTypes from '../utils/actionTypes';
import axios from 'axios' // API取得用


// Notification操作
export const setNotification = (variant, message) => ({
  type: actionTypes.SET_NOTIFICATION,
  variant: variant,
  message: message,
});
export const closeNotification = (variant, message) => ({
  type: actionTypes.CLOSE_NOTIFICATION,
});

// 非同期取得操作
export const getCities = (cityname) => {
  return (dispatch) => {
    dispatch(getCitiesRequest());
    
    return axios.get('https://andruxnet-world-cities-v1.p.rapidapi.com/?query=' + cityname + '&searchby=city')
      .header("X-RapidAPI-Host", "andruxnet-world-cities-v1.p.rapidapi.com")
      .header("X-RapidAPI-Key", "141148c05bmsh56483f1c5c1eee0p167e29jsnec0c282db804")
      .then(response => dispatch(getCitiesSuccess(response.data)))
      .catch(error => dispatch(getCitiesFailure(error)))
  };
};

export const getCitiesRequest = () => ({
  type: actionTypes.GET_CITIES_REQUEST,
});

export const getCitiesSuccess = (json) => ({
  type: actionTypes.GET_CITIES_SUCCESS,
  items: json,
});

export const getCitiesFailure = (error) => ({
  type: actionTypes.GET_CITIES_FAILURE,
  error: error,
});