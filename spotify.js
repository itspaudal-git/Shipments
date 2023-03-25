const CLIENT_ID = 'c5e10854685c47ceb5b83f172b26322f';
const CLIENT_SECRET = '00e097ee91d5469abb2783ce8e1509d3';
const REDIRECT_URI = 'https://example.com/callback/';

const authEndpoint = 'https://accounts.spotify.com/authorize';
const tokenEndpoint = 'https://accounts.spotify.com/api/token';

const scopes = ['user-read-private', 'user-read-email'];

const getToken = () => {
  const url = `${authEndpoint}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${scopes.join('%20')}`;

  window.location.href = url;
};

const getAccessToken = async (code) => {
  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
    },
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${REDIRECT_URI}`,
  });

  const data = await response.json();

  return data.access_token;
};

const searchTracks = async (token, query) => {
  const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  return data.tracks.items;
};

const displayTracks = (tracks) => {
  const container = document.querySelector('#tracks');

  tracks.forEach((track) => {
    const item = document.createElement('div');
    item.className = 'track';
    item.innerHTML = `
      <img src="${track.album.images[0].url}">
      <div>
        <h3>${track.name}</h3>
        <p>${track.artists.map((artist) => artist.name).join(', ')}</p>
      </div>
    `;

    container.appendChild(item);
  });
};

// Check if there is an access token in the URL
const params = new URLSearchParams(window.location.search);
const code = params.get('code');

if (code) {
  getAccessToken(code)
    .then((token) => {
      const query = 'billie eilish';

      searchTracks(token, query)
        .then(displayTracks)
        .catch(console.error);
    })
    .catch(console.error);
} else {
  getToken();
}
