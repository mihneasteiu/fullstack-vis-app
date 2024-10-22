package edu.brown.cs.student.main.server;

import spark.Request;

/** Utility functions shared across handlers */
public class HandlerUtilities {

  /**
   * Retrieves a required parameter from the request.
   *
   * @param request The Spark Request object
   * @param paramName The name of the parameter
   * @return The parameter value
   * @throws IllegalArgumentException if the parameter is missing or empty
   */
  public static String getRequiredParam(Request request, String paramName)
      throws IllegalArgumentException {
    String value = request.queryParams(paramName);
    if (value == null || value.trim().isEmpty()) {
      throw new IllegalArgumentException(paramName + " parameter is missing or empty");
    }
    return value.trim();
  }

  /**
   * Retrieves a boolean parameter from the request.
   *
   * @param request The Spark Request object
   * @param paramName The name of the parameter
   * @param defaultValue The default value if the parameter is not specified
   * @return The boolean value of the parameter
   */
  public static boolean getBooleanParam(Request request, String paramName, boolean defaultValue) {
    String value = request.queryParams(paramName);
    if (value == null) {
      return defaultValue;
    }
    return value.trim().toLowerCase().equals("true");
  }
}
