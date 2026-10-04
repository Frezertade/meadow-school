import { Redirect, useLocalSearchParams, router } from 'expo-router';
import { ScrollView } from 'react-native';
import { TeacherAgent } from '@/components/TeacherAgent';
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
      <TeacherAgent
        lesson={lesson}
        childName={child.name}
        onBack={() => router.back()}
      />
    </ScrollView>
  );
}
