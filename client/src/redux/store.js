import { combineReducers, createStore, applyMiddleware } from "redux";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { thunk } from "redux-thunk";

const persistConfig = {
	key: 'root',
	storage
}


import {
userRegisterReducer, userLoginReducer, userUpdateReducer, userDeleteReducer,
userGetByIdReducer, userBanReducer, userUnbanReducer
} from "./reducers/userReducer";


const rootReducer = combineReducers({
userRegisterReducer, userLoginReducer, userUpdateReducer, userDeleteReducer,
userGetByIdReducer, userBanReducer, userUnbanReducer
});


const persistedReducer = persistReducer(persistConfig, rootReducer);
const middleware = [thunk];
export const store = createStore(persistedReducer, applyMiddleware(...middleware));

export let persistor = persistStore(store);