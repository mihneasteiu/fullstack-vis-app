/** This package contains classes related to the ACS (American Community Survey) API data source. */
package edu.brown.cs.student.main.ACSApi.datasource;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.util.List;
import okio.BufferedSource;
import okio.Okio;

/**
 * A mock implementation of the CensusDatasource interface. This class simulates the ACS (American
 * Community Survey) API by reading data from a JSON file.
 */
public class MockACS implements CensusDatasource {

  /**
   * Retrieves broadband data for the specified state and county from a mock JSON file.
   *
   * @param state The state for which to retrieve broadband data.
   * @param county The county for which to retrieve broadband data.
   * @return The BroadbandData for the specified state and county.
   * @throws IllegalArgumentException If the specified state and county combination is not found in
   *     the mock data.
   * @throws IOException If there's an error reading the mock data file.
   */
  @Override
  public BroadbandData getBroadbandData(String state, String county)
      throws IllegalArgumentException, IOException {
    File file = new File("data/acs_mock.json");
    Moshi moshi = new Moshi.Builder().build();
    BufferedSource source = Okio.buffer(Okio.source(file));
    Type ListString =
        Types.newParameterizedType(
            List.class, Types.newParameterizedType(List.class, String.class));
    JsonAdapter<List<List<String>>> adapter = moshi.adapter(ListString);
    List<List<String>> data = adapter.fromJson(source);
    for (List<String> entry : data) {
      if (entry.size() == 3
          && entry.get(1).equalsIgnoreCase(state)
          && entry.get(2).equalsIgnoreCase(county)) {
        return new BroadbandData(
            Float.parseFloat(entry.get(0)),
            state,
            county,
            LocalDateTime.of(2018, 6, 14, 10, 30, 0));
      }
    }
    throw new IllegalArgumentException("state/county not found");
  }
}
