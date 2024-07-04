import React from 'react';
import { Chart } from 'react-google-charts';

const GraphTemplate = ({ chartType, data, width, height, options }) => {
  return (
    <div>
      <Chart
        chartType={chartType}
        data={data}
        width={width}
        height={height}
        options={options}
        legendToggle
      />
    </div>
  );
};
export default GraphTemplate;
