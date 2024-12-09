# Project Details
This is a full-stack web application project that I created over multiple partnered assignments for my softare engineering class. The user can select from a range of csv files that are stored in the backend and choose a display mode for the given data, that is retrieved through API queries. The user can also retrieve broadband percentage data for a specific county and state in the US, and this is done through queries to the US Census Bureau API. Additionally, the backend server can be run individually and used for loading, viewing, and searching information in CSV files that are stored locally. This can be done through the commands "loadcsv", "viewcsv", and "searchcsv". The "loadcsv" command requires a "filepath" parameter, while "searchcsv" must be provided with a keyword "query" parameter.    

# Technologies Used
We used React and Typescript for frontend functionality, Java for the backend server, Clerk for secure authentication, and Playwright for testing. We also used RESTful API proxy for mocking data retrieval during testing and LRU Caching for efficiency.

# Usage instructions 
In order to run the application, the frontend and backend need to be started on different terminals. One can do this by calling "npm install" and "npm start" in the client folder, and "mvn package" and "./run" in the server folder. 
