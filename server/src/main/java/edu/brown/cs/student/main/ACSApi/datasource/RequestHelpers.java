/** This package contains classes related to the ACS (American Community Survey) API data source. */
package edu.brown.cs.student.main.ACSApi.datasource;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import spark.Spark;

/**
 * Utility class providing helper methods for making HTTP requests. This class contains static
 * methods to create and connect to HTTP URL connections for both local (Spark) and public API
 * calls.
 */
public class RequestHelpers {

  /**
   * Creates and connects to an HTTP URL connection for a given local API call. This method is
   * designed to work with Spark's local server.
   *
   * @param apiCall The API endpoint to call, without the base URL or port number.
   * @return An HttpURLConnection object connected to the specified API endpoint.
   * @throws IOException If an I/O error occurs while creating the connection.
   */
  public static HttpURLConnection tryRequest(String apiCall) throws IOException {
    URL requestURL = new URL("http://localhost:" + Spark.port() + "/" + apiCall);
    HttpURLConnection clientConnection = (HttpURLConnection) requestURL.openConnection();
    clientConnection.setRequestMethod("GET");
    clientConnection.connect();
    return clientConnection;
  }

  /**
   * Creates and connects to an HTTP URL connection for a given public API call. This method is
   * designed to work with external API endpoints.
   *
   * @param apiCall The complete URL of the API endpoint to call.
   * @return An HttpURLConnection object connected to the specified API endpoint.
   * @throws IOException If an I/O error occurs while creating the connection.
   */
  public static HttpURLConnection tryPublicRequest(String apiCall) throws IOException {
    URL requestURL = new URL(apiCall);
    HttpURLConnection clientConnection = (HttpURLConnection) requestURL.openConnection();
    clientConnection.setRequestMethod("GET");
    clientConnection.connect();
    return clientConnection;
  }
}
