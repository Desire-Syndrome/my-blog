import {
	ARTICLE_GET_ALL_REQ, ARTICLE_GET_ALL_SUCCESS, ARTICLE_GET_ALL_FAIL, ARTICLE_GET_ALL_RESET
} from "../constants/articleConstants";


const initialArticleGetAllState = { articles: [], loading: false, error: null }

export const articlesGetAllReducer = (state = initialArticleGetAllState, action) => {
	switch (action.type) {
		case ARTICLE_GET_ALL_REQ:
			return { ...state, loading: true}
		case ARTICLE_GET_ALL_SUCCESS: 
			return { 
				loading: false, articles: action.payload.articles,
				page: action.payload.page, totalPages: action.payload.totalPages 
			 }
		case ARTICLE_GET_ALL_FAIL: 
			return { ...state, loading: false, error: action.payload }
		case ARTICLE_GET_ALL_RESET:
			return initialArticleGetAllState;
		default: return state
	}
}