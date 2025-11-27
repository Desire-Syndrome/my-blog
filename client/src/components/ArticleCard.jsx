const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import { assetsImages } from '../assets/images-data'

import { useNavigate } from 'react-router-dom';


const ArticleCard = ({ article }) => {

	const navigate = useNavigate();

	return (

		<div onClick={() => { navigate(`/article/${article._id}`) }} className="border p-2 shadow rounded cursor-pointer hover:opacity-90 transition duration-300 ease-in-out">
			<div className="flex justify-between">
				<p className="text-sm text-gray-500">Category: <span className='text-black'>{article.category}</span></p>
				<p className="text-sm text-gray-500">Date: <span className='text-black'>{new Date(article.createdAt).toLocaleDateString("en-GB")}</span></p>
			</div>
			{article.image ? (
				<div className="mt-2">
					<img src={`${BASE_URL}${article.image}`} className="h-48 md:h-40 w-full object-cover" alt="Article image" />
				</div>
			):(
				<div className="mt-2">
					<img src={assetsImages.upload_area2} className="h-48 md:h-40 w-full object-cover" alt="Article image" />
				</div>
			)}
			<h3 className="font-medium text-xl mt-2">{article.title}</h3>
			<div className='mt-4 h-[60px] sm:h-[80px] md:h-[60px] overflow-hidden'>
			{article.shortText ? (
				<p className="text-gray-500 text-sm">{article.shortText.slice(0, 150)}</p>
			) : (
				<p dangerouslySetInnerHTML={{ __html: article.fullText.slice(0, 150) }} className="text-gray-500 text-sm"></p>
			)}
			</div>
			<div className="mt-4 flex items-center justify-center">
				<p className='me-2 text-sm'>Rating:</p>
				<img src={assetsImages.star} className='w-6 h-6' alt="Star" />
				<p className='ms-2 text-sm'>{Number(article.rating).toFixed(1)} from 5</p>
			</div>
		</div>

	)
}

export default ArticleCard