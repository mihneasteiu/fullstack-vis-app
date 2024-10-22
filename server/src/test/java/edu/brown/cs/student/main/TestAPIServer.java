package edu.brown.cs.student.main;

import static edu.brown.cs.student.main.JsonSerializer.JsonSerializer.fromJson;
import static org.junit.jupiter.api.Assertions.assertEquals;

import edu.brown.cs.student.main.ACSApi.datasource.BroadbandData;
import edu.brown.cs.student.main.ACSApi.datasource.CachedACSApi;
import edu.brown.cs.student.main.ACSApi.datasource.MockACS;
import edu.brown.cs.student.main.server.BroadbandHandler;
import edu.brown.cs.student.main.server.LoadHandler;
import edu.brown.cs.student.main.server.SearchHandler;
import edu.brown.cs.student.main.server.SuccessResponse;
import edu.brown.cs.student.main.server.ViewHandler;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import okio.Buffer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import spark.Spark;

/**
 * Integration tests for the API server handlers.
 *
 * <p>This class tests the functionality of various handlers including LoadHandler, ViewHandler,
 * SearchHandler, and BroadbandHandler. It sets up a Spark server before each test and tears it down
 * after each test.
 *
 * <p>These tests are considered integration tests as they test the interaction between multiple
 * units of code, rather than isolated unit tests.
 */
public class TestAPIServer {

  @BeforeAll
  public static void setup_before_everything() {
    Spark.port(0);
    Logger.getLogger("").setLevel(Level.WARNING);
  }

  /** Shared state for all tests. */
  final ConcurrentHashMap<String, Object> state = new ConcurrentHashMap<String, Object>();

  @BeforeEach
  public void setup() {
    this.state.clear();

    Spark.get("viewcsv", new ViewHandler(state));
    Spark.get("loadcsv", new LoadHandler(state));
    Spark.get("searchcsv", new SearchHandler(state));
    Spark.get("broadband", new BroadbandHandler(new MockACS()));
    Spark.init();
    Spark.awaitInitialization();
  }

  @AfterEach
  public void teardown() {
    Spark.unmap("viewcsv");
    Spark.unmap("loadcsv");
    Spark.unmap("searchcsv");
    Spark.unmap("broadband");
    Spark.awaitStop();
  }

  /**
   * Tests the full workflow of loading, viewing, and searching a CSV file.
   *
   * @throws IOException if an I/O error occurs during the test
   */
  @Test
  public void testFullLoadViewSearchCSV() throws IOException {
    // loadcsv works
    HttpURLConnection loadConnection = tryRequest("loadcsv?filepath=persons/people.csv");
    assertEquals(200, loadConnection.getResponseCode());
    Map<String, Object> response = deserializeMapFromConnection(loadConnection);
    assertEquals(response.get("result"), "success");
    assertEquals(response.get("filepath"), "data/persons/people.csv");
    loadConnection.disconnect();

    // viewcsv works
    HttpURLConnection viewConnection = tryRequest("viewcsv");
    assertEquals(200, viewConnection.getResponseCode());
    response = deserializeMapFromConnection(viewConnection);
    List<List<String>> expected =
        List.of(
            List.of("Colin", "19", "Student"),
            List.of("Thao", "52", "Doctor"),
            List.of("Fred", "55", "Doctor"),
            List.of("Derick", "21", "Student"),
            List.of("Ryan", "17", "Student"),
            List.of("Ba", "76", "Retired"));
    assertEquals(response.get("result"), "success");
    assertEquals(response.get("data"), expected);
    viewConnection.disconnect();

    // basic Search csv works
    HttpURLConnection searchConnection = tryRequest("searchcsv?query=Student&column=2");
    response = deserializeMapFromConnection(searchConnection);
    expected =
        List.of(
            List.of("Colin", "19", "Student"),
            List.of("Derick", "21", "Student"),
            List.of("Ryan", "17", "Student"));
    assertEquals(response.get("result"), "success");
    searchConnection.disconnect();
  }
  /**
   * Tests the behavior when attempting to load a non-existent CSV file.
   *
   * @throws IOException
   */
  @Test
  public void testLoadCSVFileNotFound() throws IOException {
    HttpURLConnection clientConnection = tryRequest("loadcsv?filepath=blah");
    assertEquals(404, clientConnection.getResponseCode());
    Map<String, Object> response = deserializeMapFromError(clientConnection);
    assertEquals(response.get("result"), "error_datasource");
    assertEquals(response.get("message"), "File not found: data/blah (No such file or directory)");
    clientConnection.disconnect();
  }

