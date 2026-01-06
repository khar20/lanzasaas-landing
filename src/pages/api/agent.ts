import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
    const AGENT_URL = locals.runtime?.env?.AGENT_URL || import.meta.env.AGENT_URL

    if (!AGENT_URL) {
        return new Response(JSON.stringify({ error: 'Server configuration error: Missing AGENT_URL' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const body = await request.json();

        const n8nResponse = await fetch(AGENT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: body.message,
                sessionId: body.sessionId
            }),
        });

        const data = await n8nResponse.json();

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Error connecting to agent' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};