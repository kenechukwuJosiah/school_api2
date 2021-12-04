const Invoice = require("../model/invoice");
const PostutmeregModel = require("../model/postutmemodel");
const crypto = require("crypto");
const axios = require("axios");

exports.createInvoice = async (req, res, next) => {
  try {
    const response = await Invoice.findOne({
      username: req.body.username,
      paymentTypeId: req.body.paymentTypeId,
    });
    if (response == null) {
      const orderId = Date.now();
      const marchantId = "2547916";
      const serviceTypeId = "4430731";
      const APIKEY = "1946";
      const concats =
        marchantId + serviceTypeId + orderId + req.body.amount + APIKEY;
      const hash = crypto.createHash("sha512");
      const data = hash.update(concats, "utf-8");
      const gen_hash = data.digest("hex");

      const data1 = {
        payerSurname: req.body.surname,
        amount: req.body.amount,
        payerName: req.body.name,
        orderId: orderId,
        payerPhone: req.body.phone,
        payerEmail: req.body.email,
        paymentId: req.body.paymentTypeId,
        serviceTypeId: "4430731",
        marchantId: marchantId,
      };

      // console.log(marchantId, "\n", gen_hash);

      axios({
        method: "post",
        url: "https://remitademo.net/remita/exapp/api/v1/send/api/echannelsvc/merchant/api/paymentinit",
        data: data1,
        headers: {
          "Content-Type": "application/json",
          Authorization: `remitaConsumerKey=${marchantId},remitaConsumerToken=${gen_hash}`,
        },
      })
        .then(async (response) => {
          // console.log(response);
          if (response.data.status === "INVALID_REQUEST") {
            return res.status(200).json({
              code: "002",
              status: "error",
              message: "Error occured",
            });
          }

          const response1 = JSON.parse(response.data.slice(7, -1));
          // console.log(JSON.parse(response1))
          // console.log("Then here: ", response.data.statuscode, response.data.RRR);

          if (response1.statuscode === "025") {
            const data = await Invoice.create({
              username: req.body.username,
              surname: req.body.surname,
              amount: req.body.amount,
              phone: req.body.phone,
              payer: req.body.payer,
              orderId: req.body.orderId,
              paymentTypeId: req.body.paymentTypeId,
              reference: response1.RRR,
              date_paid: new Date(),
              date_generated: new Date(),
            });

            return res.status(200).json({
              code: "00",
              status: "success",
              data,
            });
          } else {
            return res.status(500).json({
              code: "002",
              status: "fail",
              message: "something went wrong",
            });
          }
        })
        .catch(function (error) {
          console.log(error);
          return res.status(500).json({
            code: "002",
            status: "fail",
            message: "Error occured while processing request",
          });
        });
    } else {
      return res.status(200).json({
        code: "00",
        stauts: "success",
        data: response,
      });
    }
  } catch (error) {
    return res.status(500).json({
      code: "002",
      stauts: "error",
      error,
    });
  }
};

exports.rrrGen = async (req, res, next) => {
  console.log(req.body.email);
  const marchantId = "2547916";
  const apiKey = "1946";
  const rrr = "240008104947";
  const concat = `${rrr}${apiKey}${marchantId}`;
  const apiHash = crypto
    .createHash("sha512")
    .update(concat, "utf-8")
    .digest("hex");
  // console.log(apiHash);

  axios({
    method: "get",
    url: `https://remitademo.net/remita/exapp/api/v1/send/api/echannelsvc/${marchantId}/${rrr}/${apiHash}/status.reg`,
  })
    .then(async (response) => {
      const data = await Invoice.findOne({ orderId: response.data.orderId });
      // console.log(data);
      if (data !== null) {
        if (data.payer === req.body.email) {
          await PostutmeregModel("2020-2021").updateOne(
            { email: req.body.email },
            { stage: 1, status: 1 }
          );
          await Invoice.updateOne(
            { payer: req.body.email },
            {
              // orderId: response.orderId,
              // reference: response.RRR,
              // amount: response.amount,
              status: 1,
            }
          );
          return res.status(200).json({
            code: "00",
            status: "ok",
            message: "RRR Generated successfully",
          });
        } else {
          return res.status(200).json({
            code: "00",
            status: "fail",
            message: "Invalid Email",
          });
        }
      } else {
        return res.status(200).json({
          code: "00",
          status: "fail",
          message: "Invalid OrderId",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(200).json({
        code: "00E",
        status: "error",
        message: "something went wrong",
      });
    });
};
