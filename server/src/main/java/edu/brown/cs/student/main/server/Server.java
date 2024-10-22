package edu.brown.cs.student.main.server;

import static spark.Spark.after;

import edu.brown.cs.student.main.ACSApi.datasource.ACSApi;
import edu.brown.cs.student.main.ACSApi.datasource.CachedACSApi;
import edu.brown.cs.student.main.ACSApi.datasource.CensusDatasource;
import edu.brown.cs.student.main.ACSApi.datasource.MockACS;
import java.util.concurrent.ConcurrentHashMap;
import spark.Spark;

/**
 * Server class, with load csv, viewcsv, broadband endpoints.
 */
public class Server {

  /**
   * Server runs with object that implements CensusDataSource interface
   * @param datasource
   */
  public Server(CensusDatasource datasource) {
    ConcurrentHashMap<String, Object> state = new ConcurrentHashMap<>();
    int port = 3232;
    Spark.port(port);
    after(
        (request, response) -> {
          response.header("Access-Control-Allow-Origin", "*");
          response.header("Access-Control-Allow-Methods", "*");
        });

    Spark.get("loadcsv", new LoadHandler(state));
    Spark.get("viewcsv", new ViewHandler(state));
    Spark.get("searchcsv", new SearchHandler(state));
    Spark.get("broadband", new BroadbandHandler(datasource));
    Spark.init();
    Spark.awaitInitialization();

    System.out.println("Server started at http://localhost:" + port);
  }

  public static void main(String[] args) {
    Server CSVServer = new Server(new CachedACSApi(30, new ACSApi())); //defaults to running on CachedACSAPI for this sprint
  }
}
