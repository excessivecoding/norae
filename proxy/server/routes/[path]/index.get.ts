export default defineEventHandler(async (event) => {
  // Get the path from the request URL
  const path = getRequestURL(event).pathname.replace(/^\/+/, "");

  // Create the target URL for genius.com
  const targetUrl = `https://genius.com/${path}`;

  try {
    // Fetch the content from genius.com
    const response = await fetch(targetUrl);

    // Get the response body as text
    const body = await response.text();

    // Set the Content-Type header to match the response
    setResponseHeader(
      event,
      "Content-Type",
      response.headers.get("Content-Type") || "text/html"
    );

    // Return the response body
    return body;
  } catch (error) {
    // Handle errors
    console.error(`Error proxying to ${targetUrl}:`, error);

    // Return an error response
    throw createError({
      statusCode: 500,
      statusMessage: "Error proxying to Genius",
    });
  }
});
