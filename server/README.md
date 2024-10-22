> **GETTING STARTED:** You must start from some combination of the CSV Sprint code that you and your partner ended up with. Please move your code directly into this repository so that the `pom.xml`, `/src` folder, etc, are all at this base directory.

> **IMPORTANT NOTE**: In order to run the server, run `mvn package` in your terminal then `./run` (using Git Bash for Windows users). This will be the same as the first Sprint. Take notice when transferring this run sprint to your Sprint 2 implementation that the path of your Server class matches the path specified in the run script. Currently, it is set to execute Server at `edu/brown/cs/student/main/server/Server`. Running through terminal will save a lot of computer resources (IntelliJ is pretty intensive!) in future sprints.
# Sprint 2.1 API Server #
### Project Details


Repo: https://github.com/cs0320-f24/server-colin-furkan

Team: Colin Pascual (ctpascua) and Furkan Baylav (fbaylav)

Estimated Time: 8 hours

### Design Choices
We stored in our state variable between all handlers a Concurrent Hash Map that for now just stores our parser. The file is loaded in
loadcsv and then parsed, checking for any errors before finally being stored in the hash map for reading in search csv and view csv. Our search endpoint
allows for case insensitive, substring search, defaulting at case sensitive and non-substring search if no query parameters are added. We decided to ipmlement our own
LRU cache using doubly linked lists and a hash map, making sure to properly test it as well. Both the cache and mocked data use dependency injection so
a developer could easily swap between cached/mock, non-cached/real, cached/real, etc. Running the server will default to using the
cached ACS api implementation.

### Errors/Bugs
Currently, ./run is not working for us,  we are working on fixing it. The server can be ran by just running the Server.java file on 
the path listed below.
### Tests
Full integration tests for load, search, and view csv as well as mocked broadband request, making sure our server follows expected behavior for things like
viewing without loading, file not found, missing search parameters. For 2.2, we emphasized fully testing the caching mechanism, both for mocked data and 
ACS queries as well as basic funcionality tests and exception handling -- notifying user if state/county does not exist or if
they are missing a parameter. 
## How to
To run, execute the Server.java file at `src/main/java/edu/brown/cs/student/main/server`

Example queries:


**To load a csv**:

loadcsv/filepath=census/income_by_race.csv


**To view csv**

viewcsv

**To search csv:**

Note: query defaults to case sensitive and exact match, searching all columns.

**To search for Colin in column "Name" with case insensitive and substring match:**


searchcsv?query=Colin&column=Name&caseInsensitive=True&substringMatch=True

**To search for Colin in column 4**:

searchcsv?query=Colin&column=4

**To get broadband data for a county and state**:

broadband?state=[state]&county=[county]

States/counties can be inputted in any case. For two word states/counties like "Rhode Island",
input both words with any spaces removed. "rhode island" -> "rhodeisland". "Los angeles" -> "losangeles".

## Citations

Anthropic. (2024). Claude (3.5 Sonnet version) [Large language model]. https://www.anthropic.com