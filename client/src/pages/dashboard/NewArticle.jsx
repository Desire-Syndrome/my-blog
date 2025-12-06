import { assetsImages } from '../../assets/images-data'
import { articlesCategories } from '../../assets/mock-data'

import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from "react-redux";
import { articlePostAction } from "../../redux/actions/articleActions"

import Quill from 'quill';


const NewArticle = () => {

	const navigate = useNavigate();

	const dispatch = useDispatch();
	const { loading: articlePostLoading, success: articlePostSuccess, error: articlePostError, article } = useSelector(state => state.articlePostReducer);

	const [category, setCategory] = useState(articlesCategories[0]);
	const [title, setTitle] = useState("");
	const [image, setImage] = useState(null);
	const [previewImage, setPreviewImage] = useState(null);
	const [shortText, setShortText] = useState("");

	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const editorRef = useRef(null);
	const quillRef = useRef(null);

	useEffect(() => {
		if (!quillRef.current && editorRef.current) {
			quillRef.current = new Quill(editorRef.current, {
				theme: 'snow'
			})
		}
	}, [])


	useEffect(() => {
		if (articlePostSuccess) {
			setCategory(articlesCategories[0]);
			setTitle("");
			setImage(null);
			setPreviewImage(null);
			setShortText("");
			quillRef.current.setContents([]);
			setSuccessMessage("Article created successfully.");
			setTimeout(() => {
				setSuccessMessage("");
				dispatch({ type: "ARTICLE_POST_RESET" });
				navigate(`/article/${article._id}`);
			}, 3000);
		} else if (articlePostError) {
			setErrorMessage(articlePostError);
			setTimeout(() => {
				setErrorMessage("");
				dispatch({ type: "ARTICLE_POST_RESET" });
			}, 3000);
		}
	}, [dispatch, articlePostSuccess, articlePostError, navigate, article]);

	const submitArticleHandler = (event) => {
		event.preventDefault();
		const updatedData = new FormData();
		updatedData.append("category", category);
		updatedData.append("title", title);
		updatedData.append("shortText", shortText);
		updatedData.append("fullText", quillRef.current.root.innerHTML);
		if (image) {
			updatedData.append("articleImage", image);
		}
		dispatch(articlePostAction(updatedData));
	}


	const imageChange = (e) => {
		const file = e.target.files[0];
		setImage(file);
		setPreviewImage(URL.createObjectURL(file));
	};

	return (

		<form onSubmit={submitArticleHandler} className='container py-8 flex flex-col w-full items-start gap-3'>
			<div className='w-full'>
				<p className='mb-2'>Title</p>
				<input onChange={e => setTitle(e.target.value)} value={title} type="text" placeholder="" className='w-full max-w-3xl py-2 border-2 border-gray-300' required />
			</div>
			<div className='max-w-3xl mt-6 w-full flex flex-col md:flex-row justify-between'>
				<div className='w-full md:w-5/12 bg-sky-100 py-4 rounded-lg'>
					<label htmlFor="image">
						<img src={previewImage ? previewImage : assetsImages.upload_area2}
							alt="Upload image" className='w-30 h-20 md:w-36 md:h-24 ms-5 object-cover inline-block cursor-pointer border border-sky-300' />
						<input onChange={(e) => { imageChange(e) }} type="file" id='image' hidden />
						<p className='text-sm  md:text-base ms-3 px-2 py-2 cursor-pointer inline-block'>Change image</p>
					</label>
				</div>
				<div className='w-full md:w-6/12 mt-8 md:mt-0'>
					<p className='mb-2'>Description</p>
					<textarea onChange={e => setShortText(e.target.value)} value={shortText} rows="3" type="text" placeholder="" className='w-full max-w-3xl py-2 border-2 border-gray-300' />
				</div>
			</div>
			<div className='max-w-3xl w-full'>
				<p className='my-2'>Content</p>
				<div className='my-quil' ref={editorRef}></div>
			</div>
			<div className='flex gap-2 w-full max-w-3xl mt-4 items-center'>
				<p className='w-20'>Category</p>
				<select onChange={e => setCategory(e.target.value)} className='x-3 py-2 border-2 border-gray-300'>
					{articlesCategories.map((category, i) => (
						<option value={category} key={i}>{category}</option>
					))}
				</select>
			</div>
			<div className='max-w-3xl w-full'>

				{errorMessage && (
					<div className="w-full mt-3 py-3 max-[500px]:text-xs text-sm lg:text-base text-center rounded-md bg-red-100 border border-red-400">
						{errorMessage}
					</div>
				)}
				{successMessage && (
					<div className="w-full mt-3 py-3 max-[500px]:text-xs text-sm lg:text-base text-center rounded-md bg-blue-100 border border-blue-400">
						{successMessage}
					</div>
				)}

			</div>
			<button disabled={articlePostLoading} type="submit" className="mt-4 bg-blue-600 rounded px-12 py-3 text-white hover:bg-blue-500 transition duration-300 ease-in-out">
				{articlePostLoading ? "Loading..." : "Post Article"}
			</button>
		</form>

	)
}

export default NewArticle