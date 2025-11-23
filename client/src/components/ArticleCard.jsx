const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import { assetsImages } from '../assets/images-data'

import { useNavigate } from 'react-router-dom';

import { useSelector } from "react-redux";


const ArticleCard = ({ article }) => {

	const navigate = useNavigate();
 
	const { userInfo } = useSelector((state) => state.userLoginReducer);

	
	return (

		 <p>Article</p>
		
	)
}

export default ArticleCard