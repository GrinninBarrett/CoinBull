import React from "react";
import { Helmet } from "react-helmet";
import PurchaseModal from "../PurchaseModal";

const SingleCoinCard = ({
  coin,
  handleDeleteCoin,
  handlePurchaseButton,
  handleModalRemoval,
  initializer,
}) => {
  return (
    <div className="card m-3 p-2 widget-card">
      <div className="card-content">
        <Helmet>
          <script
            defer
            src="https://www.livecoinwatch.com/static/lcw-widget.js"
          ></script>
        </Helmet>
        <div
          className="livecoinwatch-widget-1 "
          lcw-coin={`${coin.ticker}`}
          lcw-base="USD"
          lcw-secondary="BTC"
          lcw-period="d"
          lcw-color-tx="#00d084"
          lcw-color-pr="#00d084"
          lcw-color-bg="#e6e6e6"
          lcw-border-w="1"
          lcw-digits="4"
        ></div>
        <div className="media">
          <div className="media-left">
            <figure className="image is-32x32">
              <img src={`${coin.logoURL}`} alt={`${coin.name}`} />
            </figure>
          </div>
          <div className="media-content">
            <p className="title is-4">{coin.name}</p>
          </div>
        </div>
      </div>
      <footer className="card-footer">
        <button
          className="card-footer-item cards-buttons"
          style={{ backgroundColor: "rgb(56, 200, 56)" }}
          type="button"
          onClick={() => handleDeleteCoin(coin.name)}
        >
          Delete
        </button>
        <button
          className="card-footer-item cards-buttons"
          id={coin.ticker}
          type="button"
          style={{ backgroundColor: "rgb(56, 200, 56)" }}
          onClick={handlePurchaseButton}
        >
          Purchase
        </button>
        <PurchaseModal
          handleModalRemoval={handleModalRemoval}
          initializer={initializer}
          ticker={coin.ticker}
        />
      </footer>
    </div>
  );
};

export default SingleCoinCard;
