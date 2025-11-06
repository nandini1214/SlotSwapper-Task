
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../redux/slices/authSlice"
import eventReducer from "../redux/slices/eventSlice"
import swapReducer from "../redux/slices/swapSlice"
const persistConfig = {
  key: "root",
  storage, 
  whitelist: ["auth",], 
};

const rootReducer = combineReducers({
  auth: authReducer,
  event: eventReducer,
  swap :swapReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// Define RootState and AppDispatch for types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
