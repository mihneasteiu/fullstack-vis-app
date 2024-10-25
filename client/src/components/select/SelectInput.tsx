import { Dispatch, SetStateAction, useState, KeyboardEvent } from "react";
import "../../styles/main.css";
import { histEntry } from "./Select";
import React from "react";

interface SelectInputProps {
  history: string;
  setHistory: Dispatch<SetStateAction<string>>;
  mode: string;
  setMode: Dispatch<SetStateAction<string>>;
}

export function SelectInput(props: SelectInputProps) {
  function handleSubmit(text: string, mode: string) {
    props.setHistory(text);
    props.setMode(mode);
  }

  // Handle keyboard interaction for the button
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // Prevent space from scrolling
      const selectElement = document.getElementById("dropdown") as HTMLSelectElement | null;
      const selectMode = document.getElementById("dropdownVisOption") as HTMLSelectElement | null;
      const selectText = selectElement?.options[selectElement.selectedIndex]?.text;
      const selectDisplay = selectMode?.options[selectMode.selectedIndex]?.text;
      if (selectText != null && selectDisplay != null) {
        handleSubmit(selectText, selectDisplay);
      }
    }
  };

  return (
    <div 
      className="dropdown-container"
      role="region"
      aria-label="Data selection controls"
    >
      <select
        className="dropdown"
        name="dropdown"
        id="dropdown"
        aria-label="Select a data file"
      >
        <option>Select a file</option>
        <option>census/income_by_race.csv</option>
        <option>census/postsecondary_education.csv</option>
        <option>Nonexistent table</option>
        <option>malformed/malformed_signs.csv</option>
        <option>stars/stardata.csv</option>
      </select>

      <select
        className="dropdownVisOption"
        name="dropdownVisOption"
        id="dropdownVisOption"
        aria-label="Select display mode"
      >
        <option>Select display mode</option>
        <option>Table</option>
        <option>Vertical Bar Chart</option>
        <option>Stacked Bar Chart</option>
      </select>

      <button
        onClick={() => {
          const selectElement = document.getElementById("dropdown") as HTMLSelectElement | null;
          const selectMode = document.getElementById("dropdownVisOption") as HTMLSelectElement | null;
          const selectText = selectElement?.options[selectElement.selectedIndex]?.text;
          const selectDisplay = selectMode?.options[selectMode.selectedIndex]?.text;
          if (selectText != null && selectDisplay != null) {
            handleSubmit(selectText, selectDisplay);
          }
        }}
        onKeyDown={handleKeyDown}
        aria-label="Retrieve selected data"
      >
        Retrieve
      </button>

      {/* Instructions for screen reader users */}
      <div className="sr-only" aria-live="polite">
        Use Tab to move between controls, arrow keys to change options, and Enter to select
      </div>
    </div>
  );
}