package edu.brown.cs.student.main;

import static edu.brown.cs.student.main.JsonSerializer.JsonSerializer.fromJson;
import static edu.brown.cs.student.main.TestAPIServer.tryRequest;
import static org.junit.jupiter.api.Assertions.assertEquals;

import edu.brown.cs.student.main.ACSApi.datasource.BroadbandData;
import edu.brown.cs.student.main.ACSApi.datasource.CachedACSApi;
import edu.brown.cs.student.main.ACSApi.datasource.MockACS;
import edu.brown.cs.student.main.ACSApi.datasource.StateCountyKey;
import edu.brown.cs.student.main.Cache.CacheElement;
import edu.brown.cs.student.main.Cache.LinkedListNode;
import edu.brown.cs.student.main.server.BroadbandHandler;
import edu.brown.cs.student.main.server.LoadHandler;
import edu.brown.cs.student.main.server.SearchHandler;
import edu.brown.cs.student.main.server.SuccessResponse;
import edu.brown.cs.student.main.server.ViewHandler;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.plaf.nimbus.State;
import okio.Buffer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import spark.Spark;


/**
 * Integration tests for the caching functionality of Server API.
 */
public class TestMockedCache {

  CachedACSApi cachedApi;

  @BeforeAll
  public static void setup_before_everything() {
    Spark.port(0);
    Logger.getLogger("").setLevel(Level.WARNING);
  }


  @BeforeEach
  public void setup() {
    cachedApi = new CachedACSApi(2, new MockACS());
    Spark.get("broadband", new BroadbandHandler(cachedApi));
    Spark.init();
    Spark.awaitInitialization();
  }

  @AfterEach
  public void teardown() {
    Spark.unmap("broadband");
    Spark.awaitStop();
  }

  /**
   * Fully tests cache functionality using mock data. Makes sure most recently used is always at head of linked list,
   * stored hashmap is never greater than specified size, least recently used nodes are evicted.
   * @throws IOException
   */
  @Test
  public void testCacheFunctionality() throws IOException {
    String apiCall1 = "broadband?state=Michigan&county=Oakland";
    String apiCall2 = "broadband?state=Michigan&county=Wayne";
    String apiCall3 = "broadband?state=California&county=Riverside";

    StateCountyKey keyOakland = new StateCountyKey("Michigan", "Oakland");
    StateCountyKey keyWayne = new StateCountyKey("Michigan", "Wayne");
    StateCountyKey keyRiverside = new StateCountyKey("California", "Riverside");

    BroadbandData dataOakland = new BroadbandData(67.19999694824219, "Michigan", "Oakland",
        LocalDateTime.of(2018, 6, 14, 10, 30, 0));
    BroadbandData dataWayne = new BroadbandData(81.5, "Michigan", "Wayne",
        LocalDateTime.of(2018, 6, 14, 10, 30, 0));
    BroadbandData dataRiverside = new BroadbandData(63.099998474121094, "California", "Riverside",
        LocalDateTime.of(2018, 6, 14, 10, 30, 0));

    LinkedListNode<CacheElement<StateCountyKey, BroadbandData>> kvOakland = new LinkedListNode<>(new CacheElement<>(keyOakland, dataOakland));
    LinkedListNode<CacheElement<StateCountyKey, BroadbandData>> kvWayne = new LinkedListNode<>(new CacheElement<>(keyWayne, dataWayne));
    LinkedListNode<CacheElement<StateCountyKey, BroadbandData>> kvRiverside = new LinkedListNode<>(new CacheElement<>(keyRiverside, dataRiverside));

    HttpURLConnection connection = tryRequest(apiCall1);
    assertEquals(200, connection.getResponseCode());
    BroadbandData response = SuccessResponse.getDataFromConnection(connection, BroadbandData.class);
    assertEquals(response, dataOakland);
    assertEquals(1, cachedApi.getCache().getLinkedListNodeMap().size());
    connection.disconnect();
    connection = tryRequest(apiCall1);
    assertEquals(200, connection.getResponseCode());
    assertEquals(1, cachedApi.getCache().getLinkedListNodeMap().size());
    connection.disconnect();
    connection = tryRequest(apiCall2);
    assertEquals(200, connection.getResponseCode());
    assertEquals(2, cachedApi.getCache().getLinkedListNodeMap().size());
    Map<StateCountyKey, LinkedListNode<CacheElement<StateCountyKey, BroadbandData>>> expected = new HashMap<>();
    expected.put(keyOakland, kvOakland);
    expected.put(keyWayne, kvWayne);
    assertEquals(cachedApi.getCache().getLinkedListNodeMap().keySet(), expected.keySet());
    connection.disconnect();
    connection = tryRequest(apiCall3);
    assertEquals(200, connection.getResponseCode());
    assertEquals(2, cachedApi.getCache().getLinkedListNodeMap().size());
    expected.remove(keyOakland, kvOakland);
    expected.put(keyRiverside, kvRiverside);
    assertEquals(cachedApi.getCache().getLinkedListNodeMap().keySet(), expected.keySet());
    connection.disconnect();
    LinkedListNode<CacheElement<StateCountyKey, BroadbandData>> head = cachedApi.getCache().getDoublyLinkedList().getHead();
    assertEquals(head.next.data, kvRiverside.data);
    assertEquals(head.next.next.data, kvWayne.data);
    connection = tryRequest(apiCall2);
    assertEquals(200, connection.getResponseCode());
    assertEquals(head.next.data, kvWayne.data);
    assertEquals(head.next.next.data, kvRiverside.data);
    connection.disconnect();
    connection = tryRequest(apiCall1);
    assertEquals(200, connection.getResponseCode());
    assertEquals(head.next.data, kvOakland.data);
    assertEquals(head.next.next.data, kvWayne.data);
    assertEquals(2, cachedApi.getCache().getLinkedListNodeMap().size());
    assertEquals(2, cachedApi.getAccesses());
  }

}