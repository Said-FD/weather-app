import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';

import { countriesApiService, weatherApiService } from '../../services/api-service';
import { convertWindDirection } from '../../services/wind-direction-service';
import RefreshIcon from '../../assets/Icons/RefreshIcon/RefreshIcon';
import TilePropsModel from '../../types/TilePropsModel';
import Tile from '../Tile/Tile';
import styles from './WeatherPage.module.css';

interface CountryModel {
  flag: string;
  latlng: [number, number];
  name: { common: string };
  value: { common: string };
}

interface SelectedCountryModel {
  label: string;
  lat: number;
  lng: number;
  value: string;
}

const WeatherPage = () => {
  const [countriesList, setCountriesList] = useState<SelectedCountryModel[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<SelectedCountryModel | null>(null);
  const [countryWeather, setCountryWeather] = useState<TilePropsModel[]>();
  const [loading, setLoading] = useState(false);
  const [responseError, setResponseError] = useState('');
  const errorMessage = 'Something went wrong';

  useEffect(() => {
    countriesApiService()
      .then(data => {
        const countries = data
          .map((country: CountryModel) => {
            return {
              label: `${country.flag} ${country.name.common}`,
              lat: country.latlng[0],
              lng: country.latlng[1],
              value: country.name.common
            };
          })
          .sort((firstItem: SelectedCountryModel, secondItem: SelectedCountryModel) => {
            return firstItem.value.localeCompare(secondItem.value)
          });

        setCountriesList(countries);
      })
      .catch(error => {
        setResponseError(errorMessage);
        console.log(error);
      });
  }, []);

  const handleCountryChange = (country: SingleValue<SelectedCountryModel>) => {
    if (!country) return null;

    setLoading(true);
    setSelectedCountry(country);

    weatherApiService(country.lat, country.lng)
      .then(data => {
        setCountryWeather([
          {
            title: 'Temperature',
            value: `${Math.round(data.main.temp)}°C`,
            details: [
              `Min ${Math.round(data.main.temp_min)}°C`,
              `Max ${Math.round(data.main.temp_max)}°C`
            ]
          },
          {
            title: 'Wind',
            value: `${Math.round(data.wind.speed)} m/s`,
            details: [
              convertWindDirection(data.wind.deg)
            ]
          },
          {
            title: 'Humidity',
            value: `${data.main.humidity}%`
          },
          {
            title: 'Pressure',
            value: `${data.main.pressure} hPa`
          }
        ]);

        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        setResponseError(errorMessage);
        console.log(error);
      })
  };

  return (
    <main className={styles.main}>
      <Select
        onChange={handleCountryChange}
        options={countriesList}
        placeholder='Select a country'
        value={selectedCountry}
      />

      <section>
        <h1 className={styles.title}>
          {selectedCountry
            ? `Current weather in ${selectedCountry.value}`
            : 'Please select a country to see the current weather'}
        </h1>

        {countryWeather && (
          <>
            <div className={styles.tilesGrid}>
              {countryWeather.map(weather => (
                <Tile weather={weather} key={weather.title} />
              ))}
            </div>
            <button
              type="button"
              className={`action-button ${loading ? 'loading' : ''}`}
              onClick={() => handleCountryChange(selectedCountry)}
            >
              <RefreshIcon />
              Refresh
            </button>
          </>
        )}
      </section>

      {selectedCountry && !countryWeather && (
        <div className={`loader ${loading ? 'loading' : ''}`}>
          <RefreshIcon />
        </div>
      )}

      {responseError && (
        <div className="error-container">
          <p>
            {responseError}
          </p>
        </div>
      )}
    </main>
  );
}

export default WeatherPage;
