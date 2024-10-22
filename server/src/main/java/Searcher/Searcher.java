package Searcher;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/** A utility class for searching through CSV content. */
public class Searcher {

  /**
   * Searches for a specific value in the given content, either in a specific column or across all
   * columns.
   *
   * @param content The CSV content to search through, represented as a list of rows.
   * @param value The value to search for.
   * @param column An Optional containing the index of the column to search in, or empty to search
   *     all columns.
   * @param caseSensitive Whether the search should be case-sensitive.
   * @param substringMatch Whether to perform substring matching.
   */
  public static List<List<String>> search(
      List<List<String>> content,
      String value,
      Optional<Integer> column,
      boolean caseSensitive,
      boolean substringMatch) {
    ArrayList<List<String>> matches = new ArrayList<>();
    String searchValue = caseSensitive ? value : value.toLowerCase();

    for (List<String> row : content) {
      if (column.isEmpty()) {
        if (searchRow(row, searchValue, caseSensitive, substringMatch)) {
          matches.add(row);
        }
      } else if (searchColumn(row, searchValue, column.get(), caseSensitive, substringMatch)) {
        matches.add(row);
      }
    }

    return matches;
  }

  /**
   * Searches for the value in a specific column of the row.
   *
   * @param row The row to search in.
   * @param value The value to search for.
   * @param columnIndex The index of the column to search in.
   * @param caseSensitive Whether the search should be case-sensitive.
   * @param substringMatch Whether to perform substring matching.
   * @return true if the value is found, false otherwise.
   */
  private static boolean searchColumn(
      List<String> row,
      String value,
      int columnIndex,
      boolean caseSensitive,
      boolean substringMatch) {
    if (columnIndex >= row.size()) {
      return false;
    }
    if (!caseSensitive) value = value.toLowerCase();
    String cellValue = caseSensitive ? row.get(columnIndex) : row.get(columnIndex).toLowerCase();
    return substringMatch ? cellValue.contains(value) : cellValue.equals(value);
  }

  /**
   * Searches for the value across all columns in the row.
   *
   * @param row The row to search in.
   * @param value The value to search for.
   * @param caseSensitive Whether the search should be case-sensitive.
   * @param substringMatch Whether to perform substring matching.
   * @return true if the value is found in any column, false otherwise.
   */
  private static boolean searchRow(
      List<String> row, String value, boolean caseSensitive, boolean substringMatch) {
    if (!caseSensitive) value = value.toLowerCase();
    String finalValue = value;
    return row.stream()
        .anyMatch(
            item -> {
              String cellValue = caseSensitive ? item : item.toLowerCase();
              return substringMatch ? cellValue.contains(finalValue) : cellValue.equals(finalValue);
            });
  }
}
