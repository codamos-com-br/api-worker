export interface Env {}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		if (request.method !== "POST") {
			return new Response(null, {
				status: 400,
			});
		}

		const responseBody = crypto.randomUUID();
		return new Response(responseBody, {
			status: 200,
			headers: {
				"Access-Control-Allow-Origin": "https://codamos.com.br",
				"Content-type": "text/plain",
			},
		});
	},
};
