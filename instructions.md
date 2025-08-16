// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token = 'BQA_76SSYD5xgkgvlrFAaVBDD5pg9vv2RtM3jsTZBmyvrNvKGUiXzB2Ezuwhy_fQWWkA3I0dURKICaYsRfr2cmX0zfLvYA91GjJYyz0kMB6wW1h0B6wb9NFbE2U5jMYqkO7soU182hLAmFe-HLZ1Nef5VbijtTjxhpAYty429MzlYaeehmn1_RxVB293eYvIndkMEvkWHcUwQ4Senbx5p5UoE-wsxc5CkzxgBmXIhP3wPPMYDGiz_xUTa05x_q0QzkFEY-JceOJMCVGWp8VlEztJvyEbAtV8g3DhdXMCXJb05grHeiA7v8kEuTiuGshr';
async function fetchWebApi(endpoint, method, body) {
const res = await fetch(`https://api.spotify.com/${endpoint}`, {
headers: {
Authorization: `Bearer ${token}`,
},
method,
body:JSON.stringify(body)
});
return await res.json();
}

async function getTopTracks(){
// Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
return (await fetchWebApi(
'v1/me/top/tracks?time_range=long_term&limit=5', 'GET'
)).items;
}

const topTracks = await getTopTracks();
console.log(
topTracks?.map(
({name, artists}) =>
`${name} by ${artists.map(artist => artist.name).join(', ')}`
)
);
// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token = 'BQA_76SSYD5xgkgvlrFAaVBDD5pg9vv2RtM3jsTZBmyvrNvKGUiXzB2Ezuwhy_fQWWkA3I0dURKICaYsRfr2cmX0zfLvYA91GjJYyz0kMB6wW1h0B6wb9NFbE2U5jMYqkO7soU182hLAmFe-HLZ1Nef5VbijtTjxhpAYty429MzlYaeehmn1_RxVB293eYvIndkMEvkWHcUwQ4Senbx5p5UoE-wsxc5CkzxgBmXIhP3wPPMYDGiz_xUTa05x_q0QzkFEY-JceOJMCVGWp8VlEztJvyEbAtV8g3DhdXMCXJb05grHeiA7v8kEuTiuGshr';
async function fetchWebApi(endpoint, method, body) {
const res = await fetch(`https://api.spotify.com/${endpoint}`, {
headers: {
Authorization: `Bearer ${token}`,
},
method,
body:JSON.stringify(body)
});
return await res.json();
}

const tracksUri = [
'spotify:track:4ThOZ5HXGvCfUbptEJRzyF','spotify:track:6G8xvLFNkXy3HM5EbQI6c8','spotify:track:36gcliMRX1vCpgnrZE3dFZ','spotify:track:3ryXl6OFAr9fzUpIjAnHIY','spotify:track:211apnzqBdvi4A5SjL0Mzp'
];

async function createPlaylist(tracksUri){
const { id: user_id } = await fetchWebApi('v1/me', 'GET')

const playlist = await fetchWebApi(
`v1/users/${user_id}/playlists`, 'POST', {
"name": "My top tracks playlist",
"description": "Playlist created by the tutorial on developer.spotify.com",
"public": false
})

await fetchWebApi(
`v1/playlists/${playlist.id}/tracks?uris=${tracksUri.join(',')}`,
'POST'
);

return playlist;
}

const createdPlaylist = await createPlaylist(tracksUri);
console.log(createdPlaylist.name, createdPlaylist.id);
const playlistId = '5RPYC3rpnX9Jlf7g9dlwga';

<iframe
  title="Spotify Embed: Recommendation Playlist "
  src={`https://open.spotify.com/embed/playlist/5RPYC3rpnX9Jlf7g9dlwga?utm_source=generator&theme=0`}
  width="100%"
  height="100%"
  style={{ minHeight: '360px' }}
  frameBorder="0"
  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
  loading="lazy"
/>
