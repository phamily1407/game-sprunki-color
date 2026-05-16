import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
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
    scale.value = withSpring(1.15, { damping: 8 }, () => {
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
    paddingHorizontal: sizes.spacing.xs,
    paddingVertical: sizes.spacing.xs,
    gap: 4,
    backgroundColor: colors.card,
    borderTopWidth: 2,
    borderTopColor: colors.border,
    minHeight: 96,
  },
  btnWrapper: {
    width: sizes.touchMin,
    height: sizes.touchMin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // F-01: visible circle is now full 72px — children tap what they see
  colorBtn: {
    width: sizes.touchMin,
    height: sizes.touchMin,
    borderRadius: sizes.radius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedRing: {
    borderWidth: 4,
    borderColor: colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 6,
  },
  eraserBtn: {
    width: sizes.touchMin,
    height: sizes.touchMin,
    borderRadius: sizes.radius.full,
    backgroundColor: colors.zone.unpainted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.zone.outline,
  },
  eraserText: {
    fontSize: 28,
  },
});