  /**
   * Tests loading file without filepath query parameter
   *
   * @throws IOException
   */
  @Test
  public void testLoadWithoutfilepath() throws IOException {
    HttpURLConnection clientConnection = tryRequest("loadcsv");
    assertEquals(400, clientConnection.getResponseCode());
    Map<String, Object> response = deserializeMapFromError(clientConnection);
    assertEquals(response.get("result"), "error_bad_json");
    assertEquals(response.get("message"), "Filepath parameter is missing or empty");
  }

  /**
   * Tests when user attempts to view a file without loading
   *
   * @throws IOException
   */
  @Test
  public void testViewWithoutLoading() throws IOException {
    HttpURLConnection viewConnection = tryRequest("viewcsv");
    assertEquals(400, viewConnection.getResponseCode());
    Map<String, Object> response = deserializeMapFromError(viewConnection);
    assertEquals(response.get("result"), "error_bad_request");
    assertEquals(response.get("message"), "Must load CSV first before viewing using /loadcsv");
  }

  /**
   * Tests when user attempts to search without loading
   *
   * @throws IOException
   */
  @Test
  public void testSearchWithoutLoading() throws IOException {
    HttpURLConnection viewConnection = tryRequest("searchcsv?query=dog");
    assertEquals(400, viewConnection.getResponseCode());
    Map<String, Object> response = deserializeMapFromError(viewConnection);
    assertEquals(response.get("result"), "error_bad_request");
    assertEquals(response.get("message"), "Must load CSV first before searching using /loadcsv");
  }

  /**
   * Tests various types of erroneous search inputs
   *
   * @throws IOException
   */
  @Test
  public void testBadSearchInput() throws IOException {
    HttpURLConnection loadConnection = tryRequest("loadcsv?filepath=persons/people.csv");
    assertEquals(200, loadConnection.getResponseCode());
    Map<String, Object> response = deserializeMapFromConnection(loadConnection);
    assertEquals(response.get("result"), "success");
    assertEquals(response.get("filepath"), "data/persons/people.csv");
    loadConnection.disconnect();

    HttpURLConnection searchConnectionOutOfBoundsIndex = tryRequest("searchcsv?query=c&column=10");
    assertEquals(400, searchConnectionOutOfBoundsIndex.getResponseCode());
    response = deserializeMapFromError(searchConnectionOutOfBoundsIndex);
    assertEquals(response.get("result"), "error_bad_request");
    assertEquals(response.get("message"), "Column index must be between 0 and 2");
    searchConnectionOutOfBoundsIndex.disconnect();

    HttpURLConnection searchConnectionNoQuery = tryRequest("searchcsv?");
    assertEquals(400, searchConnectionNoQuery.getResponseCode());
    response = deserializeMapFromError(searchConnectionNoQuery);
    assertEquals(response.get("result"), "error_bad_request");
    assertEquals(response.get("message"), "query parameter is missing or empty");
    searchConnectionNoQuery.disconnect();

    HttpURLConnection searchConnectionColumnNameDNE = tryRequest("searchcsv?query=c&column=blah");
    assertEquals(400, searchConnectionColumnNameDNE.getResponseCode());
    response = deserializeMapFromError(searchConnectionColumnNameDNE);
    assertEquals(response.get("result"), "error_bad_request");
    assertEquals(response.get("message"), "Invalid column name: blah");
    searchConnectionColumnNameDNE.disconnect();
  }

