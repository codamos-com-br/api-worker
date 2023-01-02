import worker from "../src/index";

test("Invalid requests", async () => {
	const result = await worker.fetch(
		new Request("http://api.codamos.com.br/uuid4", { method: "GET" }),
		{},
		{} as any
	);

	expect(result.status).toBe(400);
});

test("Valid requests", async () => {
	const result = await worker.fetch(
		new Request("http://api.codamos.com.br/uuid4", {
      method: "POST",
      headers: {
        'Origin': 'https://codamos.com.br',
        'Referer': 'https://codamos.com.br',
      },
    }),
		{},
		{} as any
	);

	expect(result.status).toBe(200);
	expect(result.headers.get("Content-Type")).toBe("text/plain");
	expect(result.headers.get("Access-Control-Allow-Origin")).toBe(
		"https://codamos.com.br"
	);

	const responseBody = await result.text();
	expect(responseBody)
		// 00000000-0000-0000-0000-000000000000
		.toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
});
