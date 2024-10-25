package edu.brown.cs.student.main.JsonSerializer;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import java.io.IOException;
import java.lang.reflect.Type;

/** Json serializer helper class. */
public class JsonSerializer {
  private static final Moshi moshi =
      new Moshi.Builder().add(new LocalDateTimeAdapter()).add(new StateCountyMapAdapter()).build();

  public static String toJson(Object obj) {
    JsonAdapter<Object> jsonAdapter = moshi.adapter(Object.class);
    return jsonAdapter.toJson(obj);
  }

  public static <T> String toJson(T obj, Type typeOfT) {
    JsonAdapter<T> jsonAdapter = moshi.adapter(typeOfT);
    return jsonAdapter.toJson(obj);
  }

  public static <T> T fromJson(String json, Class<T> classOfT) throws IOException {
    JsonAdapter<T> jsonAdapter = moshi.adapter(classOfT);
    return jsonAdapter.fromJson(json);
  }

  public static <T> T fromJson(String json, Type typeOfT) throws IOException {
    JsonAdapter<T> jsonAdapter = moshi.adapter(typeOfT);
    return jsonAdapter.fromJson(json);
  }
}
