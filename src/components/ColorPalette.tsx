import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, AccessibilityInfo } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors, sizes } from '../constants/theme';
import { PAINT_COLORS, COLOR_MAP, type PaintColor } from '../constants/colorMap';

interface Props {
  selectedColor: PaintColor | null;
  onSelectColor: (color: PaintColor) => void;
  onClear: () => void;
}

function ColorButton({
  color,
  selected,
  onPress,
}: {
  color: PaintColor;
  selected: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const def = COLOR_MAP[color];

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(1.2, { damping: 8 }, () => {
      scale.value = withSpring(1);
    });
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      accessibilityLabel={def.label}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={styles.btnWrapper}
    >
      <Animated.View
        style={[
          styles.colorBtn,
          { backgroundColor: def.hex },
          selected && styles.selectedRing,
          animStyle,
        ]}
      />
    </TouchableOpacity>
  );
}

export function ColorPalette({ selectedColor, onSelectColor, onClear }: Props) {
  return (
    <View style={styles.container}>
      {PAINT_COLORS.map((color) => (
        <ColorButton
          key={color}
          color={color}
          selected={selectedColor === color}
          onPress={() => onSelectColor(color)}
        />
      ))}
      <TouchableOpacity
        onPress={onClear}
        style={styles.btnWrapper}
        accessibilityLabel="Clear all"
        accessibilityRole="button"
      >
        <View style={styles.eraserBtn}>
          <Text style={styles.eraserText}>🧹</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: sizes.spacing.sm,
    paddingVertical: sizes.spacing.xs,
    gap: sizes.spacing.xs,
    backgroundColor: colors.card,
    borderTopWidth: 2,
    borderTopColor: colors.border,
    minHeight: 96,
  },
  btnWrapper: {
    width: sizes.colorBtn,
    height: sizes.colorBtn,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorBtn: {
    width: 52,
    height: 52,
    borderRadius: sizes.radius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedRing: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 6,
  },
  eraserBtn: {
    width: 52,
    height: 52,
    borderRadius: sizes.radius.full,
    backgroundColor: colors.zone.unpainted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.zone.outline,
  },
  eraserText: {
    fontSize: 24,
  },
});
