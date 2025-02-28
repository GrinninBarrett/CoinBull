import React, { useEffect, useState } from "react";

import CoinTab from "../CoinTab";
import Pagination from "../Pagination";
import { getAllCoins, newGetAllCoins } from "../../utils/API";
import { ADD_FAVORITE } from "../../utils/mutations";
import { useMutation } from "@apollo/client";
import Auth from "../../utils/auth";
import {
  AddFavoriteCoinIds,
  getFavoriteCoinIds,
  removeCoinId,
} from "../../utils/localStorage";

import "./styles/ProductList.css";

import { REMOVE_COIN } from "../../utils/mutations";
import { REMOVE_FROM_FAVORITES } from "../../utils/actions";
import { useStoreContext } from "../../utils/GlobalState";

function ProductList() {
  const [, dispatch] = useStoreContext();

  const [coinsState, setCoinsState] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [coinsPerPage] = useState(20);
  const [sortOrder, setSortOrder] = useState({ sortTarget: "", value: false });
  const [favoriteCoinIds, setFavoriteCoinIds] = useState(getFavoriteCoinIds());

  const [removeCoinFromFavorite] = useMutation(REMOVE_COIN);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        // const coins = await getAllCoins();
        // setCoinsState(coins);
        const coins = await newGetAllCoins();
        console.log(coins)
        setCoinsState(coins);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCoins();
  }, []);

  useEffect(() => {
    if (sortOrder.sortTarget !== "") {
      let toBeSorted;
      let toBeSortedA;
      let toBeSortedB;

      if (sortOrder.sortTarget === "coin") {
        toBeSorted = "id";
      } else if (sortOrder.sortTarget === "price") {
        toBeSorted = "price";
      } else if (sortOrder.sortTarget === "change") {
        toBeSorted = "change";
      } else if (sortOrder.sortTarget === "circulating_supply") {
        toBeSorted = "circulating_supply";
      } else if (sortOrder.sortTarget === "market_cap") {
        toBeSorted = "market_cap";
      }

      const compare = (a, b) => {
        if (sortOrder.sortTarget === "coin") {
          toBeSortedA = a[toBeSorted].toLowerCase();
          toBeSortedB = b[toBeSorted].toLowerCase();
        } else if (
          sortOrder.sortTarget === "price" ||
          sortOrder.sortTarget === "circulating_supply" ||
          sortOrder.sortTarget === "market_cap"
        ) {
          toBeSortedA = +a[toBeSorted];
          toBeSortedB = +b[toBeSorted];
        } else if (sortOrder.sortTarget === "change") {
          toBeSortedA = a["1d"].price_change_pct;
          toBeSortedB = b["1d"].price_change_pct;
        }

        let comparison = 0;
        if (toBeSortedA > toBeSortedB) {
          comparison = 1;
        } else if (toBeSortedA < toBeSortedB) {
          comparison = -1;
        }
        if (sortOrder.value) {
          return comparison;
        } else {
          return comparison * -1;
        }
      };

      coinsState.sort(compare);
    }
  }, [coinsState, sortOrder]);

  const [addFavorite] = useMutation(ADD_FAVORITE);

  const handleAddFavorite = async (coinId) => {
    const coinToFavorite = coinsState.find((coin) => coin.id === coinId);

    const { id, symbol, name, price, market_cap, logo_url } = coinToFavorite;

    let oneDay;

    // Ensures this works, since variables can't begin with numbers
    for (const key in coinToFavorite) {
      if (key === "1d") {
        oneDay = coinToFavorite[key];
      }
    }

    const { price_change_pct, volume } = oneDay;

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await addFavorite({
        variables: {
          input: {
            name: name,
            ticker: symbol,
            price: price,
            volume: volume,
            dayPercentChange: price_change_pct,
            marketCap: market_cap,
            logoURL: logo_url,
          },
        },
      });
      setFavoriteCoinIds([...favoriteCoinIds, id]);
      AddFavoriteCoinIds(favoriteCoinIds);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCoin = async (name, id) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeCoinFromFavorite({
        variables: { name },
      });
      dispatch({
        type: REMOVE_FROM_FAVORITES,
        name: name,
      });
      removeCoinId(id);
    } catch (err) {
      console.error(err);
    }
  };

  const indexOfLastCoin = currentPage * coinsPerPage;
  const indexOfFirstCoin = indexOfLastCoin - coinsPerPage;
  const currentCoins = coinsState.slice(indexOfFirstCoin, indexOfLastCoin);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSortChange = (event) => {
    let invokedTarget = event.target.id;
    setSortOrder({ sortTarget: invokedTarget, value: !sortOrder.value });
  };

  return (
    <>
      <div className="is-flex is-justify-content-center mt-3">
        <table className="table mt-1">
          <thead>
            <tr>
              <th> </th>
              <th>#</th>
              <th>Coin</th>
              <th id="coin" className="tableHead" onClick={handleSortChange}>
                <span className="arrows">&#8661;</span>
                Name
              </th>
              <th id="price" className="tableHead" onClick={handleSortChange}>
                <span className="arrows">&#8661;</span>
                Price
              </th>
              <th id="change" className="tableHead" onClick={handleSortChange}>
                <span className="arrows" onClick={handleSortChange}>
                  &#8661;
                </span>
                Pct  
              </th>
              <th
                id="circulating_supply"
                className="tableHead to-remove"
                onClick={handleSortChange}
              >
                <span className="arrows" onClick={handleSortChange}>
                  &#8661;
                </span>
                Circulating supply
              </th>
              <th
                id="market_cap"
                className="tableHead to-remove"
                onClick={handleSortChange}
              >
                <span className="arrows to-remove" onClick={handleSortChange}>
                  &#8661;
                </span>
                Market Cap
              </th>
              <th className="to-remove">Price Chart</th>
            </tr>
          </thead>
          <tbody>
            {currentCoins.map((coin) => (
              <CoinTab
                key={coin.id}
                id={coin.symbol}
                rank={coin.market_cap_rank}
                name={coin.name}
                logo_url={coin.image}
                price={coin.current_price}
                change={coin.price_change_percentage_24h}
                circulating_supply={coin.circulating_supply}
                market_cap={coin.market_cap}
                handleAddFavorite={handleAddFavorite}
                handleDeleteCoin={handleDeleteCoin}
                favorite={favoriteCoinIds.includes(coin.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        coinsPerPage={coinsPerPage}
        totalCoins={coinsState.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </>
  );
}

export default ProductList;
