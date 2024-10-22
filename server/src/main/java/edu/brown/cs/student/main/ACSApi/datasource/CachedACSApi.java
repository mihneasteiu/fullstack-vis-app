/**
 * This package contains classes related to the ACS (American Community Survey) API data source.
 */
package edu.brown.cs.student.main.ACSApi.datasource;

import edu.brown.cs.student.main.Cache.LRUCache;
import java.util.Optional;

/**
 * A cached implementation of the CensusDatasource interface.
 * This class wraps another CensusDatasource and caches the results using an LRU cache.
 */
public class CachedACSApi implements CensusDatasource {
  private final CensusDatasource acsApi;
  private final LRUCache<StateCountyKey, BroadbandData> cache;
  private int accesses;

  /**
   * Constructs a new CachedACSApi with the specified cache size and underlying ACS API.
   *
   * @param cacheSize The maximum number of entries to store in the cache.
   * @param acsApi The underlying CensusDatasource to use for fetching data.
   */
  public CachedACSApi(int cacheSize, CensusDatasource acsApi) {
    this.acsApi = acsApi;
    this.cache = new LRUCache<StateCountyKey, BroadbandData>(cacheSize);
    this.accesses = 0;
  }

  /**
   * Retrieves broadband data for the specified state and county.
   * If the data is in the cache, it is returned from there. Otherwise, it is fetched
   * from the underlying ACS API and then cached for future use.
   *
   * @param state The state for which to retrieve broadband data.
   * @param county The county for which to retrieve broadband data.
   * @return The BroadbandData for the specified state and county.
   * @throws Exception If an error occurs while retrieving the data.
   */
  @Override
  public BroadbandData getBroadbandData(String state, String county) throws Exception {
    StateCountyKey key = new StateCountyKey(state, county);
    Optional<BroadbandData> cachedData = cache.get(key);

    if (cachedData.isPresent()) {
      accesses++;
      return cachedData.get();
    }
    BroadbandData data = acsApi.getBroadbandData(state, county);
    cache.set(key, data);
    return data;
  }

  /**
   * Returns the LRU cache used by this CachedACSApi.
   *
   * @return The LRUCache instance.
   */
  public LRUCache<StateCountyKey, BroadbandData> getCache() {
    return cache;
  }

  /**
   * Returns the number of times data has been successfully retrieved from the cache.
   *
   * @return The number of cache hits.
   */
  public int getAccesses() {
    return accesses;
  }
}