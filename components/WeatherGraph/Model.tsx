/* eslint-disable camelcase */
import * as shape from "d3-shape";
import { scaleLinear } from "d3-scale";
import { Dimensions } from "react-native";
import { parse, Path } from "react-native-redash";
import { scaleTime } from "d3";

// import data from "./data.json";

export const SIZE = Dimensions.get("window").width * 0.85;

// interface Amount {
//   amount: string;
//   currency: string;
//   scale: string;
// }

// interface PercentChange {
//   hour: number;
//   day: number;
//   week: number;
//   month: number;
//   year: number;
// }

// interface LatestPrice {
//   amount: Amount;
//   timestamp: string;
//   percent_change: PercentChange;
// }

// type PriceList = [string, number][];

// interface DataPoints {
//   percent_change: number;
//   prices: PriceList;
// }

// interface Prices {
//   latest: string;
//   latest_price: LatestPrice;
//   hour: DataPoints;
//   day: DataPoints;
//   week: DataPoints;
//   month: DataPoints;
//   year: DataPoints;
//   all: DataPoints;
// }

// const values = data.data.prices as Prices;
const POINTS = 100;

export type GraphData = {
  label: string;
  minTemp: number;
  maxTemp: number;
  path: Path;
  latestTemperature: number;
};

export const buildGraph = (
  datapoints: { temperature: Array<[number, number]> },
  label: string
) => {
  const temperatureList = datapoints.temperature.slice(240,300);
  const formattedValues = temperatureList.map(
    (value) => [value[0], value[1]] as [number, number]
  );
  const temperatures = formattedValues.map((value) => value[0]);
  const timestamp = formattedValues.map((value) => value[1]);

  const scaleX = scaleTime()
    .domain([Math.min(...timestamp), Math.max(...timestamp)])
    .range([0, SIZE]);
  const minTemp = Math.min(...temperatures);
  const maxTemp = Math.max(...temperatures);
  const scaleY = scaleLinear().domain([minTemp, maxTemp]).range([SIZE, 0]);
  return {
    label,
    minTemp,
    maxTemp,
    latestTemperature: temperatures[temperatures.length - 1],
    path: parse(
      shape
        .area()
        .x(([, x]) => scaleX(x) as number)
        .y0(scaleY(0))
        .y1(([y]) => scaleY(y) as number)
        .curve(shape.curveBasis)(formattedValues) as string
    ),
  };
};

// export const graphs = [
// {
//   label: "5S",
//   value: 0,
//   data: buildGraph(values.seconds,"Seconds"),
// },
//   {
//     label: "1D",
//     value: 1,
//     data: buildGraph(values.day, "Hourly"),
//   },
//   {
//     label: "1M",
//     value: 2,
//     data: buildGraph(values.month, "Last Month"),
//   },
//   {
//     label: "1Y",
//     value: 3,
//     data: buildGraph(values.year, "This Year"),
//   },
//   {
//     label: "all",
//     value: 4,
//     data: buildGraph(values.all, "All time"),
//   },
// ] as const;

// export type GraphIndex = 0 | 1 | 2 | 3 | 4;
