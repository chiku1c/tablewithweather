import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Clear from "../asset/image/clear.jpg"
import Thunder from "../asset/image/thunder.jpg"
import Drizzle from "../asset/image/drizzle.jpg"
import Rain from "../asset/image/rain.jpg"
import Snow from "../asset/image/snow.jpg"
import Fog from "../asset/image/fog.jpg"
import Clouds from "../asset/image/clouds.jpg"
import { useParams } from 'react-router-dom';
import { WeatherData } from '../types/WeatherTypes';

const WeatherPage: React.FC = () => {
  const { lat, lon } = useParams();

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const mode = 'cors'; // Set the desired mode (json/xml/html)
        const response = await fetch(
          `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&mode=${mode}&appid=4b2d1a230332e3534169b37e6dde4668`
        );
        const data = await response.json();
        setWeather(data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching weather data');
        setLoading(false);
      }
    };
  
    fetchWeatherData();
  }, [lat, lon]);
  

  const getBackground = () => {
    if (!weather) return '';
    const weatherCode = weather.weather[0].id;
    if (weatherCode >= 200 && weatherCode < 300) return Thunder; // Adjust path as needed
    if (weatherCode >= 300 && weatherCode < 400) return Drizzle; // Adjust path as needed
    if (weatherCode >= 500 && weatherCode < 600) return Rain; // Adjust path as needed
    if (weatherCode >= 600 && weatherCode < 700) return Snow; // Adjust path as needed
    if (weatherCode >= 700 && weatherCode < 800) return Fog; // Adjust path as needed
    if (weatherCode === 800) return Clear; // Adjust path as needed
    if (weatherCode > 800) return Clouds; // Adjust path as needed
    return '';
  };


  return (
    <Container background={getBackground()}>
      {loading && <Loading>Loading...</Loading>}
      {error && <Error>{error}</Error>}
      {weather && (
        <WeatherCard>
          <City>{weather.name}</City>
          <Temperature>{weather.main.temp}°C</Temperature>
          <Description>{weather.weather[0].description}</Description>
          <Details>
            <DetailItem>
              <DetailIcon>🌡️</DetailIcon>
              <DetailText>Humidity: {weather.main.humidity}%</DetailText>
            </DetailItem>
            <DetailItem>
              <DetailIcon>💨</DetailIcon>
              <DetailText>Wind Speed: {weather.wind.speed} m/s</DetailText>
            </DetailItem>
            <DetailItem>
              <DetailIcon>🌫️</DetailIcon>
              <DetailText>Pressure: {weather.main.pressure} hPa</DetailText>
            </DetailItem>
          </Details>
        </WeatherCard>
      )}
    </Container>
  );
};

const Container = styled.div<{ background: string }>`
  background-image: ${({ background }) => `url(${background})`};
  background-size: cover;
  background-position: left;
  background-repeat: no-repeat; 
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  
`;





const WeatherCard = styled.div`
  background-color: rgba(255, 255, 255, 0.7);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width:500px;
  width:100%;
  margin:30px
`;

const City = styled.h2`
  margin: 0;
  font-size: 24px;
  margin-bottom: 10px;
`;

const Temperature = styled.p`
  font-size: 36px;
  margin: 0;
`;

const Description = styled.p`
  font-size: 18px;
  margin: 10px 0;
`;

const Details = styled.div`
  display: flex;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
`;

const DetailIcon = styled.span`
  font-size: 20px;
  margin-right: 5px;
`;

const DetailText = styled.p`
  margin: 5px 0;
`;

const Loading = styled.div`
  font-size: 18px;
`;

const Error = styled.div`
  font-size: 18px;
  color: red;
`;

export default WeatherPage;
