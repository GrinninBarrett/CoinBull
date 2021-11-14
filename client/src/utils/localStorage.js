export const getFavoriteCoinIds = () => {
  const favoriteCoinIds = localStorage.getItem("favorite_coins")
    ? JSON.parse(localStorage.getItem("favorite_coins"))
    : [];

  return favoriteCoinIds;
};

export const favoriteCoinIds = (coinIdArr) => {
  if (coinIdArr.length) {
    localStorage.setItem("favorite_coins", JSON.stringify(coinIdArr));
  } else {
    localStorage.removeItem("favorite_coins");
  }
};

export const removeCoinId = (coinId) => {
  const favoriteCoinIds = localStorage.getItem("favorite_coins")
    ? JSON.parse(localStorage.getItem("favorite_coins"))
    : null;

  if (!favoriteCoinIds) {
    return false;
  }

  const updatedFavoriteCoinIds = favoriteCoinIds?.filter(
    (favoriteCoinId) => favoriteCoinId !== coinId
  );
  localStorage.setItem(
    "favorite_coins",
    JSON.stringify(updatedFavoriteCoinIds)
  );

  return true;
};
