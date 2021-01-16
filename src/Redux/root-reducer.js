import { combineReducers } from 'redux';

import playerTableReducer from './PlayerTable/PlayerTable.reducer';
import userReducer from './User/User.reducer';

export default combineReducers({
  route: "signin",
  playerTable: playerTableReducer,
  user: userReducer
})