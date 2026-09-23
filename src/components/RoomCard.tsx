import { Ionicons } from '@expo/vector-icons';
import { memo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii } from '../theme';
import type { Room } from '../types';

interface RoomCardProps {
  room: Room;
  width: number;
  onPress: (roomId: string) => void;
}

const statusCopy = {
  available: { label: 'Còn chỗ', color: colors.forest, background: colors.mint },
  limited: { label: 'Sắp đầy', color: '#995D09', background: colors.amberSoft },
  occupied: { label: 'Đã kín', color: colors.red, background: colors.redSoft },
} as const;

function RoomCardComponent({ room, width, onPress }: RoomCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const status = statusCopy[room.status];

  return (
    <Pressable
      accessibilityHint="Mở chi tiết và chọn lịch đặt phòng"
      accessibilityLabel={`${room.name}, ${room.capacity} chỗ, ${status.label}`}
      accessibilityRole="button"
      onPress={() => onPress(room.id)}
      style={({ pressed }) => [styles.card, { width }, pressed && styles.cardPressed]}
    >
      <View style={styles.imageWrap}>
        {imageFailed ? (
          <View style={styles.imageFallback}>
            <Ionicons color={colors.forestSoft} name="library-outline" size={38} />
          </View>
        ) : (
          <Image
            accessibilityIgnoresInvertColors
            onError={() => setImageFailed(true)}
            resizeMode="cover"
            source={{ uri: room.imageUrl }}
            style={styles.image}
          />
        )}
        <View style={[styles.status, { backgroundColor: status.background }]}>
          <View style={[styles.statusDot, { backgroundColor: status.color }]} />
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <View style={styles.titleCopy}>
            <Text numberOfLines={1} style={styles.title}>
              {room.name}
            </Text>
            <View style={styles.metaLine}>
              <Ionicons color={colors.inkSoft} name="location-outline" size={14} />
              <Text style={styles.metaText}>
                {room.building} · {room.floor}
              </Text>
            </View>
          </View>
          <View style={styles.capacity}>
            <Ionicons color={colors.forest} name="people-outline" size={16} />
            <Text style={styles.capacityText}>{room.capacity}</Text>
          </View>
        </View>

        <View style={styles.features}>
          {room.features.slice(0, 2).map((feature) => (
            <View key={feature} style={styles.featurePill}>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <View style={styles.walking}>
            <Ionicons color={colors.inkSoft} name="walk-outline" size={16} />
            <Text style={styles.walkingText}>{room.distance}</Text>
          </View>
          <View style={styles.cta}>
            <Text style={styles.ctaText}>Xem lịch</Text>
            <Ionicons color={colors.white} name="arrow-forward" size={15} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export const RoomCard = memo(RoomCardComponent);

const styles = StyleSheet.create({
  card: {
    height: 318,
    borderRadius: radii.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  imageWrap: {
    height: 132,
    backgroundColor: colors.mint,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mint,
  },
  status: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  body: {
    flex: 1,
    padding: 15,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  titleCopy: {
    flex: 1,
  },
  title: {
    color: colors.ink,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
  },
  metaLine: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: colors.inkSoft,
    fontSize: 12,
  },
  capacity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: radii.sm,
    backgroundColor: colors.mint,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  capacityText: {
    color: colors.forest,
    fontSize: 12,
    fontWeight: '800',
  },
  features: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 13,
  },
  featurePill: {
    borderRadius: radii.pill,
    backgroundColor: colors.cream,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  featureText: {
    color: colors.inkSoft,
    fontSize: 11,
    fontWeight: '600',
  },
  footer: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  walking: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  walkingText: {
    color: colors.inkSoft,
    fontSize: 11,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.forest,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  ctaText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
});
