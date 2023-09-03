import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        return NextResponse.json({ message: 'Hello from the server' });
    } catch (err) {
        console.error("Error occurred:", err);
        return NextResponse.json({ error: err }, { status: 500 });
    }
};