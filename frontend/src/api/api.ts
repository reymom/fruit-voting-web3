const port = process.env.NEXT_PUBLIC_PORT ? process.env.NEXT_PUBLIC_PORT : 8080;

async function callAPI({
  url,
  method,
  body,
  headers,
}: {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
}) {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(`HTTP error! status: ${data.message}`);
  }

  const data = await response.json();
  return data;
}

export async function vote(fruitName: string) {
  return callAPI({
    url: `http://localhost:${port}/vote/${fruitName}`,
    method: "GET",
  });
}

export async function getVotes(fruitName: string) {
  return callAPI({
    url: `http://localhost:${port}/getVotes/${fruitName}`,
    method: "GET",
  });
}
