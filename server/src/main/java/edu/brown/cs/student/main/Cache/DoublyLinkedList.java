package edu.brown.cs.student.main.Cache;

/**
 * Represents a doubly linked list data structure.
 *
 * @param <T> The type of elements held in this doubly linked list.
 */
public class DoublyLinkedList<T> {
  private LinkedListNode<T> head;
  private LinkedListNode<T> tail;

  /** Constructs an empty DoublyLinkedList. */
  public DoublyLinkedList() {
    head = new LinkedListNode<>(null);
    tail = new LinkedListNode<>(null);
    head.next = tail;
    tail.prev = head;
  }

  /**
   * Adds a node to the front of the list.
   *
   * @param node The node to be added.
   */
  public void addFirst(LinkedListNode<T> node) {
    node.next = head.next;
    node.prev = head;
    head.next.prev = node;
    head.next = node;
  }

  /**
   * Moves an existing node to the front of the list.
   *
   * @param node The node to be moved to the front.
   */
  public void pushToFront(LinkedListNode<T> node) {
    remove(node);
    addFirst(node);
  }

  /**
   * Removes a specific node from the list.
   *
   * @param node The node to be removed.
   */
  public void remove(LinkedListNode<T> node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  /**
   * Removes and returns the last node in the list.
   *
   * @return The last node in the list, or null if the list is empty.
   */
  public LinkedListNode<T> removeLast() {
    if (tail.prev == head) {
      return null;
    }
    LinkedListNode<T> last = tail.prev;
    remove(last);
    return last;
  }

  /**
   * Returns the head node of the list.
   *
   * @return The head node of the list.
   */
  public LinkedListNode<T> getHead() {
    return head;
  }

  /**
   * Returns the tail node of the list.
   *
   * @return The tail node of the list.
   */
  public LinkedListNode<T> getTail() {
    return tail;
  }
}
