"use client";
import { useState } from "react";

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

			// handle the error
			if (!res.ok) throw new Error(await res.text());
		} catch (e) {
			// Handle errors here
			console.error(e);
		}
	};

	return (
		<form onSubmit={onSubmit}>
			<input
				type="file"
				name="file"
				multiple
				onChange={(e) => setFiles(Array.from(e.target.files))}
			/>
			<input type="submit" value="Upload" />
		</form>
	);
}
