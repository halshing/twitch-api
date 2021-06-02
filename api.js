const { Router } = require("express");
const { getAccessToken, getChannelInfo } = require("./twitch");

const router = Router();

router.use(async (req, res, next) => {
  try {
    // get access token #YoDawgMemeLOL
    let token = await getAccessToken();
    req.accessToken = token.access_token;
    next();
  } catch (err) {
    console.error(err);
    next();
  }
});

router.get("/mychannel", async (req, res) => {
  try {
    let data = await getChannelInfo(req.accessToken);
    res.json(data);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
