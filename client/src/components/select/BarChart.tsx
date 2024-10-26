import "../../styles/main.css";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

interface barChartProps {
  data: string[][];
  isStacked: boolean;
}

function generateRandomRGBA(): string {
  const r = Math.floor(128 + Math.random() * 128);
  const g = Math.floor(128 + Math.random() * 128);
  const b = Math.floor(128 + Math.random() * 128);

  const a = (0.7 + Math.random() * 0.3).toFixed(2); // Alpha between 0.70 and 1.00

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function BarChart(props: barChartProps) {
    const table = props.data;
    const isStacked = props.isStacked;
  const labels = table.slice(1).map((row) => row[0]);
  const headers = table[0].slice(1);
  const invalidHeaders: string[] = [];
  let allHeadersInvalid = true;
  let datasets = headers.map((header, colIndex) => {
    const data = table.slice(1).map((row) => parseFloat(row[colIndex + 1]));

    if (data.some((value) => isNaN(value))) {
      invalidHeaders.push(header);
    } else {
      allHeadersInvalid = false;
    }

    const color = generateRandomRGBA();

    return {
      label: header,
      data: data,
      backgroundColor: color,
      borderColor: color,
      borderWidth: 1,
    };
  });

  datasets = datasets.filter(
    (dataset) => !dataset.data.some((value) => isNaN(value))
  );

  const data = {
    labels,
    datasets,
  };

  let options;
  if (!isStacked) {
    options = {
      plugins: {
        legend: {
          display: true,
          labels: {
            font: {
              size: 10, // Smaller font for legends
            },
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false, // Allows height to grow with container
      scales: {
        x: {
          stacked: false,
          beginAtZero: true,
          ticks: {
            maxRotation: 90,
            minRotation: 90,
          },
          grid: {
            display: false,
          },
          // Enable scrolling on the x-axis
          min: 0,
        },
        y: {
          stacked: false,
          beginAtZero: true,
          ticks: {
            stepSize: 10, // Customize this for a larger y-axis
          },
        },
      },
    };
  } else {
    options = {
      plugins: {
        legend: {
          display: true,
          labels: {
            font: {
              size: 10, // Smaller font for legends
            },
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false, // Allows height to grow with container
      scales: {
        x: {
          stacked: true,
          beginAtZero: true,
          grid: {
            display: false,
          },
          // Enable scrolling on the x-axis
          min: 0,
        },
        y: {
          stacked: true,
          beginAtZero: true,
          ticks: {
            stepSize: 10, // Customize this for a larger y-axis
          },
        },
      },
    };
  }

  let message = <div></div>;
  if (allHeadersInvalid) {
    message = <div>Selected dataset contains no numerical Y values.</div>;
  } else if (invalidHeaders.length !== 0) {
    message = (
      <div>
        Couldn't parse the following headers: {invalidHeaders.join(", ")}
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", width: "100%", overflowX: "scroll" }}>
      {" "}
      {/* Enable horizontal scrolling */}
      {message}
      {!allHeadersInvalid && <Bar options={options} data={data} />}
    </div>
  );
}
