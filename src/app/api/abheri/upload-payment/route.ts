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

// ==================================================
// UPLOAD PAYMENT SCREENSHOT
// ==================================================

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const file = formData.get("file");

        if (!(file instanceof File)) {
            return Response.json(
                {
                    error: "No file uploaded",
                },
                { status: 400 }
            );
        }

        // Maximum 5MB
        if (file.size > 5 * 1024 * 1024) {
            return Response.json(
                {
                    error: "File size should be less than 5MB",
                },
                { status: 400 }
            );
        }

        // Image validation
        if (!file.type.startsWith("image/")) {
            return Response.json(
                {
                    error: "Only image files are allowed",
                },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(
            await file.arrayBuffer()
        );

        const uploadedFile =
            await drive.files.create({
                requestBody: {
                    name: `Abheri_Payment_${Date.now()}_${file.name}`,
                    parents: [
                        process.env.GOOGLE_DRIVE_FOLDER_ID!,
                    ],
                },

                media: {
                    mimeType: file.type,
                    body: Readable.from(buffer),
                },

                fields: "id,name,webViewLink",
            });

        const fileId = uploadedFile.data.id;

        if (!fileId) {
            throw new Error(
                "Google Drive did not return a file ID"
            );
        }

        return Response.json({
            success: true,
            fileId,
            url:
                uploadedFile.data.webViewLink ||
                `https://drive.google.com/file/d/${fileId}/view`,
        });
    } catch (error: any) {
        console.error(
            "Google Drive upload error:",
            error
        );

        return Response.json(
            {
                error:
                    error?.message ||
                    "Failed to upload screenshot to Google Drive",
            },
            { status: 500 }
        );
    }
}

// ==================================================
// DELETE PAYMENT SCREENSHOT
// ==================================================

export async function DELETE(
    request: Request
) {
    try {
        const body = await request.json();

        const fileId = body.fileId;

        if (!fileId) {
            return Response.json(
                {
                    error: "File ID is required",
                },
                { status: 400 }
            );
        }

        await drive.files.delete({
            fileId,
        });

        return Response.json({
            success: true,
        });
    } catch (error: any) {
        console.error(
            "Google Drive delete error:",
            error
        );

        return Response.json(
            {
                error:
                    error?.message ||
                    "Failed to delete screenshot",
            },
            { status: 500 }
        );
    }
}