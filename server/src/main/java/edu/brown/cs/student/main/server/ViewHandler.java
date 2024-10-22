package edu.brown.cs.student.main.server;

import Parser.Parser;
import edu.brown.cs.student.main.JsonSerializer.JsonSerializer;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import spark.Request;
import spark.Response;
import spark.Route;

/**
 * This class handles view requests in a Spark server application. It retrieves parsed data from a
 * previously loaded parser in shared state.
 */
public class ViewHandler implements Route {
  private final ConcurrentHashMap<String, Object> state;

  /**
   * Constructs a new ViewHandler with the given shared state.
   *
   * @param state A ConcurrentHashMap representing the shared state of the application
   */
  public ViewHandler(ConcurrentHashMap<String, Object> state) {
    this.state = state;
  }

  /**
   * Handles the view request.
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
      if (!state.containsKey("parser")) {
        throw new IllegalStateException("Must load CSV first before viewing using /loadcsv");
      }

      Object parserObj = state.get("parser");
      if (!(parserObj instanceof Parser<?>)) {
        throw new IllegalStateException("Stored parser is not of the expected type");
      }

      Parser<List<String>> parser = (Parser<List<String>>) parserObj;

      List<List<String>> data = parser.getParsedContent();
      responseMap.put("result", "success");
      responseMap.put("data", data);
    } catch (IllegalStateException e) {
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
}
