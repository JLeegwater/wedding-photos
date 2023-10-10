"use client";
import { useState } from "react";
import Image from "next/image";
import axios from "axios";

export default function FileUpload() {
	const [files, setFiles] = useState([]);
	const [uploadProgress, setUploadProgress] = useState([]);
	const [isUploading, setIsUploading] = useState(false);
	const MAX_RETRIES = 3;
	const RETRY_DELAY = 1000; // in milliseconds

	const uploadFileWithRetry = async (file, index, retryCount = 0) => {
		try {
			const data = new FormData();
			data.append("file", file.data);
			data.append("upload_preset", "my-uploads");

			const res = await axios.post(
				"https://api.cloudinary.com/v1_1/dvnmpxoyj/auto/upload",
				data,
				{
					onUploadProgress: (progressEvent) => {
						let percentCompleted = Math.round(
							(progressEvent.loaded * 100) / progressEvent.total
						);
						setUploadProgress((prevProgress) => {
							let newProgress = [...prevProgress];
							newProgress[index] = percentCompleted;
							return newProgress;
						});
					},
				}
			);
			if (res.status !== 200) throw new Error(res.statusText);
		} catch (error) {
			if (retryCount < MAX_RETRIES) {
				// Wait for a while before retrying.
				await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
				await uploadFileWithRetry(file, index, retryCount + 1);
			} else {
				throw error;
			}
		}
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		if (files.length === 0) return;
		setIsUploading(true);

		try {
			await Promise.all(
				files.map((file, index) => uploadFileWithRetry(file, index))
			);
			setFiles([]);
			setUploadProgress([]);
			setIsUploading(false);
			alert("All files uploaded. Thank you!");
		} catch (error) {
			setIsUploading(false);
			alert(
				"Something went wrong! If your device went to sleep or you accidentally closed the website, please try uploading the files again. \nIf you continue to see this message, please text Jesse Leegwater at +1(925)270-5512"
			);
		}
	};

	const onFileChange = (e) => {
		const filesArray = Array.from(e.target.files).map((file) => ({
			url: URL.createObjectURL(file),
			type: file.type,
			name: file.name,
			data: file,
		}));
		setFiles(filesArray);
		setUploadProgress(new Array(filesArray.length).fill(0));
	};

	const deleteFile = (indexToDelete) => {
		setFiles(files.filter((_, index) => index !== indexToDelete));
		setUploadProgress(
			uploadProgress.filter((_, index) => index !== indexToDelete)
		);
	};

	return (
		<div className="bg-gray-800 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-white">
						Upload Your Pictures and Videos of the Wedding
					</h2>
				</div>
				{!isUploading && (
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
					</form>
				)}
				<ul>
					{files.map((file, index) => (
						<li key={file.name} className="mt-4 relative">
							{file.type.startsWith("video") ? (
								<>
									<div className="border border-white rounded px-3 py-3 w-16 h-16 flex items-center justify-center bg-gray-700 text-white text-sm font-bold text-center m-1">
										{file.name.split(".").pop()}
									</div>
									<p className="mt-2 text-sm text-gray-500">{file.name}</p>
								</>
							) : (
								<Image
									src={file.url}
									alt="Preview"
									width="0"
									height="0"
									sizes="100vw"
									style={{ width: "100%", height: "auto" }}
									className="rounded h"
								/>
							)}
							{!isUploading && (
								<button
									onClick={() => deleteFile(index)}
									className="absolute right-0 top-0 bg-red-500 text-white rounded-full w-5 h-5"
								>
									X
								</button>
							)}
							<div className="relative pt-1">
								<div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-pink-200">
									<div
										style={{ width: `${uploadProgress[index]}%` }}
										className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center  ${
											uploadProgress[index] === 100
												? "bg-green-500"
												: "bg-pink-500"
										}`}
									></div>
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
			{isUploading && (
				<div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white text-black text-2xl rounded-full text-center px-4 py-2">
						Uploading...
						<br /> Please keep your device awake!
					</div>
				</div>
			)}
		</div>
	);
}
