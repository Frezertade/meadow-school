import { LinearGradient } from 'expo-linear-gradient';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { Lesson } from '@/content/schema';
import { useTeachSession } from '@/lib/useTeachSession';
import { difficultyLabel, exerciseDifficulty } from '@/lib/progress';
import { colors, fonts, radii, space } from '@/lib/theme';
import { MeadowMascot } from '@/components/MeadowMascot';
import { StarBurst } from '@/components/StarBurst';
import { Celebration } from '@/components/Celebration';
import { DrawingCanvas } from '@/components/exercises/DrawingCanvas';
import { MathExercise } from '@/components/exercises/MathExercise';
import { ReadingExercise } from '@/components/exercises/ReadingExercise';
import { SequenceExercise } from '@/components/exercises/SequenceExercise';
import { ListenSayExercise } from '@/components/exercises/ListenSayExercise';

interface Props {
  lesson: Lesson;
  childName: string;
  onBack: () => void;
}

const BACKDROPS: Record<string, { emoji: string; bg: [string, string] }> = {
  english: { emoji: '📖', bg: [colors.skySoft, colors.paper] },
  math: { emoji: '🔢', bg: [colors.honeySoft, colors.paper] },
  art: { emoji: '🎨', bg: [colors.blush, colors.paper] },
  science: { emoji: '🔬', bg: [colors.meadowLight, colors.paper] },
  social: { emoji: '🗺️', bg: [colors.skySoft, colors.paper] },
  health: { emoji: '🍎', bg: [colors.honeySoft, colors.paper] },
  music: { emoji: '🎵', bg: [colors.blush, colors.paper] },
  safety: { emoji: '🧯', bg: [colors.skySoft, colors.paper] },
};

/**
 * Meadow Show: the lesson plays like an animated episode.
 * Scenes auto-play with captions; the child jumps in for play breaks.
 * Meadow never reads the screen — she performs it.
 */
