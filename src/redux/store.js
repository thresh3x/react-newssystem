import { combineReducers, configureStore } from '@reduxjs/toolkit';
import collapseSlice from './reducers/CollapseSlice';
import loadingSlice from './reducers/LoadingSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
  blacklist:['loading']
}

const reducer = combineReducers({
  loading: loadingSlice,
  collapsed: collapseSlice,
})

const myPersistReducer = persistReducer(persistConfig, reducer)

export const store = configureStore({
  reducer: myPersistReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false, // 忽略非序列化的 action，以便与 redux-persist 兼容
  }),
});
export const persistor = persistStore(store)
