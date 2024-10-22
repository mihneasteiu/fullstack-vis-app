package edu.brown.cs.student.main.Cache;

/**
 * Represents a node in a doubly linked list.
 *
 * @param <T> The type of data stored in this node.
 */
public class LinkedListNode<T> {
  /** The data stored in this node. */
  public T data;
  /** The previous node in the linked list. */
  public LinkedListNode<T> prev;
  /** The next node in the linked list. */
  public LinkedListNode<T> next;

  /**
   * Constructs a new LinkedListNode with the specified data.
   *
   * @param data The data to be stored in this node.
   */
  public LinkedListNode(T data) {
    this.data = data;
    this.prev = null;
    this.next = null;
  }
}
