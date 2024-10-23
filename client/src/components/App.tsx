import { useState } from "react";
import "../styles/App.css";
import { LoginButton } from "./LoginButton";
import { Select } from "./select/Select";
import React from "react";

/**
 * This is the highest level of Mock which builds the component APP;
 *
 * @return JSX of the entire mock
 *  Note: if the user is loggedIn, the main interactive screen will show,
 *  else it will stay at the screen prompting for log in
 */
function App({}: { children: React.ReactNode; modal: React.ReactNode }) {
  /**
   * A state tracker for if the user is logged in and
   *  a function to update the logged-in state
   */
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <div className="App">
      <div className="App-header">
        <h1 aria-label="Mock Header">Data Viewer</h1>
      </div>
        <Select />
      <div id="modal-root"></div>
    </div>
  );
}
export default App;
