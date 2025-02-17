import React from "react";
import { useChart } from "@/hooks/useChart";
import { Box } from "native-base";
import { LineChart } from "react-native-chart-kit";
import { ScrollView } from "react-native";

interface EmissionEntry {
  date: string;
  emission: number;
}

interface EmissionsChartProps {
  entries: EmissionEntry[];
}

const EmissionsChart: React.FC<EmissionsChartProps> = ({ entries }) => {
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  console.log(entries);
  
  const data = {
    labels: sortedEntries.map((entry) => entry.date),
    datasets: [
      {
        data: sortedEntries.map((entry) => entry.emission),
      },
    ],
  };
  return (
    <Box style={{ width: "100%", height: 400 }}>
      <ScrollView horizontal={true}>
      <LineChart
        data={data}
        width={entries.length * 70}
        height={400}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
      /></ScrollView>
    </Box>
  );
};

export default EmissionsChart;
