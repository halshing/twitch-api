const fetch = require("node-fetch");

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const twitchLogin = process.env.TWITCH_LOGIN;

const baseUrl = "https://api.twitch.tv/helix";

const getAccessToken = async () => {
  let url = `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`;
  let res = await fetch(url, { method: "POST" });
  return res.json();
};

const getUser = async (accessToken) => {
  let url = `${baseUrl}/users?login=${twitchLogin}`;
  let res = await fetch(url, {
    method: "GET",
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  let data = await res.json();
  return Array.isArray(data.data) ? data.data[0] : {};
};

const getChannelInfo = async (accessToken) => {
  let user = await getUser(accessToken);
  let url = `${baseUrl}/channels?broadcaster_id=${user.id}`;
  let res = await fetch(url, {
    method: "GET",
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.json();
};

const getFollowers = async (accessToken) => {
  let user = await getUser(accessToken);
  let url = `${baseUrl}/users/follows?to_id=${user.id}`;
  let res = await fetch(url, {
    method: "GET",
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.json();
};

module.exports = {
  getAccessToken,
  getUser,
  getChannelInfo,
  getFollowers,
};
