const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import { assetsImages } from '../../assets/images-data.js'

import { useEffect, useState, useRef } from "react";

import { Link, useNavigate, useSearchParams } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux";
import { articlesGetByUserAction, articleDeleteAction, articleGetAction } from "../../redux/actions/articleActions.js"


const MyArticles = () => {

	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	const initialPage = Number(searchParams.get("page")) || 1;
	const [currentPage, setCurrentPage] = useState(initialPage);
	const articlesPerPage = 20;

	const dispatch = useDispatch();
	const { loading: articlesGetLoading, error: articlesGetError, articles = [], totalPages, totalArticles } = useSelector((state) => state.articlesGetByUserReducer);
	const { loading: articleDeleteLoading, success: articleDeleteSuccess, error: articleDeleteError } = useSelector((state) => state.articleDeleteReducer);
	const { userInfo } = useSelector((state) => state.userLoginReducer);

	const [modalVisible, setModalVisible] = useState(false);
	const [articleToDelete, setArticleToDelete] = useState(null);
	const [modalMessage, setModalMessage] = useState("");


	useEffect(() => {
		if (userInfo) {
			dispatch({ type: "ARTICLE_GET_BY_USER_RESET" });
			dispatch(articlesGetByUserAction(userInfo._id, currentPage, articlesPerPage));
		}
	}, [dispatch, userInfo, currentPage]);


	useEffect(() => {
		const pageFromUrl = Number(searchParams.get("page")) || 1;
		setCurrentPage(pageFromUrl);
	}, [searchParams]);

	const isFirstRender = useRef(true);
	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		const params = {};
		if (currentPage > 1) { params.page = currentPage; }
		const newParams = new URLSearchParams(params).toString();
		if (searchParams.toString() !== newParams) {
			setSearchParams(params, { replace: true });
		}
	}, [currentPage]);


	const nextPage = () => { 
		if (currentPage < totalPages) { setCurrentPage((prev) => prev + 1); } 
	};
	const prevPage = () => { 
		if (currentPage > 1) { setCurrentPage((prev) => prev - 1); } 
	};


	useEffect(() => {
		if (articleDeleteSuccess) {
			setModalMessage("Article has been successfully deleted!");
		} else if (articleDeleteError) {
			setModalMessage(articleDeleteError);
		}
	}, [dispatch, articleDeleteSuccess, articleDeleteError]);

	const articleDeleteHandler = () => {
		setModalMessage("Are you sure you want to delete this article?");
		setModalVisible(true);
	};

	const articleConfirmDeleteHandler = () => {
		dispatch(articleDeleteAction(articleToDelete));
	};

	const articleAfterDeleteHandler = () => {
		dispatch(articlesGetByUserAction(userInfo._id, currentPage, articlesPerPage));
		dispatch({ type: "ARTICLE_DELETE_RESET" });
		setModalVisible(false);
		setArticleToDelete(null);
	};


	const articleUpdateHandler = (articleId) => {
		dispatch(articleGetAction(articleId));
		navigate("/dashboard/update-article");
	};

	return (<>

		<section className='container py-8 max-w-4xl'>
			<h2 className='mb-2 font-medium  text-gray-800 text-base md:text-lg'>Published articles: {totalArticles ? totalArticles : "0"}</h2>
			{articles.length > 0 && !articlesGetLoading && (
				articles.map((article, i) => (
					<div key={i} className='flex items-center py-4 border-t border-sky-200 first-of-type:border-none'>
						<div className='w-2/12'>
							<img className='w-full h-12 md:h-16 lg:h-20 object-cover' alt="Article Image" src={article.image ? `${BASE_URL}${article.image}` : assetsImages.no_image} />
						</div>
						<div className='w-9/12 md:w-7/12 lg:w-6/12 px-2 lg:px-4 text-center'>
							<Link to={`/article/${article._id}`} className='block text-sky-900 hover:text-sky-500 transition duration-300 ease-in-out' >
								{article.title.slice(0, 100)}
							</Link>
						</div>
						<div className="hidden md:w-2/12 lg:w-1/12 md:flex items-center justify-center">
							<img src={assetsImages.star} className='w-5 h-5' alt="Star" />
							<p className='ms-2 '>{Number(article.rating).toFixed(0)} / 5</p>
						</div>
						<div className='hidden w-2/12 lg:block text-center'>
							<p>{article.category}</p>
						</div>
						<div className='w-1/12 relative inline-block text-left group'>
							<button className='text-gray-500 action-button text-lg'>•••</button>
							<div className='z-10 hidden absolute right-0 lg:left-0 top-0 w-24 lg:w-28 bg-white border border-gray-200 shadow rounded group-hover:block'>
								<button onClick={() => articleUpdateHandler(article._id)}
									className='block w-full text-left px-4 py-2 text-sky-500 hover:bg-gray-200'>Update</button>
								<button onClick={() => { articleDeleteHandler(); setArticleToDelete(article._id); }}
									className='block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-200'>Delete</button>
							</div>
						</div>
					</div>
				))
			)}

			{articlesGetError && (
				<p className="w-full mt-3 py-3 max-[500px]:text-xs text-sm lg:text-base text-center rounded-md bg-rose-100 border border-rose-300">{articlesGetError}</p>
			)}

			{totalPages > 1 &&
				<div className="flex flex-col items-center mt-6">
					<span className="mb-2">Page {currentPage} / {totalPages}</span>
					<div className="flex gap-2 text-md">
						<button onClick={prevPage} disabled={currentPage === 1}
							className="bg-sky-600 rounded-full px-4 py-1 text-white hover:bg-sky-500 transition duration-300 ease-in-out disabled:bg-gray-400 disabled:hover:bg-gray-400">Prev</button>
						<button onClick={nextPage} disabled={currentPage === totalPages}
							className="bg-sky-600 rounded-full px-4 py-1 text-white hover:bg-sky-500 transition duration-300 ease-in-out disabled:bg-gray-400 disabled:hover:bg-gray-400">Next</button>
					</div>
				</div>
			}
		</section>


		{modalVisible && (<>
			<div onClick={() => { dispatch({ type: "ARTICLE_DELETE_RESET" }); setModalVisible(false); }} className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
				<div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-lg w-full max-w-md">
					<div className="px-6 py-4 border-b border-gray-200"><h5 className="text-lg font-semibold text-sky-600">Confirmation</h5></div>
					<div className="px-6 py-4"><p className="text-gray-700">{modalMessage}</p></div>
					<div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">

						{!articleDeleteSuccess ? (<>
							<button onClick={() => { setModalVisible(false); dispatch({ type: "ARTICLE_DELETE_RESET" }); setArticleToDelete(null); }} disabled={articleDeleteLoading}
								type="button" className="text-sm font-medium px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 transition duration-300 ease-in-out">Cancel</button>
							<button onClick={articleConfirmDeleteHandler} disabled={articleDeleteLoading}
								type="button" className="text-white text-sm font-medium px-4 py-2 rounded bg-sky-600 hover:bg-sky-500 transition duration-300 ease-in-out">{!articleDeleteLoading ? "Yes, Delete" : "Loading..."}</button>
						</>) : (
							<button onClick={articleAfterDeleteHandler}
								type="button" className="text-white text-sm font-medium px-4 py-2 rounded bg-sky-600 hover:bg-sky-500 transition duration-300 ease-in-out">OK</button>
						)}

					</div>
				</div>
			</div>
		</>)
		}

	</>)
}

export default MyArticles