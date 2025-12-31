'use client'

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  useRef,
  type ReactNode,
  type RefObject,
} from 'react'

interface KeyboardNavContextValue {
  /** Currently selected item index (-1 = none) */
  selectedIndex: number
  /** Total items in the list */
  itemCount: number
  /** Whether keyboard nav is active */
  isActive: boolean
  /** Register list items count */
  setItemCount: (count: number) => void
  /** Register search input ref */
  registerSearchRef: (ref: RefObject<HTMLInputElement | null>) => void
  /** Manually set selected index */
  setSelectedIndex: (index: number) => void
  /** Clear selection */
  clearSelection: () => void
  /** Number of columns for grid navigation */
  columns: number
  /** Set number of columns */
  setColumns: (cols: number) => void
}

const KeyboardNavContext = createContext<KeyboardNavContextValue | null>(null)

interface KeyboardNavProviderProps {
  children: ReactNode
  /** Enable keyboard navigation (default: true) */
  enabled?: boolean
  /** Initial column count for grids (default: 1 for lists) */
  initialColumns?: number
  /** Callback when item is selected (Enter pressed) */
  onSelect?: (index: number) => void
  /** Callback when selection changes */
  onSelectionChange?: (index: number) => void
}

export function KeyboardNavProvider({
  children,
  enabled = true,
  initialColumns = 1,
  onSelect,
  onSelectionChange,
}: KeyboardNavProviderProps) {
  const [selectedIndex, setSelectedIndexState] = useState(-1)
  const [itemCount, setItemCount] = useState(0)
  const [columns, setColumns] = useState(initialColumns)
  const [isActive, setIsActive] = useState(false)
  const searchRef = useRef<RefObject<HTMLInputElement | null> | null>(null)

  const registerSearchRef = useCallback((ref: RefObject<HTMLInputElement | null>) => {
    searchRef.current = ref
  }, [])

  const setSelectedIndex = useCallback((index: number) => {
    setSelectedIndexState(index)
    setIsActive(index >= 0)
    onSelectionChange?.(index)
  }, [onSelectionChange])

  const clearSelection = useCallback(() => {
    setSelectedIndexState(-1)
    setIsActive(false)
    onSelectionChange?.(-1)
  }, [onSelectionChange])

  // Handle keyboard events
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const tagName = target.tagName.toLowerCase()
      const isEditable = target.isContentEditable
      const isInput = tagName === 'input' || tagName === 'textarea' || tagName === 'select'

      // Handle "/" to focus search (only when not in input)
      if (e.key === '/' && !isInput && !isEditable) {
        if (searchRef.current?.current) {
          e.preventDefault()
          searchRef.current.current.focus()
          return
        }
      }

      // Handle Escape - clear selection or blur search
      if (e.key === 'Escape') {
        if (isInput && target === searchRef.current?.current) {
          // Clear and blur search
          e.preventDefault()
          const input = target as HTMLInputElement
          if (input.value) {
            input.value = ''
            // Trigger change event for React controlled inputs
            input.dispatchEvent(new Event('input', { bubbles: true }))
          }
          input.blur()
          return
        }
        // Clear keyboard nav selection
        if (selectedIndex >= 0) {
          e.preventDefault()
          clearSelection()
          return
        }
      }

      // Don't handle j/k when in inputs
      if (isInput || isEditable) return

      // Handle j/k navigation
      if (e.key === 'j' || e.key === 'k') {
        if (itemCount === 0) return
        e.preventDefault()

        let newIndex: number

        if (selectedIndex < 0) {
          // Nothing selected, start at first item for j, last for k
          newIndex = e.key === 'j' ? 0 : itemCount - 1
        } else if (e.key === 'j') {
          // Move down (or right in grid)
          newIndex = Math.min(selectedIndex + columns, itemCount - 1)
        } else {
          // Move up (or left in grid)
          newIndex = Math.max(selectedIndex - columns, 0)
        }

        setSelectedIndex(newIndex)
      }

      // Handle Enter to select
      if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault()
        onSelect?.(selectedIndex)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled, selectedIndex, itemCount, columns, clearSelection, setSelectedIndex, onSelect])

  // Reset selection when item count changes significantly
  useEffect(() => {
    if (selectedIndex >= itemCount) {
      setSelectedIndex(itemCount > 0 ? itemCount - 1 : -1)
    }
  }, [itemCount, selectedIndex, setSelectedIndex])

  return (
    <KeyboardNavContext.Provider
      value={{
        selectedIndex,
        itemCount,
        isActive,
        setItemCount,
        registerSearchRef,
        setSelectedIndex,
        clearSelection,
        columns,
        setColumns,
      }}
    >
      {children}
    </KeyboardNavContext.Provider>
  )
}

/**
 * Hook to access keyboard navigation context
 */
export function useKeyboardNavContext() {
  const context = useContext(KeyboardNavContext)
  if (!context) {
    throw new Error('useKeyboardNavContext must be used within a KeyboardNavProvider')
  }
  return context
}

