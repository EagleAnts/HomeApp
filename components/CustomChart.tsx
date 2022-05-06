// import React from "react";
// import { Text, View } from "react-native";
// import { Svg, G, Rect, Line } from "react-native-svg";
// import * as d3 from "d3";

// const CustomChart = () => {
//   const svgHeight = 60;
//   const svgWidth = 60;
//   const graphHeight = 50;

//   return (
//     <Svg width={svgWidth} height={svgHeight}>
//       <G y={graphHeight}>
//         <Rect
//           x={15}
//           y={-15}
//           width={20}
//           height={20}
//           stroke="red"
//           strokeWidth={4}
//           fill="yellow"
//         />
//       </G>
//     </Svg>
//   );
// };

// const GRAPH_MARGIN = 20;
// const GRAPH_BAR_WIDTH = 5;
// const colors = {
//   axis: "#E4E4E4",
//   bars: "#15AD13",
// };

// export const BarChart = () => {
//   const SVGWidth = 300;
//   const SVGHeight = 300;
//   const graphHeight = SVGHeight - 2 * GRAPH_MARGIN;
//   const graphWidth = SVGWidth - 2 * GRAPH_MARGIN;

//   const data = [
//     { label: "Jan", value: 500 },
//     { label: "Feb", value: 312 },
//     { label: "Mar", value: 424 },
//     { label: "Apr", value: 745 },
//     { label: "May", value: 89 },
//     { label: "Jun", value: 434 },
//     { label: "Jul", value: 650 },
//     { label: "Aug", value: 980 },
//     { label: "Sep", value: 123 },
//     { label: "Oct", value: 186 },
//     { label: "Nov", value: 689 },
//     { label: "Dec", value: 643 },
//   ];

//   // X Scale Point

//   const xDomain = data.map((item) => item.label);
//   const xRange = [0, graphWidth];
//   const x = d3.scalePoint().domain(xDomain).range(xRange).padding(1);

//   // Y Scale linear
//   const yDomain = [0, d3.max(data, (d) => d.value)];
//   const yRange = [0, graphHeight];
//   const y = d3.scaleLinear().domain(yDomain).range(yRange);

//   return (
//     <Svg width={SVGWidth} height={SVGHeight}>
//       <G y={graphHeight}>
//         {data.map((item) => (
//           <Rect
//             key={item.label}
//             x={x(item.label) - GRAPH_BAR_WIDTH / 2}
//             y={y(item.value) * -1}
//             rx={2.5}
//             width={GRAPH_BAR_WIDTH}
//             height={y(item.value)}
//             fill={colors.bars}
//           />
//         ))}
//         {/* bottom Axis */}
//         <Line
//           x1={0}
//           y1={2}
//           x2={graphWidth}
//           y2={2}
//           stroke={colors.axis}
//           strokeWidth={0.5}
//         />
//       </G>
//     </Svg>
//   );
// };

// export default CustomChart;
