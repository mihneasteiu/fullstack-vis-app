package edu.brown.cs.student.main.server;

import Parser.Parser;
import Parser.TrivialCreator;
import edu.brown.cs.student.main.JsonSerializer.JsonSerializer;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import spark.Request;
import spark.Response;
import spark.Route;

/**
 * This class handles file loading requests in a Spark server application. It parses a file
 * specified by the client and stores the resulting parser in shared state.
 */
public class LoadHandler implements Route {
  private final ConcurrentHashMap<String, Object> state;

  /**
   * Constructs a new LoadHandler with the given shared state.
   *
   * @param state A ConcurrentHashMap representing the shared state of the application
   */
  public LoadHandler(ConcurrentHashMap<String, Object> state) {
    this.state = state;
  }

  /**
   * Handles the file loading request.
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
      String filepath = validateAndGetFilepath(request);
      Parser<List<String>> parser = parseFile(filepath);
      state.put("parser", parser);
      responseMap.put("result", "success");
      responseMap.put("filepath", filepath);
    } catch (IllegalArgumentException e) {
      response.status(400); // Bad Request
      responseMap.put("result", "error_bad_json");
      responseMap.put("message", e.getMessage());
    } catch (FileNotFoundException e) {
      response.status(404); // Not Found
      responseMap.put("result", "error_datasource");
      responseMap.put("message", "File not found: " + e.getMessage());
    } catch (IOException e) {
      response.status(500); // Internal Server Error
      responseMap.put("result", "error");
      responseMap.put("message", "Error reading file: " + e.getMessage());
    } catch (Exception e) {
      response.status(500); // Internal Server Error
      responseMap.put("result", "error");
      responseMap.put("message", "Unexpected error: " + e.getMessage());
    }

    return JsonSerializer.toJson(responseMap);
  }

  /**
   * Validates and retrieves the filepath from the request parameters.
   *
   * @param request The Spark Request object
   * @return The validated filepath
   * @throws IllegalArgumentException if the filepath is missing or invalid
   */
  private String validateAndGetFilepath(Request request) throws IllegalArgumentException {
    String filepath = request.queryParams("filepath");
    if (filepath == null || filepath.trim().isEmpty()) {
      throw new IllegalArgumentException("Filepath parameter is missing or empty");
    }
    return "data/" + filepath.trim();
  }

  /**
   * Parses the file at the given filepath.
   *
   * @param filepath The path to the file to be parsed
   * @return A Parser object containing the parsed data
   * @throws FileNotFoundException if the file is not found
   * @throws IOException if there's an error reading the file
   */
  private Parser<List<String>> parseFile(String filepath) throws IOException {
    try (FileReader reader = new FileReader(filepath)) {
      Parser<List<String>> parser = new Parser<List<String>>(reader, false, new TrivialCreator());
      parser.parse();
      return parser;
    }
  }
}
