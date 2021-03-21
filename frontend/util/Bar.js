import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const colors = d3.scaleOrdinal(d3.schemeCategory10);
const format = d3.format('.2f');

const XAxis = ({ top, bottom, left, right, height, scale }) => {
  const axis = useRef(null);

  useEffect(() => {
    d3.select(axis.current).call(d3.axisBottom(scale));
  });

  return <g className="axis x" ref={axis} transform={`translate(${left}, ${height - bottom})`} />;
};

const YAxis = ({ top, bottom, left, right, scale }) => {
  const axis = useRef(null);

  useEffect(() => {
    d3.select(axis.current).call(d3.axisLeft(scale));
  });

  return <g className="axis y" ref={axis} transform={`translate(${left}, ${top})`} />;
};

const Rect = ({ data, x, y, height, top, bottom }) => {
  return (
    <g transform={`translate(${x(data.date)}, ${y(data.value)})`}>
      <rect
        width={x.bandwidth()}
        height={height - bottom - top - y(data.value)}
        fill={colors(data.index)}
      />
      <text
        transform={`translate(${x.bandwidth() / 2}, ${-2})`}
        textAnchor="middle"
        alignmentBaseline="baseline"
        fill="grey"
        fontSize="10"
      >
        {format(data.value)}
      </text>
    </g>
  );
};

const Bar = props => {
  const [sort, setSort] = useState(false);

  const data = sort ? [...props.data].sort((a, b) => b.value - a.value) : [...props.data];

  const x = d3
    .scaleBand()
    .range([0, props.width - props.left - props.right])
    .domain(data.map(d => d.date))
    .padding(0.1);

  const y = d3
    .scaleLinear()
    .range([props.height - props.top - props.bottom, 0])
    .domain([0, d3.max(data, d => d.value)]);

  return (
    <>
      <svg width={props.width} height={props.height}>
        <XAxis
          scale={x}
          top={props.top}
          bottom={props.bottom}
          left={props.left}
          right={props.right}
          height={props.height}
        />
        <YAxis
          scale={y}
          top={props.top}
          bottom={props.bottom}
          left={props.left}
          right={props.right}
        />
        <g transform={`translate(${props.left}, ${props.top})`}>
          {data.map((d, i) => (
            <Rect
              data={d}
              x={x}
              y={y}
              top={props.top}
              bottom={props.bottom}
              height={props.height}
            />
          ))}
        </g>
      </svg>
    </>
  );
};

export default Bar;
