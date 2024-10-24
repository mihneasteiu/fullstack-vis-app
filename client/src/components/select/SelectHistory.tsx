import "../../styles/main.css";
import { histEntry } from "./Select";
import {getTable} from "../../mockedData"
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import React, { useEffect } from "react";
import { Dispatch, SetStateAction, useState } from "react";
import { Table } from "./Table";

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
export async function SelectHistory(props: SelectHistoryProps) {
  const history = props.history;
  const mode = props.mode;
  const [table, setTable] = useState<string[][] | null>(null);
  const [loading, setLoading] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (history !== "Select a file" && mode !== "Select display mode") {
      const fetchTable = async () => {
        setLoading(true);
        try {
        const fetchedTable = await getTable(history);
        setTable(fetchedTable)
        } catch (error) {
          if (error instanceof Error){
            setError(error.message);
          }
          setError("Error in fetch");
        } finally {
          setLoading(false);
        }
      };
      fetchTable();
    } 
  }, [history, mode]);
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
      );
    }
  if (error)
  if (mode == "Table"){
    return (<Table table={table}/>);
  }
}