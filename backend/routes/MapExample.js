const express = require("express");
const { checkAccessToken } = require("../middleware/auth.js");
const { DummyLayers } = require("../mock/Layers");
// Create Express Router
const router = express.Router();

// Attach middleware to ensure that user is authenticated
router.use(checkAccessToken(process.env.AUTH0_DOMAIN, process.env.AUDIENCE));

/**
 * GET /api/layers
 */
router.get("/layers", (req, res, next) => {
  res.json(DummyLayers);
});

module.exports = router;
