import { combineReducers } from 'redux';
import NotificationReducer from './NotificationReducer';
import CityListReducer from './CityListReducer';

const reducer = combineReducers({
  NotificationReducer: NotificationReducer,
  CityListReducer: CityListReducer,
});

export default reducer;