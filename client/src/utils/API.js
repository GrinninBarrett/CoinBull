import axios from "axios";

const nomicsURL = `https://api.nomics.com/v1/currencies/ticker?key=001b0fad7295e9be8c2270792dcc4efb3763624e&interval=1d,30d&convert=USD&per-page=100&page=1`;
export async function getAllCoins() {
  const res = await axios.get(nomicsURL);
  const coins = res.data;
  return coins;
}

const singleLunarURL = `https://api.lunarcrush.com/v2?data=assets&key=axnpldsftoa03n17z75cy5r&symbol=BTC&interval=day&time_series_indicators=open,close,high,volume,low&data_points=90`;
export async function getASingleCoin() {
  const res = await axios.get(singleLunarURL);
  const coin = res.data;
  return coin;
}
// Gets news from Lunarcrush
export async function getNews(symbol) {
  const res = await axios({
    url: `https://lunarcrush.com/api3/feeds?since=1w&symbol=${symbol}&sources=news`,
    headers: {
      'Authorization': `Bearer ${process.env.NEWS_API_TOKEN}`,
    },
  })
  
    console.log(res.data);
    return res.data;
  // const res = await axios.get(
  //   `https://lunarcrush.com/api3/feeds?key=pfl8o8fkm9llsf89zsle49d8belg11938rhbm70l7&symbol=${symbol}&limit=10&sources=news`
  // );
  // const news = res.data;
  // console.log(news);
  // return news;
}

export async function getCoin(ticker) {
  if (ticker) {
    const res = await axios.get(
      `https://api.nomics.com/v1/currencies/ticker?key=001b0fad7295e9be8c2270792dcc4efb3763624e&ids=${ticker}&convert=USD&page=1`
    );
    const coin = res.data;
    return coin;
  }
}
