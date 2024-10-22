package edu.brown.cs.student.main.server;

import com.squareup.moshi.Types;
import edu.brown.cs.student.main.JsonSerializer.JsonSerializer;
import java.io.IOException;
import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import okio.Buffer;

/**
 * Represents a success response in the server's API. This class encapsulates a successful response
 * with generic data of type T.
 *
 * @param <T> The type of data contained in the success response.
 */
public class SuccessResponse<T> {
  private String result;
  private T data;

  /**
   * Constructs a new SuccessResponse with the given data.
   *
   * @param data The data to be included in the success response.
   */
  public SuccessResponse(T data) {
    this.result = "success";
    this.data = data;
  }

  /**
   * Gets the result status of the response.
   *
   * @return The result status, which is always "success" for this class.
   */
  public String getResult() {
    return result;
  }

  /**
   * Gets the data contained in the success response.
   *
   * @return The data of type T.
   */
  public T getData() {
    return data;
  }

  /**
   * Converts this SuccessResponse object to its JSON representation.
   *
   * @return A JSON string representing this SuccessResponse object.
   */
  public String toJson() {
    Type type = Types.newParameterizedType(SuccessResponse.class, data.getClass());
    return JsonSerializer.toJson(this, type);
  }

  /**
   * Creates a SuccessResponse object from a JSON string.
   *
   * @param <T> The type of data contained in the success response.
   * @param json The JSON string to parse.
   * @param dataClass The class of the data contained in the response.
   * @return A new SuccessResponse object.
   * @throws IOException If there's an error parsing the JSON.
   */
  public static <T> SuccessResponse<T> fromJson(String json, Class<T> dataClass)
      throws IOException {
    Type type = Types.newParameterizedType(SuccessResponse.class, dataClass);
    return JsonSerializer.fromJson(json, type);
  }

  /**
   * Creates a SuccessResponse object from an HttpURLConnection.
   *
   * @param <T> The type of data contained in the success response.
   * @param connection The HttpURLConnection to read from.
   * @param dataClass The class of the data contained in the response.
   * @return A new SuccessResponse object.
   * @throws IOException If there's an error reading from the connection or parsing the JSON.
   */
  public static <T> SuccessResponse<T> fromConnection(
      HttpURLConnection connection, Class<T> dataClass) throws IOException {
    String json = new Buffer().readFrom(connection.getInputStream()).readUtf8();
    return fromJson(json, dataClass);
  }

  /**
   * Extracts the data from a JSON string representing a SuccessResponse.
   *
   * @param <T> The type of data to extract.
   * @param json The JSON string to parse.
   * @param dataClass The class of the data to extract.
   * @return The extracted data of type T.
   * @throws IOException If there's an error parsing the JSON.
   */
  public static <T> T getDataFromJson(String json, Class<T> dataClass) throws IOException {
    SuccessResponse<T> response = fromJson(json, dataClass);
    return response.getData();
  }

  /**
   * Extracts the data from an HttpURLConnection representing a SuccessResponse.
   *
   * @param <T> The type of data to extract.
   * @param connection The HttpURLConnection to read from.
   * @param dataClass The class of the data to extract.
   * @return The extracted data of type T.
   * @throws IOException If there's an error reading from the connection or parsing the JSON.
   */
  public static <T> T getDataFromConnection(HttpURLConnection connection, Class<T> dataClass)
      throws IOException {
    SuccessResponse<T> response = fromConnection(connection, dataClass);
    return response.getData();
  }
}
