const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import { assetsImages } from '../../assets/images-data.js'

import { useEffect, useState } from "react";

import { Link, useSearchParams } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux";
import { articlesGetByUserAction } from "../../redux/actions/articleActions.js"


const MyArticles = () => {

	// url params
	const [searchParams, setSearchParams] = useSearchParams();

	// page pagination
	const initialPage = Number(searchParams.get("page")) || 1;
	const [currentPage, setCurrentPage] = useState(initialPage);
	const articlesPerPage = 12;

	// redux
	const dispatch = useDispatch();
	const articlesGetByUserReducer = useSelector((state) => state.articlesGetByUserReducer);
	const { loading: articlesLoading, error: articlesError, articles = [], totalPages, totalArticles } = articlesGetByUserReducer;

	const { userInfo } = useSelector((state) => state.userLoginReducer);


	useEffect(() => {
		if (userInfo) {
			dispatch({ type: "USER_APPLICATIONS_RESET" });
			dispatch(articlesGetByUserAction(userInfo._id, currentPage, articlesPerPage));
		}
	}, [dispatch, userInfo, currentPage, articlesPerPage]);


	// get params from url
	useEffect(() => {
		const pageFromUrl = Number(searchParams.get("page")) || 1;
		setCurrentPage(pageFromUrl);
	}, [searchParams]);

	// change url params
	useEffect(() => {
		const params = {};
		if (currentPage > 1) params.page = currentPage;
		setSearchParams(params);
	}, [currentPage, setSearchParams]);

	// switch pages
	const nextPage = () => {
		if (currentPage < totalPages) { setCurrentPage((prev) => prev + 1); }
	};
	const prevPage = () => {
		if (currentPage > 1) { setCurrentPage((prev) => prev - 1); }
	};


	return (

		<div className='container py-8 max-w-4xl'>

			{articles && !articlesLoading && (
				articles.map((article, i) => (
					<div key={i} className='flex items-center py-4 border-t border-sky-200 first-of-type:border-none'>
						<div className='w-2/12'>
							<img className='w-full h-20 object-cover' alt="Article Image" src={article.image ? `${BASE_URL}${article.image}` : assetsImages.no_image} />
						</div>
						<div className='w-6/12 px-4 text-center'>
							<Link to={`/article/${article._id}`} className='block text-sky-900 hover:text-sky-500 transition duration-300 ease-in-out' >
								{article.title.slice(0, 100)}
							</Link>
						</div>
						<div className="w-1/12 flex items-center justify-center">
							<img src={assetsImages.star} className='w-5 h-5' alt="Star" />
							<p className='ms-2 '>{Number(article.rating).toFixed(0)} / 5</p>
						</div>
						<div className='w-2/12 text-center'>
							<p>{article.category}</p>
						</div>
						<div className='w-1/12 relative inline-block text-left group'>
							<button className='text-gray-500 action-button text-lg'>•••</button>
							<div className='z-10 hidden absolute right-0 md:left-0 top-0 w-32 bg-white border border-gray-200 shadow rounded group-hover:block'>
								<button className='block w-full text-left px-4 py-2 text-sky-500 hover:bg-gray-200'>Update</button>
								<button className='block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-200'>Remove</button>
							</div>
						</div>
					</div>
				))
			)}

		</div>

	)
}

export default MyArticles