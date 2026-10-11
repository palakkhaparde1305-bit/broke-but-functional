import { useEffect } from 'react';

export interface ShortcutHandlers {
  onToggleSimulator: () => void;
  onOpenExpense: () => void;
  onOpenIncome: () => void;
  onAdvanceDay: () => void;
}

/**
 * Custom hook to manage global power-user keyboard shortcuts.
 * Automatically ignores keystrokes when the user is focused inside form inputs.
 */
export function useKeyboardShortcuts({
  onToggleSimulator,
  onOpenExpense,
  onOpenIncome,
  onAdvanceDay
}: ShortcutHandlers): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement as HTMLElement)?.tagName;
      const isEditable = (document.activeElement as HTMLElement)?.isContentEditable;

      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag) || isEditable) {
        return;
      }

      // Modifier key safety (do not trigger if user is pressing Ctrl, Alt, or Meta unless intended)
      if (e.ctrlKey || e.metaKey) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 's':
          e.preventDefault();
          onToggleSimulator();
          break;
        case 'e':
          e.preventDefault();
          onOpenExpense();
          break;
        case 'i':
          e.preventDefault();
          onOpenIncome();
          break;
        case 'n':
          e.preventDefault();
          onAdvanceDay();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggleSimulator, onOpenExpense, onOpenIncome, onAdvanceDay]);
}
