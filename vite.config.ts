import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        {
          name: 'google-reviews-proxy',
          configureServer(server) {
            server.middlewares.use('/api/reviews', async (req, res) => {
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Content-Type', 'application/json');
              const apiKey = env.GOOGLE_MAPS_API_KEY || env.GOOGLE_PLACES_API_KEY;
              const placeId = env.GOOGLE_PLACE_ID;
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
            });
            server.middlewares.use('/api/instagram', async (req, res) => {
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Content-Type', 'application/json');
              const token = env.INSTAGRAM_ACCESS_TOKEN;
              const userId = env.INSTAGRAM_USER_ID;
              if (!token || !userId) {
                res.statusCode = 200;
                res.end(JSON.stringify([]));
                return;
              }
              try {
                const mediaUrl = `https://graph.instagram.com/${encodeURIComponent(userId)}/media?fields=id,caption,media_url,permalink,media_type,timestamp&access_token=${encodeURIComponent(token)}`;
                const response = await fetch(mediaUrl);
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
            });
          }
        }
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
