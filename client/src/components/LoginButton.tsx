import React from "react";
import { Dispatch, SetStateAction } from "react";
import { useState } from "react";

/**
 * An interface for logged-in state for mock.
 *
 * @params
 * isLoggedIn: true if the user is logged in, false otherwise
 * setIsLoggedIn: to update the state of isLoggedIn
 */
interface loginProps {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

/**
 * Builds a component that manage the login button and end-user's logged in state.
 *
 * @param props to access logged-in state (see interface loginProps for more details)
 * @returns JSX to let user know they can sign out if they are logged in
 *  or log-in if they are not logged in
 */
export function LoginButton(props: loginProps) {
  /**
   * Function to manage authentication;
   *  if the user is logged in, the user's log-in state will update to not logged in
   *  if the user is not logged in, the user's log-in state will update to logged in
   *
   * @returns whether they are logged in or not
   */
  const [password,setPassword] = useState("");
  const login = () => {
    if (password=="cs32"){
      const newValue = !props.isLoggedIn;
      props.setIsLoggedIn(newValue);
      return newValue;
    }
    const box = document.getElementsByTagName("input");
    setPassword("");
    box[0].setAttribute("placeholder", "Incorrect Password !!");
  };
  const signout = () => {
    setPassword("")
    const newValue = !props.isLoggedIn;
    props.setIsLoggedIn(newValue);
    return newValue;
  };

  if (props.isLoggedIn) {
    return (
      <button aria-label="Sign Out" onClick={signout}>
        Sign out
      </button>
    );
  } else {
    return (
      <span>
        <input
          type="password"
          placeholder="Enter password"
          aria-label = "Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            borderRadius: "8px",
            border: "1px solid transparent",
            padding: "0.6em 1.2em",
            fontSize: "1em",
            fontWeight: "500",
            fontFamily: "inherit",
            backgroundColor: "#1a1a1a",
            color: "white",  
            marginRight: "10px",
            cursor: "text", 
            boxSizing: "border-box",
          }}
        />
      <button aria-label="Login" onClick={login}>
        Login
      </button>
      </span>
    );
  }
}
