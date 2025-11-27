import {
	ARTICLE_GET_ALL_REQ, ARTICLE_GET_ALL_SUCCESS, ARTICLE_GET_ALL_FAIL, ARTICLE_GET_ALL_RESET,
	ARTICLE_POST_REQ, ARTICLE_POST_SUCCESS, ARTICLE_POST_FAIL, ARTICLE_POST_RESET,
	ARTICLE_GET_REQ, ARTICLE_GET_SUCCESS, ARTICLE_GET_FAIL, ARTICLE_GET_RESET,
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