import request from "request";
import crypto from "crypto";
const { key, secret } = require("./config");

const baseurl = "https://api.coindcx.com";

const createOrder = (side, market, price, quantity, clientOrderId) => {
  return new Promise((resolve) => {
    const body = {
      side,
      order_type: "limit_order",
      market,
      price_per_unit: price,
      total_quantity: quantity,
      timestamp: Math.floor(Date.now()),
      client_order_id: clientOrderId,
    };

    const payload = new Buffer(JSON.stringify(body)).toString();
    const signature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const options = {
      url: baseurl + "/exchange/v1/orders/create",
      headers: {
        "X-AUTH-APIKEY": key,
        "X-AUTH-SIGNATURE": signature,
      },
      json: true,
      body: body,
    };

    request.post(options, function (error, response, body) {
      if (error) {
        console.log("Errors while buying orders");
      } else console.log(body);
      resolve();
    });
  });
};

const cancelOrder = () => {};
const cancelAll = (market) => {
  return new Promise((resolve) => {
    const body = {
      market,
      timestamp: Math.floor(Date.now()),
    };

    const payload = new Buffer(JSON.stringify(body)).toString();
    const signature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const options = {
      url: baseurl + "/exchange/v1/orders/cancel_all",
      headers: {
        "X-AUTH-APIKEY": key,
        "X-AUTH-SIGNATURE": signature,
      },
      json: true,
      body: body,
    };

    request.post(options, function (error, response, body) {
      if (error) {
        console.log("Errors while cancelling orders");
      } else console.log(body);
      resolve();
    });
  });
};

// Usage examples
createOrder("buy", "BTCINR", 50000, 1, "myClientId123");
cancelOrder();
cancelAll("BTCINR");