interface UseKeyboardNavOptions {
  /** Total number of items */
  itemCount: number
  /** Number of columns for grid layout (default: 1) */
  columns?: number
  /** Callback when Enter is pressed on selected item */
  onSelect?: (index: number) => void
  /** Callback when selection changes */
  onSelectionChange?: (index: number) => void
  /** Enable keyboard navigation (default: true) */
  enabled?: boolean
}

interface UseKeyboardNavReturn {
  /** Currently selected index (-1 = none) */
  selectedIndex: number
  /** Whether an item is currently selected */
  isActive: boolean
  /** Set selected index manually */
  setSelectedIndex: (index: number) => void
  /** Clear selection */
  clearSelection: () => void
  /** Check if specific index is selected */
  isSelected: (index: number) => boolean
  /** Ref to register search input */
  searchInputRef: RefObject<HTMLInputElement | null>
  /** Props to spread on search input */
  searchInputProps: {
    ref: RefObject<HTMLInputElement | null>
    onFocus: () => void
  }
  /** Get props to spread on a list item */
  getItemProps: (index: number) => {
    'data-keyboard-nav-index': number
    'data-keyboard-nav-selected': boolean
    tabIndex: number
    onClick: () => void
  }
}

/**
 * Standalone hook for keyboard navigation (without context)
 * Use this when you need keyboard nav in a single component
 */
export function useKeyboardNav({
  itemCount,
  columns = 1,
  onSelect,
  onSelectionChange,
  enabled = true,
}: UseKeyboardNavOptions): UseKeyboardNavReturn {
  const [selectedIndex, setSelectedIndexState] = useState(-1)
  const [isActive, setIsActive] = useState(false)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  const setSelectedIndex = useCallback((index: number) => {
    setSelectedIndexState(index)
    setIsActive(index >= 0)
    onSelectionChange?.(index)
  }, [onSelectionChange])

  const clearSelection = useCallback(() => {
    setSelectedIndexState(-1)
    setIsActive(false)
    onSelectionChange?.(-1)
  }, [onSelectionChange])

  const isSelected = useCallback((index: number) => {
    return selectedIndex === index
  }, [selectedIndex])

  // Handle keyboard events
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const tagName = target.tagName.toLowerCase()
      const isEditable = target.isContentEditable
      const isInput = tagName === 'input' || tagName === 'textarea' || tagName === 'select'

      // Handle "/" to focus search (only when not in input)
      if (e.key === '/' && !isInput && !isEditable) {
        if (searchInputRef.current) {
          e.preventDefault()
          searchInputRef.current.focus()
          return
        }
      }

      // Handle Escape - clear selection or blur search
      if (e.key === 'Escape') {
        if (isInput && target === searchInputRef.current) {
          // Clear and blur search
          e.preventDefault()
          const input = target as HTMLInputElement
          if (input.value) {
            input.value = ''
            input.dispatchEvent(new Event('input', { bubbles: true }))
          }
          input.blur()
          return
        }
        if (selectedIndex >= 0) {
          e.preventDefault()
          clearSelection()
          return
        }
      }

      // Don't handle j/k when in inputs
      if (isInput || isEditable) return

      // Handle j/k navigation
      if (e.key === 'j' || e.key === 'k') {
        if (itemCount === 0) return
        e.preventDefault()

        let newIndex: number

        if (selectedIndex < 0) {
          newIndex = e.key === 'j' ? 0 : itemCount - 1
        } else if (e.key === 'j') {
          newIndex = Math.min(selectedIndex + columns, itemCount - 1)
        } else {
          newIndex = Math.max(selectedIndex - columns, 0)
        }

        setSelectedIndex(newIndex)
      }

      // Handle Enter to select
      if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault()
        onSelect?.(selectedIndex)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled, selectedIndex, itemCount, columns, clearSelection, setSelectedIndex, onSelect])

  // Reset selection when item count changes
  useEffect(() => {
    if (selectedIndex >= itemCount) {
      setSelectedIndex(itemCount > 0 ? itemCount - 1 : -1)
    }
  }, [itemCount, selectedIndex, setSelectedIndex])

  const getItemProps = useCallback((index: number) => ({
    'data-keyboard-nav-index': index,
    'data-keyboard-nav-selected': selectedIndex === index,
    tabIndex: selectedIndex === index ? 0 : -1,
    // Don't trigger selection ring on mouse hover - cards have their own hover styles
    // The ring should only show for keyboard navigation (j/k keys)
    onClick: () => onSelect?.(index),
  }), [selectedIndex, onSelect])

  const searchInputProps = {
    ref: searchInputRef,
    onFocus: clearSelection,
  }

  return {
    selectedIndex,
    isActive,
    setSelectedIndex,
    clearSelection,
    isSelected,
    searchInputRef,
    searchInputProps,
    getItemProps,
  }
}
