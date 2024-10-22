package edu.brown.cs.student.main.Cache;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Implements a Least Recently Used (LRU) cache.
 * This cache has a fixed capacity and evicts the least recently used items when it reaches capacity.
 *
 * @param <K> The type of keys maintained by this cache.
 * @param <V> The type of mapped values.
 */
public class LRUCache<K, V> implements Cache<K, V> {
  private final int size;
  private final Map<K, LinkedListNode<CacheElement<K,V>>> linkedListNodeMap;
  private final DoublyLinkedList<CacheElement<K,V>> doublyLinkedList;

  /**
   * Constructs a new LRUCache with the specified capacity.
   *
   * @param size The maximum number of elements the cache can hold.
   */
  public LRUCache(int size) {
    this.size = size;
    this.linkedListNodeMap = new HashMap<>();
    this.doublyLinkedList = new DoublyLinkedList<>();
  }

  /**
   * Associates the specified value with the specified key in this cache.
   * If the cache previously contained a mapping for the key, the old value is replaced.
   * This operation also moves the key to the front of the cache (most recently used).
   *
   * @param key The key with which the specified value is to be associated.
   * @param value The value to be associated with the specified key.
   */
  @Override
  public void set(K key, V value){
    if (linkedListNodeMap.containsKey(key)) {
      LinkedListNode<CacheElement<K, V>> node = linkedListNodeMap.get(key);
      node.data = new CacheElement<K, V>(key, value);
      doublyLinkedList.pushToFront(node);
    } else {
      LinkedListNode<CacheElement<K,V>> newNode = new LinkedListNode<>(new CacheElement<K,V>(key, value));
      if (linkedListNodeMap.size() == size){
        LinkedListNode<CacheElement<K, V>> removedNode = doublyLinkedList.removeLast();
        linkedListNodeMap.remove(removedNode.data.getKey());
      }
      doublyLinkedList.addFirst(newNode);
      linkedListNodeMap.put(key, newNode);
    }
  }

  /**
   * Returns the value to which the specified key is mapped, or an empty Optional if this cache contains no mapping for the key.
   * This operation also moves the key to the front of the cache (most recently used).
   *
   * @param key The key whose associated value is to be returned.
   * @return An Optional containing the value to which the specified key is mapped, or an empty Optional if this cache contains no mapping for the key.
   */
  @Override
  public Optional<V> get(K key){
    if (linkedListNodeMap.containsKey(key)){
      doublyLinkedList.pushToFront(linkedListNodeMap.get(key));
      V value = linkedListNodeMap.get(key).data.getValue();
      return Optional.of(value);
    }
    return Optional.empty();
  }

  /**
   * Returns the number of key-value mappings in this cache.
   *
   * @return The number of key-value mappings in this cache.
   */
  @Override
  public int size() {
    return linkedListNodeMap.size();
  }

  /**
   * Returns the map of keys to linked list nodes used internally by this cache.
   *
   * @return The map of keys to linked list nodes.
   */
  public Map<K, LinkedListNode<CacheElement<K, V>>> getLinkedListNodeMap() {
    return linkedListNodeMap;
  }

  /**
   * Returns the doubly linked list used internally by this cache.
   *
   * @return The doubly linked list.
   */
  public DoublyLinkedList<CacheElement<K, V>> getDoublyLinkedList() {
    return doublyLinkedList;
  }
}