const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import { assetsImages } from '../assets/images-data'

import { useEffect, useState } from "react"
import { useParams, useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from "react-redux";
import { articleGetAction, articlesGetByUserAction, articleDeleteAction } from "../redux/actions/articleActions"
import { userGetByIdAction } from "../redux/actions/userActions"

import Layouts from '../layouts/Layouts'
import PopupUserInfo from '../components/PopupUserInfo'
import PopupDelete from "../components/PopupDelete";


const Article = () => {

	const { id } = useParams();
	const navigate = useNavigate();

	const dispatch = useDispatch();
	const { loading: articleGetLoading, error: articleGetError, article } = useSelector((state) => state.articleGetReducer);
	const { loading: articleDeleteLoading, success: articleDeleteSuccess, error: articleDeleteError } = useSelector((state) => state.articleDeleteReducer);
	const { success: userGetByIdSuccess, error: userGetByIdError, user: userById } = useSelector((state) => state.userGetByIdReducer);
	const { loading: articlesGetByUserLoading, error: articlesGetByUserError, articles = [], totalPages } = useSelector((state) => state.articlesGetByUserReducer);
	const { userInfo } = useSelector((state) => state.userLoginReducer);

	const [selectedUserId, setSelectedUserId] = useState(null);

	const [modalUserInfoVisible, setModalUserInfoVisible] = useState(false);

	const [articleToDelete, setArticleToDelete] = useState(null);

	const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
	const [modalConfirmMessage, setModalConfirmMessage] = useState("");

	const [currentPage, setCurrentPage] = useState(1);
	const articlesPerPage = 5;


	useEffect(() => {
		dispatch(articleGetAction(id))
	}, [dispatch, id]);


	useEffect(() => {
		if (modalUserInfoVisible && selectedUserId) {
			dispatch(articlesGetByUserAction(selectedUserId, currentPage, articlesPerPage));
		}
	}, [modalUserInfoVisible, selectedUserId, currentPage, dispatch]);

	const userGetByIdHandler = (userId) => {
		setCurrentPage(1);
		setSelectedUserId(userId);
		dispatch(userGetByIdAction(userId));
		setModalUserInfoVisible(true);
	};

	const closeModal = () => {
		setModalUserInfoVisible(false);
		dispatch({ type: "USER_GET_BY_ID_RESET" });
		dispatch({ type: "ARTICLE_GET_BY_USER_RESET" });
	}


	useEffect(() => {
		if (articleDeleteSuccess) {
			setModalConfirmMessage("Article has been successfully deleted!");
		} else if (articleDeleteError) {
			setModalConfirmMessage(articleDeleteError);
		}
	}, [dispatch, articleDeleteSuccess, articleDeleteError]);

	const articleDeleteHandler = () => {
		setModalConfirmMessage("Are you sure you want to delete this article?");
		setModalConfirmVisible(true);
	};

	const articleConfirmDeleteHandler = () => {
		dispatch(articleDeleteAction(articleToDelete));
	};

	const articleAfterDeleteHandler = () => {
		dispatch({ type: "ARTICLE_DELETE_RESET" });
		setModalConfirmVisible(false);
		setArticleToDelete(null);
		navigate('/');
	};


	const articleUpdateHandler = (articleId) => {
		dispatch(articleGetAction(articleId));
		navigate("/dashboard/update-article");
	};


	const nextPage = () => {
		if (currentPage < totalPages) { setCurrentPage((prev) => prev + 1); }
	};
	const prevPage = () => {
		if (currentPage > 1) { setCurrentPage((prev) => prev - 1); }
	};

	return (<Layouts>

		{article && !articleGetLoading ? (<>
			<div className='container px-4 2xl:px-20 mx-auto'>
				<div className='mt-16 py-6 px-4 md:px-0 w-full bg-sky-100 rounded-lg'>
					<div className='w-full md:w-5/6 mx-auto flex flex-col md:flex-row justify-between items-center'>
						<div className='md:w-3/5'>
							{article.image ? (
								<div className="mt-2">
									<img src={`${BASE_URL}${article.image}`} className="h-72 w-full object-cover" alt="Article image" />
								</div>
							) : (
								<div className="mt-2">
									<img src={assetsImages.no_image} className="h-72 w-full object-cover" alt="Article image" />
								</div>
							)}
						</div>
						<div className='mt-8 md:mt-0 md:w-2/5 md:ms-4 text-center'>
							<p className="text-lg text-gray-500">Category: <span className='text-black'>{article.category}</span></p>
							<div className='inline-flex items-center gap-1 mt-3 md:mt-4'>
								<p className='text-lg text-gray-500 me-2'>Author:</p>
								{article.author ? (
									<div onClick={() => userGetByIdHandler(article.author._id)} className="inline-flex items-center gap-2 cursor-pointer hover:opacity-90 transition duration-300 ease-in-out">
										<img src={article.author.image ? `${BASE_URL}${article.author.image}` : assetsImages.upload_area} className="w-8 h-8 object-cover rounded-full border border-sky-300" alt="User Avatar" />
										<span className="text-black text-lg font-medium">{article.author.name.length > 10 ? `${article.author.name.slice(0, 10)}...` : article.author.name}</span>
									</div>
								) : (
									<div className="inline-flex items-center gap-2">
										<img src={assetsImages.upload_area} className="w-8 h-8 object-cover rounded-full border border-sky-300" alt="User Avatar" />
										<span className="text-black text-lg font-medium">Author unknown</span>
									</div>
								)}
							</div>
							<p className="mt-3 md:mt-4 text-lg text-gray-500">Date: <span className='text-black'>{new Date(article.createdAt).toLocaleDateString("en-GB")}</span></p>
							{userInfo?.isAdmin && (
								<div className='mt-5 flex justify-center gap-2'>
									<button onClick={() => articleUpdateHandler(article._id)}
										className='bg-sky-600 rounded px-4 py-2 text-white hover:bg-sky-500 transition duration-300 ease-in-out'>Update</button>
									<button onClick={() => { articleDeleteHandler(); setArticleToDelete(article._id); }}
										className='bg-rose-600 rounded px-4 py-2 text-white hover:bg-rose-500 transition duration-300 ease-in-out'>Delete</button>
								</div>
							)}
						</div>
					</div>
				</div>
				<div className='w-full md:w-5/6 m-auto mt-12'>
					<h1 className='text-2xl md:text-3xl font-medium text-center text-gray-800'>{article.title}</h1>
					<div className='mt-8 rich-text'
						dangerouslySetInnerHTML={{ __html: article.fullText }}></div>
				</div>
			</div>

			<PopupUserInfo modalVisible={modalUserInfoVisible} userById={userById} userGetByIdSuccess={userGetByIdSuccess} userGetByIdError={userGetByIdError} articles={articles} articlesGetByUserError={articlesGetByUserError} articlesGetByUserLoading={articlesGetByUserLoading} currentPage={currentPage} totalPages={totalPages}
				closeModal={closeModal} nextPage={nextPage} prevPage={prevPage} />

			<PopupDelete modalVisible={modalConfirmVisible} modalMessage={modalConfirmMessage} deleteSuccess={articleDeleteSuccess} deleteLoading={articleDeleteLoading}
			onCancel={() => {
				setModalConfirmVisible(false);
				dispatch({ type: "ARTICLE_DELETE_RESET" });
				setArticleToDelete(null);
			}}
			onConfirm={() => {
				if (!articleDeleteSuccess) { articleConfirmDeleteHandler(); }
				else { articleAfterDeleteHandler(); }
			}}
		/>

		</>) : (
			<div className='mt-12 py-10 container px-4 2xl:px-20 mx-auto'>
				<p className='text-lg sm:text-xl font-medium  text-center text-neutral-700'>{articleGetError}</p>
			</div>
		)
		}

	</Layouts >)
}

export default Article