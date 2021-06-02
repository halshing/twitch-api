const { Router } = require("express");
const fs = require("fs");
const { getAccessToken, getChannelInfo, getFollowers } = require("./twitch");

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

router.get("/myfollowers", async (req, res) => {
  try {
    let result = await getFollowers(req.accessToken);
    let { total, data } = result;

    let calcFollowage = (value) => {
      let today = new Date();
      let date = new Date(value);

      let milliseconds = Math.abs(date.getTime() - today.getTime());
      let seconds = Math.floor(milliseconds / 1000);
      let minute = Math.floor(seconds / 60);
      seconds = seconds % 60;
      let hour = Math.floor(minute / 60);
      minute = minute % 60;
      day = Math.floor(hour / 24);
      hour = hour % 24;
      
      return { day, hour, minute, seconds };
    };

    let fileContent = () => {
      let content = "";
      for (let item of data) {
        let name = item.from_name;
        let followage = calcFollowage(item.followed_at);
        content += `${name} (${followage.day})     `;
      }
      return content;
    };

    let stream = fs.createWriteStream("./.files/followers.txt");
    stream.write(fileContent());
    res.json(data);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
