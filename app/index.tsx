import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { colors, sizes } from '../src/constants/theme';
import { CHARACTERS } from '../src/constants/characters';
import { SprunkiCharacter } from '../src/components/SprunkiCharacter';
import { Analytics } from '../src/utils/analytics';

function CharacterCard({ character }: { character: (typeof CHARACTERS)[number] }) {
  const router = useRouter();
  const scale = useSharedValue(1);
  // F-10: store timer ref so it can be cancelled on unmount
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Analytics.characterSelected(character.id);
    scale.value = withSpring(0.92, { damping: 10 }, () => {
      scale.value = withSpring(1.05, { damping: 8 }, () => {
        scale.value = withSpring(1);
      });
    });
    timerRef.current = setTimeout(() => router.push(`/paint/${character.id}`), 180);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.cardTouch}
      accessibilityLabel={`Select ${character.name}`}
      accessibilityRole="button"
    >
      <Animated.View style={[styles.card, animStyle]}>
        <SprunkiCharacter
          characterId={character.id}
          zones={{}}
          onTapZone={() => {}}
          size={90}
        />
        <Text style={styles.characterName}>{character.name}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    Analytics.screenView('home');
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Sprunki Color 🎨</Text>
        <Text style={styles.subtitle}>Tap a friend!</Text>

        <View style={styles.cardRow}>
          {CHARACTERS.map((c) => (
            <CharacterCard key={c.id} character={c} />
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.galleryBtn}
        onPress={() => router.push('/gallery')}
        accessibilityLabel="View gallery"
        accessibilityRole="button"
      >
        <Text style={styles.galleryBtnText}>🖼️</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: sizes.spacing.xl,
    paddingBottom: 100,
    paddingHorizontal: sizes.spacing.md,
  },
  title: {
    fontSize: sizes.font.xxl,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: sizes.spacing.xs,
  },
  subtitle: {
    fontSize: sizes.font.md,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: sizes.spacing.xl,
  },
  cardRow: {
    flexDirection: 'row',
    gap: sizes.spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  cardTouch: {
    minWidth: sizes.touchMin,
    minHeight: sizes.touchMin,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: sizes.radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    padding: sizes.spacing.md,
    alignItems: 'center',
    gap: sizes.spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  characterName: {
    fontSize: sizes.font.sm,
    fontWeight: '700',
    color: colors.text,
  },
  galleryBtn: {
    position: 'absolute',
    bottom: sizes.spacing.lg,
    right: sizes.spacing.lg,
    width: sizes.touchMin,
    height: sizes.touchMin,
    borderRadius: sizes.radius.full,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  galleryBtnText: {
    fontSize: 28,
  },
});
