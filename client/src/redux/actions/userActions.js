const BASE_URL = import.meta.env.VITE_BACKEND_URL;

import axios from 'axios';

import {
	USER_REGISTRATION_REQ, USER_REGISTRATION_SUCCESS, USER_REGISTRATION_FAIL, USER_REGISTRATION_RESET,
	USER_LOGIN_REQ, USER_LOGIN_SUCCESS, USER_LOGIN_FAIL, USER_LOGOUT,
	USER_UPDATE_REQ, USER_UPDATE_SUCCESS, USER_UPDATE_FAIL, USER_UPDATE_RESET,
	USER_DELETE_REQ, USER_DELETE_SUCCESS, USER_DELETE_FAIL, USER_DELETE_RESET,
	USER_GET_BY_ID_REQ, USER_GET_BY_ID_SUCCESS, USER_GET_BY_ID_FAIL, USER_GET_BY_ID_RESET,
	USER_BAN_REQ, USER_BAN_SUCCESS, USER_BAN_FAIL, USER_BAN_RESET,
	USER_UNBAN_REQ, USER_UNBAN_SUCCESS, USER_UNBAN_FAIL, USER_UNBAN_RESET
} from "../constants/UserConstants";


export const userRegisterAction = (name, email, password, avatar) => async (dispatch) => {

}


export const userLoginAction = (email, password) => async (dispatch) => {

}


export const userLogoutAction = () => async (dispatch) => {
	localStorage.removeItem("userInfo");

	dispatch({
		type: USER_LOGOUT
	});
	document.location.href = "/";
}


export const userUpdateAction = (updatedUser) => async (dispatch, getState) => {

}


export const userDeleteAction = () => async (dispatch, getState) => {

}


export const userGetByIdAction = (userId) => async (dispatch) => {

}


export const userBanAction = (userId, days) => async (dispatch) => {

}


export const userUnbanAction = (userId) => async (dispatch) => {

}