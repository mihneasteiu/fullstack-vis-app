/**
 * Interface defining the properties for the Table component.
 *
 * @interface tableProps
 * @property {string[][]} table - A 2D array where each sub-array represents a row in the table,
 *                                and each string represents a cell's content.
 */
interface tableProps {
  table: string[][];
}

/**
 * Table component that renders a scrollable, responsive table.
 * The first row of the data is treated as the table header, and all subsequent rows
 * represent the table body. Each cell is displayed as a string.
 *
 * @component
 * @param {tableProps} props - The properties passed to the component.
 * @returns {JSX.Element} JSX Element representing the rendered table.
 */
export function Table(props: tableProps) {
  const table = props.table;

  return (
    <div
      className="table"
      style={{
        overflowY: "auto",
        width: "80%",
        margin: "auto",
        overflowX: "auto",
      }}
    >
      {/* Table element with border styling and full width */}
      <table border={1} style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            {/* Render table headers from the first row of the table data */}
            {table[0].map((header, index) => (
              <th
                key={index}
                style={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "grey",
                  zIndex: 1,
                  minWidth: "150px",
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Render each row of data, skipping the first (header) row */}
          {table.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {/* Render each cell in the row */}
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
