import { Dispatch, SetStateAction, useState, KeyboardEvent, useRef, useEffect } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const fileSelectRef = useRef<HTMLSelectElement>(null);
  const modeSelectRef = useRef<HTMLSelectElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function handleSubmit(text: string, mode: string) {
    props.setHistory(text);
    props.setMode(mode);
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const focusableElements = [fileSelectRef.current, modeSelectRef.current, buttonRef.current].filter(
      (element): element is HTMLSelectElement | HTMLButtonElement => element !== null
    );
    
    const activeElement = document.activeElement;
    const currentIndex = activeElement ? focusableElements.findIndex(el => el === activeElement) : -1;

    switch (e.key) {
      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) {
          // Move focus backwards
          const nextIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
          focusableElements[nextIndex]?.focus();
        } else {
          // Move focus forwards
          const nextIndex = currentIndex >= focusableElements.length - 1 ? 0 : currentIndex + 1;
          focusableElements[nextIndex]?.focus();
        }
        break;

      case 'Enter':
      case ' ':
        if (e.target === buttonRef.current) {
          e.preventDefault();
          const selectText = fileSelectRef.current?.options[fileSelectRef.current.selectedIndex]?.text;
          const selectDisplay = modeSelectRef.current?.options[modeSelectRef.current.selectedIndex]?.text;
          if (selectText != null && selectDisplay != null) {
            handleSubmit(selectText, selectDisplay);
          }
        }
        break;
    }
  };

  // Set initial focus when component mounts
  useEffect(() => {
    fileSelectRef.current?.focus();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="dropdown-container"
      role="region"
      aria-label="Data selection controls"
      onKeyDown={handleKeyDown}
    >
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
        <option>Nonexistent table</option>
        <option>malformed/malformed_signs.csv</option>
        <option>stars/stardata.csv</option>
      </select>

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

      <button
        ref={buttonRef}
        onClick={() => {
          const selectText = fileSelectRef.current?.options[fileSelectRef.current.selectedIndex]?.text;
          const selectDisplay = modeSelectRef.current?.options[modeSelectRef.current.selectedIndex]?.text;
          if (selectText != null && selectDisplay != null) {
            handleSubmit(selectText, selectDisplay);
          }
        }}
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