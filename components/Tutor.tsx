import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { Lesson } from '@/content/schema';
import { askMeadow, type TutorMessage } from '@/lib/agent/tutor';
import { colors, fonts, radii, space } from '@/lib/theme';
import { getBand } from '@/content';

interface Props {
  lesson: Lesson;
  childName: string;
  visible: boolean;
  onClose: () => void;
}

export function TutorSheet({ lesson, childName, visible, onClose }: Props) {
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const band = getBand(lesson.ageBand);

  useEffect(() => {
    if (visible && messages.length === 0) {
      setMessages([
        {
          role: 'meadow',
          text: `Hi ${childName}! I'm Meadow. I only help with “${lesson.title}”. Ask me for a hint, a sound, a number, or drawing help.`,
        },
      ]);
    }
  }, [visible, lesson.id]);

  const send = async (text?: string) => {
    const q = (text ?? input).trim();
    if (!q || busy) return;
    setInput('');
    setMessages((m) => [...m, { role: 'child', text: q }]);
    setBusy(true);
    const reply = await askMeadow(q, {
      lesson,
      childName,
      ageBandLabel: band.label,
    });
    setMessages((m) => [...m, { role: 'meadow', text: reply }]);
    setBusy(false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  };

  const chips = ['Hint please', 'Help me draw', 'What are we learning?'];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.dismiss} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>M</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Meadow</Text>
              <Text style={styles.sub}>Lesson-safe helper · {lesson.title}</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={12}>
              <Text style={styles.close}>Close</Text>
            </Pressable>
          </View>

          <ScrollView
            ref={scrollRef}
            style={styles.messages}
            contentContainerStyle={{ paddingBottom: space.md, gap: space.sm }}
          >
            {messages.map((msg, i) => (
              <View
                key={`${i}-${msg.text.slice(0, 12)}`}
                style={[styles.bubble, msg.role === 'child' ? styles.child : styles.meadow]}
              >
                <Text style={styles.bubbleText}>{msg.text}</Text>
              </View>
            ))}
            {busy && <ActivityIndicator color={colors.meadow} />}
          </ScrollView>

          <View style={styles.chips}>
            {chips.map((c) => (
              <Pressable key={c} style={styles.chip} onPress={() => send(c)}>
                <Text style={styles.chipText}>{c}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Ask Meadow…"
              placeholderTextColor={colors.inkSoft}
              onSubmitEditing={() => send()}
              returnKeyType="send"
            />
            <Pressable style={styles.send} onPress={() => send()}>
              <Text style={styles.sendText}>Go</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export function TutorFab({ onPress }: { onPress: () => void }) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.06, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View style={[styles.fabWrap, { transform: [{ scale: pulse }] }]}>
      <Pressable style={styles.fab} onPress={onPress} accessibilityLabel="Ask Meadow for help">
        <Text style={styles.fabLetter}>M</Text>
        <Text style={styles.fabLabel}>Help</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.overlay },
  dismiss: { flex: 1 },
  sheet: {
    backgroundColor: colors.paper,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    padding: space.md,
    paddingBottom: space.xl,
    maxHeight: '82%',
  },
  handle: {
    alignSelf: 'center',
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.paperDeep,
    marginBottom: space.sm,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginBottom: space.sm },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.meadow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.display, color: colors.white, fontSize: 20 },
  title: { fontFamily: fonts.display, fontSize: 22, color: colors.ink },
  sub: { fontFamily: fonts.body, fontSize: 13, color: colors.inkSoft },
  close: { fontFamily: fonts.bodyBold, color: colors.meadow, fontSize: 15 },
  messages: { flexGrow: 0, maxHeight: 320 },
  bubble: { borderRadius: radii.md, padding: space.md, maxWidth: '92%' },
  child: { alignSelf: 'flex-end', backgroundColor: colors.skySoft },
  meadow: { alignSelf: 'flex-start', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.paperDeep },
  bubbleText: { fontFamily: fonts.body, fontSize: 16, color: colors.ink, lineHeight: 22 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: space.sm },
  chip: {
    backgroundColor: colors.honeySoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.pill,
  },
  chipText: { fontFamily: fonts.bodyBold, color: colors.ink, fontSize: 13 },
  inputRow: { flexDirection: 'row', gap: space.sm },
  input: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink,
    borderWidth: 1,
    borderColor: colors.paperDeep,
  },
  send: {
    backgroundColor: colors.meadow,
    borderRadius: radii.pill,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  sendText: { fontFamily: fonts.bodyBold, color: colors.white },
  fabWrap: { position: 'absolute', right: 18, bottom: 28, zIndex: 50 },
  fab: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.honey,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: colors.ink,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabLetter: { fontFamily: fonts.display, fontSize: 22, color: colors.ink, lineHeight: 26 },
  fabLabel: { fontFamily: fonts.bodyBold, fontSize: 11, color: colors.ink },
});
