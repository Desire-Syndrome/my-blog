const BASE_URL = import.meta.env.VITE_BACKEND_URL;

import axios from 'axios';

import {
	ARTICLE_GET_ALL_REQ, ARTICLE_GET_ALL_SUCCESS, ARTICLE_GET_ALL_FAIL, ARTICLE_GET_ALL_RESET
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