package edu.brown.cs.student.main.JsonSerializer;

import com.squareup.moshi.FromJson;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class StateCountyMapAdapter {
  @FromJson
  Map<String, Integer> fromJson(List<List<String>> json) {
    Map<String, Integer> map = new HashMap<>();
    for (int i = 1; i < json.size(); i++) {
      if (json.get(i).size() == 3) {
        String county = extractCountyName(json.get(i).get(0));
        map.put(county, Integer.parseInt(json.get(i).get(2)));
      } else {
        map.put(
            json.get(i).get(0).toLowerCase().replaceAll("\\s", ""),
            Integer.parseInt(json.get(i).get(1)));
      }
    }
    return map;
  }

  private String extractCountyName(String fullName) {
    String[] parts = fullName.split(",")[0].split(" ");
    StringBuilder county = new StringBuilder();
    for (String part : parts) {
      if (part.equals("County")) {
        break; // Stop when we reach "County"
      }
      county.append(part);
    }
    return county.toString().toLowerCase();
  }
}
