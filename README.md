> **GETTING STARTED:** You should likely integrate your work from mock for the `/client` folder and server for the `/server` folder, while keeping some of the new features from the gearup (firebase, fetch, etc.)

# Project Details
Partners: ctpascua and msteiu

Estimated time: 8 hours

Github Link: https://github.com/cs0320-f24/repl-colin-mihnea
# Design Choices
Created a new endpoint in our backend that combines view csv and load csv, returning a specified csv in our data folder. When the user selects a csv name from the dropdown, our frontend will make a request to our new endpoint and the data will be displayed. One dataset is hardcoded in our frontend for mock testing purposes. For screenreading and keyboard shortcuts, we added aria-labels to our components, also providing directions for keyboard shortcuts that will be read out loud: "Tab" to switch between dropdowns, "ArrowDown" to choose between items in dropdowns" and "Space" to press buttons or select items in dropdowns.
# Errors/Bugs
We are having some issues with playwright testing our keyboard inputs, as it seems to not be registering our inputs in the testing environment, yet when we run the exact same tests locally our site has the proper behavior.
# Tests
Added tests to ensure our fetched data was properly being displayed and keyboard shorcuts were working (although these tests will fail and we don't understand why). We also tested with multiple screenreaders to ensure full functionality.
# How to
From root directory, run npm run dev to start both backend and frontends.
# Collaboration
*(state all of your sources of collaboration past your project partner. Please refer to the course's collaboration policy for any further questions.)*
Claude LLM By Anthropic
