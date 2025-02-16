"use client"; // Required for Chart.js to work in Next.js

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

// Define the type for the chart data
interface BarChartData {
  labels: string[];
  values: number[];
}

export default function BarChart({ data }: { data: BarChartData }) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null); // Store Chart instance

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      // Destroy existing chart instance before creating a new one
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create new chart instance and store it in ref
      chartInstance.current = new Chart(ctx!, {
        type: "bar",
        data: {
          labels: data.labels,
          datasets: [
            {
              label: "Genre Count",
              data: data.values,
              backgroundColor: "rgba(59, 130, 246, 0.6)",
              borderColor: "rgba(59, 130, 246, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: "#f3f4f6", // Tailwind gray-100
              },
            },
            x: {
              ticks: {
                color: "#f3f4f6", // Tailwind gray-100
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: "#f3f4f6", // Tailwind gray-100
              },
            },
          },
        },
      });
    }

    // Cleanup function to destroy chart on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [data]);

  return <canvas ref={chartRef} className="text-gray-100" />;
}
