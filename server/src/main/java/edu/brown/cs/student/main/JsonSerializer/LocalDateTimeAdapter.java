package edu.brown.cs.student.main.JsonSerializer;

import com.squareup.moshi.FromJson;
import com.squareup.moshi.ToJson;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class LocalDateTimeAdapter {
  private static final DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

  @ToJson
  String toJson(LocalDateTime dateTime) {
    return dateTime.format(formatter);
  }

  @FromJson
  LocalDateTime fromJson(String dateString) {
    return LocalDateTime.parse(dateString, formatter);
  }
}
