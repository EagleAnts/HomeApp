import moment from "moment";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { RaspiSocket } from "../../utils/clientSocketProvider";

import AsyncStorage from "@react-native-async-storage/async-storage";

export const WeatherDataContext = createContext({
  seconds: [] as [number, number][],
  setContext: (update: any) => {},
});

// export const updateWeatherData = (temperature: Array<[number, number]>) =>
//   temperature;

export const TemperatureDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [tempData, setTempData] = useState<Array<[number, number]>>([]);

  useEffect(() => {
    async function getStoredData() {
      const getWeatherData = await AsyncStorage.getItem("@weather_data");
      if (getWeatherData !== null) {
        const res = JSON.parse(getWeatherData);
        return res;
      } else return [];
    }

    getStoredData().then((res) => {
      setTempData((prev) => [...prev, ...res]);
    });

    RaspiSocket?.on("temperature:recieve", (data) => {
      setTempData((prev) => [...prev, [data.temperature, moment().unix()]]);
    });
  }, []);

  useEffect(() => {
    // let interval = setInterval(async () => {

    async function saveTemperatureData() {
      console.log("Storing Temperature Data");
      try {
        const json = JSON.stringify(tempData);
        await AsyncStorage.setItem("@weather_data", json);
      } catch (e) {
        console.log(e);
      }
    }

    saveTemperatureData();
    // }, 10000);

    return () => {
      // clearInterval(interval);
    };
  }, [tempData]);

  const setContext = useCallback(
    (update) => {
      setTempData(update);
    },
    [tempData, setTempData]
  );

  const getContext = useCallback(
    () => ({
      seconds: tempData,
      setContext,
    }),
    [tempData, setContext]
  );

  return (
    <WeatherDataContext.Provider value={getContext()}>
      {children}
    </WeatherDataContext.Provider>
  );
};
