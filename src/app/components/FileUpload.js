"use client";
import { useState } from "react";
import Image from "next/image";

export default function FileUpload() {
	const [files, setFiles] = useState([]);

	const onSubmit = async (e) => {
		e.preventDefault();
		if (files.length === 0) return;

		try {
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

	return (
		<div className="bg-gray-100 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						File Upload
					</h2>
				</div>
				<form onSubmit={onSubmit} className="mt-8 space-y-6">
					<input
						type="file"
						name="file"
						multiple
						onChange={onFileChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					/>
					<button
						type="submit"
						className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						Upload
					</button>
					<ul>
						{files.map((file, index) =>
							file.type.startsWith("video") ? (
								<li key={file.name} className="mt-4">
									<div className="border border-black rounded px-3 py-3 w-16 h-16 flex items-center justify-center bg-gray-200 text-black text-sm font-bold text-center m-1">
										{file.name.split(".").pop()}
									</div>
									<p className="mt-2 text-sm text-gray-500">{file.name}</p>
								</li>
							) : (
								<li key={index} className="mt-4">
									<Image
										src={file.url}
										alt="Preview"
										width={200}
										height={150}
										className="rounded"
									/>
								</li>
							)
						)}
					</ul>
				</form>
			</div>
		</div>
	);
}
