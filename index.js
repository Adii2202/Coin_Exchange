import axios from "axios";

import { DepthManager } from "./DepthManager";
import { cancelAll, createOrder } from "./order";

const solInMarket = new DepthManager("B-SOL_INR");
const usdtInMarket = new DepthManager("B-USDT_INR");
const solUsdtMarket = new DepthManager("B-SOL_USDT");

setInterval(() => {
  console.log(solInMarket.getRelevantDepth());
  console.log(usdtInMarket.getRelevantDepth());
  console.log(solUsdtMarket.getRelevantDepth());

  // there are two sides

  //   1. sell sol for inr, buy usdt from inr and buy sol from inr
  // lets start with 1 sol
  const canGetInr = solInMarket.getRelevantDepth().lowestAsk - 0.001;
  const canGetUsdt = canGetInr / usdtInMarket.getRelevantDepth().lowestAsk;
  const canGetSol = canGetUsdt / solUsdtMarket.getRelevantDepth().lowestAsk;

  console.log(`You can convert ${1} SOL into ${canGetSol} SOL`);

  // buy sol from inr, sell sol for usdt, sell usdt for inr
  const inititalInr = solInMarket.getRelevantDepth().highestBid + 0.001;
  const canGetUsdt2 = solUsdtMarket.getRelevantDepth().highestBid;
  const canGetInr2 = usdtInMarket.getRelevantDepth().highestBid * canGetUsdt2;

  console.log(`You can convert ${inititalInr} SOL into ${canGetInr2} SOL`);
}, 2000);

setInterval(async () => {
  await createOrder("buy", "XAIINR", 81, 1, Math.random());
  await new Promise((r) => setTimeout(r, 4000));
  await cancelAll("XAIINR");
}, 5000);

async function main() {
  const highestbid = solInMarket.getRelevantDepth().highestBid;
  console.log(`placing order for ${parseFloat(highestbid) + 0.01}`);
  await createOrder(
    "buy",
    "XAIINR",
    (parseFloat(highestbid) + 0.01).toFixed(3),
    10,
    Math.random()
  );
  await new Promise((r) => setTimeout(r, 10000));
  await cancelAll("XAIINR");
  await new Promise((r) => setTimeout(r, 1000));
  main();
}

setTimeout(async () => {
  main();
}, 2000);
