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

export function SelectBroadbandInput(props: SelectInputProps) {
  const [stateInput, setStateInput] = useState<string>("");
  const [countyInput, setCountyInput] = useState<string>(""); 
  const stateRef = useRef<HTMLInputElement>(null);
  const countyRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  useKeyboardNav('state', stateRef, {
    position: 0,
  }
  );
  useKeyboardNav('county', countyRef, {
    position: 1,
  });  
  useKeyboardNav('submit broadband', submitRef, {
    position: 2,
    isSubmit: true,
    onClick: handleSubmit
  });
  
  function handleSubmit() {
    props.setState(stateInput);
    props.setCounty(countyInput);
  }

  return (
    <div>
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
      {/* Button to retrieve the selected data and display mode */}
      <button ref={submitRef}
      aria-label="Retrieve broadband data"
        onClick={() => {
          if (stateInput != "" && countyInput != "") {
            handleSubmit();
          }
        }}
      >
        Broadband
      </button>
    </div>
  );
}
