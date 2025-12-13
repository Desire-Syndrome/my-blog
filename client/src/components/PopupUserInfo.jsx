
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import { assetsImages } from '../assets/images-data'

import { useState, useEffect } from "react";

import { Link } from 'react-router-dom'

import { useDispatch, useSelector } from "react-redux";
import { userBanAction, userUnbanAction } from "../redux/actions/userActions"

import Pagination from "../components/Pagination"


const PopupUserInfo = ({
	modalVisible,
	userById, userGetByIdSuccess, userGetByIdError,
	articles, articlesGetByUserError, articlesGetByUserLoading,
	currentPage, totalPages,
	nextPage, prevPage, closeModal
}) => {

	const dispatch = useDispatch();
	const { success: userBanSuccess, error: userBanError } = useSelector((state) => state.userBanReducer);
	const { success: userUnbanSuccess, error: userUnbanError } = useSelector((state) => state.userUnbanReducer);
	const { userInfo } = useSelector((state) => state.userLoginReducer);

	const [userLocalState, setUserLocalState] = useState(userById);

	const [banDays, setBanDays] = useState(7);

	const [banMessage, setBanMessage] = useState("");


	useEffect(() => {
		if (userById) { setUserLocalState(userById); }
	}, [userById]);

	useEffect(() => {
		if (userBanSuccess) {
			setBanMessage("User successfully banned.");
			setTimeout(() => {
				setUserLocalState(prev => ({ ...prev, isBanned: true, banExpiresAt: new Date(Date.now() + banDays * 24 * 60 * 60 * 1000).toISOString() }));
				setBanMessage("");
				dispatch({ type: "USER_BAN_RESET" });
			}, 1500);
		} else if (userBanError) {
			setBanMessage("Something went wrong while banning.");
			setTimeout(() => {
				setBanMessage("");
				dispatch({ type: "USER_BAN_RESET" });
			}, 1500);
		}
		if (userUnbanSuccess) {
			setBanMessage("User successfully unbanned.");
			setTimeout(() => {
				setUserLocalState(prev => ({ ...prev, isBanned: false, banExpiresAt: null }));
				setBanMessage("");
				dispatch({ type: "USER_UNBAN_RESET" });
			}, 1500);
		} else if (userUnbanError) {
			setBanMessage("Something went wrong while unbanning.");
			setTimeout(() => {
				setBanMessage("");
				dispatch({ type: "USER_UNBAN_RESET" });
			}, 1500);
		}
	}, [dispatch, userBanSuccess, userBanError, userUnbanSuccess, userUnbanError, banDays]);


	if (!modalVisible) return null;

	return (

		<div onClick={closeModal} className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
			<div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-lg px-4 pt-2 pb-4 w-full max-w-md">

				{userGetByIdSuccess && (<>

					{userInfo.isAdmin && userLocalState?._id && userInfo._id !== userById._id && (
						!userLocalState?.isBanned ? (
							<div className="mt-2 flex items-center justify-center gap-1">
								<p className='text-gray-800 text-sm'>Ban user for</p>
								<input onChange={(e) => setBanDays(e.target.value)} value={banDays} className="w-8 px-0 py-0 bg-transparent border-0 border-b border-gray-800 text-center text-sky-600 font-medium focus:outline-none focus:ring-0 [appearance:textfield]" type="number" min="1" placeholder="" />
								<p className='text-gray-800 text-sm'>day(s)</p>
								<button onClick={() => dispatch(userBanAction(userLocalState?._id, Number(banDays)))} className="bg-rose-600 rounded ms-2 px-4 py-1 text-white text-sm hover:bg-rose-500 transition duration-300 ease-in-out">
									Ban
								</button>
							</div>
						) : (
							<div className="mt-2 flex items-center justify-center gap-1">
								<p className='text-gray-800 text-sm'>User was banned until</p>
								<p className='text-rose-600 font-medium text-sm'>{new Date(userLocalState?.banExpiresAt).toLocaleDateString("en-GB")}</p>
								<button onClick={() => dispatch(userUnbanAction(userLocalState?._id))} className="bg-sky-600 rounded ms-2 px-4 py-1 text-white text-sm hover:bg-sky-500 transition duration-300 ease-in-out">
									Unban
								</button>
							</div>
						)
					)}
					{banMessage && (
						<p className={`w-full mt-3 py-3 text-sm text-center rounded-md ${userBanSuccess || userUnbanSuccess ? "bg-sky-100 border border-sky-400" : "bg-rose-100 border border-rose-300"}`}>
							{banMessage}
						</p>
					)}

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
								nextPage={nextPage} prevPage={prevPage}
							/>

						</>) : (
							<p className='w-full mt-6 mb-3 text-base text-center'>User has no articles...</p>
						)
					)}

					{articlesGetByUserError && (
						<p className="w-full mt-3 py-3 text-sm text-center rounded-md bg-rose-100 border border-rose-300">
							{articlesGetByUserError}
						</p>
					)}

				</>)}

				{userGetByIdError && (
					<p className="w-full mt-3 py-3 text-sm text-center rounded-md bg-rose-100 border border-rose-300">
						{userGetByIdError}
					</p>
				)}

			</div>
		</div>

	);
};

export default PopupUserInfo;