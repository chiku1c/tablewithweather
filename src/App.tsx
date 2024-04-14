import React from 'react';
import WeatherPage from './components/WeatherDetails';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css"
import DatatableWithReactQueryProvider from './components/LocationTable';


const App: React.FC = () => {


  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route element={<DatatableWithReactQueryProvider />} path="/" />
          <Route
            path="weather-details/:city/:lat/:lon"
            element={<WeatherPage />}
          />
        </Routes>
      </BrowserRouter>,
    </div>
  );
};

export default App;
