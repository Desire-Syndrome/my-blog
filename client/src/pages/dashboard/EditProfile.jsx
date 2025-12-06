const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import { assetsImages } from '../../assets/images-data'

import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { userUpdateAction, userDeleteAction, userLogoutAction } from "../../redux/actions/UserActions"


const EditProfile = () => {

	const dispatch = useDispatch();
	const { loading: updateLoading, error: updateError, success: updateSuccess } = useSelector((state) => state.userUpdateReducer);
	const { error: deleteError, success: deleteSuccess } = useSelector((state) => state.userDeleteReducer);
	const { userInfo } = useSelector((state) => state.userLoginReducer);

	const [name, setName] = useState(userInfo.name);
	const [email, setEmail] = useState(userInfo.email);
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [image, setImage] = useState(userInfo.image);
	const [previewImage, setPreviewImage] = useState(null);

	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const [modalVisible, setModalVisible] = useState(false);
	const [modalMessage, setModalMessage] = useState("");


	useEffect(() => {
		if (updateSuccess) {
			setSuccessMessage("Your profile updated.");
			setName(userInfo.name);
			setEmail(userInfo.email);
			setTimeout(() => {
				setSuccessMessage("");
				setOldPassword(""); setNewPassword("");
				dispatch({ type: "USER_UPDATE_RESET" });
			}, 3000);
		} else if (updateError) {
			setErrorMessage(updateError);
			setTimeout(() => {
				setErrorMessage("");
				setOldPassword(""); setNewPassword("");
				dispatch({ type: "USER_UPDATE_RESET" });
			}, 3000);
		}
		if (deleteSuccess) {
			setModalMessage("Your account has been successfully deleted!");
		} else if (deleteError) {
			setModalMessage(deleteError);
		}
	}, [dispatch, updateError, updateSuccess, deleteError, deleteSuccess, userInfo]);

	const updateHandler = (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("name", name);
		formData.append("email", email);
		if (newPassword) {
			formData.append("newPassword", newPassword);
			formData.append("oldPassword", oldPassword);
		}
		if (image) { formData.append("avatar", image); }
		dispatch(userUpdateAction(formData));
	};


	const deleteHandler = () => {
		setModalMessage("Are you sure you want to delete your profile?");
		setModalVisible(true);
	};

	const confirmDeleteHandler = () => {
		dispatch(userDeleteAction());
	};

	const exitAfterDeleteHandler = () => {
		dispatch(userLogoutAction());
		dispatch({ type: "USER_DELETE_RESET" });
		setModalVisible(false);
	};


	const imageChange = (e) => {
		const file = e.target.files[0];
		setImage(file);
		setPreviewImage(URL.createObjectURL(file));
	};

	return (<>

		<form onSubmit={updateHandler} className='container max-w-2xl py-8 flex flex-col w-full items-start gap-3'>
			<div className='w-full py-4 bg-sky-100 rounded-lg'>
				<label htmlFor="image">
					<img src={previewImage ? previewImage : userInfo.image ? `${BASE_URL}${userInfo.image}` : assetsImages.upload_area}
						alt="Upload image" className='w-20 h-20 md:w-24 md:h-24 ms-5 rounded-full object-cover inline-block cursor-pointer border border-sky-300' />
					<input onChange={(e) => { imageChange(e) }} type="file" id='image' hidden />
					<p className='text-sm  md:text-base ms-3 md:ms-5 px-2 py-2 cursor-pointer inline-block'>Change photo</p>
				</label>
			</div>

			<div className='w-full'>
				<p className='mb-2'>Name</p>
				<input onChange={e => setName(e.target.value)} value={name}
					type="text" placeholder="" className='w-full py-2 border border-gray-300' />
			</div>
			<div className='w-full'>
				<p className='mb-2'>Email</p>
				<input onChange={e => setEmail(e.target.value)} value={email}
					type="email" placeholder="" className='w-full py-2 border border-gray-300' />
			</div>
			<div className='w-full flex gap-x-4'>
				<div className='w-1/2'>
					<p className='mb-2'>Password</p>
					<input onChange={e => setOldPassword(e.target.value)} value={oldPassword}
						type="password" placeholder="" className='w-full py-2 border border-gray-300' />
				</div>
				<div className='w-1/2'>
					<p className='mb-2'>New Password</p>
					<input onChange={e => setNewPassword(e.target.value)} value={newPassword}
						type="password" placeholder="" className='w-full py-2 border border-gray-300' />
				</div>
			</div>

			{errorMessage && (
				<div className="w-full mt-3 py-3 max-[500px]:text-xs text-sm lg:text-base text-center rounded-md bg-rose-100 border border-rose-300">
					{errorMessage}
				</div>
			)}
			{successMessage && (
				<div className="w-full mt-3 py-3 max-[500px]:text-xs text-sm lg:text-base text-center rounded-md bg-sky-100 border border-sky-400">
					{successMessage}
				</div>
			)}

			<div className='mt-5 flex items-center'>
				<button disabled={updateLoading}
					className="font-medium text-center bg-sky-600 rounded px-5 md:px-8 py-3 text-white text-sm md:text-base hover:bg-sky-500 transition duration-300 ease-in-out">Update Profile</button>
				<button onClick={deleteHandler}
					type="button" className="ms-5 font-medium text-center rounded px-5 md:px-8 py-3 text-gray-800 text-sm md:text-base bg-slate-200 hover:bg-gray-300 transition duration-300 ease-in-out">Delete Profile</button>
			</div>
		</form >


		{modalVisible && (<>
			<div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
			<div className="fixed inset-0 flex items-center justify-center z-50">
				<div className="bg-white rounded-lg shadow-lg w-full max-w-md">
					<div className="px-6 py-4 border-b border-gray-200"><h5 className="text-lg font-semibold text-sky-600">Confirmation</h5></div>
					<div className="px-6 py-4"><p className="text-gray-700">{modalMessage}</p></div>
					<div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">

						{!deleteSuccess ? (<>
							<button onClick={() => { dispatch({ type: "USER_DELETE_RESET" }); setModalVisible(false); }}
								type="button" className="text-sm font-medium px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 transition duration-300 ease-in-out">Cancel</button>
							<button onClick={confirmDeleteHandler}
								type="button" className="text-white text-sm font-medium px-4 py-2 rounded bg-sky-600 hover:bg-sky-500 transition duration-300 ease-in-out">Yes, Delete</button>
						</>) : (
							<button onClick={exitAfterDeleteHandler}
								type="button" className="text-white text-sm font-medium px-4 py-2 rounded bg-sky-600 hover:bg-sky-500 transition duration-300 ease-in-out">OK</button>
						)}

					</div>
				</div>
			</div>
		</>)
		}

	</>)
}

export default EditProfile