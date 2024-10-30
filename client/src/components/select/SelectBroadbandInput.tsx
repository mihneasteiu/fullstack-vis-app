import {
  Dispatch,
  SetStateAction,
  useState,
  KeyboardEvent,
  useRef,
  useEffect,
} from "react";
import "../../styles/main.css";


interface SelectInputProps {
  state: string;
  setState: Dispatch<SetStateAction<string>>;
  county: string;
  setCounty: Dispatch<SetStateAction<string>>;
}

export function SelectBroadbandInput(props: SelectInputProps) {
const [stateInput, setStateInput] = useState<string>("");
const [countyInput, setCountyInput] = useState<string>("");  

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
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setStateInput(event.target.value);
        }}
      />
      <input
        id="text-input"
        type="text"
        placeholder="Enter county"
        value={countyInput}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setCountyInput(event.target.value);
        }}
      />
      {/* Button to retrieve the selected data and display mode */}
      <button
        onClick={() => {
          if (stateInput != "" && countyInput != "") {
            handleSubmit();
          }
        }}
        aria-label="Retrieve selected data"
      >
        Broadband
      </button>
    </div>
  );
}
