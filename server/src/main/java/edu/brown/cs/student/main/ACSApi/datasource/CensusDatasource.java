package edu.brown.cs.student.main.ACSApi.datasource;

/** Census Datasoruce interface. Any census source object must have this function. */
public interface CensusDatasource {
  BroadbandData getBroadbandData(String state, String county) throws Exception;
}
