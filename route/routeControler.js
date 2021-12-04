const express = require("express");
const mainControler = require("../controler/mainControler");

const router = express.Router();

router.post("/", mainControler.createInvoice);
router.post("/rrrgen", mainControler.rrrGen);

module.exports = router;
