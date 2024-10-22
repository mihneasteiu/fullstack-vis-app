package Parser;

import java.io.*;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

/**
 * A generic parser class that reads and parses content from a Reader object.
 *
 * @param <T> The type of objects to be created from each row of the parsed content.
 */
public class Parser<T> {
  /** The reader object containing the content to be parsed. */
  private final Reader reader;

  /** Indicates whether the content contains a header row. */
  private final boolean containsHeader;

  /** The creator object responsible for creating instances of T from parsed rows. */
  private final CreatorFromRow<T> creator;

  /** List to store the successfully parsed content as objects of type T. */
  private final List<T> parsedContent;

  /** List to store any errors encountered during parsing. */
  private final List<FactoryFailureException> errors;

  /** List to store header for searching. */
  private List<String> header;

  /**
   * Constructs a new Parser object.
   *
   * @param reader The reader object containing the content to be parsed.
   * @param containsHeader Indicates whether the content contains a header row.
   * @param creator The creator object responsible for creating instances of T from parsed rows.
   * @throws IllegalArgumentException if the reader is null.
   */
  public Parser(Reader reader, boolean containsHeader, CreatorFromRow<T> creator) {
    if (reader == null) {
      throw new IllegalArgumentException("Content cannot be null, must extend Reader class");
    }
    this.containsHeader = containsHeader;
    this.reader = reader;
    this.parsedContent = new ArrayList<>();
    this.creator = creator;
    this.errors = new ArrayList<>();
    this.header = null;
  }

  public boolean containsHeader() {
    return containsHeader;
  }

  public CreatorFromRow<T> getCreator() {
    return creator;
  }

  public List<T> getParsedContent() {
    return parsedContent;
  }

  public List<FactoryFailureException> getErrors() {
    return errors;
  }

  public List<String> getHeader() {
    return header;
  }

  /**
   * Parses the content from the reader object. This method reads the content line by line, splits
   * each line into fields, and attempts to create objects of type T using the provided creator.
   * Successful parses are added to parsedContent, while errors are added to the errors list.
   *
   * @throws IOException if there's an error reading from the reader.
   */
  public void parse() throws IOException {
    String line;
    Pattern regexSplitCSVRow = Pattern.compile(",(?=([^\\\"]*\\\"[^\\\"]*\\\")*(?![^\\\"]*\\\"))");
    BufferedReader readInBuffer = new BufferedReader(reader);
    int lineNumber = 1;
    while ((line = readInBuffer.readLine()) != null) {
      String[] result = regexSplitCSVRow.split(line);
      List<String> lineToArr = Arrays.stream(result).toList();
      if (!(lineNumber == 1 && containsHeader)) {
        try {
          T created_object = creator.create(lineToArr);
          if (!parsedContent.isEmpty()
              && (parsedContent.get(0) instanceof List
                  && ((List<?>) created_object).size()
                      != ((List<?>) parsedContent.get(0)).size())) {
            this.errors.add(
                new FactoryFailureException(
                    "Inconsistent number of fields, line number " + lineNumber, lineToArr));
          } else {
            parsedContent.add(created_object);
          }
        } catch (FactoryFailureException e) {
          this.errors.add(e);
        }
      } else {
        this.header = lineToArr;
      }
      lineNumber++;
    }
    readInBuffer.close();
  }

  /**
   * Converts column name to first index in csv
   *
   * @param name The string of column to convert to index
   */
  public int columNameToIndex(String name) {
    if (this.header == null || this.header.isEmpty()) {
      System.out.println("no header, must call parse() method with header before");
      return -1;
    }
    for (int i = 0; i < this.header.size(); i++) {
      if (this.header.get(i).equals(name)) {
        return i;
      }
    }
    return -1;
  }
}
