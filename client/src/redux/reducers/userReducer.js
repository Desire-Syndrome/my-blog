import {
	USER_REGISTRATION_REQ, USER_REGISTRATION_SUCCESS, USER_REGISTRATION_FAIL, USER_REGISTRATION_RESET,
	USER_LOGIN_REQ, USER_LOGIN_SUCCESS, USER_LOGIN_FAIL, USER_LOGOUT,
	USER_UPDATE_REQ, USER_UPDATE_SUCCESS, USER_UPDATE_FAIL, USER_UPDATE_RESET,
	USER_DELETE_REQ, USER_DELETE_SUCCESS, USER_DELETE_FAIL, USER_DELETE_RESET,
	USER_GET_BY_ID_REQ, USER_GET_BY_ID_SUCCESS, USER_GET_BY_ID_FAIL, USER_GET_BY_ID_RESET,
	USER_BAN_REQ, USER_BAN_SUCCESS, USER_BAN_FAIL, USER_BAN_RESET,
	USER_UNBAN_REQ, USER_UNBAN_SUCCESS, USER_UNBAN_FAIL, USER_UNBAN_RESET
} from "../constants/UserConstants";


export const userRegisterReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_REGISTRATION_REQ:
			return { loading: true }
		case USER_REGISTRATION_SUCCESS:
			return { loading: false, userInfo: action.payload, success: true }
		case USER_REGISTRATION_FAIL:
			return { loading: false, error: action.payload }
		case USER_REGISTRATION_RESET:
			return {};
		default: return state
	}
}

export const userLoginReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_LOGIN_REQ:
			return { loading: true }
		case USER_LOGIN_SUCCESS:
			return { loading: false, userInfo: action.payload, success: true }
		case USER_LOGIN_FAIL:
			return { loading: false, error: action.payload }
		case USER_LOGOUT:
			return {}
		default: return state
	}
}

export const userUpdateReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_UPDATE_REQ:
			return { loading: true }
		case USER_UPDATE_SUCCESS:
			return { loading: false, success: true }
		case USER_UPDATE_FAIL:
			return { loading: false, error: action.payload }
		case USER_UPDATE_RESET:
			return {};
		default: return state
	}
}


export const userDeleteReducer = (state = {}, action) => {
	switch (action.type) {
		case USER_DELETE_REQ:
			return { loading: true };
		case USER_DELETE_SUCCESS:
			return { loading: false, success: true };
		case USER_DELETE_FAIL:
			return { loading: false, error: action.payload };
		case USER_DELETE_RESET:
			return {};
		default: return state;
	}
}


const userGetByIdInitialState = { userInfo: {} };

export const userGetByIdReducer = (state = userGetByIdInitialState, action) => {
	switch (action.type) {
		case USER_GET_BY_ID_REQ:
			return { loading: true}
		case USER_GET_BY_ID_SUCCESS:  
			return { loading: false, userInfo: action.payload }
		case USER_GET_BY_ID_FAIL: 
			return { loading: false, error: action.payload }
		case USER_GET_BY_ID_RESET:
			return { userInfo: {} };
		default: return state
	}
}


export const userBanReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_BAN_REQ:
      return { loading: true };
    case USER_BAN_SUCCESS:
      return { loading: false, success: true, message: action.payload };
    case USER_BAN_FAIL:
      return { loading: false, error: action.payload };
    case USER_BAN_RESET:
      return {};
    default: return state;
  }
};


export const userUnbanReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UNBAN_REQ:
      return { loading: true };
    case USER_UNBAN_SUCCESS:
      return { loading: false, success: true, message: action.payload };
    case USER_UNBAN_FAIL:
      return { loading: false, error: action.payload };
    case USER_UNBAN_RESET:
      return {};
    default: return state;
  }
};