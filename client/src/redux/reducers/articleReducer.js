import {
	ARTICLE_GET_ALL_REQ, ARTICLE_GET_ALL_SUCCESS, ARTICLE_GET_ALL_FAIL, ARTICLE_GET_ALL_RESET,
	ARTICLE_GET_REQ, ARTICLE_GET_SUCCESS, ARTICLE_GET_FAIL, ARTICLE_GET_RESET,
	ARTICLE_GET_BY_USER_REQ, ARTICLE_GET_BY_USER_SUCCESS, ARTICLE_GET_BY_USER_FAIL, ARTICLE_GET_BY_USER_RESET,
	ARTICLE_POST_REQ, ARTICLE_POST_SUCCESS, ARTICLE_POST_FAIL, ARTICLE_POST_RESET,
	ARTICLE_UPDATE_REQ, ARTICLE_UPDATE_SUCCESS, ARTICLE_UPDATE_FAIL, ARTICLE_UPDATE_RESET,
	ARTICLE_DELETE_REQ, ARTICLE_DELETE_SUCCESS, ARTICLE_DELETE_FAIL, ARTICLE_DELETE_RESET
} from "../constants/articleConstants";


const initialArticleGetAllState = { articles: [], loading: false, error: null }

export const articlesGetAllReducer = (state = initialArticleGetAllState, action) => {
	switch (action.type) {
		case ARTICLE_GET_ALL_REQ:
			return { ...state, loading: true}
		case ARTICLE_GET_ALL_SUCCESS: 
			return { 
				loading: false, articles: action.payload.articles,
				page: action.payload.page, totalPages: action.payload.totalPages, totalArticles: action.payload.totalArticles
			 }
		case ARTICLE_GET_ALL_FAIL: 
			return { ...state, loading: false, error: action.payload }
		case ARTICLE_GET_ALL_RESET:
			return initialArticleGetAllState;
		default: return state
	}
}


export const articleGetReducer = (state = {}, action) => {
	switch (action.type) {
		case ARTICLE_GET_REQ:
			return { loading: true }
		case ARTICLE_GET_SUCCESS: 
			return { loading: false, article: action.payload.article }
		case ARTICLE_GET_FAIL: 
			return { loading: false, error: action.payload }
		case ARTICLE_GET_RESET:
			return {};
		default: return state
	}
}


const initialArticleGetByUserState = { articles: [], loading: false, error: null }

export const articlesGetByUserReducer = (state = initialArticleGetByUserState, action) => {
	switch (action.type) {
		case ARTICLE_GET_BY_USER_REQ:
			return { ...state, loading: true}
		case ARTICLE_GET_BY_USER_SUCCESS: 
			return { 
				loading: false, articles: action.payload.articles,
				page: action.payload.page, totalPages: action.payload.totalPages, totalArticles: action.payload.totalArticles
			 }
		case ARTICLE_GET_BY_USER_FAIL: 
			return { ...state, loading: false, error: action.payload }
		case ARTICLE_GET_BY_USER_RESET:
			return initialArticleGetByUserState;
		default: return state
	}
}


export const articlePostReducer = (state = {}, action) => {
	switch (action.type) {
		case ARTICLE_POST_REQ:
			return { loading: true }
		case ARTICLE_POST_SUCCESS: 
			return { loading: false, success: true, article: action.payload.article }
		case ARTICLE_POST_FAIL: 
			return { loading: false, error: action.payload }
			case ARTICLE_POST_RESET: 
			return {};
		default: return state
	}
}


export const articleDeleteReducer = (state = {}, action) => {
	switch (action.type) {
		case ARTICLE_DELETE_REQ:
			return { loading: true }
		case ARTICLE_DELETE_SUCCESS: 
			return { loading: false, success: true }
		case ARTICLE_DELETE_FAIL: 
			return { loading: false, error: action.payload }
			case ARTICLE_DELETE_RESET: 
			return {};
		default: return state
	}
}


export const articleUpdateReducer = (state = {}, action) => {
	switch (action.type) {
		case ARTICLE_UPDATE_REQ:
			return { loading: true }
		case ARTICLE_UPDATE_SUCCESS:
			return { loading: false, success: true }
		case ARTICLE_UPDATE_FAIL:
			return { loading: false, error: action.payload }
		case ARTICLE_UPDATE_RESET:
			return {};
		default: return state
	}
}