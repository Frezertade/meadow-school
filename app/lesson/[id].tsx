import { Redirect, useLocalSearchParams, router } from 'expo-router';
import { LessonPlayer } from '@/components/LessonPlayer';
import { getLesson } from '@/content';
import { useActiveChild } from '@/lib/store';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const child = useActiveChild();
  const lesson = getLesson(String(id));

  if (!lesson) return <Redirect href="/" />;

  return (
    <LessonPlayer
      lesson={lesson}
      childName={child.name}
      onBack={() => router.back()}
    />
  );
}
