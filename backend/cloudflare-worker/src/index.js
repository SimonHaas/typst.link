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
		const targetUrl = new URL(request.url);
		console.log({ url: request.url });

		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, OPTIONS',
			'Access-Control-Max-Age': '86400',
			'Content-Type': 'text/plain'
		};

		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: corsHeaders,
			});
		}

		const searchParams = targetUrl.searchParams;
		const urlParam = searchParams.get('url');

		if (!urlParam) {
			return new Response('Missing "url" parameter', { status: 400 });
		};

		try {
			const response = await fetch(urlParam);
			const text = await response.text();

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
