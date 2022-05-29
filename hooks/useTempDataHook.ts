import { useState, useEffect } from "react";
import { GraphData } from "../components/WeatherGraph/Model";

export const useTempData = () => {
  const [data, setData] = useState<GraphData>();

  useEffect(() => {}, []);

  return [data, setData];
};
