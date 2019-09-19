import * as actionTypes from '../utils/actionTypes';

const initialState = {
  isFetching: false,
  items: []
};

const CityListReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_CITIES_REQUEST:
      console.log()
      return {
        ...state,
        isFetching: true,
        items: [],
      };
    case actionTypes.GET_CITIES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: action.items,
      };
    case actionTypes.GET_CITIES_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export default CityListReducer;