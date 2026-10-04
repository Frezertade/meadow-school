import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AgeBand } from '@/content/schema';
import type { MeadowVoiceChoice } from '@/lib/voice/meadowVoice';
import { configureMeadowOpenAiKey, configureMeadowVoice } from '@/lib/voice/meadowVoice';

const PIN_KEY = 'homeschool_parent_pin';
const OPENAI_KEY = 'homeschool_openai_key';
const MAX_LOGS = 250;

async function secureSet(key: string, value: string) {
  if (Platform.OS === 'web') {
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

export type LogKind =
  | 'switch_learner'
  | 'session_start'
  | 'lesson_open'
  | 'exercise_done'
  | 'level_up'
  | 'lesson_complete'
  | 'session_idle';

export interface LearningLog {
  id: string;
  at: string;
  kind: LogKind;
  childId: string;
  childName: string;
  lessonId?: string;
  lessonTitle?: string;
  exerciseId?: string;
  detail: string;
}

export interface ActiveLearning {
  childId: string;
  childName: string;
  startedAt: string;
  lessonId?: string;
  lessonTitle?: string;
}

export interface SkillMastery {
  /** Completed exercises practicing this skill */
  seen: number;
  lastSeen: string;
}
interface ProgressState {
  children: ChildProfile[];
  activeChildId: string | null;
  completed: Record<string, string[]>;
  logs: LearningLog[];
  activeLearning: ActiveLearning | null;
  parentUnlocked: boolean;
  voiceEnabled: boolean;
  /** Per-child skill mastery keyed `${childId}:${skillId}` */
  mastery: Record<string, SkillMastery>;
  /** Earned stars keyed `${childId}:${lessonId}` — one per finished lesson */
  stars: Record<string, true>;
  /** Neural voice id (F2 default) or `browser` for device TTS only. */
  meadowVoiceId: MeadowVoiceChoice;
  /** Optional OpenAI key for smarter conversational teaching (parent desk). Never committed. */
  openaiKey: string | null;
  hydrateDefaults: () => void;
  setActiveChild: (id: string) => void;
  setChildBand: (id: string, band: AgeBand) => void;
  renameChild: (id: string, name: string) => void;
  markExerciseDone: (lessonId: string, exerciseId: string, meta?: { lessonTitle?: string; detail?: string; skillId?: string }) => void;
  logEvent: (partial: Omit<LearningLog, 'id' | 'at' | 'childId' | 'childName'> & { childId?: string }) => void;
  openLesson: (lessonId: string, lessonTitle: string) => void;
  completeLesson: (lessonId: string, lessonTitle: string) => void;
  levelUp: (lessonId: string, lessonTitle: string, toLevel: number) => void;
  clearActiveLesson: () => void;
  isLessonComplete: (lessonId: string, exerciseCount: number) => boolean;
  getCompletedIds: (lessonId: string) => string[];
  setParentUnlocked: (v: boolean) => void;
  setVoiceEnabled: (v: boolean) => void;
  setMeadowVoiceId: (v: MeadowVoiceChoice) => void;
  setOpenaiKey: (key: string | null) => Promise<void>;
  loadOpenaiKey: () => Promise<void>;
  ensurePin: (pin: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
  hasPin: () => Promise<boolean>;
}

const defaultChildren: ChildProfile[] = [
  { id: 'child-a', name: 'Explorer One', ageBand: 'ages-3-4' },
  { id: 'child-b', name: 'Explorer Two', ageBand: 'ages-3-4' },
];

function childOf(get: () => ProgressState, id?: string | null) {
  const cid = id || get().activeChildId;
  return get().children.find((c) => c.id === cid) || get().children[0];
}

function pushLog(
  get: () => ProgressState,
  set: (partial: Partial<ProgressState>) => void,
  entry: Omit<LearningLog, 'id' | 'at'>
) {
  const log: LearningLog = {
    ...entry,
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    at: new Date().toISOString(),
  };
  const logs = [log, ...get().logs].slice(0, MAX_LOGS);
  set({ logs });
}

export const useAppStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      children: defaultChildren,
      activeChildId: 'child-a',
      completed: {},
      logs: [],
      mastery: {},
      stars: {},
      activeLearning: null,
      parentUnlocked: false,
      voiceEnabled: true,
      meadowVoiceId: 'F2',
      openaiKey: null,

      hydrateDefaults: () => {
        if (!get().children.length) {
          set({ children: defaultChildren, activeChildId: 'child-a' });
        }
        const child = childOf(get);
        if (!get().activeLearning) {
          set({
            activeLearning: {
              childId: child.id,
              childName: child.name,
              startedAt: new Date().toISOString(),
            },
          });
        }
        configureMeadowVoice(get().meadowVoiceId || 'F2');
        void get().loadOpenaiKey();
      },

      setActiveChild: (id) => {
        const child = childOf(get, id);
        set({
          activeChildId: id,
          activeLearning: {
            childId: child.id,
            childName: child.name,
            startedAt: new Date().toISOString(),
          },
        });
        pushLog(get, set, {
          kind: 'switch_learner',
          childId: child.id,
          childName: child.name,
          detail: `${child.name} is learning now`,
        });
      },

      setVoiceEnabled: (v) => set({ voiceEnabled: v }),

      setMeadowVoiceId: (v) => {
        set({ meadowVoiceId: v });
        configureMeadowVoice(v);
      },

      loadOpenaiKey: async () => {
        const key = await secureGet(OPENAI_KEY);
        set({ openaiKey: key });
        configureMeadowOpenAiKey(key);
      },

      setOpenaiKey: async (key) => {
        if (!key) {
          if (Platform.OS === 'web') {
            if (typeof localStorage !== 'undefined') localStorage.removeItem(OPENAI_KEY);
          } else {
            try {
              await SecureStore.deleteItemAsync(OPENAI_KEY);
            } catch {
              // ignore
            }
          }
          set({ openaiKey: null });
          configureMeadowOpenAiKey(null);
          return;
        }
        await secureSet(OPENAI_KEY, key.trim());
        set({ openaiKey: key.trim() });
        configureMeadowOpenAiKey(key.trim());
      },

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
          activeLearning:
            get().activeLearning?.childId === id
              ? { ...get().activeLearning!, childName: name }
              : get().activeLearning,
        }),

      logEvent: (partial) => {
        const child = childOf(get, partial.childId);
        pushLog(get, set, {
          kind: partial.kind,
          childId: child.id,
          childName: child.name,
          lessonId: partial.lessonId,
          lessonTitle: partial.lessonTitle,
          exerciseId: partial.exerciseId,
          detail: partial.detail,
        });
      },

      openLesson: (lessonId, lessonTitle) => {
        const child = childOf(get);
        set({
          activeLearning: {
            childId: child.id,
            childName: child.name,
            startedAt: get().activeLearning?.startedAt || new Date().toISOString(),
            lessonId,
            lessonTitle,
          },
        });
        pushLog(get, set, {
          kind: 'lesson_open',
          childId: child.id,
          childName: child.name,
          lessonId,
          lessonTitle,
          detail: `${child.name} opened “${lessonTitle}”`,
        });
      },

      clearActiveLesson: () => {
        const cur = get().activeLearning;
        if (!cur) return;
        set({
          activeLearning: {
            childId: cur.childId,
            childName: cur.childName,
            startedAt: cur.startedAt,
          },
        });
      },

      completeLesson: (lessonId, lessonTitle) => {
        const child = childOf(get);
        const skey = `${child.id}:${lessonId}`;
        const already = !!(get().stars ?? {})[skey];
        if (!already) {
          set({ stars: { ...(get().stars ?? {}), [skey]: true } });
        }
        pushLog(get, set, {
          kind: 'lesson_complete',
          childId: child.id,
          childName: child.name,
          lessonId,
          lessonTitle,
          detail: already
            ? `${child.name} finished “${lessonTitle}” again`
            : `${child.name} finished “${lessonTitle}” ⭐ first star for this lesson`,
        });
      },

      levelUp: (lessonId, lessonTitle, toLevel) => {
        const child = childOf(get);
        pushLog(get, set, {
          kind: 'level_up',
          childId: child.id,
          childName: child.name,
          lessonId,
          lessonTitle,
          detail: `${child.name} unlocked difficulty ${toLevel} in “${lessonTitle}”`,
        });
      },

      markExerciseDone: (lessonId, exerciseId, meta) => {
        const child = childOf(get);
        const key = `${child.id}:${lessonId}`;
        const prev = get().completed[key] || [];
        if (prev.includes(exerciseId)) return;
        set({
          completed: { ...get().completed, [key]: [...prev, exerciseId] },
        });
        if (meta?.skillId) {
          const mkey = `${child.id}:${meta.skillId}`;
          const prior = (get().mastery ?? {})[mkey];
          set({
            mastery: {
              ...(get().mastery ?? {}),
              [mkey]: { seen: (prior?.seen ?? 0) + 1, lastSeen: new Date().toISOString() },
            },
          });
        }
        pushLog(get, set, {
          kind: 'exercise_done',
          childId: child.id,
          childName: child.name,
          lessonId,
          lessonTitle: meta?.lessonTitle,
          exerciseId,
          detail: meta?.detail || `${child.name} cleared an exercise`,
        });
      },

      getCompletedIds: (lessonId) => {
        const key = `${get().activeChildId}:${lessonId}`;
        return get().completed[key] || [];
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
        mastery: s.mastery ?? {},
        stars: s.stars ?? {},
        voiceEnabled: s.voiceEnabled,
        meadowVoiceId: s.meadowVoiceId,
        logs: s.logs,
        activeLearning: s.activeLearning,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.meadowVoiceId) configureMeadowVoice(state.meadowVoiceId);
        if (typeof window !== 'undefined') {
          void useAppStore.getState().loadOpenaiKey();
        }
      },
    }
  )
);

export function useActiveChild() {
  const children = useAppStore((s) => s.children);
  const activeChildId = useAppStore((s) => s.activeChildId);
  return children.find((c) => c.id === activeChildId) || children[0];
}
