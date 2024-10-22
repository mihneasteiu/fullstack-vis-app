package Parser;

import java.util.List;

public interface CreatorFromRow<T> {
  /**
   * Creates an object of type T from a list of strings representing a CSV row.
   *
   * @param row The list of strings representing a CSV row.
   * @return An object of type T created from the row data.
   * @throws FactoryFailureException If the object cannot be created from the given row.
   */
  T create(List<String> row) throws FactoryFailureException;
}
