"use client";
import { useState } from "react";
import Image from "next/image";

export default function FileUpload() {
	const [files, setFiles] = useState([]);

	const onSubmit = async (e) => {
		e.preventDefault();
		if (files.length === 0) return;

		try {
			console.log(files);
			const data = new FormData();
			files.forEach((file, index) => {
				data.append("file" + index, file);
			});

			const res = await fetch("/api/upload", {
				method: "POST",
				body: data,
			});

			if (!res.ok) throw new Error(await res.text());
		} catch (e) {
			console.error(e);
		}
	};

	const onFileChange = (e) => {
		const filesArray = Array.from(e.target.files).map((file) => ({
			url: URL.createObjectURL(file),
			type: file.type,
			name: file.name,
		}));
		setFiles(filesArray);
	};

	const deleteFile = (indexToDelete) => {
		setFiles(files.filter((_, index) => index !== indexToDelete));
	};

	return (
		<div className="bg-gray-800 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-white">
						Upload Your Pictures and Videos of the Wedding
					</h2>
				</div>
				<form onSubmit={onSubmit} className="mt-8 space-y-6">
					<input
						type="file"
						name="file"
						multiple
						onChange={onFileChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700"
					/>
					{files.length > 0 && (
						<button
							type="submit"
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							Upload
						</button>
					)}
					<ul>
						{files.map((file, index) =>
							file.type.startsWith("video") ? (
								<li key={file.name} className="mt-4 relative">
									<div className="border border-white rounded px-3 py-3 w-16 h-16 flex items-center justify-center bg-gray-700 text-white text-sm font-bold text-center m-1">
										{file.name.split(".").pop()}
									</div>
									<p className="mt-2 text-sm text-gray-500">{file.name}</p>
									<button
										onClick={() => deleteFile(index)}
										className="absolute right-0 top-0 bg-red-500 text-white rounded-full w-5 h-5"
									>
										X
									</button>
								</li>
							) : (
								<li key={index} className="mt-4 relative">
									<Image
										src={file.url}
										alt="Preview"
										width={200}
										height={200}
										className="rounded"
									/>
									<button
										onClick={() => deleteFile(index)}
										className="absolute right-0 top-0 bg-red-500 text-white rounded-full w-5 h-5"
									>
										X
									</button>
								</li>
							)
						)}
					</ul>
				</form>
			</div>
		</div>
	);
}