export function LessonShow({ lesson, childName, onBack }: Props) {
  const s = useTeachSession({ lesson, childName, onBack });
  const { turn } = s;
  const backdrop = BACKDROPS[lesson.subject] ?? { emoji: '🌼', bg: [colors.paper, colors.paper] as [string, string] };
  const sceneNo = Math.min(s.turnIndex + 1, s.plan.length);
  const markers = s.plan
    .map((t, i) => ({ t, i }))
    .filter(({ t }) => t.phase === 'exercise_intro')
    .map(({ i }) => Math.round(((i + 1) / Math.max(1, s.plan.length)) * 100));

  return (
    <View style={styles.root}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={s.goBack}
          accessibilityRole="button"
          accessibilityLabel="Go back to lessons"
          style={styles.backBtn}
        >
          <Text style={styles.back}>← Back</Text>
        </Pressable>
        <Text style={styles.scene} numberOfLines={1}>
          Scene {sceneNo}/{s.plan.length}
        </Text>
        <Text style={styles.stars}>⭐ {s.starCount}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Stage */}
        <LinearGradient colors={backdrop.bg} style={styles.stage}>
          {turn?.phase === 'celebrate' && <StarBurst />}
          <Text style={styles.backdropEmoji}>{backdrop.emoji}</Text>
          <MeadowMascot key={s.direction.mood} mood={s.direction.mood} size={112} />
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
        </LinearGradient>

        {/* Captions */}
        <View style={styles.captions}>
          <Text style={styles.captionText}>
            {s.meadowLine || turn?.say || '…'}
            {s.thinking ? ' …' : ''}
          </Text>
          {!!turn?.ask && <Text style={styles.ask}>{turn.ask}</Text>}
          {!!s.lastHeard && <Text style={styles.heard}>You said: “{s.lastHeard}”</Text>}
          {s.thinking && <Text style={styles.thinking}>Meadow is thinking…</Text>}
        </View>

        {/* Transport: play like a video */}
        {!s.needsTap && (
          <View style={styles.transport}>
            <Pressable
              onPress={() => (s.playing ? s.pause() : s.play())}
              accessibilityRole="button"
              accessibilityLabel={s.playing ? 'Pause the show' : 'Play the show'}
              style={styles.transportBtn}
            >
              <Text style={styles.transportText}>{s.playing ? '⏸ Pause' : '▶ Play'}</Text>
            </Pressable>
            <View style={styles.trackWrap}>
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    { width: `${Math.round((sceneNo / Math.max(1, s.plan.length)) * 100)}%` },
                  ]}
                />
                {markers.map((left, i) => (
                  <View key={i} style={[styles.marker, { left: `${left}%` }]} />
                ))}
              </View>
            </View>
            <Pressable
              onPress={s.replay}
              accessibilityRole="button"
              accessibilityLabel="Replay this scene"
              style={styles.transportBtn}
            >
              <Text style={styles.transportText}>↺ Replay</Text>
            </Pressable>
          </View>
        )}

        {/* Tap-to-talk */}
        {turn?.waitForChild && !s.needsTap && (
          <View style={styles.replyRow}>
            {(turn.chips || []).map((chip) => (
              <Pressable
                key={chip}
                style={styles.chip}
                onPress={() => s.onChip(chip)}
                accessibilityRole="button"
                accessibilityLabel={`Answer: ${chip}`}
              >
                <Text style={styles.chipText}>{chip}</Text>
              </Pressable>
            ))}
            <Pressable
              style={[styles.mic, s.busyListen && styles.micOn]}
              onPress={() => void s.onMic()}
              disabled={s.busyListen}
              accessibilityRole="button"
              accessibilityLabel="Talk to Meadow with your voice"
            >
              {s.busyListen ? (
                <ActivityIndicator color={colors.ink} />
              ) : (
                <Text style={styles.micText}>🎤 Talk</Text>
              )}
            </Pressable>
          </View>
        )}

        {/* Keep watching */}
        {!turn?.waitForChild && turn?.phase !== 'exercise' && !s.needsTap && (
          <Pressable
            style={styles.continue}
            onPress={s.advance}
            accessibilityRole="button"
            accessibilityLabel="Continue the show"
          >
            <Text style={styles.continueText}>▶ Keep watching</Text>
          </Pressable>
        )}

        {/* Play break */}
        {s.currentExercise && (
          <View style={styles.exCard}>
            <Text style={styles.playBreak}>
              🎮 Play break · {difficultyLabel(exerciseDifficulty(s.currentExercise))}
              {exerciseDifficulty(s.currentExercise) > s.maxDiff ? ' (finish easier first)' : ''}
            </Text>
            {exerciseDifficulty(s.currentExercise) <= s.maxDiff ? (
              <>
                {s.currentExercise.kind === 'math' && (
                  <MathExercise
                    exercise={s.currentExercise}
                    childName={childName}
                    onComplete={() => s.onExerciseComplete(s.currentExercise!.id)}
                    onWrong={s.onExerciseWrong}
                  />
                )}
                {s.currentExercise.kind === 'reading' && (
                  <ReadingExercise
                    exercise={s.currentExercise}
                    childName={childName}
                    onComplete={() => s.onExerciseComplete(s.currentExercise!.id)}
                    onWrong={s.onExerciseWrong}
                  />
                )}
                {s.currentExercise.kind === 'drawing' && (
                  <DrawingCanvas
                    instruction={s.currentExercise.instruction}
                    prompt={s.currentExercise.prompt}
                    successMessage={s.currentExercise.successMessage}
                    onComplete={() => s.onExerciseComplete(s.currentExercise!.id)}
                  />
                )}
                {s.currentExercise.kind === 'sequence' && (
                  <SequenceExercise
                    exercise={s.currentExercise}
                    childName={childName}
                    onComplete={() => s.onExerciseComplete(s.currentExercise!.id)}
                    onWrong={s.onExerciseWrong}
                  />
                )}
                {s.currentExercise.kind === 'listen-say' && (
                  <ListenSayExercise
                    exercise={s.currentExercise}
                    childName={childName}
                    onComplete={() => s.onExerciseComplete(s.currentExercise!.id)}
                    onWrong={s.onExerciseWrong}
                  />
                )}
              </>
            ) : (
              <Text style={styles.lockNote}>
                Clear the warmer challenges first — then this stronger one unlocks.
              </Text>
            )}
          </View>
        )}

        {/* Finale */}
        {turn?.phase === 'celebrate' && (
          <>
            <Celebration childName={childName} lessonTitle={lesson.title} stars={s.starCount} />
            <Pressable
              style={styles.continue}
              onPress={s.goBack}
              accessibilityRole="button"
              accessibilityLabel="Done for now, back to lessons"
            >
              <Text style={styles.continueText}>Done for now</Text>
            </Pressable>
          </>
        )}

        {/* Downloading the nicer voice? Say so, never trap. */}
        {!s.needsTap && s.voiceStatus === 'loading' && (
          <View style={styles.voiceBanner}>
            <ActivityIndicator color={colors.meadow} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.voiceBannerText}>
                {s.voiceProgress.detail || 'Loading Meadow’s nicer voice… stay on this page.'}
              </Text>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.round(Math.max(0.05, s.voiceProgress.progress) * 100)}%` },
                  ]}
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Tap to start the show */}
      {s.needsTap && (
        <Pressable style={styles.startOverlay} onPress={s.startTeacher}>
          <MeadowMascot mood="idle" size={120} />
          <Text style={styles.startTitle}>▶ Start the show</Text>
          <Text style={styles.startBody}>
            One tap turns sound on. Meadow performs the lesson — no reading needed.
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  backBtn: { paddingVertical: 10, paddingRight: 12, minHeight: 48, justifyContent: 'center' },
  back: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.meadow },
  scene: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.inkSoft, flex: 1, textAlign: 'center' },
  stars: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink },
  content: { padding: space.md, paddingBottom: space.xl * 2, gap: space.sm },
  stage: {
    borderRadius: radii.lg,
    padding: space.lg,
    alignItems: 'center',
    gap: 6,
    overflow: 'hidden',
  },
  backdropEmoji: { fontSize: 40, opacity: 0.9 },
  lessonTitle: { fontFamily: fonts.display, fontSize: 24, color: colors.ink, textAlign: 'center' },
  captions: {
    backgroundColor: colors.ink,
    borderRadius: radii.md,
    padding: space.md,
    gap: 6,
  },
  captionText: { fontFamily: fonts.bodyBold, fontSize: 20, color: colors.white, lineHeight: 30 },
  ask: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.honey },
  heard: { fontFamily: fonts.body, fontSize: 14, color: colors.white, fontStyle: 'italic', opacity: 0.8 },
  thinking: { fontFamily: fonts.body, fontSize: 14, color: colors.honey, fontStyle: 'italic' },
  transport: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  transportBtn: {
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.paperDeep,
    minHeight: 48,
    justifyContent: 'center',
  },
  transportText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink },
  trackWrap: { flex: 1, paddingVertical: 8 },
  track: { height: 10, borderRadius: radii.pill, backgroundColor: colors.paperDeep, overflow: 'visible' },
  fill: { height: 10, borderRadius: radii.pill, backgroundColor: colors.meadow },
  marker: {
    position: 'absolute',
    top: -3,
    width: 6,
    height: 16,
    borderRadius: 3,
    backgroundColor: colors.honey,
  },
  replyRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: colors.skySoft,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: radii.pill,
  },
  chipText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink },
  mic: {
    backgroundColor: colors.honey,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: radii.pill,
    minWidth: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micOn: { backgroundColor: colors.blush },
  micText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink },
  continue: {
    backgroundColor: colors.meadow,
    borderRadius: radii.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  continueText: { fontFamily: fonts.bodyBold, color: colors.white, fontSize: 16 },
  exCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: space.md,
    borderWidth: 1,
    borderColor: colors.paperDeep,
    gap: space.sm,
  },
  playBreak: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.meadow },
  lockNote: { fontFamily: fonts.body, color: colors.inkSoft, fontSize: 15 },
  voiceBanner: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: space.md,
    borderWidth: 1,
    borderColor: colors.paperDeep,
    alignItems: 'center',
  },
  voiceBannerText: { fontFamily: fonts.body, fontSize: 13, color: colors.inkSoft },
  progressTrack: { height: 8, borderRadius: radii.pill, backgroundColor: colors.paperDeep, overflow: 'hidden' },
  progressFill: { height: 8, backgroundColor: colors.meadow },
  startOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: space.lg,
  },
  startTitle: { fontFamily: fonts.display, fontSize: 30, color: colors.ink, textAlign: 'center' },
  startBody: { fontFamily: fonts.body, fontSize: 16, color: colors.inkSoft, textAlign: 'center', lineHeight: 24 },
});
