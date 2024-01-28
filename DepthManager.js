export class DepthManager {
  constructor(market) {
    this.market = market;
    this.bids = {};
    this.asks = {};
    setInterval(() => {
      this.pollMarket();
    }, 3000);
  }

  async pollMarket() {
    try {
      const res = await fetch(
        `https://public.coindcx.com/market_data/orderbook?pair=${this.market}`
      );
      const depth = await res.json();
      this.bids = depth.bids;
      this.asks = depth.asks;
    } catch (error) {
      console.error("Error fetching market data:", error.message);
    }
  }

  getRelevantDepth() {
    let highestBid = -100;
    let lowestAsk = 10000000;

    Object.keys(this.bids).forEach((x) => {
      if (parseFloat(x) > highestBid) {
        highestBid = parseFloat(x);
      }
    });

    Object.keys(this.asks).forEach((x) => {
      if (parseFloat(x) < lowestAsk) {
        lowestAsk = parseFloat(x);
      }
    });

    return { highestBid, lowestAsk };
  }
}
// Usage example
// const depthManager = new DepthManager("exampleMarket");
