package edu.brown.cs.student.main;

import static edu.brown.cs.student.main.TestAPIServer.deserializeMapFromError;
import static edu.brown.cs.student.main.TestAPIServer.tryRequest;
import static org.junit.jupiter.api.Assertions.assertEquals;

import edu.brown.cs.student.main.ACSApi.datasource.ACSApi;
import edu.brown.cs.student.main.ACSApi.datasource.BroadbandData;
import edu.brown.cs.student.main.ACSApi.datasource.CachedACSApi;
import edu.brown.cs.student.main.server.BroadbandHandler;
import edu.brown.cs.student.main.server.SuccessResponse;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.time.LocalDateTime;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import spark.Spark;

/** Integration tests for the caching functionality of Server API. */
public class TestRealACSAPI {

  CachedACSApi cachedApi;

  @BeforeEach
  public void setup() {
    Spark.stop();
    Spark.awaitStop();
    Spark.port(0);
    Logger.getLogger("").setLevel(Level.WARNING);
    cachedApi = new CachedACSApi(2, new ACSApi());
    Spark.get("broadband", new BroadbandHandler(cachedApi));
    Spark.init();
    Spark.awaitInitialization();
  }

  @AfterEach
  public void teardown() {
    Spark.unmap("broadband");
    Spark.awaitStop();
  }

  /**
   * Tests basic query and makes sure that api will use cached results if available
   *
   * @throws IOException
   */
  @Test
  public void testACSQueryAndCacheFunctionality() throws IOException {
    String kingRequest = "broadband?county=king&state=washington";
    String snohomishRequest = "broadband?county=snohomish&state=washington";
    String lewisRequest = "broadband?county=lewis&state=washington";
    HttpURLConnection connection = tryRequest(kingRequest);
    BroadbandData expected =
        new BroadbandData(
            93.30000305175781, "washington", "king", LocalDateTime.of(2024, 7, 14, 2, 3, 5));
    assertEquals(200, connection.getResponseCode());
    BroadbandData response = SuccessResponse.getDataFromConnection(connection, BroadbandData.class);
    assertEquals(response.county(), expected.county());
    assertEquals(response.state(), expected.state());
    assertEquals(response.percentage(), expected.percentage());
    connection.disconnect();

    connection = tryRequest(kingRequest);
    assertEquals(200, connection.getResponseCode());
    assertEquals(1, cachedApi.getAccesses());
    connection.disconnect();

    connection = tryRequest(snohomishRequest);
    assertEquals(200, connection.getResponseCode());
    connection.disconnect();

    connection = tryRequest(lewisRequest);
    assertEquals(200, connection.getResponseCode());
    connection.disconnect();

    // king county should be evicted from cache at this point, so cache accesses should remain at
    // zero
    connection = tryRequest(kingRequest);
    assertEquals(200, connection.getResponseCode());
    assertEquals(1, cachedApi.getAccesses());
    connection.disconnect();

    connection = tryRequest(lewisRequest);
    assertEquals(200, connection.getResponseCode());
    assertEquals(2, cachedApi.getAccesses());
    connection.disconnect();
  }

  /** Tests county/state not found */
  @Test
  public void testCountyStateNotFound() throws IOException {
    String badRequest = "broadband?county=sfsf&state=sfs";
    String badCounty = "broadband?county=sfs&state=NewYork";

    HttpURLConnection connection = tryRequest(badRequest);
    assertEquals(400, connection.getResponseCode());
    assertEquals(
        "sfs not found in ACS api states", deserializeMapFromError(connection).get("message"));
    connection.disconnect();

    connection = tryRequest(badCounty);
    assertEquals(400, connection.getResponseCode());
    assertEquals(
        "sfs county does not exist in state", deserializeMapFromError(connection).get("message"));
    connection.disconnect();
  }

  /** Tests county/states with spaces */
  @Test
  public void testCountyStateSpaces() throws IOException {
    String spaceStateRequest = "broadband?county=Queens&state=newyork";
    String spaceCountyRequest = "broadband?county=Losangeles&state=california";
    HttpURLConnection connection = tryRequest(spaceStateRequest);
    assertEquals(200, connection.getResponseCode());
    BroadbandData expected =
        new BroadbandData(89.0, "newyork", "queens", LocalDateTime.of(2024, 7, 14, 2, 3, 5));
    BroadbandData response = SuccessResponse.getDataFromConnection(connection, BroadbandData.class);
    assertEquals(expected.percentage(), response.percentage());
    connection.disconnect();

    connection = tryRequest(spaceCountyRequest);
    assertEquals(200, connection.getResponseCode());
    expected =
        new BroadbandData(
            89.9000015258789, "california", "losangeles", LocalDateTime.of(2024, 7, 14, 2, 3, 5));
    response = SuccessResponse.getDataFromConnection(connection, BroadbandData.class);
    assertEquals(expected.percentage(), response.percentage());
    connection.disconnect();
  }
}
