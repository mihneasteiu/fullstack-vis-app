package edu.brown.cs.student.main.server;

import static edu.brown.cs.student.main.server.HandlerUtilities.getBooleanParam;

import Parser.Parser;
import Searcher.Searcher;
import edu.brown.cs.student.main.JsonSerializer.JsonSerializer;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import spark.Request;
import spark.Response;
import spark.Route;

/**
 * This class handles search requests in a Spark server application. It performs searches on
 * previously loaded CSV data.
 */
public class SearchHandler implements Route {

  private final ConcurrentHashMap<String, Object> state;

  /**
   * Constructs a new SearchHandler with the given shared state.
   *
   * @param state A ConcurrentHashMap representing the shared state of the application
   */
  public SearchHandler(ConcurrentHashMap<String, Object> state) {
    this.state = state;
  }

  /**
   * Handles the search request.
   *
   * @param request The Spark Request object containing the HTTP request information
   * @param response The Spark Response object for setting response properties
   * @return A JSON string containing the result of the operation
   */
  @Override
  public Object handle(Request request, Response response) {
    Map<String, Object> responseMap = new HashMap<>();
    response.type("application/json");

    try {
      Parser<List<String>> parser = getParserFromState();
      List<List<String>> rows = performSearch(request, parser);
      responseMap.put("result", "success");
      responseMap.put("data", rows);
    } catch (IllegalArgumentException | IllegalStateException e) {
      response.status(400); // Bad Request
      responseMap.put("result", "error_bad_request");
      responseMap.put("message", e.getMessage());
    } catch (Exception e) {
      response.status(500); // Internal Server Error
      responseMap.put("result", "error");
      responseMap.put("message", "Unexpected error: " + e.getMessage());
    }
    return JsonSerializer.toJson(responseMap);
  }

  /**
   * Retrieves the parser from the shared state.
   *
   * @return The Parser object
   * @throws IllegalStateException if the parser is not found or is of the wrong type
   */
  private Parser<List<String>> getParserFromState() throws IllegalStateException {
    if (!state.containsKey("parser")) {
      throw new IllegalStateException("Must load CSV first before searching using /loadcsv");
    }

    Object parserObj = state.get("parser");
    return (Parser<List<String>>) parserObj;
  }

  /**
   * Performs the search operation based on the request parameters.
   *
   * @param request The Spark Request object
   * @param parser The Parser object containing the CSV data
   * @return A list of matched rows
   * @throws IllegalArgumentException if required parameters are missing or invalid
   */
  private List<List<String>> performSearch(Request request, Parser<List<String>> parser)
      throws IllegalArgumentException {
    String searchValue = HandlerUtilities.getRequiredParam(request, "query");
    Optional<Integer> columnIndex = getColumnIndex(request, parser);
    boolean caseSensitive = getBooleanParam(request, "caseInsensitive", false);
    boolean substringMatch = getBooleanParam(request, "substringMatch", false);

    return Searcher.search(
        parser.getParsedContent(), searchValue, columnIndex, !caseSensitive, substringMatch);
  }

  /**
   * Determines the column index for the search.
   *
   * @param request The Spark Request object
   * @param parser The Parser object
   * @return An Optional containing the column index, or empty if not specified
   * @throws IllegalArgumentException if the specified column is invalid
   */
  private Optional<Integer> getColumnIndex(Request request, Parser<List<String>> parser)
      throws IllegalArgumentException {
    String column = request.queryParams("column");
    if (column == null || column.trim().isEmpty()) {
      return Optional.empty();
    }

    try {
      int inputColumn = Integer.parseInt(column.trim());
      validateColumnIndex(inputColumn, parser);
      return Optional.of(inputColumn);
    } catch (NumberFormatException e) {
      int parsedColumnIndex = parser.columNameToIndex(column.trim());
      if (parsedColumnIndex == -1) {
        throw new IllegalArgumentException("Invalid column name: " + column);
      }
      validateColumnIndex(parsedColumnIndex, parser);
      return Optional.of(parsedColumnIndex);
    }
  }

  /**
   * Validates if the given column index is within the valid range.
   *
   * @param columnIndex The column index to validate.
   * @return true if the index is valid, false otherwise.
   */
  public void validateColumnIndex(int columnIndex, Parser<List<String>> parser) {
    if (columnIndex < 0 || columnIndex >= parser.getHeader().size()) {
      throw new IllegalArgumentException(
          "Column index must be between 0 and " + (parser.getHeader().size() - 1));
    }
  }
}
