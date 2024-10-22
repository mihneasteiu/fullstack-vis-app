package Parser;

import java.util.ArrayList;
import java.util.List;

/**
 * Custom exception class to represent failures in factory creation operations. This exception is
 * thrown when there's an error in creating an object from a row of data.
 */
public class FactoryFailureException extends Exception {

  /**
   * The row of data that caused the factory creation to fail. This is stored as an unmodifiable
   * list to preserve the original data.
   */
  final List<String> row;

  /**
   * Constructs a new FactoryFailureException with the specified detail message and row data.
   *
   * @param message The detail message (which is saved for later retrieval by the {@link
   *     #getMessage()} method)
   * @param row The row of data that caused the factory creation to fail
   */
  public FactoryFailureException(String message, List<String> row) {
    super(message);
    this.row = new ArrayList<>(row); // Create a defensive copy of the row
  }

  /**
   * Returns the row of data that caused the factory creation to fail.
   *
   * @return An unmodifiable view of the row data
   */
  public List<String> getRow() {
    return java.util.Collections.unmodifiableList(row);
  }
}
