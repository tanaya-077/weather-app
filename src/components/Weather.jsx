import React, { useEffect, useState } from "react";
import "remixicon/fonts/remixicon.css";
import { motion } from "framer-motion";

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("");

  const getWeatherImage = (condition) => {
    if (!condition) return "/assets/clear.png";

    condition = condition.toLowerCase();

    if (condition.includes("sun") || condition.includes("clear"))
      return "/assets/clear.png";
    if (condition.includes("rain") || condition.includes("drizzle"))
      return "/assets/rain.png";
    if (condition.includes("cloud") || condition.includes("overcast"))
      return "/assets/drizzle.png";
    if (condition.includes("snow") || condition.includes("blizzard"))
      return "/assets/snow.png";

    return "/assets/cloud.png";
  };

  const search = async (cityName) => {
    try {
      const url = `https://api.weatherapi.com/v1/current.json?key=${
        import.meta.env.VITE_APP_ID
      }&q=${cityName}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);

      setWeatherData({
        humidity: data.current.humidity,
        wind: data.current.wind_kph,
        temperature: data.current.temp_c,
        city: data.location.name,
        condition: data.current.condition.text,
      });
    } catch (error) {
      console.error("Error fetching weather:", error);
      alert("City not found. Please try again.");
    }
  };

  useEffect(() => {
    search("India");
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120 },
    },
  };

  return (
    <div className="h-screen w-full flex justify-center items-center bg-gradient-to-br from-purple-100 to-indigo-200">
      <div className="relative bg-[#3b32a0] rounded-lg p-4 md:p-6 shadow-lg shadow-gray-900 w-[90vw] max-w-[400px]">
        
        {/* Search Box */}
        <div className="search flex items-center mb-5">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="text-center text-base md:text-lg font-semibold py-3 md:py-4 px-3 md:px-4 bg-white text-yellow-500 rounded-2xl mx-2 w-[70%]"
            type="text"
            placeholder="Search city"
          />
          <motion.i
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileTap={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            onClick={() => search(city)}
            className="ri-search-line bg-white px-3 md:px-4 py-3 md:py-4 rounded-full text-yellow-500 text-xl font-bold cursor-pointer"
          ></motion.i>
        </div>

        {/* Weather Display */}
        {weatherData && (
          <motion.div variants={containerVariants} initial="hidden" animate="show">
            <motion.img
              variants={childVariants}
              className="w-[40vw] md:w-[15vw] mx-auto"
              src={getWeatherImage(weatherData.condition)}
              alt="Weather icon"
            />

            <motion.div variants={childVariants} className="mt-0">
              <motion.p
                variants={childVariants}
                className="text-white text-2xl md:text-4xl text-center font-bold"
              >
                {weatherData.temperature}°C
              </motion.p>
              <motion.p
                variants={childVariants}
                className="text-white text-xl md:text-3xl text-center"
              >
                {weatherData.city}
              </motion.p>

              <div className="w-full mt-8 px-2 flex justify-between">
                {/* Humidity */}
                <motion.div
                  variants={childVariants}
                  className="flex flex-col items-center justify-center"
                >
                  <img src="/assets/humidity.png" alt="humidity" className="w-8" />
                  <div className="flex flex-col items-center">
                    <p className="text-yellow-300 font-semibold">{weatherData.humidity}%</p>
                    <span className="text-white text-sm">Humidity</span>
                  </div>
                </motion.div>

                {/* Wind */}
                <motion.div
                  variants={childVariants}
                  className="flex flex-col items-center justify-center"
                >
                  <img src="/assets/wind.png" alt="wind" className="w-8" />
                  <div className="flex flex-col items-center">
                    <p className="text-yellow-300 font-semibold">{weatherData.wind} km/h</p>
                    <span className="text-white text-sm">Wind Speed</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Weather;
