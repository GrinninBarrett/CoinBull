import React, { useState, useEffect } from "react";
import Auth from "../../utils/auth";
import upMarket from "../../assets/upmarket.png";
import downMarket from "../../assets/downmarket.png";
import { Link } from "react-router-dom";
import "./styles/SingleCoin.css";
import { FaStar, FaRegStar } from "react-icons/fa";
import ModalAlert from "../ModalAlert";

const CoinTab = (coin) => {
  let {
    rank,
    name,
    id,
    logo_url,
    price,
    change,
    circulating_supply,
    market_cap,
    handleAddFavorite,
    favorite,
    handleDeleteCoin,
  } = coin;

  const [isFavorite, setIsFavorite] = useState(favorite);
  const [isActive, setIsActive] = useState(false);

  price = Number(price.toFixed(2)).toLocaleString('en-US');
  circulating_supply = Number(circulating_supply.toFixed(2)).toLocaleString("en-US");
  market_cap = Number(market_cap.toFixed(2)).toLocaleString("en-US");
  // circulating_supply = circulating_supply.replace(/(.)(?=(\d{3})+$)/g, "$1,");
  // market_cap = market_cap.replace(/(.)(?=(\d{3})+$)/g, "$1,");
  change = parseFloat(change).toFixed(2);

  const handleAlert = () => {
    setIsActive(true);
  }

  const handleCloseAlert = () => {
    setIsActive(false);
  }

  return (
    <>
      <tr>
        <th className="is-vcentered">
          {Auth.loggedIn() ? (
            <button className="star-icon">
            {isFavorite ? (
              <FaStar
                id="delete-star"
                onClick={() => {
                  handleDeleteCoin(name, id);
                  setIsFavorite(false);
                }}
              />
            ) : (
              <FaRegStar
                onClick={() => {
                  handleAddFavorite(id);
                  setIsFavorite(true);
                }}
              />
            )}
          </button>
          ) : (
            <button className="star-icon">
              <FaRegStar onClick={handleAlert} />
            </button>
          ) }

        </th>
        <th className="is-vcentered is-size-7-mobile">{rank}</th>
        <th className="is-vcentered is-size-7-mobile">
          <Link to={`/coins/${id}`}>
            <img className="coins-icons" src={logo_url} alt={logo_url} />
          </Link>
        </th>
        <th className="is-vcentered">
          <Link className="coin-name is-size-7-mobile" to={`/coins/${id}`}>
            {name}
          </Link>
        </th>
        <th className="is-vcentered is-size-7-mobile">${price}</th>
        <th
          className={
            change > 0
              ? "has-text-success is-vcentered is-size-7-mobile"
              : "has-text-danger is-vcentered is-size-7-mobile"
          }
        >
          {change} %
        </th>
        <th className="is-vcentered to-remove">{circulating_supply}</th>
        <th className="is-vcentered to-remove">${market_cap}</th>
        <th className="is-vcentered to-remove">
          {change > 0 ? (
            <img width="100" src={upMarket} alt="market chart" />
          ) : (
            <img width="100" src={downMarket} alt="market chart" />
          )}
        </th>
      </tr>
      {isActive ? (
        <ModalAlert handleCloseAlert={handleCloseAlert} />
      ) : null }      
    </>
  );
};

export default CoinTab;
