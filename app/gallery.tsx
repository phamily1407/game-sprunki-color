import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, sizes } from '../src/constants/theme';
import { useStorage, type SavedPainting } from '../src/hooks/useStorage';
import { SprunkiCharacter } from '../src/components/SprunkiCharacter';
import { CHARACTER_MAP } from '../src/constants/characters';

function PaintingCard({
  painting,
  onDelete,
}: {
  painting: SavedPainting;
  onDelete: (id: string) => void;
}) {
  const character = CHARACTER_MAP[painting.characterId];
  const date = new Date(painting.createdAt).toLocaleDateString();
  const zoneCount = Object.values(painting.zones).filter(Boolean).length;

  const handleLongPress = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Delete this painting?')) onDelete(painting.id);
    } else {
      Alert.alert('Delete painting?', `${character?.name ?? 'Character'} — ${date}`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(painting.id) },
      ]);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onLongPress={handleLongPress}
      delayLongPress={500}
      accessibilityLabel={`${character?.name ?? 'Character'} painting from ${date}. Long press to delete.`}
      accessibilityRole="button"
    >
      <SprunkiCharacter
        characterId={painting.characterId}
        zones={painting.zones}
        onTapZone={() => {}}
        size={110}
      />
      <Text style={styles.cardName}>{character?.name ?? painting.characterId}</Text>
      <Text style={styles.cardDate}>{date}</Text>
      <Text style={styles.cardZones}>{zoneCount} zones</Text>
    </TouchableOpacity>
  );
}

export default function GalleryScreen() {
  const router = useRouter();
  const { listPaintings, deletePainting } = useStorage();
  const [paintings, setPaintings] = useState<SavedPainting[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const list = await listPaintings();
    setPaintings(list);
    setLoading(false);
  }, [listPaintings]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string) => {
    await deletePainting(id);
    setPaintings((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gallery 🖼️</Text>
        <View style={{ width: 72 }} />
      </View>

      {paintings.length === 0 && !loading ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🎨</Text>
          <Text style={styles.emptyText}>Save a painting to see it here!</Text>
        </View>
      ) : (
        <FlatList
          data={paintings}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <PaintingCard painting={item} onDelete={handleDelete} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sizes.spacing.sm,
    height: 56,
    backgroundColor: colors.card,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 72,
    height: sizes.touchMin,
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: sizes.font.sm,
    color: colors.accent,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: sizes.font.md,
    fontWeight: '700',
    color: colors.text,
  },
  grid: {
    padding: sizes.spacing.sm,
    gap: sizes.spacing.sm,
  },
  row: {
    gap: sizes.spacing.sm,
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    maxWidth: '48%',
    backgroundColor: colors.card,
    borderRadius: sizes.radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    padding: sizes.spacing.sm,
    alignItems: 'center',
    gap: 4,
  },
  cardName: {
    fontSize: sizes.font.sm,
    fontWeight: '700',
    color: colors.text,
  },
  cardDate: {
    fontSize: 14,
    color: colors.textMuted,
  },
  cardZones: {
    fontSize: 12,
    color: colors.textMuted,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: sizes.spacing.md,
  },
  emptyEmoji: {
    fontSize: 64,
  },
  emptyText: {
    fontSize: sizes.font.md,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: sizes.spacing.xl,
  },
});
