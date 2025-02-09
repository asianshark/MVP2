import React from "react";
import { useChart } from "@/hooks/useChart";

interface EmissionEntry {
  date: string;
  emission: number;
}

interface EmissionsChartProps {
  entries: EmissionEntry[];
}

const EmissionsChart: React.FC<EmissionsChartProps> = ({ entries }) => {
  const chartRef = useChart({ entries });

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <canvas ref={chartRef} id="emissionsChart"></canvas>
    </div>
  );
};

export default EmissionsChart;
