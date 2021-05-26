import { Fragment, useContext } from "react";

import { useMediaContext } from "../context/useMediaContext";
import { NFTDataContext } from "../context/NFTDataProvider";
import { CountdownDisplay } from "../components/CountdownDisplay";
import { AuctionType } from "@zoralabs/nft-hooks";

function isInFuture(timestamp: string) {
  const timestampParsed = parseInt(timestamp);
  return timestampParsed > Math.floor(new Date().getTime() / 1000);
}

export const PricingComponent = () => {
  const {
    nft: { data },
  } = useContext(NFTDataContext);

  const { getStyles, getString } = useMediaContext();

  const pricing = data?.pricing;

  if (pricing && pricing.auctionType === AuctionType.PERPETUAL) {
    let listPrice = null;

    if (pricing.perpetual.ask?.pricing) {
      const perpetualPricing = pricing.perpetual.ask?.pricing;
      listPrice = (
        <Fragment>
          <span {...getStyles("textSubdued")}>{getString("LIST_PRICE")}</span>
          <span>
            {perpetualPricing.prettyAmount} {perpetualPricing.currency.symbol}
          </span>
        </Fragment>
      );
    }
    const highestBid = pricing.perpetual.highestBid;
    if (!highestBid && pricing.reserve?.previousBids.length) {
      const highestPreviousBid = pricing.reserve.previousBids[0];
      return (
        <div {...getStyles("cardAuctionPricing", { type: "reserve-pending" })}>
          <span {...getStyles("textSubdued")}>{getString("SOLD_FOR")}</span>
          <span {...getStyles("pricingAmount")}>
            {highestPreviousBid?.pricing.prettyAmount}{" "}
            {highestPreviousBid?.pricing.currency.symbol}
          </span>
          {listPrice}
        </div>
      );
    }
    return (
      <div {...getStyles("cardAuctionPricing", { type: "perpetual" })}>
        <span {...getStyles("textSubdued")}>{getString("HIGHEST_BID")}</span>
        <span {...getStyles("pricingAmount")}>
          {!highestBid && "--"}
          {highestBid?.pricing.prettyAmount}{" "}
          {highestBid?.pricing.currency.symbol}
        </span>
        {listPrice}
      </div>
    );
  }
  if (pricing && pricing.auctionType === AuctionType.RESERVE) {
    if (
      pricing.reserve?.current.reserveMet &&
      !pricing.reserve?.current.likelyHasEnded
    ) {
      const highestBid = pricing.reserve?.current.highestBid;
      return (
        <div {...getStyles("cardAuctionPricing", { type: "reserve-active" })}>
          <span {...getStyles("textSubdued")}>{getString("TOP_BID")}</span>
          <span {...getStyles("pricingAmount")}>
            {highestBid?.pricing.prettyAmount}{" "}
            {highestBid?.pricing.currency.symbol}
          </span>
          {pricing.reserve?.expectedEndTimestamp &&
            isInFuture(pricing.reserve.expectedEndTimestamp) && (
              <Fragment>
                <span {...getStyles("textSubdued")}>
                  {getString("ENDS_IN")}
                </span>
                <span {...getStyles("pricingAmount")}>
                  <CountdownDisplay to={pricing.reserve.expectedEndTimestamp} />
                </span>
              </Fragment>
            )}
        </div>
      );
    }
    if (pricing.reserve?.reservePrice) {
      return (
        <div {...getStyles("cardAuctionPricing", { type: "reserve-pending" })}>
          <span {...getStyles("textSubdued")}>
            {getString("RESERVE_PRICE")}
          </span>
          <span>
            {pricing.reserve.reservePrice.prettyAmount}{" "}
            {pricing.reserve.reservePrice.currency.symbol}
          </span>
        </div>
      );
    }
  }

  return (
    <div {...getStyles("cardAuctionPricing", { type: "unknown" })}>
      <div {...getStyles("textSubdued")}>{getString("PRICING_LOADING")}</div>
      <div {...getStyles("pricingAmount")}>{getString("PRICING_LOADING")}</div>
    </div>
  );
};
