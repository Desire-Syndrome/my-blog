import { assetsImages } from '../assets/images-data'
import { articlesCategories } from '../assets/mock-data'

import { useState, useEffect, useRef } from "react"

import { useSearchParams } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux";
import { articlesGetAllAction } from "../redux/actions/articleActions"

import Layouts from '../layouts/Layouts'
import ArticleCard from '../components/ArticleCard'
import Pagination from "../components/Pagination"


const Blog = () => {

	const [searchParams, setSearchParams] = useSearchParams();

	const [showFilters, setShowFilters] = useState(false);
	const [selectedCategories, setSelectedCategories] = useState([]);

	const [isSearched, setIsSearched] = useState(false);
	const [searchByTitle, setSearchByTitle] = useState("");
	const titleRef = useRef(null);

	const initialPage = Number(searchParams.get("page")) || 1;
	const [currentPage, setCurrentPage] = useState(initialPage);
	const articlesPerPage = 24;

	const dispatch = useDispatch();
	const { loading: articlesGetAllLoading, articles = [], totalPages, totalArticles } = useSelector((state) => state.articlesGetAllReducer);


	useEffect(() => {
		dispatch(articlesGetAllAction(currentPage, articlesPerPage, selectedCategories, searchByTitle));
	}, [dispatch, currentPage, articlesPerPage, selectedCategories, searchByTitle]);


	const handleCategoryChange = (category) => {
		setSelectedCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);
		setCurrentPage(1);
	}

	const onSearch = () => {
		setSearchByTitle(titleRef.current.value);
		titleRef.current.value = "";
		setIsSearched(true);
		setCurrentPage(1);
	}


	useEffect(() => {
		const categoriesFromUrl = searchParams.get("categories")?.split(',') || [];
		const titleFromUrl = searchParams.get("title") || "";
		const pageFromUrl = Number(searchParams.get("page")) || 1;

		setSelectedCategories(categoriesFromUrl);
		setSearchByTitle(titleFromUrl);
		setIsSearched(Boolean(titleFromUrl));
		setCurrentPage(pageFromUrl);
	}, [searchParams]);

	const isFirstRender = useRef(true);
	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		const params = {};
		if (currentPage > 1) params.page = currentPage;
		if (selectedCategories.length > 0) params.categories = selectedCategories.join(',');
		if (searchByTitle) params.title = searchByTitle;
		const newParams = new URLSearchParams(params).toString();
		if (searchParams.toString() !== newParams) {
			setSearchParams(params, { replace: true });
		}
	}, [currentPage, selectedCategories, searchByTitle]);


	const nextPage = () => {
		if (currentPage < totalPages) { setCurrentPage((prev) => prev + 1); }
	};
	const prevPage = () => {
		if (currentPage > 1) { setCurrentPage((prev) => prev - 1); }
	};

	return (<Layouts>

		<div className='mx-auto mb-6'>
			<div className='bg-gradient-to-t from-sky-400 to-sky-800 text-white py-16 text-center'>
				<h2 className='text-2xl md:text-3xl lg:text-4xl font-medium mb-4'>Over {totalArticles - 1}+ articles to read</h2>
				<p className='mb-8 max-w-xl mx-auto text-sm font-light px-5'>We offer a large collection of articles on a variety of topics.<br />Enjoy the read and share your thoughts with us!</p>
				<div className='w-10/12 lg:w-full flex items-center justify-center bg-white rounded-full text-gray-600 max-w-xl pl-4 mx-auto'>
					<div className='w-full flex items-center'>
						<img className='h-4 sm:h-5' src={assetsImages.search_icon} alt="Search icon" />
						<input ref={titleRef}
							type="text" placeholder='Search by title...' className='no-focus max-sm:text-xs p-2 rounded outline-none w-full border-none' />
					</div>
					<button onClick={onSearch}
						className='bg-sky-600 px-6 py-2 rounded-full text-white m-1 hover:bg-sky-400 transition duration-300 ease-in-out'>Search</button>
				</div>
			</div>
		</div>

		<div className='container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8 b'>
			<div className='w-full lg:w-1/5 bg-white px-4'>
				{(isSearched && searchByTitle !== "") && (
					<div><h3 className='font-medium text-md mb-3'>Title:</h3><div className='mb-2 text-gray-400'>
						<span className='inline-flex items-center gap-2.5 ml-1 mr-1 text-gray-700 bg-sky-100 border border-sky-200 px-4 py-1.5 rounded'>
							{searchByTitle}
							<img onClick={() => setSearchByTitle("")} src={assetsImages.cross_icon} alt="cross-icon" className="cursor-pointer" />
						</span>
					</div></div>
				)}
				<button onClick={() => setShowFilters(prev => !prev)} className='lg:hidden block mt-4 px-6 py-1.5 rounded border border-gray-600 hover:bg-sky-100 transition duration-300 ease-in-out'>
					{showFilters ? "Close Filters" : "Open Filters"}
				</button>
				<div className={showFilters ? "mt-2" : "max-lg:hidden mt-2"}>
					<h4 className='font-medium text-md py-4'>Categories:</h4>
					<ul className='space-y-2 text-gray-600'>
						{articlesCategories.map((category, i) => (
							<li key={i} className='flex gap-3 items-center '>
								<input onChange={() => handleCategoryChange(category)} checked={selectedCategories.includes(category)}
									type="checkbox" className='cursor-pointer border-gray-400 rounded' />{category}
							</li>
						))}
					</ul>
				</div>
			</div>

			<section className='w-full lg:w-4/5 text-gray-800 max-lg:px-4'>
				<h3 id='job-list' className='font-medium text-3xl py-2'>Latest articles</h3>
				<p className='mb-8'>Explore articles to suit every taste</p>
				
				{!articlesGetAllLoading && (
					articles.length > 0 ? (<>
						<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
							{articles.map((article, i) => (
								<ArticleCard key={i} article={article} />
							))}
						</div>
						<Pagination currentPage={currentPage} totalPages={totalPages}
					nextPage={nextPage} prevPage={prevPage} />
					</>) : (
						<p>Nothing found, please change your search criteria...</p>
					)
				)}

			</section>
		</div>

	</Layouts>)
}

export default Blog