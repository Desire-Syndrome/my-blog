const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import { assetsImages } from '../../assets/images-data'
import { articlesCategories } from '../../assets/mock-data'

import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from "react-redux";
import { articleUpdateAction } from "../../redux/actions/articleActions"

import Quill from 'quill';


const UpdateArticle = () => {

	const navigate = useNavigate();

	const dispatch = useDispatch();
	const { loading: articleGetLoading, article } = useSelector((state) => state.articleGetReducer);
	const { loading: articleUpdateLoading, success: articleUpdateSuccess, error: articleUpdateError } = useSelector(state => state.articleUpdateReducer);
	const { userInfo } = useSelector((state) => state.userLoginReducer);

	const [category, setCategory] = useState(articlesCategories[0]);
	const [title, setTitle] = useState("");
	const [image, setImage] = useState(null);
	const [previewImage, setPreviewImage] = useState(null);
	const [shortText, setShortText] = useState("");

	const [hadShortText, setHadShortText] = useState(false);
	const [hadImage, setHadImage] = useState(false);

	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const editorRef = useRef(null);
	const quillRef = useRef(null);

	useEffect(() => {
		if (!articleGetLoading && editorRef.current && !quillRef.current) {
			quillRef.current = new Quill(editorRef.current, {
				theme: 'snow'
			});
			if (article?.fullText) {
				quillRef.current.root.innerHTML = article.fullText;
			}
		}
	}, [articleGetLoading, article]);


	useEffect(() => {
		if (article) {
			setHadShortText(!!article.shortText);
			setHadImage(!!article.image);

			setTitle(article.title || "");
			setShortText(article.shortText || "");
			setPreviewImage(article.image ? `${BASE_URL}${article.image}` : null);
			setCategory(article.category || articlesCategories[0]);
			if (quillRef.current && article?.fullText) {
				quillRef.current.root.innerHTML = article.fullText;
			}
		}
	}, [article]);


	useEffect(() => {
		if (articleUpdateSuccess) {
			setSuccessMessage("Article successfully updated!");
			setTimeout(() => {
				if (article._id) {
					navigate(`/article/${article._id}`);
					dispatch({ type: "ARTICLE_UPDATE_RESET" });
				}
			}, 2000);
		} else if (articleUpdateError) {
			setErrorMessage(articleUpdateError);
			setTimeout(() => {
				setErrorMessage("")
				dispatch({ type: "ARTICLE_UPDATE_RESET" });
			}, 3000);
		}
	}, [articleUpdateSuccess, articleUpdateError, navigate, dispatch, article]);

	const articleUpdateHandler = (event) => {
		event.preventDefault();
		const updatedData = new FormData();
		updatedData.append("category", category);
		updatedData.append("title", title);
		updatedData.append("shortText", shortText);
		updatedData.append("fullText", quillRef.current.root.innerHTML);
		if (image) {
			updatedData.append("articleImage", image);
		}
		dispatch(articleUpdateAction(article._id, updatedData));
	}


	const imageChange = (e) => {
		const file = e.target.files[0];
		setImage(file);
		setPreviewImage(URL.createObjectURL(file));
	};

	return (

		!articleGetLoading && (
			<form onSubmit={articleUpdateHandler} className='container py-8 flex flex-col w-full items-start gap-3'>
				<div className='w-full max-w-3xl'>
					{userInfo.isAdmin ? (<>
						<p className='mb-2'>Title</p>
						<input onChange={e => setTitle(e.target.value)} value={title} type="text" placeholder="" className='w-full max-w-3xl py-2 border-2 border-gray-300' required />
					</>) : (
						<p className='text-lg font-medium text-gray-800'>{title}</p>
					)}
				</div>
				<div className='max-w-3xl mt-3 w-full flex flex-col md:flex-row justify-between items-center'>
					{userInfo.isAdmin ? (
						<div className='w-full md:w-5/12 bg-sky-100 py-4 rounded-lg'>
							<label htmlFor="image">
								<img src={previewImage ? previewImage : assetsImages.upload_area2}
									alt="Upload image" className='w-30 h-20 md:w-36 md:h-24 ms-5 object-cover inline-block cursor-pointer border border-sky-300' />
								<input onChange={(e) => { imageChange(e) }} type="file" id='image' hidden />
								<p className='text-sm  md:text-base ms-3 px-2 py-2 cursor-pointer inline-block'>Change image</p>
							</label>
						</div>
					) : !hadImage ? (
						<div className='w-full md:w-5/12 bg-sky-100 py-4 rounded-lg'>
							<label htmlFor="image">
								<img src={previewImage ? previewImage : assetsImages.upload_area2}
									alt="Upload image" className='w-30 h-20 md:w-36 md:h-24 ms-5 object-cover inline-block cursor-pointer border border-sky-300' />
								<input onChange={(e) => { imageChange(e) }} type="file" id='image' hidden />
								<p className='text-sm  md:text-base ms-3 px-2 py-2 cursor-pointer inline-block'>Change image</p>
							</label>
						</div>
					) : (
						<div className='w-full md:w-5/12 bg-gray-200 py-4 rounded-lg'>
							<img src={previewImage} alt="Article image" className='w-52 h-28 mx-auto object-cover block border border-sky-300' />
						</div>
					)}
					<div className='w-full md:w-6/12 mt-8 md:mt-0'>
						{userInfo.isAdmin ? (<>
							<p className='mb-2'>Description</p>
							<textarea onChange={e => setShortText(e.target.value)} value={shortText} rows="3" type="text" placeholder="" className='w-full max-w-3xl py-2 border-2 border-gray-300' />
						</>) : !hadShortText ? (<>
							<p className='mb-2'>Description</p>
							<textarea onChange={e => setShortText(e.target.value)} value={shortText} rows="3" type="text" placeholder="" className='w-full max-w-3xl py-2 border-2 border-gray-300' />
						</>) : (
							<p>{shortText.slice(0, 150)}</p>
						)}
					</div>
				</div>
				<div className='max-w-3xl w-full'>
					<p className='my-2'>Change content</p>
					<div className='my-quil' ref={editorRef}></div>
				</div>
				<div className='flex gap-2 w-full max-w-3xl mt-4 items-center'>
					<p className='w-36'>Change category</p>
					<select onChange={e => setCategory(e.target.value)} value={category} className='x-3 py-2 border-2 border-gray-300'>
						{articlesCategories.map((category, i) => (
							<option value={category} key={i}>{category}</option>
						))}
					</select>
				</div>
				<div className='max-w-3xl w-full'>

					{errorMessage && (
						<div className="w-full mt-3 py-3 max-[500px]:text-xs text-sm lg:text-base text-center rounded-md bg-rose-100 border border-rose-400">
							{errorMessage}
						</div>
					)}
					{successMessage && (
						<div className="w-full mt-3 py-3 max-[500px]:text-xs text-sm lg:text-base text-center rounded-md bg-sky-100 border border-sky-400">
							{successMessage}
						</div>
					)}

				</div>
				<button disabled={articleUpdateLoading} type="submit" className="mt-4 bg-sky-600 rounded px-12 py-3 text-white hover:bg-sky-500 transition duration-300 ease-in-out">
					{articleUpdateLoading ? "Loading..." : "Update Article"}
				</button>
			</form>
		)

	)
}

export default UpdateArticle