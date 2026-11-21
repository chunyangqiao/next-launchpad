export async function GET() {
  const isProduction = process.env.NEXT_PUBLIC_ENV === "production";

  return new Response("", {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
