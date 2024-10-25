/** This package contains classes related to caching mechanisms. */
package edu.brown.cs.student.main.Cache;

import java.util.Objects;

/**
 * Represents an element in a cache, containing a key-value pair.
 *
 * @param <K> The type of the key.
 * @param <V> The type of the value.
 */
public class CacheElement<K, V> {
  private K key;
  private V value;

  /**
   * Constructs a new CacheElement with the specified key and value.
   *
   * @param key The key of the cache element.
   * @param value The value associated with the key.
   */
  public CacheElement(K key, V value) {
    this.key = key;
    this.value = value;
  }

  /**
   * Returns the key of this cache element.
   *
   * @return The key of this cache element.
   */
  public K getKey() {
    return key;
  }

  /**
   * Returns the value of this cache element.
   *
   * @return The value of this cache element.
   */
  public V getValue() {
    return value;
  }

  /**
   * Compares this CacheElement to another object for equality.
   *
   * @param o The object to compare with this CacheElement.
   * @return true if the objects are equal, false otherwise.
   */
  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    CacheElement<?, ?> that = (CacheElement<?, ?>) o;
    return Objects.equals(key, that.key) && Objects.equals(value, that.value);
  }

  /**
   * Returns a hash code value for this CacheElement.
   *
   * @return A hash code value for this CacheElement.
   */
  @Override
  public int hashCode() {
    return Objects.hash(key, value);
  }

  /**
   * Returns a string representation of this CacheElement.
   *
   * @return A string representation of this CacheElement.
   */
  @Override
  public String toString() {
    return "CacheElement{" + "key=" + key + ", value=" + value + '}';
  }
}
