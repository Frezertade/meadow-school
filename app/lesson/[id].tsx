import { Redirect, useLocalSearchParams, router } from 'expo-router';
import { ScrollView } from 'react-native';
import { LessonShow } from '@/components/LessonShow';
import { getLesson } from '@/content';
import { useActiveChild } from '@/lib/store';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const child = useActiveChild();
  const lesson = getLesson(String(id));

  if (!lesson) return <Redirect href="/" />;

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <LessonShow
        lesson={lesson}
        childName={child.name}
        onBack={() => { try { router.back(); } catch {} if (typeof window !== "undefined") { window.history.length > 1 ? window.history.back() : router.replace("/"); } else { router.replace("/"); } }}
      />
    </ScrollView>
  );
}
