require("dotenv").config();

const axios = require("axios");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 4000;

app.use(cors());

app.get("/seafile", ({ res }) => {
  axios(`${process.env.SEAFILE_URL}/api2/repos/`, {
    headers: {
      Authorization: `Token ${process.env.SEAFILE_TOKEN}`
    }
  })
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      res.send(error);
    });
});

app.get("/plex", ({ res }) => {
  axios(`${process.env.PLEX_URL}/status/sessions`, {
    params: {
      "X-Plex-Token": process.env.PLEX_TOKEN
    }
  })
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      res.send(error);
    });
});

app.get("/unifi", ({ res }) => {
  axios
    .post(`${process.env.UNIFI_URL}/api/login`, {
      username: process.env.UNIFI_USERNAME,
      password: process.env.UNIFI_PASSWORD,
      remember: false,
      strict: true
    })
    .then(response => {
      axios(`${process.env.UNIFI_URL}/api/s/default/stat/health`, {
        headers: {
          cookie: response.headers["set-cookie"].toString()
        }
      })
        .then(response => {
          res.send(response.data);
        })
        .catch(error => {
          res.send(error);
        });
    })
    .catch(error => {
      res.send(error);
    });
});

app.get("/netdata-do", ({ res }) => {
  axios(`${process.env.NETDATA_DO_URL}/api/v1/info`)
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      res.send(error);
    });
});

app.get("/netdata-home", ({ res }) => {
  axios(`${process.env.NETDATA_HOME_URL}/api/v1/info`)
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      res.send(error);
    });
});

app.get("/uptime-robot", ({ res }) => {
  axios
    .post("https://api.uptimerobot.com/v2/getMonitors", {
      api_key: process.env.UPTIME_ROBOT_KEY
    })
    .then(response => {
      let client = [];

      response.data.monitors.map(monitor => {
        const { id, friendly_name, status } = monitor;

        client.push({ id, friendly_name, status });
      });

      res.send(client);
    })
    .catch(error => {
      res.send(error);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
