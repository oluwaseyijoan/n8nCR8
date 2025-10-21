import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export default async function handler(req, res) {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: "Missing 'url' query parameter" });
  }

  try {
    // Download video info (no file storage)
    const cmd = `yt-dlp -j "${url}"`;
    const { stdout } = await execPromise(cmd);
    const info = JSON.parse(stdout);

    // Get best format URL
    const videoUrl = info.url || (info.formats?.pop()?.url ?? null);

    if (!videoUrl) {
      throw new Error("Could not extract download URL");
    }

    res.status(200).json({
      status: "ok",
      title: info.title,
      uploader: info.uploader,
      url: videoUrl,
      duration: info.duration,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
