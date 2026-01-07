export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) {
    res.statusCode = 200;
    res.end(JSON.stringify([]));
    return;
  }
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=reviews&key=${encodeURIComponent(apiKey)}`;
    const response = await fetch(url);
    const json = await response.json();
    const reviews = Array.isArray(json.result?.reviews) ? json.result.reviews : [];
    const normalized = reviews.map((r: any) => ({
      author_name: r.author_name,
      rating: r.rating,
      text: r.text,
      time: r.time
    }));
    res.statusCode = 200;
    res.end(JSON.stringify(normalized));
  } catch (err) {
    res.statusCode = 200;
    res.end(JSON.stringify([]));
  }
}
