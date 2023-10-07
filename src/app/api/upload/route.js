import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { writeFile } from "fs/promises";

export async function POST(request) {
	const data = await request.formData();

	for (let entry of data.entries()) {
		if (entry[0].startsWith("file")) {
			const file = entry[1];

			const bytes = await file.arrayBuffer();
			const buffer = Buffer.from(bytes);

			// With the file data in the buffer, you can do whatever you want with it.
			// For this, we'll just write it to the filesystem in a new location
			const path = join("/", "tmp", file.name);

			await writeFile(path, buffer);
			console.log(`open ${path} to see the uploaded file`);
		}
	}

	return NextResponse.json({ success: true });
}
