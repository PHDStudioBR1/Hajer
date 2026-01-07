export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  if (!token || !userId) {
    res.statusCode = 200;
    res.end(JSON.stringify([]));
    return;
  }
  try {
    const url = `https://graph.instagram.com/${encodeURIComponent(userId)}/media?fields=id,caption,media_url,permalink,media_type,timestamp&access_token=${encodeURIComponent(token)}`;
    const response = await fetch(url);
    const json = await response.json();
    const data = Array.isArray(json.data) ? json.data : [];
    const normalized = data.map((m: any) => ({
      id: m.id,
      caption: m.caption,
      media_url: m.media_url,
      permalink: m.permalink,
      media_type: m.media_type,
      timestamp: m.timestamp
    }));
    res.statusCode = 200;
    res.end(JSON.stringify(normalized));
  } catch (err) {
    res.statusCode = 200;
    res.end(JSON.stringify([]));
  }
}
