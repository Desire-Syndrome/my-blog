
const PopupDelete = ({
	modalVisible, modalMessage, 
	deleteSuccess, deleteLoading,
	onCancel, onConfirm
}) => {

	if (!modalVisible) return null;

	return (
 
			<div onClick={onCancel} className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
				<div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-lg w-full max-w-md">
					<div className="px-6 py-4 border-b border-gray-200"><h5 className="text-lg font-semibold text-sky-600">Confirmation</h5></div>
					<div className="px-6 py-4"><p className="text-gray-700">{modalMessage}</p></div>
					<div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
						{!deleteSuccess ? (<>
							<button onClick={onCancel} disabled={deleteLoading}
								type="button" className="text-sm font-medium px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 transition duration-300 ease-in-out">Cancel</button>
							<button onClick={onConfirm} disabled={deleteLoading}
								type="button" className="text-white text-sm font-medium px-4 py-2 rounded bg-sky-600 hover:bg-sky-500 transition duration-300 ease-in-out">{!deleteLoading ? "Yes, Delete" : "Loading..."}</button>
						</>) : (
							<button onClick={onConfirm}
								type="button" className="text-white text-sm font-medium px-4 py-2 rounded bg-sky-600 hover:bg-sky-500 transition duration-300 ease-in-out">OK</button>
						)}
					</div>
				</div>
			</div>
 
 	);
};

export default PopupDelete;