/** This package contains classes related to the ACS (American Community Survey) API data source. */
package edu.brown.cs.student.main.ACSApi.datasource;

import java.util.Objects;

/**
 * Represents a composite key for a state and county combination. This class is used as a key in
 * collections where state and county pairs need to be uniquely identified.
 */
public class StateCountyKey {
  /** The state name. */
  public String state;

  /** The county name. */
  public String county;

  /**
   * Constructs a new StateCountyKey with the specified state and county.
   *
   * @param state The name of the state.
   * @param county The name of the county.
   */
  public StateCountyKey(String state, String county) {
    this.state = state;
    this.county = county;
  }

  /**
   * Compares this StateCountyKey to another object for equality. Two StateCountyKey objects are
   * considered equal if they have the same state and county values.
   *
   * @param o The object to compare with this StateCountyKey.
   * @return true if the objects are equal, false otherwise.
   */
  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    StateCountyKey that = (StateCountyKey) o;
    return Objects.equals(state, that.state) && Objects.equals(county, that.county);
  }

  /**
   * Generates a hash code for this StateCountyKey. The hash code is based on both the state and
   * county values.
   *
   * @return A hash code value for this object.
   */
  @Override
  public int hashCode() {
    return Objects.hash(state, county);
  }

  /**
   * Returns a string representation of this StateCountyKey.
   *
   * @return A string representation of this StateCountyKey, including the state and county values.
   */
  @Override
  public String toString() {
    return "StateCountyKey{" + "state='" + state + '\'' + ", county='" + county + '\'' + '}';
  }
}
