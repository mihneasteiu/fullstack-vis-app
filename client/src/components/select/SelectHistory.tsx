import "../../styles/main.css";
import { histEntry } from "./Select";
import {getTable} from "../../mockedData"
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import React from "react";

/**
 * A interface for the props that are passed into SelectHistory.
 *
 * @params
 * history: an array holding the history entries that are to be
 *  outputted to the end-user in the main output area
 */
interface SelectHistoryProps {
  history: string;
  mode: string
}

function generateRandomRGBA(): string {
  const r = Math.floor(128 + Math.random() * 128);
  const g = Math.floor(128 + Math.random() * 128);
  const b = Math.floor(128 + Math.random() * 128);
  
  const a = (0.7 + Math.random() * 0.3).toFixed(2); // Alpha between 0.70 and 1.00

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}


/**
 * Builds a SelectHistory component that displays the output area according
 *  to any commands inputted by the user.
 *
 * @param props the history entries (see SelectHistoryProps for more details)
 * @returns JSX that will print a tabular view of the passed in data
 */
export function SelectHistory(props: SelectHistoryProps) {
  const key= props.history;
  const mode=props.mode;
  const table = getTable(key);
  if (!table) {
    // If selected is the empty one, tell user to select
    if (props.history == "Select a file"){
      return (
        <div style={{ 
          wordWrap: 'break-word', 
          whiteSpace: 'normal', 
          overflowWrap: 'break-word' 
        }}>Please choose one of the tables in the dropdown menu to display it.</div>
      );
    }
    // If table is undefined or null, render a message or empty state
    return <div>No data available for the selected table.</div>;
  }
  if (mode == "Select display mode") {
    return (
      <div style={{
          wordWrap: 'break-word',
          whiteSpace: 'normal',
          overflowWrap: 'break-word'
        }}>
        Please choose a display mode.
      </div>
    );
  }
  if (mode == "Table"){
    return (
      <div className="table" style={{ overflowY: 'auto', width: '80%', margin: 'auto' , overflowX: 'auto'}}>
        <table border={1} style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              {table[0].map((header, index) => (
                <th key={index} style={{ 
                  position: 'sticky', 
                  top: 0, 
                  backgroundColor: 'grey', 
                  zIndex: 1,
                  minWidth: '150px'
                }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
const labels = table.slice(1).map(row => row[0]);
const headers = table[0].slice(1);
const invalidHeaders:string[] = [];
let allHeadersInvalid = true;
let datasets = headers.map((header, colIndex) => {
  const data = table.slice(1).map(row => parseFloat(row[colIndex + 1]));
  
  if (data.some(value => isNaN(value))) {
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
    borderWidth: 1
  };
});

datasets = datasets.filter(dataset => !dataset.data.some(value => isNaN(value)));

const data = {
  labels,
  datasets
};

let options;
if (mode === "Vertical Bar Chart") {
  options = {
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 10 // Smaller font for legends
          }
        }
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
          minRotation: 90
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
          stepSize: 10 // Customize this for a larger y-axis
        }
      },
    },
  };
} else if (mode === "Stacked Bar Chart") {
  options = {
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 10 // Smaller font for legends
          }
        }
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
          stepSize: 10 // Customize this for a larger y-axis
        }
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
  <div style={{ height: '100vh', width: '100%', overflowX: 'scroll' }}> {/* Enable horizontal scrolling */}
    {message}
    {!allHeadersInvalid && <Bar options={options} data={data} />}
  </div>
);

}