import express from 'express';
import axios from 'axios';
import querystring from 'querystring';

const app = express();
const PORT = process.env.PORT || 5000;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

let access_token = null; // You should implement auth flow to get this

// Helper: Get current date minus N months
function getDateMonthsAgo(months) {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date;
}

// Get user's listened tracks from multiple sources
async function getUserListenedTrackIds(token) {
  let trackIds = new Set();

  // 1. Top Tracks (limit 50)
  const topTracksResp = await axios.get('https://api.spotify.com/v1/me/top/tracks?limit=50', {
    headers: { Authorization: `Bearer ${token}` },
  });
  topTracksResp.data.items.forEach(track => trackIds.add(track.id));

  // 2. Recently Played Tracks (limit 50)
  const recentTracksResp = await axios.get('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
    headers: { Authorization: `Bearer ${token}` },
  });
  recentTracksResp.data.items.forEach(item => trackIds.add(item.track.id));

  // 3. Saved Tracks (limit 50 for demo)
  const savedTracksResp = await axios.get('https://api.spotify.com/v1/me/tracks?limit=50', {
    headers: { Authorization: `Bearer ${token}` },
  });
  savedTracksResp.data.items.forEach(item => trackIds.add(item.track.id));

  return trackIds;
}

app.get('/new-releases-from-top-artists', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing access token' });

  try {
    // 1. Get user's top artists
    const topArtistsResponse = await axios.get('https://api.spotify.com/v1/me/top/artists?limit=10', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const topArtists = topArtistsResponse.data.items;

    // 2. Get recently played and saved tracks (for filtering)
    const [recentlyPlayed, savedTracks] = await Promise.all([
      axios.get('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get('https://api.spotify.com/v1/me/tracks?limit=50', {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const listenedTrackIds = new Set([
      ...recentlyPlayed.data.items.map(i => i.track.id),
      ...savedTracks.data.items.map(i => i.track.id),
    ]);

    // 3. Get new releases from top artists and filter
    const results = [];

    for (const artist of topArtists) {
      const artistAlbums = await axios.get(`https://api.spotify.com/v1/artists/${artist.id}/albums?include_groups=album,single&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const trackPromises = artistAlbums.data.items.map(album =>
        axios.get(`https://api.spotify.com/v1/albums/${album.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      const albumDetails = await Promise.all(trackPromises);

      const newTracks = [];
      for (const album of albumDetails) {
        for (const track of album.data.tracks.items) {
          if (!listenedTrackIds.has(track.id)) {
            newTracks.push({
              name: track.name,
              url: `https://open.spotify.com/track/${track.id}`,
              id: track.id,
              embedUrl: `https://open.spotify.com/embed/track/${track.id}`,
            });
            if (newTracks.length >= 5) break;
          }
        }
        if (newTracks.length >= 5) break;
      }

      results.push({
        artistName: artist.name,
        newTracks,
      });
    }

    res.json(results);
  } catch (error) {
    console.error('Error fetching new releases:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch new releases' });
  }
});


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
