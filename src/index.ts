export interface Env {}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const expectedOrigin = new URL("https://codamos.com.br");

    const origin = new URL(
      request.headers.get("Origin") || "https://invalid.url"
    );
    const referer = new URL(
      request.headers.get("Referer") || "https://invalid.url"
    );
    if (
      origin.host !== expectedOrigin.host ||
      referer.host !== expectedOrigin.host
    ) {
      return new Response(null, {
        status: 400,
      });
    }

    if (request.method === "POST" && url.pathname.startsWith("/uuid")) {
      const responseBody = crypto.randomUUID();
      return new Response(responseBody, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "https://codamos.com.br",
          "Content-type": "text/plain",
        },
      });
    }

    if (request.method === "GET" && url.pathname.startsWith("/ifcfg")) {
      const ip =
        request.headers.get("CF-Pseudo-IPv4") ||
        request.headers.get("CF-Connecting-IP") ||
        "";
      return new Response(ip, {
        status: ip !== "" ? 200 : 404,
        headers: {
          "Access-Control-Allow-Origin": "https://codamos.com.br",
          "Content-type": "text/plain",
        },
      });
    }

    return new Response(null, {
      status: 400,
    });
  },
};
