const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import { assetsImages } from '../assets/images-data'

import { Link } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux";
import { userLogoutAction } from "../redux/actions/UserActions"


function UserMenu() {

	const dispatch = useDispatch();
	const { userInfo } = useSelector((state) => state.userLoginReducer);


	const logoutHandler = () => {
		dispatch(userLogoutAction());
	}


	return (

		<div className='flex items-center gap-3'>
			<p className='text-sm md:text-base'>Welcome, {userInfo.name.length > 10 ? `${userInfo.name.slice(0, 10)}...` : userInfo.name}</p>
			<div className='relative group'>
				<img src={userInfo.image ? `${BASE_URL}${userInfo.image}` : assetsImages.upload_area} className='w-8 h-8 border rounded-full border border-sky-300' alt="User Avatar" />
				<div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12'>
					<ul className='list-none m-0 p-2 bg-white rounded-md border text-sm w-max shadow-sm shadow-black'>
						<li><Link to={'/'} className='py-1 px-2 cursor-pointer flex items-center gap-2 hover:bg-sky-200 transition duration-300 ease-in-out'>
							<img src={assetsImages.icon1} className='w-4 h-4' alt="icon" />Back to Website
						</Link></li>
						<li><Link to={'/dashboard/'} className='py-1 px-2 cursor-pointer flex items-center gap-2 hover:bg-sky-200 transition duration-300 ease-in-out'>
							<img src={assetsImages.icon4} className='w-4 h-4' alt="icon" />To Dashboard
						</Link></li>
						<li><Link to={'/dashboard/edit-profile'} className='py-1 px-2 cursor-pointer flex items-center gap-2 hover:bg-sky-200 transition duration-300 ease-in-out'>
							<img src={assetsImages.icon2} className='w-4 h-4' alt="icon" />Edit Profile
						</Link></li>
						<li onClick={logoutHandler}  className='py-1 px-2 cursor-pointer flex items-center gap-2 hover:bg-sky-200 transition duration-300 ease-in-out'>
							<img src={assetsImages.icon3} className='w-4 h-4' alt="icon" />Logout
						</li>
					</ul>
				</div>
			</div>
		</div>

	)
}

export default UserMenu