import "../styles/App.css";
import { Select } from "./select/Select";
import React, { useEffect } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useClerk
} from "@clerk/clerk-react";

/**
 * This is the highest level of Mock which builds the component APP;
 *
 * @return JSX of the entire mock
 *  Note: if the user is loggedIn, the main interactive screen will show,
 *  else it will stay at the screen prompting for log in
 */
function App({}: { children: React.ReactNode; modal: React.ReactNode }) {

  return (
    <div className="App">
      <div className="App-header">
        <h1 aria-label="Mock Header">Data Viewer</h1>
      </div>
      <SignedIn>
        <Select />
      </SignedIn>
      <div className="SignIn">
        <SignedOut>
          <SignInButton>Sign In</SignInButton>
        </SignedOut>
      </div>
      <div id="modal-root"></div>
    </div>
  );
}
export default App;
