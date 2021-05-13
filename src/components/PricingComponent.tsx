/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Fragment, useContext } from "react";

import { useMediaContext } from "../context/useMediaContext";
import { NFTDataContext } from "../context/NFTDataProvider";

export const PricingComponent = () => {
  const {
    nft: { data },
  } = useContext(NFTDataContext);
  const { getStyles, getString } = useMediaContext();

  if (data && data.auction.current.auctionType === "perpetual") {
    let listPrice = null;

    if (data.auction.current.reservePrice) {
      listPrice = (
        <Fragment>
          <span {...getStyles("textSubdued")}>{getString("LIST_PRICE")}</span>
          <span>
            {data.auction.current.reservePrice.prettyAmount}{" "}
            {data.auction.current.reservePrice.currency.symbol}
          </span>
        </Fragment>
      );
    }
    const { highestBid } = data.auction;
    if (!highestBid && data.pricing.reserve?.previousBids.length) {
      const highestPreviousBid = data.pricing.reserve.previousBids[0];
      return (
        <div {...getStyles("cardAuctionPerpetual")}>
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
      <div {...getStyles("cardAuctionPerpetual")}>
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
  if (data && data.auction.current.auctionType === "reserve") {
    if (data.auction.current.reserveMet) {
      return (
        <div {...getStyles("cardAuctionReserveActive")}>
          <span {...getStyles("textSubdued")}>{getString("TOP_BID")}</span>
          <span {...getStyles("pricingAmount")}>
            {data.auction.highestBid?.pricing.prettyAmount}
          </span>
          <span {...getStyles("textSubdued")}>{getString("ENDS_IN")}</span>
          <span {...getStyles("pricingAmount")}>12:32:23</span>
        </div>
      );
    }
    if (data.auction.current.reservePrice) {
      return (
        <div {...getStyles("cardAuctionReservePending")}>
          <span {...getStyles("textSubdued")}>
            {getString("RESERVE_PRICE")}
          </span>
          <span>
            {data.auction.current.reservePrice.prettyAmount}{" "}
            {data.auction.current.reservePrice.currency.symbol}
          </span>
          <span {...getStyles("textSubdued")}>{getString("ENDS_IN")}</span>
          <span {...getStyles("pricingAmount")}>12:32:23</span>
        </div>
      );
    }
  }

  return (
    <div {...getStyles("cardAuctionPerpetual")}>
      <div {...getStyles("textSubdued")}>--</div>
      <div {...getStyles("pricingAmount")}>--</div>
    </div>
  );
};
