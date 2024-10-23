import { Dispatch, SetStateAction, useState } from "react";
import "../../styles/main.css";
import { histEntry } from "./Select";
import React from "react";

/**
 * A interface for SelectInput.
 *
 * @params
 * history: the array storing all previous history entries
 * setHistory: function to add new history entry to history array
 */
interface SelectInputProps {
  history: string;
  setHistory: Dispatch<SetStateAction<string>>;
  mode: string;
  setMode: Dispatch<SetStateAction<string>>;
}

export function SelectInput(props: SelectInputProps) {
  // SOLUTION FUNCTION:
  /**
   * Function that is called when a user click the submit button to display a new output
   *
   * @param file the file selected by the user
   */

  function handleSubmit(text: string, mode: string) {
    let newEntry=text;
    let newMode=mode;
    props.setHistory(newEntry);
    props.setMode(newMode);
  }

  return (
    <div className="dropdown-container">
      <select
        className="dropdown"
        name="dropdown"
        id="dropdown"
        aria-label="dropdown"
      >
        <option>Select a file</option>
        <option>Star Data</option>
        <option>Student Records</option>
        <option>Nonexistent table</option>
        <option>Empty Table</option>
        <option>RI Income by Race</option>
        <option>just text</option>
      </select>
      <select
        className="dropdownVisOption"
        name="dropdownVisOption"
        id="dropdownVisOption"
        aria-label="dropdownVisOption"
      >
        <option>Select display mode</option>
        <option>Table</option>
        <option>Vertical Bar Chart</option>
        <option>Stacked Bar Chart</option>
      </select>

      <button
        onClick={() => {
          const selectElement = document.getElementById(
            "dropdown"
          ) as HTMLSelectElement | null;
          const selectMode = document.getElementById(
            "dropdownVisOption"
          ) as HTMLSelectElement | null;
          const selectText =
            selectElement?.options[selectElement.selectedIndex]?.text;
          const selectDisplay =
            selectMode?.options[selectMode.selectedIndex]?.text;
          if (selectText != null && selectDisplay != null) {
            handleSubmit(selectText, selectDisplay);
          }
        }}
        aria-label="retrieve"
      >
        Retrieve
      </button>
    </div>
  );
}