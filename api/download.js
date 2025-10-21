export default async function handler(req, res) {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: "Missing ?url parameter" });
  }

  try {
    // Using a public yt-dlp endpoint
    const api = `https://api.tomp3.cc/api/v1/convert?url=${encodeURIComponent(url)}`;
    const response = await fetch(api);
    const data = await response.json();

    return res.status(200).json({
      title: data.title,
      download: data.link,
      thumbnail: data.thumbnail,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}
