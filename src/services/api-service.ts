export const countriesApiService = async () => {
  const request = await fetch('https://restcountries.com/v3.1/all');
  const data = await request.json();

  return data;
};

export const weatherApiService = async (
  lat: number, lon: number
) => {
  const url = new URL('https://api.openweathermap.org/data/2.5/weather');

  const params = {
    lat: String(lat),
    lon: String(lon),
    units: 'metric',
    appid: 'bb9a85fcd71d66484385b15faf03193b'
  };

  url.search = new URLSearchParams(params).toString();
  const request = await fetch(url.toString());
  const data = await request.json();
  await new Promise(r => setTimeout(r, 1000));

  return data;
};
