import React, { useEffect, useRef } from "react";
/**
 * Global keyboard navigation utility with submit button handling
 */
class KeyboardNavManager {
    private static instance: KeyboardNavManager;
    private focusableElements: Map<string, {
      element: HTMLElement;
      isSubmit?: boolean;
      onClick?: () => void;
    }>;
    private navigationOrder: string[];
    private isListening: boolean;
  
    private constructor() {
      this.focusableElements = new Map();
      this.navigationOrder = [];
      this.isListening = false;
      this.handleKeyDown = this.handleKeyDown.bind(this);
    }
  
    public static getInstance(): KeyboardNavManager {
      if (!KeyboardNavManager.instance) {
        KeyboardNavManager.instance = new KeyboardNavManager();
      }
      return KeyboardNavManager.instance;
    }
  
    /**
     * Register an element for keyboard navigation
     * @param id Unique identifier for the element
     * @param element The DOM element to register
     * @param options Additional options for the element
     */
    public register(
      id: string, 
      element: HTMLElement, 
      options: {
        position?: number;
        isSubmit?: boolean;
        onClick?: () => void;
      } = {}
    ) {
      this.focusableElements.set(id, {
        element,
        isSubmit: options.isSubmit,
        onClick: options.onClick
      });
      
      // Add to navigation order
      if (typeof options.position === 'number') {
        this.navigationOrder.splice(options.position, 0, id);
      } else {
        this.navigationOrder.push(id);
      }
  
      // Start listening if this is our first element
      if (!this.isListening) {
        document.addEventListener('keydown', this.handleKeyDown);
        this.isListening = true;
      }
    }
  
    public unregister(id: string) {
      this.focusableElements.delete(id);
      this.navigationOrder = this.navigationOrder.filter(item => item !== id);
  
      if (this.focusableElements.size === 0) {
        document.removeEventListener('keydown', this.handleKeyDown);
        this.isListening = false;
      }
    }
  
    private handleKeyDown(event: KeyboardEvent) {
      const currentElement = document.activeElement as HTMLElement;
      const currentEntry = Array.from(this.focusableElements.entries())
        .find(([, {element}]) => element === currentElement);
  
      if (!currentEntry) return;
  
      const [currentId, currentConfig] = currentEntry;
  
      // Handle Enter or Space for submit buttons
      if ((event.key === 'Enter' || event.key === ' ') && currentConfig.isSubmit) {
        event.preventDefault();
        currentConfig.onClick?.();
        return;
      }
  
      // Handle regular navigation
      if (event.key === 'Tab' || (event.altKey && ['ArrowUp', 'ArrowDown'].includes(event.key))) {
        event.preventDefault();
        
        const currentIndex = this.navigationOrder.indexOf(currentId);
        let nextIndex;
  
        if (event.shiftKey || event.key === 'ArrowUp') {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : this.navigationOrder.length - 1;
        } else {
          nextIndex = currentIndex < this.navigationOrder.length - 1 ? currentIndex + 1 : 0;
        }
  
        const nextId = this.navigationOrder[nextIndex];
        this.focusableElements.get(nextId)?.element.focus();
      }
    }
  }
  
  // Enhanced React hook
  export function useKeyboardNav(
    id: string, 
    ref: React.RefObject<HTMLElement>, 
    options: {
      position?: number;
      isSubmit?: boolean;
      onClick?: () => void;
    } = {}
  ) {
    useEffect(() => {
      const nav = KeyboardNavManager.getInstance();
      const element = ref.current;
      
      if (element) {
        nav.register(id, element, options);
        return () => nav.unregister(id);
      }
    }, [id, ref, options.position, options.isSubmit, options.onClick]);
  }
