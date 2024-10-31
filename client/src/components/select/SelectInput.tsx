import {
  Dispatch,
  SetStateAction,
  useState,
  KeyboardEvent,
  useRef,
  useEffect,
} from "react";
import "../../styles/main.css";
import { useKeyboardNav } from "../../KeyboardManager";

/**
 * Defines the props for SelectInput component.
 *
 * @interface SelectInputProps
 * @property {string} history - The current history value.
 * @property {Dispatch<SetStateAction<string>>} setHistory - Function to update the history state.
 * @property {string} mode - The current mode of selection.
 * @property {Dispatch<SetStateAction<string>>} setMode - Function to update the mode state.
 */
interface SelectInputProps {
  history: string;
  setHistory: Dispatch<SetStateAction<string>>;
  mode: string;
  setMode: Dispatch<SetStateAction<string>>;
}

/**
 * The SelectInput component provides a UI for selecting a file and a display mode from dropdowns,
 * and then retrieves the selected data based on these options. The component is accessible for
 * keyboard users, allowing navigation and interaction using the Tab and Space keys.
 *
 * @component
 * @param {SelectInputProps} props - The properties passed to the component.
 * @returns {JSX.Element} JSX Element representing the SelectInput component.
 */
export function SelectInput(props: SelectInputProps) {
  const fileSelectRef = useRef<HTMLSelectElement>(null);
  const modeSelectRef = useRef<HTMLSelectElement>(null);
  const getDataRef = useRef<HTMLButtonElement>(null);

  useKeyboardNav("file", fileSelectRef, {
    position: 3,
  });
  useKeyboardNav("mode", modeSelectRef, {
    position: 4,
  });
  useKeyboardNav("submit", getDataRef, {
    position: 5,
    isSubmit: true,
    onClick: requestData
  });

  /**
   * handleSubmit sets the selected text and mode in the parent state.
   *
   * @param {string} text - The selected file name.
   * @param {string} mode - The selected display mode.
   */
  function handleSubmit(text: string, mode: string) {
    props.setHistory(text);
    props.setMode(mode);
  }

  function requestData() { 
    const selectText =
      fileSelectRef.current?.options[fileSelectRef.current.selectedIndex]
        ?.text;
    const selectDisplay =
      modeSelectRef.current?.options[modeSelectRef.current.selectedIndex]
        ?.text;
    if (selectText != null && selectDisplay != null) {
      handleSubmit(selectText, selectDisplay);
    }
  }

  return (
    <div
      className="dropdown-container"
      role="region"
      aria-label="Data selection controls"
    >
      {/* Dropdown for selecting a data file */}
      <select
        ref={fileSelectRef}
        className="dropdown"
        name="dropdown"
        id="dropdown"
        aria-label="Select a data file"
      >
        <option>Select a file</option>
        <option>census/income_by_race.csv</option>
        <option>census/postsecondary_education.csv</option>
        <option>malformed/malformed_signs.csv</option>
        <option>Nonexistent table</option>
        <option>Text Dataset</option>
        <option>Number Dataset</option>
        <option>Star Data</option>
        <option>Empty Dataset</option>
      </select>

      {/* Dropdown for selecting display mode */}
      <select
        ref={modeSelectRef}
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

      {/* Button to retrieve the selected data and display mode */}
      <button
        ref={getDataRef}
        onClick={requestData}
        aria-label="Retrieve selected data"
      >
        Retrieve
      </button>

      {/* Instructions for screen reader users */}
      <div className="sr-only" aria-live="polite">
        Use Tab to move between controls, arrow keys to change options, and
        Enter or Space to select
      </div>
    </div>
  );
}
