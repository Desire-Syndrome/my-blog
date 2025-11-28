const BASE_URL = import.meta.env.VITE_BACKEND_URL;

import axios from 'axios';

import {
	ARTICLE_GET_ALL_REQ, ARTICLE_GET_ALL_SUCCESS, ARTICLE_GET_ALL_FAIL,
	ARTICLE_POST_REQ, ARTICLE_POST_SUCCESS, ARTICLE_POST_FAIL,
	ARTICLE_GET_REQ, ARTICLE_GET_SUCCESS, ARTICLE_GET_FAIL,
	ARTICLE_GET_BY_USER_REQ, ARTICLE_GET_BY_USER_SUCCESS, ARTICLE_GET_BY_USER_FAIL,
} from "../constants/articleConstants";


export const articlesGetAllAction = (page = 1, limit = 12, categories = [], title = "") => async (dispatch) => {
	try {
		dispatch({
			type: ARTICLE_GET_ALL_REQ
		});

		const params = new URLSearchParams();
		params.append("page", page);
		params.append("limit", limit);
		if (title) { params.append("title", title) };
		if (categories.length > 0) { params.append("categories", categories.join(",")) };

		const { data } = await axios.get(`${BASE_URL}/api/article/get-all?${params.toString()}`);
		dispatch({
			type: ARTICLE_GET_ALL_SUCCESS,
			payload: data
		});
	} catch (error) {
		dispatch({
			type: ARTICLE_GET_ALL_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message
		});
	}
};

export const articlePostAction = (articleData) => async (dispatch, getState) => {
	try {
		dispatch({
			type: ARTICLE_POST_REQ
		});

		const userInfo = getState().userLoginReducer.userInfo;
		if (!userInfo || !userInfo.token) {
			throw new Error("User not authenticated");
		}

		const config = {
			headers: { Authorization: `Bearer ${userInfo.token}` }
		}

		const [data] = await Promise.all([
			axios.post(`${BASE_URL}/api/article/post`, articleData, config).then(res => res.data),
			new Promise((resolve) => setTimeout(resolve, 1500))
		]);
		dispatch({
			type: ARTICLE_POST_SUCCESS,
			payload: data
		});
	} catch (error) {
		setTimeout(() => {
			dispatch({
				type: ARTICLE_POST_FAIL,
				payload: error.response && error.response.data.message ? error.response.data.message : error.message
			});
		}, 500);
	}
}

export const articleGetAction = (id) => async (dispatch) => {
	try {
		dispatch({
			type: ARTICLE_GET_REQ
		});

		const { data } = await axios.get(`${BASE_URL}/api/article/get-by-id/${id}`)
		dispatch({
			type: ARTICLE_GET_SUCCESS,
			payload: data
		});
	} catch (error) {
		dispatch({
			type: ARTICLE_GET_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message
		});
	}
}

export const articlesGetByUserAction = (id, page = 1, limit = 12) => async (dispatch) => {
	try {
		dispatch({
			type: ARTICLE_GET_BY_USER_REQ
		});

		const params = new URLSearchParams();
		params.append("page", page);
		params.append("limit", limit);

		const { data } = await axios.get(`${BASE_URL}/api/article/get-by-user/${id}?${params.toString()}`);
		dispatch({
			type: ARTICLE_GET_BY_USER_SUCCESS,
			payload: data
		});
	} catch (error) {
		dispatch({
			type: ARTICLE_GET_BY_USER_FAIL,
			payload: error.response && error.response.data.message ? error.response.data.message : error.message
		});
	}
};