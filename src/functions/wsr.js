require("dotenv").config();
const express = require("express");
const axios = require("axios");
const { google } = require("googleapis");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const qs = require("qs");

const app = express();

const router = express.Router();

/**
 * Get all watershed reports
 */
router.get("/", async (req, res) => {
  let didCancel = false;

  try {
    const formData = {
      username: process.env.RW_DB_USERNAME,
      password: process.env.RW_DB_PASSWORD,
      grant_type: "password",
      email: "",
      orgaspnetuserid: "",
      organizationname: "",
      kitnumber: "",
      organizationid: "",
    };

    const token = await axios.post(
      "https://www.coloradoriverwatch.com/Token",
      qs.stringify(formData),
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );

    const data = await axios.get(
      "https://www.coloradoriverwatch.com/api/ReportMetadata/ReadRawTable/WaterBody",
      { headers: { Authorization: `Bearer ${token.data.access_token}` } }
    );

    if (!didCancel) {
      res.json(data.data);
    }
  } catch (err) {
    // Is this error because we cancelled it ourselves?
    if (axios.isCancel(err)) {
      console.log(`call was cancelled`);
    } else {
      console.error(err);
    }
  }
});

/**
 * Get watershed reports for specified WBID
 */
router.get("/:wbid", async (req, res) => {
  const drive = google.drive({
    version: "v3",
    auth: process.env.GOOGLE_API_KEY,
  });

  try {
    const folderId = "1R5VWshdiFLgDKoKseV9DR_U2SA1XmWpT";
    const config = {
      q: `'${folderId}' in parents and name contains '${req.params.wbid}'`,
      orderBy: "name",
    };
    const files = await drive.files.list(config);
    // const download = await drive.files.get({
    //   fileId: "1Re34_xtW6dup9BnJ0r1OWKbbHzYmZqse",
    //   alt: "media",
    // });
    res.json({
      data:
        files.data.files.filter(
          (d) => d.mimeType === "application/vnd.ms-excel"
        ).length > 0,
      report:
        files.data.files.filter((d) => d.mimeType === "application/pdf")
          .length > 0,
    });
    res.json(files.data.files);
  } catch (err) {
    console.error(err);
  }
});

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use("/.netlify/functions/wsr/", router); // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
