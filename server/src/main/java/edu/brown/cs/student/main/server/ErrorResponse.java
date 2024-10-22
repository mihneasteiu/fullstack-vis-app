package edu.brown.cs.student.main.server;

import edu.brown.cs.student.main.JsonSerializer.JsonSerializer;

/**
 * Represents an error response in the server's API. This class encapsulates information about an
 * error that occurred during request processing, including an error code and a descriptive message.
 */
public class ErrorResponse {
  private String result;
  private String message;

  /**
   * Constructs a new ErrorResponse with the specified error code and message.
   *
   * @param errorCode A string representing the error code. This typically identifies the type or
   *     category of the error.
   * @param message A detailed message describing the error. This provides more information about
   *     what went wrong.
   */
  public ErrorResponse(String errorCode, String message) {
    this.result = errorCode;
    this.message = message;
  }

  /**
   * Retrieves the error code associated with this error response.
   *
   * @return A string representing the error code.
   */
  public String getError() {
    return result;
  }

  /**
   * Retrieves the detailed error message associated with this error response.
   *
   * @return A string containing the error message.
   */
  public String getMessage() {
    return message;
  }

  /**
   * Converts this ErrorResponse object to its JSON representation.
   *
   * @return A JSON string representing this ErrorResponse object.
   */
  public String toJson() {
    return JsonSerializer.toJson(this);
  }
}
