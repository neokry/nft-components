import { Fragment, useContext } from "react";

import { AddressView } from "../components/AddressView";
import { MediaObject } from "../components/MediaObject";
import { useMediaContext } from "../context/useMediaContext";
import { NFTDataContext } from "../context/NFTDataContext";
import {
  NFTDataType,
  OpenseaNFTDataType,
} from "@zoralabs/nft-hooks/dist/fetcher/AuctionInfoTypes";

function isZoraNFT(
  nftData: OpenseaNFTDataType | NFTDataType
): nftData is NFTDataType {
  return "zoraNFT" in nftData;
}

export const MediaThumbnail = () => {
  const {
    nft: { data },
    metadata: { metadata },
  } = useContext(NFTDataContext);

  const { getStyles, getString } = useMediaContext();

  const getContent = () => {
    if (metadata && data) {
      return {
        media: (
          <MediaObject
            contentURI={isZoraNFT(data) ? data.zoraNFT.contentURI : undefined}
            metadata={metadata}
          />
        ),
        title: metadata.name,
      };
    }
    return {
      media: <div {...getStyles("mediaLoader")}></div>,
      title: "...",
    };
  };

  const { media, title } = getContent();
  const hasCreator = data?.nft.creator;
  const address = hasCreator ? data?.nft.creator : data?.nft.owner;
  return (
    <Fragment>
      <div {...getStyles("cardMediaWrapper")}>{media}</div>
      <div {...getStyles("cardItemInfo")}>
        <div {...getStyles("cardTitle")}>{title}</div>
        <div>
          <span {...getStyles("textSubdued")}>
            {hasCreator
              ? getString("CARD_CREATED_BY")
              : getString("CARD_OWNED_BY")}
          </span>{" "}
          <span>{address && <AddressView address={address} />}</span>
        </div>
      </div>
    </Fragment>
  );
};
