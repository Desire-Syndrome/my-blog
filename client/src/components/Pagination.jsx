const Pagination = ({
	currentPage, totalPages,
	prevPage, nextPage
}) => {

	if (totalPages <= 1) return null;

	return (

		<div className="flex flex-col items-center mt-6">
			<span className="mb-2">Page {currentPage} / {totalPages}</span>
			<div className="flex gap-2 text-md">
				<button onClick={prevPage} disabled={currentPage === 1}
					className="bg-sky-600 rounded-full px-4 py-1 text-white hover:bg-sky-500 transition duration-300 ease-in-out disabled:bg-gray-400 disabled:hover:bg-gray-400">Prev</button>
				<button onClick={nextPage} disabled={currentPage === totalPages}
					className="bg-sky-600 rounded-full px-4 py-1 text-white hover:bg-sky-500 transition duration-300 ease-in-out disabled:bg-gray-400 disabled:hover:bg-gray-400">Next</button>
			</div>
		</div>

	);
};

export default Pagination;