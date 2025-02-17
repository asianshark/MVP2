import { useEffect, useRef, useState } from "react";
import Chart, { ChartConfiguration } from "chart.js/auto";

interface EmissionEntry {
  date: string; // Дата выбросов (формат YYYY-MM-DD)
  emission: number; // Количество выбросов CO₂ в кг
}

interface UseChartProps {
  entries: EmissionEntry[]; // Массив данных для графика
}

/**
 * Кастомный хук для работы с Chart.js
 */
export const useChart = ({ entries }: UseChartProps) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || entries.length === 0) return;

    // Удаляем предыдущий график, если он существует
    if (chartInstance) {
      chartInstance.destroy();
    }

    // Сортируем данные по дате
    const sortedEntries = [...entries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Формируем данные для графика
    const labels = sortedEntries.map((entry) =>
      entry.date
    );
    const dataValues = sortedEntries.map((entry) => entry.emission);

    // Конфигурация графика
    const chartConfig: ChartConfiguration = {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Выбросы CO₂ (кг)",
            data: dataValues,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 2,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: { display: true, text: "Дата" },
            type: "category",
          },
          y: {
            title: { display: true, text: "Выбросы CO₂ (кг)" },
            beginAtZero: true,
          },
        },
      },
    };

    // Создаём новый график
    const newChart = new Chart(chartRef.current, chartConfig);
    setChartInstance(newChart);

    // Очистка при размонтировании
    return () => {
      if (newChart) newChart.destroy();
    };
  }, [entries]); // Перерисовывать при изменении данных

  return chartRef;
};
