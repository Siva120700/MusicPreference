import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import client from "../dbClient";
import Cors from 'cors';

// Initialize CORS
const cors = Cors({
    methods: ['POST', 'GET', 'HEAD', 'PATCH', 'DELETE'],
    origin: 'https://music-preference.vercel.app', // Your Vercel URL
});

// Middleware to run CORS
const runCors = (req, res) => {
    return new Promise((resolve, reject) => {
        cors(req, res, (result) => {
            if (result instanceof Error) return reject(result);
            resolve(result);
        });
    });
};

// Function to fetch YouTube video title
async function fetchYoutubeTitle(youtubeId: string): Promise<string> {
    const apiKey = process.env.YOUTUBE_API_KEY; 
    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${youtubeId}&key=${apiKey}&part=snippet`
    );
    if (!response.ok) {
        throw new Error("Failed to fetch video details from YouTube");
    }
    const data = await response.json();
    const title = data?.items[0]?.snippet?.title;
    return title ?? "Unknown Title"; 
}

// Zod schema for request validation
const CreateStreamSchema = z.object({
    url: z.string().url(), 
});

// POST request handler
export async function POST(req: NextRequest) {
    const res = NextResponse.next();

    await runCors(req, res); // Run CORS

    try {
        const data = CreateStreamSchema.parse(await req.json());
        const youtubeId = extractYoutubeId(data.url);

        const videoTitle = await fetchYoutubeTitle(youtubeId);

        const result = await client.query(
            `INSERT INTO streams (url, thumbnail_url, votes, title) VALUES ($1, $2, 0, $3) RETURNING *`,
            [data.url, `https://img.youtube.com/vi/${youtubeId}/0.jpg`, videoTitle]
        );

        return NextResponse.json(result.rows[0]);
    } catch (e) {
        console.error("Error details:", e);
        return NextResponse.json(
            {
                message: "Error while adding a stream",
                error: e.message || "Unknown error"
            },
            { status: 500 }
        );
    }
}

// GET request handler
export async function GET() {
    const res = NextResponse.next();

    await runCors(req, res); // Run CORS

    try {
        const result = await client.query(
            `SELECT * FROM streams ORDER BY votes DESC`
        );
        return NextResponse.json(result.rows);
    } catch (err) {
        console.error("Error fetching streams:", err);
        return NextResponse.json(
            {
                message: "Error fetching streams",
                error: err.message || "Unknown error"
            },
            { status: 500 }
        );
    }
}

// PATCH request handler for voting
export async function PATCH(req: NextRequest) {
    const res = NextResponse.next();

    await runCors(req, res); // Run CORS

    try {
        const { streamId } = await req.json(); 

        const result = await client.query(
            `UPDATE streams SET votes = votes + 1 WHERE id = $1 RETURNING *`,
            [streamId]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ message: "Stream not found" }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (e) {
        console.error("Error while voting:", e);
        return NextResponse.json(
            {
                message: "Error while voting",
                error: e.message || "Unknown error"
            },
            { status: 500 }
        );
    }
}

// DELETE request handler
export async function DELETE(req: NextRequest) {
    const res = NextResponse.next();

    await runCors(req, res); // Run CORS

    try {
        const { streamId } = await req.json();

        const result = await client.query(`DELETE FROM streams WHERE id = $1 RETURNING *`, [streamId]);

        if (result.rowCount === 0) {
            return NextResponse.json({ message: "Song not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Song removed" });
    } catch (e) {
        console.error("Error deleting stream:", e);
        return NextResponse.json(
            {
                message: "Error deleting stream",
                error: e.message || "Unknown error"
            },
            { status: 500 }
        );
    }
}

// Function to extract YouTube video ID from the URL
function extractYoutubeId(url: string): string {
    const regex =
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : "";
}
