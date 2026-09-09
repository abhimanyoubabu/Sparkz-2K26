import { google } from "googleapis";
import { Readable } from "stream";

const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

auth.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const drive = google.drive({
    version: "v3",
    auth,
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const file = formData.get("file");
        const eventId = formData.get("eventId");

        if (!(file instanceof File)) {
            return Response.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }

        if (!eventId || typeof eventId !== "string") {
            return Response.json(
                { error: "Event ID is required" },
                { status: 400 }
            );
        }

        // 10 MB limit
        if (file.size > 10 * 1024 * 1024) {
            return Response.json(
                { error: "File size should be less than 10MB" },
                { status: 400 }
            );
        }

        if (!file.type.startsWith("image/")) {
            return Response.json(
                { error: "Only image files are allowed" },
                { status: 400 }
            );
        }

        const folderId = process.env.GOOGLE_DRIVE_EVENT_FOLDER_ID;

        if (!folderId) {
            return Response.json(
                { error: "GOOGLE_DRIVE_EVENT_FOLDER_ID is not configured" },
                { status: 500 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const uploadedFile = await drive.files.create({
            requestBody: {
                name: `Sparkz2K26_${eventId}_${Date.now()}_${file.name}`,
                parents: [folderId],
            },
            media: {
                mimeType: file.type,
                body: Readable.from(buffer),
            },
            fields: "id,name",
        });

        const fileId = uploadedFile.data.id;

        if (!fileId) {
            throw new Error("Google Drive did not return a file ID");
        }

        // Make the uploaded image publicly viewable
        await drive.permissions.create({
            fileId,
            requestBody: {
                role: "reader",
                type: "anyone",
            },
        });

        const imageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

        return Response.json({
            success: true,
            fileId,
            name: uploadedFile.data.name,
            url: imageUrl,
        });
    } catch (error: any) {
        console.error("Google Drive event upload error:", error);

        return Response.json(
            {
                error:
                    error?.message ||
                    "Failed to upload event image to Google Drive",
            },
            { status: 500 }
        );
    }
}