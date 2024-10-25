import "../../styles/main.css";
import { histEntry } from "./Select";
import { getTable } from "../../mockedData";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import React, { useEffect } from "react";
import { Dispatch, SetStateAction, useState } from "react";
import { Table } from "./Table";
import { BarChart } from "./BarChart";

/**
 * A interface for the props that are passed into SelectHistory.
 *
 * @params
 * history: an array holding the history entries that are to be
 *  outputted to the end-user in the main output area
 */
interface SelectHistoryProps {
  history: string;
  mode: string;
}

/**
 * Builds a SelectHistory component that displays the output area according
 *  to any commands inputted by the user.
 *
 * @param props the history entries (see SelectHistoryProps for more details)
 * @returns JSX that will print a tabular view of the passed in data
 */
export function SelectHistory(props: SelectHistoryProps) {
  const history = props.history;
  const mode = props.mode;
  const [table, setTable] = useState<string[][] | null>(null);
  const [loading, setLoading] = useState<boolean | null>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (history !== "Select a file" && mode !== "Select display mode") {
      const fetchTable = async () => {
        setLoading(true);
        setError(null);
        try {
          const fetchedTable = await getTable(history);
          setTable(fetchedTable);
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError("Error in fetch");
          }
        } finally {
          setLoading(false);
        }
      };
      fetchTable();
    }
  }, [history, mode]);
  // If selected is the empty one, tell user to select
  if (props.history == "Select a file") {
    return (
      <div
        style={{
          wordWrap: "break-word",
          whiteSpace: "normal",
          overflowWrap: "break-word",
        }}
      >
        Please choose one of the tables in the dropdown menu to display it.
      </div>
    );
  }
  if (mode == "Select display mode") {
    return (
      <div
        style={{
          wordWrap: "break-word",
          whiteSpace: "normal",
          overflowWrap: "break-word",
        }}
      >
        Please choose a display mode.
      </div>
      </div>
    );
  }
  if (loading) {
    return <div>Data is loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  if (table) {
    if (mode == "Table") {
      return <Table table={table} />;
    }
    return <BarChart data={table} isStacked={mode === "Stacked Bar Chart"} />;
  }
  return null;
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
  message = (
    <div role="alert" aria-live="assertive">
      Selected dataset contains no numerical Y values.
    </div>
  );
} else if (invalidHeaders.length !== 0) {
  message = (
    <div role="alert" aria-live="assertive">
      Couldn't parse the following headers: {invalidHeaders.join(", ")}
    </div>
  );
}

return (
  <div style={{ height: '100vh', width: '100%', overflowX: 'scroll' }}> {/* Enable horizontal scrolling */}
    {message}
    {!allHeadersInvalid && <Bar aria-label="bar chart displaying" options={options} data={data} />}
  </div>
);

}