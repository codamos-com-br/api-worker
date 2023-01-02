export interface Env {}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
    const expectedOrigin = new URL('https://codamos.com.br');

    const origin = new URL(request.headers.get('Origin') || 'https://invalid.url');
    const referer = new URL(request.headers.get('Referer') || 'https://invalid.url');
    if (
      request.method !== 'POST'
      || origin.host !== expectedOrigin.host
      || referer.host !== expectedOrigin.host
    ) {
			return new Response(null, {
				status: 400,
			});
    }

		const responseBody = crypto.randomUUID();
		return new Response(responseBody, {
			status: 200,
			headers: {
				"Access-Control-Allow-Origin": 'https://codamos.com.br',
				"Content-type": "text/plain",
			},
		});
	},
};
