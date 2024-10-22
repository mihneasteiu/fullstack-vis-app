package edu.brown.cs.student.main.server;

import edu.brown.cs.student.main.ACSApi.datasource.BroadbandData;
import edu.brown.cs.student.main.ACSApi.datasource.CensusDatasource;
import edu.brown.cs.student.main.JsonSerializer.JsonSerializer;
import java.util.HashMap;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

/**
 * This class handles view requests in a Spark server application. It retrieves parsed data from a
 * previously loaded parser in shared state.
 */
public class BroadbandHandler implements Route {
  private final CensusDatasource datasource;
  /**
   * Constructs a new ViewHandler with the given shared state.
   *
   * @param datasource A Census data source
   */
  public BroadbandHandler(CensusDatasource datasource) {
    this.datasource = datasource;
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
    Map<String, String> responseMap = new HashMap<>();
    response.type("application/json");
    try {
      String county = HandlerUtilities.getRequiredParam(request, "county");
      String state = HandlerUtilities.getRequiredParam(request, "state");
      BroadbandData data = datasource.getBroadbandData(state, county);
      return new SuccessResponse<BroadbandData>(data).toJson();
    } catch (IllegalStateException | IllegalArgumentException e) {
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
