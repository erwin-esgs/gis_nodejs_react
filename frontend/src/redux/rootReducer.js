import { combineReducers } from 'redux';
// import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import licenseReducer from './slices/license';
import userReducer from './slices/user';
import mapPointReducer from './slices/map_point';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const rootReducer = combineReducers({
  license : licenseReducer,
  user : userReducer,
  map_point : mapPointReducer,
});

export { rootPersistConfig, rootReducer };
