/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
    async fetch(request, env, ctx) {
        // 1. Define your headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': 'https://www.simonhaas.eu',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Max-Age': '86400',
          	'Content-Type': 'text/plain'
        };

        // 2. Handle the "Preflight" request (OPTIONS)
        // Browsers send this BEFORE the actual GET request
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                status: 204,
                headers: corsHeaders,
            });
        }

        // 3. Your actual logic
        console.log(`Received request for ${request.url}`);
        const targetUrl = new URL(request.url).searchParams.get('url');

        if (!targetUrl) {
            return new Response('Missing "url" parameter', { status: 400 });
        }

        try {
            const response = await fetch(targetUrl);
            const text = await response.text();

            // 4. Return the response WITH the CORS headers
            return new Response(text, {
                status: response.status,
                headers: {
                    ...corsHeaders,
                    'Content-Type': response.headers.get('Content-Type') || 'text/plain',
                },
            });
        } catch (err) {
            return new Response('Error fetching target URL', { 
                status: 500, 
                headers: corsHeaders 
            });
        }
    },
};
