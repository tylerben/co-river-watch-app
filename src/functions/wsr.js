require("dotenv").config();
const express = require("express");
const axios = require("axios");
const { google } = require("googleapis");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const qs = require("qs");

const app = express();

const router = express.Router();

const checkWbidName = (name1, name2) => {
  const name1Lower = name1.toLowerCase();
  const name2Lower = name2.toLowerCase();
  return name1.includes(name2);
};

/**
 * Get all watershed reports
 */
router.get("/", async (req, res) => {
  let didCancel = false;
  const drive = google.drive({
    version: "v3",
    auth: process.env.GOOGLE_API_KEY,
  });

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

    const folderId = "1R5VWshdiFLgDKoKseV9DR_U2SA1XmWpT";
    const config = {
      q: `'${folderId}' in parents`,
      orderBy: "name",
    };
    const files = await drive.files.list(config);
    const joinedData = data.data.map((wbid) => {
      const report = files.data.files.filter((d) => {
        return (
          d.mimeType === "application/pdf" && checkWbidName(d.name, wbid.Id)
        );
      });
      const reportData = files.data.files.filter((d) => {
        return (
          d.mimeType === "application/vnd.ms-excel" &&
          checkWbidName(d.name, wbid.Id)
        );
      });
      return {
        ...wbid,
        reportLink:
          report.length > 0
            ? `https://drive.google.com/uc?id=${report[0].id}&export=download`
            : null,
        dataLink:
          reportData.length > 0
            ? `https://drive.google.com/uc?id=${reportData[0].id}&export=download`
            : null,
      };
    });

    if (!didCancel) {
      res.json(joinedData);
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

    const report = files.data.files.filter(
      (d) => d.mimeType === "application/pdf"
    );
    const data = files.data.files.filter(
      (d) => d.mimeType === "application/vnd.ms-excel"
    );

    let reportLink = null;
    let dataLink = null;
    if (report.length > 0) {
      const reportLinkRes = await drive.files.get({
        fileId: report[0].id,
        fields: "webContentLink",
      });
      reportLink = reportLinkRes.data.webContentLink;
    }
    if (data.length > 0) {
      const dataLinkRes = await drive.files.get({
        fileId: data[0].id,
        fields: "webContentLink",
      });
      dataLink = dataLinkRes.data.webContentLink;
    }

    res.json({
      report: reportLink,
      data: dataLink,
    });
  } catch (err) {
    console.error(err);
  }
});

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use("/.netlify/functions/wsr/", router); // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
