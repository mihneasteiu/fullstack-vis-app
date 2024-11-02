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

interface SelectInputProps {
  state: string;
  setState: Dispatch<SetStateAction<string>>;
  county: string;
  setCounty: Dispatch<SetStateAction<string>>;
}

// Component for selecting state and county, with keyboard navigation support
export function SelectBroadbandInput(props: SelectInputProps) {
  // State for holding user input values for state and county
  const [stateInput, setStateInput] = useState<string>("");
  const [countyInput, setCountyInput] = useState<string>("");

  // Refs for focusing elements and enabling keyboard navigation
  const stateRef = useRef<HTMLInputElement>(null);
  const countyRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  // Enable keyboard navigation for the state input field
  useKeyboardNav("state", stateRef, {
    position: 0,
  });

  // Enable keyboard navigation for the county input field
  useKeyboardNav("county", countyRef, {
    position: 1,
  });

  // Enable keyboard navigation for the submit button with onClick handler
  useKeyboardNav("submit broadband", submitRef, {
    position: 2,
    isSubmit: true,
    onClick: handleSubmit,
  });

  // Function to handle submission and update the parent component state
  function handleSubmit() {
    props.setState(stateInput);
    props.setCounty(countyInput);
  }

  return (
    <div>
      {/* Input field for entering the state */}
      <input
        id="text-input"
        type="text"
        placeholder="Enter state"
        value={stateInput}
        ref={stateRef}
        aria-label="Enter state"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setStateInput(event.target.value);
        }}
      />

      {/* Input field for entering the county */}
      <input
        id="text-input"
        type="text"
        placeholder="Enter county"
        aria-label="Enter county"
        value={countyInput}
        ref={countyRef}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setCountyInput(event.target.value);
        }}
      />

      {/* Button to submit selected state and county values */}
      <button
        ref={submitRef}
        aria-label="Retrieve broadband data"
        onClick={() => {
          // Check if inputs are non-empty before submission
          if (stateInput !== "" && countyInput !== "") {
            handleSubmit();
          }
        }}
      >
        Broadband
      </button>
    </div>
  );
}
