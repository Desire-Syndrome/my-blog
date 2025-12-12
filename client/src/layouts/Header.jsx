
import { assetsImages } from '../assets/images-data'

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux";
import { userRegisterAction, userLoginAction } from "../redux/actions/userActions"

import UserMenu from '../components/UserMenu'


const Header = () => {

	const dispatch = useDispatch();
	const { loading: userRegisterLoading, error: userRegisterError, success: userRegisterSuccess } = useSelector((state) => state.userRegisterReducer);
	const { loading: userLoginLoading, error: userLoginError, success: userLoginSuccess } = useSelector((state) => state.userLoginReducer);
	const { userInfo } = useSelector((state) => state.userLoginReducer);

	const [popupState, setPopupState] = useState("Login");
	const [showPopup, setShowPopup] = useState(false);

	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [image, setImage] = useState(null);

	const [errorMessage, setErrorMessage] = useState("");


	useEffect(() => {
		if (userRegisterSuccess) {
			dispatch(userLoginAction(email, password));
			closePopup();
			dispatch({ type: "USER_REGISTRATION_RESET" });
		} else if (userRegisterError) {
			setErrorMessage(userRegisterError);
			setTimeout(() => {
				setErrorMessage("");
				dispatch({ type: "USER_REGISTRATION_RESET" });
			}, 3000);
		}
		if (userLoginSuccess) {
			closePopup();
		} else if (userLoginError) {
			setErrorMessage(userLoginError);
			setTimeout(() => {
				setErrorMessage("");
				dispatch({ type: "USER_LOGIN_FAIL", payload: "" });
			}, 3000);
		}
	}, [dispatch, email, password, userRegisterError, userRegisterSuccess, userLoginError, userLoginSuccess, userInfo]);

	
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (popupState === "Login") {
			dispatch(userLoginAction(email, password));
		} else if (popupState === "Registration") {
			dispatch(userRegisterAction(name, email, password, image));
		}
	};


	const closePopup = () => {
		setImage(null); setName(""); setEmail(""); setPassword("");
		setPopupState("Login"); setShowPopup(false); 
	}

	return (<>

		<div className='border-sky-200 border-b py-4'><div className='max-w-[1900px] px-4 2xl:px-20 mx-auto flex flex-wrap justify-between items-center lg:order-1'>
			<Link to="/" className='w-[70px] md:w-[90px]'><img src={assetsImages.logo} className='w-full' alt="Logo" /></Link>
			<div className='flex gap-2 md:text-sm text-xs lg:order-3'>

				{userInfo ? (
					<UserMenu />
				) : (<>
					<button onClick={() => { setShowPopup(true) }} className='bg-sky-600 text-white px-6 py-2 rounded-full hover:bg-sky-500 transition duration-300 ease-in-out'>
						User Login
					</button>
				</>)}

			</div>
			<div className='lg:order-2 w-full lg:w-auto mt-4 lg:mt-0'><ul className='flex justify-center items-center font-semibold'>
				<li><Link to={'/'} className='text-black md:text-lg text-md px-1 md:px-2 mx-2 hover:text-gray-600 transition duration-300 ease-in-out'>Home</Link></li>
				<li><Link to={'/faq'} className='text-black md:text-lg text-md px-1 md:px-2 mx-2 hover:text-gray-600 transition duration-300 ease-in-out'>Questions</Link></li>
				<li><Link to={'/contacts'} className='text-black md:text-lg text-md px-1 md:px-2 mx-2 hover:text-gray-600 transition duration-300 ease-in-out'>Contacts</Link></li>
			</ul></div>
		</div></div>


		{showPopup && (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100"><div onClick={closePopup} className='fixed inset-0 z-150'></div>
				<div className="bg-white rounded-lg shadow p-6 w-80 lg:w-96 relative border-sky-600 border-opacity-70 border-2 z-200">
					<button className="absolute top-2 right-3 text-gray-500" onClick={closePopup}>✕</button>
					<h2 className="text-lg text-sky-600 text-center font-semibold mb-4">User {popupState}</h2>
					<form onSubmit={handleSubmit}>

						{popupState === 'Registration' && (<>
							<div className='text-center my-6 w-100 py-2 bg-sky-100 rounded-lg'>
								<label htmlFor="image">
									<img src={image ? URL.createObjectURL(image) : assetsImages.upload_area} alt="Upload image" className='w-24 h-24 rounded-full inline-block' />
									<input onChange={e => setImage(e.target.files[0])} type="file" id='image' hidden />
									<p className='mt-2'>Upload your photo</p>
								</label>
							</div>
							<div className='border border-gray-300 px-4 py-2 flex items-center gap-2 rounded-full mt-2'>
								<img src={assetsImages.person_icon} className='h-4 w-4' alt="person icon" />
								<input onChange={e => setName(e.target.value)}
									value={name} placeholder='Name' className='no-focus text-sm border-none' type="text" required />
							</div>
						</>)}

						<div className='border border-gray-300 px-4 py-2 flex items-center gap-2 rounded-full mt-2'>
							<img src={assetsImages.email_icon} className='h-4 w-4' alt="email icon" />
							<input onChange={e => setEmail(e.target.value)}
								value={email} type="email" placeholder='Email' className='no-focus text-sm border-none' required />
						</div>
						<div className='border border-gray-300 px-4 py-2 flex items-center gap-2 rounded-full mt-2'>
							<img src={assetsImages.lock_icon} className='h-4 w-4' alt="lock icon" />
							<input onChange={e => setPassword(e.target.value)}
								value={password} type="password" placeholder='Password' className='no-focus text-sm border-none' required />
						</div>

						{popupState === 'Login' ? (<>
							<button type='submit' className='bg-sky-600 w-full text-white rounded-full py-2 mt-3 hover:bg-sky-500 transition duration-300 ease-in-out'>
								{userLoginLoading ? "Loading..." : "Login"}
							</button>
							{errorMessage && (
								<div className="mt-3 rounded-md bg-rose-100 border border-rose-300  px-4 py-3 text-sm text-center">
									{errorMessage}
								</div>
							)}
							<p className='text-center text-sm mt-5'>Don’t have an account?
								<span onClick={() => setPopupState("Registration")} className='text-sky-600 cursor-pointer ms-2'>Registration</span>
							</p>
						</>) : (<>
							<button type='submit' className='bg-sky-600 w-full text-white rounded-full py-2 mt-3 hover:bg-sky-500 transition duration-300 ease-in-out'>
								{userRegisterLoading ? "Loading..." : "Submit"}
							</button>
							{errorMessage && (
								<div className="mt-3 rounded-md bg-rose-100 border border-rose-300  px-4 py-3 text-sm text-center">
									{errorMessage}
								</div>
							)}
							<p className='text-center text-sm mt-5'>Already have an account?
								<span onClick={() => setPopupState("Login")} className='text-sky-700 cursor-pointer ms-2 '>Login</span>
							</p>
						</>)}
						
					</form>
				</div></div>
		)}

	</>)
}

export default Header