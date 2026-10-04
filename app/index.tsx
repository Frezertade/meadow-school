import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { curriculumBands, getBand } from '@/content';
import { MeadowGarden } from '@/components/MeadowGarden';
import { VoiceBar } from '@/components/VoiceBar';
import {
  isLessonUnlocked,
  sortedPathLessons,
} from '@/lib/progress';
import { colors, fonts, radii, space } from '@/lib/theme';
import { useActiveChild, useAppStore } from '@/lib/store';
import {
  isVoiceUnlocked,
  meadowSpeakSequence,
  unlockAndSpeakNow,
  unlockVoice,
} from '@/lib/voice/meadowVoice';
import { narrateHome } from '@/lib/voice/scripts';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const child = useActiveChild();
  const children = useAppStore((s) => s.children);
  const setActiveChild = useAppStore((s) => s.setActiveChild);
  const completed = useAppStore((s) => s.completed);
  const voiceEnabled = useAppStore((s) => s.voiceEnabled);
  const setVoiceEnabled = useAppStore((s) => s.setVoiceEnabled);
  const activeLearning = useAppStore((s) => s.activeLearning);
  const stars = useAppStore((s) => s.stars ?? {});
  const starCount = Object.keys(stars).filter((k) => k.startsWith(child.id)).length;
  const band = getBand(child.ageBand);
  const pathLessons = sortedPathLessons(band.lessons);
  const greeted = useRef<string | null>(null);
  const [voiceReady, setVoiceReady] = useState(isVoiceUnlocked());

  const speakWelcome = () => {
    if (!voiceEnabled) setVoiceEnabled(true);
    unlockVoice();
    setVoiceReady(true);
    // Immediate speak in case this was called from a tap
    unlockAndSpeakNow(`Hi ${child.name}! I'm Meadow.`);
    setTimeout(() => {
      meadowSpeakSequence(narrateHome(child.name, band.label), {
        enabled: true,
        gapMs: 250,
      });
    }, 80);
  };

  useEffect(() => {
    // Do not auto-speak on web without a tap — browsers block it
    if (!voiceEnabled) return;
    if (!isVoiceUnlocked()) return;
    if (greeted.current === child.id) return;
    greeted.current = child.id;
    // Only auto-continue if already unlocked from a prior tap
    meadowSpeakSequence(narrateHome(child.name, band.label), {
      enabled: true,
      gapMs: 250,
    });
  }, [child.id, voiceEnabled]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={[colors.skySoft, colors.paper, colors.paper]}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.brandRow}>
          <Text style={styles.brand}>Meadow School</Text>
          <Link href="/parent" asChild>
            <Pressable style={styles.parentBtn}>
              <Text style={styles.parentBtnText}>Parent</Text>
            </Pressable>
          </Link>
        </View>

        <Text style={styles.hello}>Hello, {child.name}</Text>
        <Text style={styles.lede}>
          Meadow is your teacher — talk with buttons or the mic. Grown-ups check the log later.
        </Text>

        <VoiceBar
          onHearAgain={() => {
            meadowSpeakSequence(narrateHome(child.name, band.label), {
              enabled: true,
              gapMs: 250,
            });
          }}
          label="Hear welcome"
          immediateLine={`Hi ${child.name}! I'm Meadow, your learning guide.`}
        />

        {!voiceReady && (
          <Pressable style={styles.unlock} onPress={speakWelcome}>
            <Text style={styles.unlockTitle}>Tap here to hear Meadow</Text>
            <Text style={styles.unlockBody}>
              Sound needs one tap to start. After this, Meadow will talk on every page.
            </Text>
          </Pressable>
        )}

        <View style={styles.switcher}>
          {children.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => {
                unlockVoice();
                setActiveChild(c.id);
                greeted.current = null;
              }}
              style={[styles.childChip, c.id === child.id && styles.childChipOn]}
              accessibilityRole="button"
              accessibilityLabel={`Learn as ${c.name}`}
            >
              <Text
                style={[styles.childChipText, c.id === child.id && styles.childChipTextOn]}
              >
                {c.name}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.nowCard}>
          <Text style={styles.nowLabel}>Learning now</Text>
          <Text style={styles.nowName}>
            {activeLearning?.childName || child.name}
            {activeLearning?.lessonTitle
              ? ` · ${activeLearning.lessonTitle}`
              : ' · choosing a lesson'}
          </Text>
          {!!activeLearning?.lessonId && (
            <Pressable
              style={styles.continueBtn}
              onPress={() => {
                unlockVoice();
                router.push(`/lesson/${activeLearning.lessonId}`);
              }}
              accessibilityRole="button"
              accessibilityLabel={`Continue ${activeLearning.lessonTitle ?? 'lesson'}`}
            >
              <Text style={styles.continueText}>Continue →</Text>
            </Pressable>
          )}
        </View>

        <MeadowGarden stars={starCount} childName={child.name} />

        <View style={styles.bandCard}>
          <Text style={styles.bandLabel}>{band.ageRange}</Text>
          <Text style={styles.bandTitle}>{band.label}</Text>
          <Text style={styles.bandDesc}>{band.description}</Text>
        </View>

        <Text style={styles.section}>Next up</Text>
        {(() => {
          const states = pathLessons.map((lesson) => {
            const key = `${child.id}:${lesson.id}`;
            const doneIds = completed[key] || [];
            const total = lesson.exercises.length;
            return {
              lesson,
              done: total > 0 && doneIds.length >= total,
              unlocked: isLessonUnlocked(lesson, band.lessons, completed, child.id),
            };
          });
          const next = states.find((s) => s.unlocked && !s.done);
          return (
            <>
              {next ? (
                <Pressable
                  style={styles.nextCard}
                  onPress={() => {
                    unlockVoice();
                    router.push(`/lesson/${next.lesson.id}`);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Start next lesson: ${next.lesson.title}`}
                >
                  <Text style={styles.nextLabel}>
                    Step {next.lesson.pathOrder ?? '—'} · {next.lesson.subject} · {next.lesson.minutes} min
                  </Text>
                  <Text style={styles.nextTitle}>{next.lesson.title}</Text>
                  <Text style={styles.nextSummary}>{next.lesson.summary}</Text>
                  <Text style={styles.nextGo}>▶ Start the show</Text>
                </Pressable>
              ) : (
                <View style={styles.nextCard}>
                  <Text style={styles.nextTitle}>Path complete! 🎉</Text>
                  <Text style={styles.nextSummary}>
                    Every step finished. Replay a favorite or visit another age band below.
                  </Text>
                </View>
              )}
              <Text style={styles.section}>Full path</Text>
              {states.map(({ lesson, done, unlocked }) => (
                <Pressable
                  key={lesson.id}
                  style={[styles.pathRow, !unlocked && styles.lessonLocked]}
                  onPress={() => {
                    if (!unlocked) return;
                    unlockVoice();
                    router.push(`/lesson/${lesson.id}`);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`${lesson.title}${done ? ', completed' : !unlocked ? ', locked' : ''}`}
                >
                  <Text style={styles.pathStep}>{lesson.pathOrder ?? '—'}</Text>
                  <Text style={styles.pathTitle} numberOfLines={1}>
                    {lesson.title}
                  </Text>
                  <Text style={styles.pathStatus}>{done ? '✅' : !unlocked ? '🔒' : '▶'}</Text>
                </Pressable>
              ))}
            </>
          );
        })()}

        <Text style={styles.otherBands}>Other ages</Text>
        {curriculumBands
          .filter((b) => b.id !== band.id)
          .map((b) => (
            <Pressable
              key={b.id}
              style={styles.otherCard}
              onPress={() => {
                useAppStore.getState().setChildBand(child.id, b.id);
              }}
            >
              <Text style={styles.otherTitle}>
                {b.label} · {b.ageRange}
              </Text>
              <Text style={styles.otherDesc}>{b.description}</Text>
            </Pressable>
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  content: { padding: space.md, paddingBottom: space.xl * 2, gap: space.sm },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space.sm,
  },
  brand: { fontFamily: fonts.display, fontSize: 20, color: colors.meadow },
  parentBtn: {
    backgroundColor: colors.ink,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.pill,
  },
  parentBtnText: { fontFamily: fonts.bodyBold, color: colors.white, fontSize: 13 },
  hello: { fontFamily: fonts.display, fontSize: 36, color: colors.ink, lineHeight: 42 },
  lede: {
    fontFamily: fonts.body,
    fontSize: 17,
    color: colors.inkSoft,
    lineHeight: 26,
    marginBottom: space.sm,
  },
  unlock: {
    backgroundColor: colors.meadow,
    borderRadius: radii.lg,
    padding: space.lg,
    gap: 6,
    marginBottom: space.sm,
  },
  unlockTitle: { fontFamily: fonts.display, fontSize: 20, color: colors.white },
  unlockBody: { fontFamily: fonts.body, fontSize: 14, color: colors.white, lineHeight: 20 },
  switcher: { flexDirection: 'row', gap: 8, marginBottom: space.sm },
  childChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.paperDeep,
  },
  childChipOn: { backgroundColor: colors.meadow },
  childChipText: { fontFamily: fonts.bodyBold, color: colors.ink },
  childChipTextOn: { color: colors.white },
  nowCard: {
    backgroundColor: colors.ink,
    borderRadius: radii.md,
    padding: space.md,
    marginBottom: space.sm,
  },
  nowLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    color: colors.honey,
    letterSpacing: 1,
  },
  nowName: { fontFamily: fonts.displaySoft, fontSize: 20, color: colors.white, marginTop: 4 },
  continueBtn: {
    marginTop: space.sm,
    backgroundColor: colors.honey,
    borderRadius: radii.pill,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  continueText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink },
  bandCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: space.lg,
    borderWidth: 1,
    borderColor: colors.paperDeep,
    marginBottom: space.md,
  },
  bandLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.honey,
    letterSpacing: 1,
  },
  bandTitle: { fontFamily: fonts.display, fontSize: 28, color: colors.ink, marginTop: 4 },
  bandDesc: { fontFamily: fonts.body, fontSize: 15, color: colors.inkSoft, marginTop: 8, lineHeight: 22 },
  section: {
    fontFamily: fonts.bodyExtra,
    fontSize: 14,
    color: colors.ink,
    letterSpacing: 0.6,
    marginTop: space.sm,
  },
  nextCard: {
    backgroundColor: colors.meadow,
    borderRadius: radii.lg,
    padding: space.lg,
    gap: 6,
    marginBottom: space.sm,
  },
  nextLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.honey,
    letterSpacing: 1,
  },
  nextTitle: { fontFamily: fonts.display, fontSize: 28, color: colors.white },
  nextSummary: { fontFamily: fonts.body, fontSize: 15, color: colors.white, lineHeight: 22, opacity: 0.9 },
  nextGo: {
    fontFamily: fonts.bodyBold,
    fontSize: 17,
    color: colors.ink,
    backgroundColor: colors.honey,
    borderRadius: radii.pill,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
    marginTop: 6,
    overflow: 'hidden',
  },
  pathRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    paddingVertical: 12,
    paddingHorizontal: space.md,
    borderWidth: 1,
    borderColor: colors.paperDeep,
  },
  pathStep: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.white,
    backgroundColor: colors.meadow,
    borderRadius: 999,
    width: 26,
    height: 26,
    textAlign: 'center',
    lineHeight: 26,
  },
  pathTitle: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink, flex: 1 },
  pathStatus: { fontSize: 16 },
  lessonLocked: { opacity: 0.55 },
  otherBands: {
    fontFamily: fonts.bodyExtra,
    fontSize: 14,
    color: colors.ink,
    marginTop: space.lg,
  },
  otherCard: {
    padding: space.md,
    borderRadius: radii.md,
    backgroundColor: colors.honeySoft,
    gap: 4,
  },
  otherTitle: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.ink },
  otherDesc: { fontFamily: fonts.body, fontSize: 14, color: colors.inkSoft },
});
