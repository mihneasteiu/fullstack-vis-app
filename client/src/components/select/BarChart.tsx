import "../../styles/main.css";
import { Bar } from "react-chartjs-2"; // Import Bar component from react-chartjs-2 library
import "chart.js/auto"; // Import chart.js for additional functionality

// Define the props interface for the BarChart component
interface barChartProps {
  data: string[][]; // 2D array of strings representing table data
  isStacked: boolean; // Boolean to determine if bars should be stacked
}

/**
 * Generates a random RGBA color string with high visibility
 * @returns A string in the format "rgba(r, g, b, a)"
 * - r, g, b values are between 128-255 for better visibility
 * - alpha value is between 0.7-1.0 for good opacity
 */
function generateRandomRGBA(): string {
  const r = Math.floor(128 + Math.random() * 128); // Red value between 128-255
  const g = Math.floor(128 + Math.random() * 128); // Green value between 128-255
  const b = Math.floor(128 + Math.random() * 128); // Blue value between 128-255
  const a = (0.7 + Math.random() * 0.3).toFixed(2); // Alpha between 0.70 and 1.00
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/**
 * BarChart component that renders either a regular or stacked bar chart
 * based on the provided data and isStacked prop
 */
export function BarChart(props: barChartProps) {
  const table = props.data;
  const isStacked = props.isStacked;
  
  // Extract labels (first column) from data, excluding header row
  const labels = table.slice(1).map((row) => row[0]);
  
  // Extract headers (first row) excluding first column
  const headers = table[0].slice(1);
  
  // Track headers with invalid (non-numeric) data
  const invalidHeaders: string[] = [];
  let allHeadersInvalid = true;

  // Create datasets for each column (header)
  let datasets = headers.map((header, colIndex) => {
    // Extract numeric data for this column, excluding header row
    const data = table.slice(1).map((row) => Number(row[colIndex + 1]));

    // Check for invalid (NaN) values in the data
    if (data.some((value) => isNaN(value))) {
      invalidHeaders.push(header);
    } else {
      allHeadersInvalid = false;
    }

    // Generate a random color for this dataset
    const color = generateRandomRGBA();

    // Return dataset object for chart.js
    return {
      label: header,
      data: data,
      backgroundColor: color,
      borderColor: color,
      borderWidth: 1,
    };
  });

  // Filter out datasets with invalid (NaN) values
  datasets = datasets.filter(
    (dataset) => !dataset.data.some((value) => isNaN(value))
  );

  // Prepare data object for chart.js
  const data = {
    labels,
    datasets,
  };

  // Configure chart options based on whether it's stacked or not
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
            maxRotation: 90, // Rotate labels for better readability
            minRotation: 90,
          },
          grid: {
            display: false, // Hide grid lines
          },
          min: 0, // Start x-axis at 0
        },
        y: {
          stacked: false,
          beginAtZero: true,
          ticks: {
            stepSize: 10, // Set y-axis tick intervals
          },
        },
      },
    };
  } else {
    // Stacked bar chart options
    options = {
      plugins: {
        legend: {
          display: true,
          labels: {
            font: {
              size: 10,
            },
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true, // Enable stacking on x-axis
          beginAtZero: true,
          grid: {
            display: false,
          },
          min: 0,
        },
        y: {
          stacked: true, // Enable stacking on y-axis
          beginAtZero: true,
          ticks: {
            stepSize: 10,
          },
        },
      },
    };
  }

  // Prepare error message if data is invalid
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

  // Render chart container with horizontal scroll
  return (
    <div style={{ height: "100vh", width: "100%", overflowX: "scroll" }}>
      {message}
      {/* Only render chart if there's valid data */}
      {!allHeadersInvalid && <Bar options={options} data={data} />}
    </div>
  );
}