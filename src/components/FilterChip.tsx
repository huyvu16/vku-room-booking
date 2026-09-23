import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii } from '../theme';

interface FilterChipProps {
  label: string;
  selected: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export function FilterChip({ label, selected, icon, onPress }: FilterChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && styles.chipPressed,
      ]}
    >
      <View style={styles.content}>
        {icon ? (
          <Ionicons
            color={selected ? colors.white : colors.inkSoft}
            name={icon}
            size={15}
          />
        ) : null}
        <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
        {selected ? <Ionicons color={colors.white} name="checkmark" size={14} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.pill,
    backgroundColor: colors.white,
    paddingHorizontal: 13,
    paddingVertical: 9,
    marginRight: 8,
  },
  chipSelected: {
    borderColor: colors.forest,
    backgroundColor: colors.forest,
  },
  chipPressed: {
    opacity: 0.72,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    color: colors.inkSoft,
    fontSize: 13,
    fontWeight: '600',
  },
  labelSelected: {
    color: colors.white,
  },
});
