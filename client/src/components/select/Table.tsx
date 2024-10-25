interface tableProps {
    table: string[][]
}

export function Table(props: tableProps) {
    const table = props.table
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
        <table border={1} style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
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