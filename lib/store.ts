import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AgeBand } from '@/content/schema';

const PIN_KEY = 'homeschool_parent_pin';

async function secureSet(key: string, value: string) {
  if (Platform.OS === 'web') {
    // Web fallback for private family local use
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function secureGet(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') return localStorage.getItem(key);
    return null;
  }
  return SecureStore.getItemAsync(key);
}

export interface ChildProfile {
  id: string;
  name: string;
  ageBand: AgeBand;
}

interface ProgressState {
  children: ChildProfile[];
  activeChildId: string | null;
  /** lessonId -> completed exercise ids */
  completed: Record<string, string[]>;
  parentUnlocked: boolean;
  hydrateDefaults: () => void;
  setActiveChild: (id: string) => void;
  setChildBand: (id: string, band: AgeBand) => void;
  renameChild: (id: string, name: string) => void;
  markExerciseDone: (lessonId: string, exerciseId: string) => void;
  isLessonComplete: (lessonId: string, exerciseCount: number) => boolean;
  setParentUnlocked: (v: boolean) => void;
  ensurePin: (pin: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
  hasPin: () => Promise<boolean>;
}

const defaultChildren: ChildProfile[] = [
  { id: 'child-a', name: 'Explorer One', ageBand: 'ages-3-4' },
  { id: 'child-b', name: 'Explorer Two', ageBand: 'ages-3-4' },
];

export const useAppStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      children: defaultChildren,
      activeChildId: 'child-a',
      completed: {},
      parentUnlocked: false,

      hydrateDefaults: () => {
        if (!get().children.length) {
          set({ children: defaultChildren, activeChildId: 'child-a' });
        }
      },

      setActiveChild: (id) => set({ activeChildId: id }),

      setChildBand: (id, band) =>
        set({
          children: get().children.map((c) =>
            c.id === id ? { ...c, ageBand: band } : c
          ),
        }),

      renameChild: (id, name) =>
        set({
          children: get().children.map((c) =>
            c.id === id ? { ...c, name } : c
          ),
        }),

      markExerciseDone: (lessonId, exerciseId) => {
        const key = `${get().activeChildId}:${lessonId}`;
        const prev = get().completed[key] || [];
        if (prev.includes(exerciseId)) return;
        set({
          completed: { ...get().completed, [key]: [...prev, exerciseId] },
        });
      },

      isLessonComplete: (lessonId, exerciseCount) => {
        const key = `${get().activeChildId}:${lessonId}`;
        const done = get().completed[key] || [];
        return exerciseCount > 0 && done.length >= exerciseCount;
      },

      setParentUnlocked: (v) => set({ parentUnlocked: v }),

      ensurePin: async (pin) => {
        await secureSet(PIN_KEY, pin);
      },

      verifyPin: async (pin) => {
        const stored = await secureGet(PIN_KEY);
        if (!stored) {
          await secureSet(PIN_KEY, pin);
          return true;
        }
        return stored === pin;
      },

      hasPin: async () => {
        const stored = await secureGet(PIN_KEY);
        return !!stored;
      },
    }),
    {
      name: 'homeschool-progress',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        children: s.children,
        activeChildId: s.activeChildId,
        completed: s.completed,
      }),
    }
  )
);

export function useActiveChild() {
  const children = useAppStore((s) => s.children);
  const activeChildId = useAppStore((s) => s.activeChildId);
  return children.find((c) => c.id === activeChildId) || children[0];
}