  /**
   * Tests search behavior for complicated search, edge cases like multiple loads, wrong column match.
   *
   * @throws IOException
   */
  @Test
  public void testComplicatedSearchBehaviorMultipleLoads() throws IOException {
    HttpURLConnection firstConnection = tryRequest("loadcsv?filepath=census/income_by_race.csv");
    assertEquals(200, firstConnection.getResponseCode());
    firstConnection.disconnect();

    HttpURLConnection loadConnection = tryRequest("loadcsv?filepath=persons/people.csv");
    assertEquals(200, loadConnection.getResponseCode());
    loadConnection.disconnect();

    HttpURLConnection substringCaseInsensitiveSearch =
        tryRequest("searchcsv?query=e&column=Name&caseInsensitive=true&substringMatch=true");
    assertEquals(200, substringCaseInsensitiveSearch.getResponseCode());
    Map<String, Object> response = deserializeMapFromConnection(substringCaseInsensitiveSearch);
    assertEquals(response.get("result"), "success");
    List<List<String>> expected =
        List.of(List.of("Fred", "55", "Doctor"), List.of("Derick", "21", "Student"));
    assertEquals(response.get("data"), expected);
    substringCaseInsensitiveSearch.disconnect();

    HttpURLConnection wrongColumnSearch = tryRequest("searchcsv?query=Colin&column=Occupation");
    assertEquals(200, wrongColumnSearch.getResponseCode());
    response = deserializeMapFromConnection(wrongColumnSearch);
    assertEquals(response.get("result"), "success");
    assertEquals(response.get("data"), List.of());
    wrongColumnSearch.disconnect();

    HttpURLConnection allColumnSearch =
        tryRequest("searchcsv?query=d&caseInsensitive=true&substringMatch=true");
    assertEquals(200, substringCaseInsensitiveSearch.getResponseCode());
    response = deserializeMapFromConnection(allColumnSearch);
    expected =
        List.of(
            List.of("Colin", "19", "Student"),
            List.of("Thao", "52", "Doctor"),
            List.of("Fred", "55", "Doctor"),
            List.of("Derick", "21", "Student"),
            List.of("Ryan", "17", "Student"),
            List.of("Ba", "76", "Retired"));
    assertEquals(response.get("data"), expected);
    allColumnSearch.disconnect();
  }

  /**
   * Tests broadband handler basic functionality
   *
   * @throws IOException
   */
  @Test
  public void testBroadbandHandlerFunctionality() throws IOException {
    HttpURLConnection connection = tryRequest("broadband?county=Kent&state=Michigan");
    assertEquals(200, connection.getResponseCode());
    BroadbandData response = SuccessResponse.getDataFromConnection(connection, BroadbandData.class);
    BroadbandData expected =
        new BroadbandData(75.30000305175781, "Michigan", "Kent", LocalDateTime.of(2018, 6, 14, 10, 30, 0));
    assertEquals(response, expected);
    connection.disconnect();
  }

  /**
   * Tests missing params for broadband handler
   *
   * @throws IOException
   */
  @Test
  public void testBroadBandHandlerMissingParams() throws IOException {
    HttpURLConnection connection = tryRequest("broadband");
    assertEquals(400, connection.getResponseCode());
    Map<String, String> response = deserializeMapFromError(connection);
    assertEquals(response.get("result"), "error_bad_request");
    assertEquals(response.get("message"), "county parameter is missing or empty");
    connection.disconnect();
  }

  /**
   * Helper method to create and connect to an HTTP URL connection for a given API call.
   *
   * <p>*
   */
  public static HttpURLConnection tryRequest(String apiCall) throws IOException {
    URL requestURL = new URL("http://localhost:" + Spark.port() + "/" + apiCall);
    HttpURLConnection clientConnection = (HttpURLConnection) requestURL.openConnection();
    clientConnection.setRequestMethod("GET");
    clientConnection.connect();
    return clientConnection;
  }

  /**
   * Helper method to deserialize a JSON error response from an HttpURLConnection into a Map.
   *
   * @param connection the HttpURLConnection to read from
   * @return a Map representing the deserialized JSON error response
   * @throws IOException if an I/O error occurs while reading the response
   */
  public static Map deserializeMapFromConnection(HttpURLConnection connection) throws IOException {
    return fromJson(new Buffer().readFrom(connection.getInputStream()).readUtf8(), Map.class);
  }

  /**
   * Helper method to deserialize a JSON error response from an HttpURLConnection into a Map.
   *
   * @param connection the HttpURLConnection to read from
   * @return a Map representing the deserialized JSON error response
   * @throws IOException if an I/O error occurs while reading the response
   */
  public static Map deserializeMapFromError(HttpURLConnection connection) throws IOException {
    return fromJson(new Buffer().readFrom(connection.getErrorStream()).readUtf8(), Map.class);
  }
}
