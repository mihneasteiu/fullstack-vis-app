/**
 * This package contains classes related to caching mechanisms.
 */
package edu.brown.cs.student.main.Cache;

import java.util.Optional;

/**
 * An interface representing a generic cache.
 *
 * @param <K> The type of keys maintained by this cache.
 * @param <V> The type of mapped values.
 */
public interface Cache<K, V> {

  /**
   * Associates the specified value with the specified key in this cache.
   *
   * @param key The key with which the specified value is to be associated.
   * @param value The value to be associated with the specified key.
   */
  void set(K key, V value);

  /**
   * Returns the value to which the specified key is mapped, or an empty Optional if this cache contains no mapping for the key.
   *
   * @param key The key whose associated value is to be returned.
   * @return An Optional containing the value to which the specified key is mapped, or an empty Optional if this cache contains no mapping for the key.
   */
  Optional<V> get(K key);

  /**
   * Returns the number of key-value mappings in this cache.
   *
   * @return The number of key-value mappings in this cache.
   */
  int size();
}