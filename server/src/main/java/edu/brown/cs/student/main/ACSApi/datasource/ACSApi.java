package edu.brown.cs.student.main.ACSApi.datasource;

import com.squareup.moshi.Types;
import edu.brown.cs.student.main.JsonSerializer.JsonSerializer;
import java.net.HttpURLConnection;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import okio.Buffer;

/** Class representing ACSApi */
public class ACSApi implements CensusDatasource {

  private Map<String, Integer> stateCodes;
  private Map<Integer, Map<String, Integer>> countyCodes;

  public ACSApi() {
    this.stateCodes = null;
    this.countyCodes = new HashMap<>();
  }
  /**
   * Gets broadband data given state/county from ACS api
   *
   * @param state
   * @param county
   * @return
   */
  @Override
  public BroadbandData getBroadbandData(String state, String county) throws Exception {
    int stateCode = getStateCode(state);
    int countyCode = getCountyCode(county, stateCode);
    HttpURLConnection connection =
        RequestHelpers.tryPublicRequest(
            "https://api.census.gov/data/2021/acs/acs1/subject/variables?get=NAME,S2802_C03_022E&for=county:"
                + String.format("%03d", countyCode)
                + "&in=state:"
                + String.format("%02d", stateCode));
    if (connection.getResponseCode() != 200) {
      throw new Exception(
          "Error from ACS API: " + new Buffer().readFrom(connection.getErrorStream()).readUtf8());
    }
    List<List<String>> response =
        JsonSerializer.fromJson(
            new Buffer().readFrom(connection.getInputStream()).readUtf8(),
            Types.newParameterizedType(
                List.class, Types.newParameterizedType(List.class, String.class)));
    float percentage = Float.parseFloat(response.get(1).get(1));
    return new BroadbandData(percentage, state, county, LocalDateTime.now());
  }

  /**
   * Gets county code for given county and state code
   *
   * @param county
   * @param stateCode
   * @return
   * @throws Exception
   */
  private int getCountyCode(String county, int stateCode) throws Exception {
    county = county.toLowerCase();
    Map<String, Integer> counties = countyCodes.get(stateCode);
    if (counties == null) {
      fetchStateCounties(stateCode);
    }
    int countyCode = countyCodes.get(stateCode).getOrDefault(county, -1);
    if (countyCode == -1) {
      throw new IllegalArgumentException(county + " county does not exist in state");
    }
    return countyCode;
  }

  private void fetchStateCounties(int stateCode) throws Exception {
    HttpURLConnection connection =
        RequestHelpers.tryPublicRequest(
            "https://api.census.gov/data/2010/dec/sf1?get=NAME&for=county:*&in=state:"
                + String.format("%02d", stateCode));
    if (connection.getResponseCode() != 200) {
      throw new Exception(
          "request is failing to get county codes for "
              + stateCode
              + ": "
              + new Buffer().readFrom(connection.getErrorStream()).readUtf8());
    }
    countyCodes.put(
        stateCode,
        JsonSerializer.fromJson(
            new Buffer().readFrom(connection.getInputStream()).readUtf8(),
            Types.newParameterizedType(Map.class, String.class, Integer.class)));
  }

  /**
   * Gets state codes for given state
   *
   * @param state
   * @return
   * @throws Exception
   */
  private int getStateCode(String state) throws Exception {
    if (stateCodes == null) {
      fetchStateCodes();
    }
    int stateCode = stateCodes.getOrDefault(state.toLowerCase(), -1);
    if (stateCode == -1) {
      throw new IllegalArgumentException(state + " not found in ACS api states");
    }
    return stateCode;
  }
  /** Gets state codes from ACS Api into Map<String, Integer> */
  private void fetchStateCodes() throws Exception {
    HttpURLConnection connection =
        RequestHelpers.tryPublicRequest(
            "https://api.census.gov/data/2010/dec/sf1?get=NAME&for=state:*");
    if (connection.getResponseCode() != 200) {
      throw new Exception(
          "request is failing to get state codes: "
              + new Buffer().readFrom(connection.getErrorStream()).readUtf8());
    }
    this.stateCodes =
        JsonSerializer.fromJson(
            new Buffer().readFrom(connection.getInputStream()).readUtf8(),
            Types.newParameterizedType(Map.class, String.class, Integer.class));
  }
}
