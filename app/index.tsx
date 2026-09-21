import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { curriculumBands, getBand } from '@/content';
import { colors, fonts, radii, space } from '@/lib/theme';
import { useActiveChild, useAppStore } from '@/lib/store';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const child = useActiveChild();
  const children = useAppStore((s) => s.children);
  const setActiveChild = useAppStore((s) => s.setActiveChild);
  const completed = useAppStore((s) => s.completed);
  const band = getBand(child.ageBand);

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
          Lessons that feel like a storybook — with Meadow beside you whenever you need help.
        </Text>

        <View style={styles.switcher}>
          {children.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => setActiveChild(c.id)}
              style={[styles.childChip, c.id === child.id && styles.childChipOn]}
            >
              <Text
                style={[styles.childChipText, c.id === child.id && styles.childChipTextOn]}
              >
                {c.name}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.bandCard}>
          <Text style={styles.bandLabel}>{band.ageRange}</Text>
          <Text style={styles.bandTitle}>{band.label}</Text>
          <Text style={styles.bandDesc}>{band.description}</Text>
        </View>

        <Text style={styles.section}>Today’s path</Text>
        {band.lessons.map((lesson) => {
          const key = `${child.id}:${lesson.id}`;
          const doneCount = (completed[key] || []).length;
          const total = lesson.exercises.length;
          const done = total > 0 && doneCount >= total;
          return (
            <Pressable
              key={lesson.id}
              style={styles.lessonCard}
              onPress={() => router.push(`/lesson/${lesson.id}`)}
            >
              <View style={styles.lessonTop}>
                <Text style={styles.lessonSubject}>{lesson.subject}</Text>
                {done && <Text style={styles.done}>Done</Text>}
              </View>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Text style={styles.lessonSummary}>{lesson.summary}</Text>
              <Text style={styles.lessonMeta}>
                {lesson.minutes} min · {lesson.exercises.length} activities
              </Text>
            </Pressable>
          );
        })}

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
  lessonCard: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: space.md,
    borderWidth: 1,
    borderColor: colors.paperDeep,
    gap: 4,
  },
  lessonTop: { flexDirection: 'row', justifyContent: 'space-between' },
  lessonSubject: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    color: colors.sky,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  done: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.success },
  lessonTitle: { fontFamily: fonts.displaySoft, fontSize: 22, color: colors.ink },
  lessonSummary: { fontFamily: fonts.body, fontSize: 15, color: colors.inkSoft, lineHeight: 22 },
  lessonMeta: { fontFamily: fonts.body, fontSize: 13, color: colors.inkSoft, marginTop: 4 },
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
