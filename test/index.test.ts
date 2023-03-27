import worker from "../src/index";

test("Invalid requests", async () => {
  const result = await worker.fetch(
    new Request("http://api.codamos.com.br/uuid4", { method: "GET" }),
    {},
    {} as any
  );

  expect(result.status).toBe(400);
});

test("Valid ifcfg IPv4 requets", async () => {
  const res = await worker.fetch(
    new Request("http://api.codamos.com.br/ifcfg", {
      method: "GET",
      headers: {
        Origin: "https://codamos.com.br",
        Referer: "https://codamos.com.br",
        "CF-Connecting-IP": "2a01:c23:6194:7a00:9474:8184:d67e:9b95",
        "CF-Pseudo-IPv4": "192.168.10.1",
      },
    }),
    {},
    {} as any
  );

  expect(res.status).toBe(200);
  expect(res.headers.get("Content-Type")).toBe("text/plain");
  expect(res.headers.get("Access-Control-Allow-Origin")).toBe(
    "https://codamos.com.br"
  );

  const body = await res.text();
  expect(body).toBe("192.168.10.1");
});

test("Valid ifcfg IPv6 requests", async () => {
  const res = await worker.fetch(
    new Request("http://api.codamos.com.br/ifcfg", {
      method: "GET",
      headers: {
        Origin: "https://codamos.com.br",
        Referer: "https://codamos.com.br",
        "CF-Connecting-IP": "2a01:c23:6194:7a00:9474:8184:d67e:9b95",
        // No IPv4 provided
      },
    }),
    {},
    {} as any
  );

  expect(res.status).toBe(200);
  expect(res.headers.get("Content-Type")).toBe("text/plain");
  expect(res.headers.get("Access-Control-Allow-Origin")).toBe(
    "https://codamos.com.br"
  );

  const body = await res.text();
  expect(body).toBe("2a01:c23:6194:7a00:9474:8184:d67e:9b95");
});

test("Valid uuid4 requests", async () => {
  const result = await worker.fetch(
    new Request("http://api.codamos.com.br/uuid4", {
      method: "POST",
      headers: {
        Origin: "https://codamos.com.br",
        Referer: "https://codamos.com.br",
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
