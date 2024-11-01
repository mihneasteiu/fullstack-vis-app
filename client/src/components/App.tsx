import "../styles/App.css";
import { Select } from "./select/Select";
import React, { useEffect, useRef } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useClerk
} from "@clerk/clerk-react";
import { useKeyboardNav } from "../KeyboardManager";

/**
 * This is the highest level of Mock which builds the component APP;
 *
 * @return JSX of the entire mock
 *  Note: if the user is loggedIn, the main interactive screen will show,
 *  else it will stay at the screen prompting for log in
 */
function App({}: { children: React.ReactNode; modal: React.ReactNode }) {

  const signOutRef = useRef<HTMLButtonElement>(null);

  useKeyboardNav("file", signOutRef, {
    position: 0,
  });

  return (
    <div className="App">
      <div className="App-header">
        <h1 aria-label="Mock Header">Data Viewer</h1>
      </div>
      <SignedIn>
        <SignOutButton>Sign Out</SignOutButton>
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
