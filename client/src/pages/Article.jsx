const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import { assetsImages } from '../assets/images-data'

import { useEffect, useState } from "react"
import { useParams, Link } from 'react-router-dom'

import { useDispatch, useSelector } from "react-redux";
import { articleGetAction } from "../redux/actions/articleActions"
import { userGetByIdAction } from "../redux/actions/userActions"

import Layouts from '../layouts/Layouts'


const Article = () => {

	const { id } = useParams();

	const dispatch = useDispatch();
	const { loading: articleGetLoading, error: articleGetError, article } = useSelector((state) => state.articleGetReducer);
	const { loading: userGetByIdLoading, success: userGetByIdSuccess, error: userGetByIdError, user: userById } = useSelector((state) => state.userGetByIdReducer);

	const [modalVisible, setModalVisible] = useState(false);

	const [errorMessage, setErrorMessage] = useState("");


	useEffect(() => {
		dispatch(articleGetAction(id))
	}, [dispatch, id]);


	const userGetByIdHandler = (userId) => {
		dispatch(userGetByIdAction(userId));
		setModalVisible(true);
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
						</div>
					</div>
				</div>
				<div className='w-full md:w-5/6 m-auto mt-12'>
					<h1 className='text-2xl md:text-3xl font-medium text-center text-gray-800'>{article.title}</h1>
					<div className='mt-8 rich-text'
						dangerouslySetInnerHTML={{ __html: article.fullText }}></div>
				</div>
			</div>

			{modalVisible && (<>
				<div onClick={() => { setModalVisible(false); dispatch({ type: "USER_GET_BY_ID_RESET" }); }} className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
					<div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-lg px-4 py-2 w-full max-w-md">

						{!userGetByIdLoading && userGetByIdSuccess ? (<>
							<div className="mt-4 md:mt-6 flex flex-col items-center text-center">
								<img src={article.author.image ? `${BASE_URL}${article.author.image}` : assetsImages.upload_area} className="w-24 h-24 object-cover rounded-full border border-sky-300" alt="User Avatar" />
								<span className="mt-2 text-black text-xl md:text-2xl font-medium">{article.author.name.length > 30 ? `${article.author.name.slice(0, 10)}...` : article.author.name}</span>
							</div>





						</>) : (
							<div className="my-3 rounded-md bg-rose-100 border border-rose-300 px-4 py-3 text-sm text-center">
								{userGetByIdError}
							</div>
						)}
						
					</div>
				</div>
			</>)}

		</>) : (
			<div className='mt-12 py-10 container px-4 2xl:px-20 mx-auto'>
				<p className='text-lg sm:text-xl font-medium  text-center text-neutral-700'>{articleGetError}</p>
			</div>
		)
		}

	</Layouts >)
}

export default Article