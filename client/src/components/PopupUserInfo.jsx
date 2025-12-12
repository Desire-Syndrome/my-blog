
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import { assetsImages } from '../assets/images-data'

import { Link } from 'react-router-dom'

import Pagination from "../components/Pagination"


const PopupUserInfo = ({
	modalVisible,
	userById, userGetByIdSuccess, userGetByIdError,
	articles, articlesGetByUserError, articlesGetByUserLoading,
	currentPage, totalPages,
	nextPage, prevPage, closeModal
}) => {

	if (!modalVisible) return null;

	return (

		<div onClick={closeModal} className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
			<div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-lg px-4 pt-2 pb-4 w-full max-w-md">

				{userGetByIdSuccess && (<>
					<div className="mt-4 md:mt-6 flex flex-col items-center text-center">
						<img src={userById.image ? `${BASE_URL}${userById.image}` : assetsImages.upload_area} className="w-24 h-24 object-cover rounded-full border-2 border-sky-300" alt="User Avatar" />
						<span className="mt-2 text-black text-xl md:text-2xl font-medium">{userById.name.length > 30 ? `${userById.name.slice(0, 10)}...` : userById.name}</span>
					</div>
					<h4 className='border-t border-b border-sky-300 py-2 mt-4 text-center font-medium text-lg text-gray-800'>User Articles</h4>
					{!articlesGetByUserLoading && (
						articles.length > 0 ? (<>
							<ul className='mt-2'>
								{articles.map((article, i) => (
									<li key={i} className='pt-1'>
										<Link onClick={closeModal} to={`/article/${article._id}`} className='block text-sky-900 hover:text-sky-500 transition duration-300 ease-in-out' >
											- {article.title.slice(0, 35)}
										</Link>
									</li>
								))}
							</ul>

							<Pagination currentPage={currentPage} totalPages={totalPages}
								nextPage={nextPage} prevPage={prevPage} />

						</>) : (
							<p className='w-full mt-6 mb-3 text-base text-center'>User has no articles...</p>
						)
					)}

					{articlesGetByUserError && (
						<p className="w-full mt-3 py-3 text-sm lg:text-base text-center rounded-md bg-rose-100 border border-rose-300">{articlesGetByUserError}</p>
					)}
				</>)}

				{userGetByIdError && (
					<div className="my-3 rounded-md bg-rose-100 border border-rose-300 px-4 py-3 text-sm text-center">
						{userGetByIdError}
					</div>
				)}
			</div>
		</div>

	);
};

export default PopupUserInfo;