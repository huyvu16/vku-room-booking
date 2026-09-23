import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRoomsQuery } from '../api/rooms';
import { TIME_SLOTS } from '../data/rooms';
import type { RootStackParamList } from '../navigation/types';
import { useBookingStore } from '../store/useBookingStore';
import { colors, radii } from '../theme';
import type { TimeSlot } from '../types';
import { dateFromOffset, dateKey } from '../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'RoomDetails'>;

export function RoomDetailsScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { data = [], isLoading } = useRoomsQuery();
  const room = data.find((item) => item.id === route.params.roomId);
  const [selectedDayOffset, setSelectedDayOffset] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const hasConflict = useBookingStore((state) => state.hasConflict);
  const bookRoom = useBookingStore((state) => state.bookRoom);

  const days = useMemo(
    () =>
      Array.from({ length: 5 }, (_, offset) => {
        const date = dateFromOffset(offset);
        return {
          offset,
          key: dateKey(date),
          weekday:
            offset === 0
              ? 'Hôm nay'
              : new Intl.DateTimeFormat('vi-VN', { weekday: 'short' }).format(date),
          day: new Intl.DateTimeFormat('vi-VN', { day: '2-digit' }).format(date),
          month: new Intl.DateTimeFormat('vi-VN', { month: 'short' }).format(date),
        };
      }),
    [],
  );

  const selectedDate = days[selectedDayOffset]?.key ?? days[0]!.key;

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.forest} size="large" />
      </View>
    );
  }

  if (!room) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.notFoundTitle}>Không tìm thấy phòng</Text>
        <Pressable onPress={() => navigation.goBack()} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Quay lại</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const roomUnavailableSlots = room.unavailableSlotsByDay[selectedDayOffset] ?? [];

  const selectDay = (offset: number) => {
    setSelectedDayOffset(offset);
    setSelectedSlot(null);
  };

  const confirmBooking = () => {
    if (!selectedSlot) return;

    if (roomUnavailableSlots.includes(selectedSlot.id)) {
      Alert.alert('Khung giờ vừa được đặt', 'Vui lòng chọn một khung giờ còn trống khác.');
      setSelectedSlot(null);
      return;
    }

    const result = bookRoom({
      roomId: room.id,
      roomName: room.name,
      building: room.building,
      date: selectedDate,
      slot: selectedSlot,
    });

    if (!result.ok || !result.booking) {
      Alert.alert('Trùng lịch', result.reason ?? 'Không thể tạo lịch đặt này.');
      return;
    }

    navigation.replace('BookingSuccess', { booking: result.booking });
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.cover, { paddingTop: insets.top }]}>
          {imageFailed ? (
            <View style={styles.coverFallback}>
              <Ionicons color={colors.forestSoft} name="library-outline" size={60} />
            </View>
          ) : (
            <Image
              onError={() => setImageFailed(true)}
              resizeMode="cover"
              source={{ uri: room.imageUrl }}
              style={styles.coverImage}
            />
          )}
          <View style={styles.coverShade} />
          <Pressable
            accessibilityLabel="Quay lại"
            hitSlop={10}
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { top: insets.top + 10 }]}
          >
            <Ionicons color={colors.ink} name="arrow-back" size={22} />
          </Pressable>
          <View style={styles.coverBadge}>
            <Ionicons color={colors.forest} name="navigate-outline" size={15} />
            <Text style={styles.coverBadgeText}>{room.distance}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.roomName}>{room.name}</Text>
          <View style={styles.locationLine}>
            <Ionicons color={colors.inkSoft} name="location-outline" size={17} />
            <Text style={styles.locationText}>
              {room.building} · {room.floor}
            </Text>
          </View>

          <View style={styles.quickFacts}>
            <View style={styles.fact}>
              <Ionicons color={colors.forest} name="people-outline" size={21} />
              <Text style={styles.factValue}>{room.capacity}</Text>
              <Text style={styles.factLabel}>chỗ ngồi</Text>
            </View>
            <View style={styles.factDivider} />
            <View style={styles.fact}>
              <Ionicons color={colors.forest} name="wifi-outline" size={21} />
              <Text style={styles.factValue}>Wi-Fi</Text>
              <Text style={styles.factLabel}>tốc độ cao</Text>
            </View>
            <View style={styles.factDivider} />
            <View style={styles.fact}>
              <Ionicons color={colors.forest} name="shield-checkmark-outline" size={21} />
              <Text style={styles.factValue}>Miễn phí</Text>
              <Text style={styles.factLabel}>cho sinh viên</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Về không gian này</Text>
            <Text style={styles.description}>{room.description}</Text>
            <View style={styles.amenities}>
              {room.features.map((feature) => (
                <View key={feature} style={styles.amenity}>
                  <Ionicons color={colors.forestSoft} name="checkmark-circle" size={17} />
                  <Text style={styles.amenityText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Chọn ngày</Text>
              <Text style={styles.stepHint}>Bước 1/2</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.daysRow}>
                {days.map((day) => {
                  const selected = day.offset === selectedDayOffset;
                  return (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      key={day.key}
                      onPress={() => selectDay(day.offset)}
                      style={[styles.dayCard, selected && styles.dayCardSelected]}
                    >
                      <Text style={[styles.dayWeekday, selected && styles.dayTextSelected]}>
                        {day.weekday}
                      </Text>
                      <Text style={[styles.dayNumber, selected && styles.dayTextSelected]}>
                        {day.day}
                      </Text>
                      <Text style={[styles.dayMonth, selected && styles.dayTextSelected]}>
                        {day.month}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Chọn khung giờ</Text>
              <Text style={styles.stepHint}>Bước 2/2</Text>
            </View>
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.white }]} />
                <Text style={styles.legendText}>Còn trống</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.forest }]} />
                <Text style={styles.legendText}>Đã chọn</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.line }]} />
                <Text style={styles.legendText}>Không khả dụng</Text>
              </View>
            </View>
            <View style={styles.slotsGrid}>
              {TIME_SLOTS.map((slot) => {
                const occupiedByRoom = roomUnavailableSlots.includes(slot.id);
                const conflictsWithUser = hasConflict(selectedDate, slot.id);
                const disabled = occupiedByRoom || conflictsWithUser;
                const selected = selectedSlot?.id === slot.id;
                return (
                  <Pressable
                    accessibilityHint={
                      conflictsWithUser
                        ? 'Bạn đã có lịch khác vào giờ này'
                        : occupiedByRoom
                          ? 'Phòng đã được đặt'
                          : 'Chọn khung giờ'
                    }
                    accessibilityRole="button"
                    accessibilityState={{ disabled, selected }}
                    disabled={disabled}
                    key={slot.id}
                    onPress={() => setSelectedSlot(slot)}
                    style={[
                      styles.slot,
                      selected && styles.slotSelected,
                      disabled && styles.slotDisabled,
                    ]}
                  >
                    <Text style={[styles.slotPeriod, selected && styles.slotTextSelected]}>
                      {slot.period}
                    </Text>
                    <Text
                      style={[
                        styles.slotTime,
                        selected && styles.slotTextSelected,
                        disabled && styles.slotTextDisabled,
                      ]}
                    >
                      {slot.start}
                    </Text>
                    <Text
                      style={[
                        styles.slotEnd,
                        selected && styles.slotTextSelected,
                        disabled && styles.slotTextDisabled,
                      ]}
                    >
                      đến {slot.end}
                    </Text>
                    {conflictsWithUser ? (
                      <View style={styles.conflictFlag}>
                        <Ionicons color={colors.red} name="alert-circle" size={12} />
                        <Text style={styles.conflictText}>Trùng lịch</Text>
                      </View>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <View style={styles.selectionSummary}>
          <Text style={styles.selectionLabel}>Lịch đã chọn</Text>
          <Text numberOfLines={1} style={styles.selectionValue}>
            {selectedSlot
              ? `${selectedSlot.start}-${selectedSlot.end} · ${days[selectedDayOffset]?.weekday}`
              : 'Chưa chọn khung giờ'}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          disabled={!selectedSlot}
          onPress={confirmBooking}
          style={({ pressed }) => [
            styles.bookButton,
            !selectedSlot && styles.bookButtonDisabled,
            pressed && selectedSlot ? styles.bookButtonPressed : null,
          ]}
        >
          <Text style={styles.bookButtonText}>Đặt phòng</Text>
          <Ionicons color={colors.white} name="arrow-forward" size={18} />
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    backgroundColor: colors.cream,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  cover: {
    height: 276,
    backgroundColor: colors.mint,
  },
  coverImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  coverFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverShade: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(12, 29, 23, 0.16)',
  },
  backButton: {
    position: 'absolute',
    left: 18,
    width: 43,
    height: 43,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
  coverBadge: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: radii.pill,
    paddingHorizontal: 11,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
  coverBadgeText: {
    color: colors.forest,
    fontSize: 12,
    fontWeight: '800',
  },
  content: {
    marginTop: -18,
    paddingHorizontal: 20,
    paddingTop: 24,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    backgroundColor: colors.cream,
  },
  roomName: {
    color: colors.ink,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '900',
  },
  locationLine: {
    marginTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  locationText: {
    color: colors.inkSoft,
    fontSize: 14,
  },
  quickFacts: {
    marginTop: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  fact: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  factDivider: {
    width: 1,
    height: 38,
    backgroundColor: colors.line,
  },
  factValue: {
    marginTop: 3,
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800',
  },
  factLabel: {
    color: colors.inkSoft,
    fontSize: 10,
  },
  section: {
    marginTop: 27,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 19,
    fontWeight: '900',
  },
  stepHint: {
    color: colors.inkSoft,
    fontSize: 11,
    fontWeight: '700',
  },
  description: {
    marginTop: 9,
    color: colors.inkSoft,
    fontSize: 14,
    lineHeight: 21,
  },
  amenities: {
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: radii.pill,
    backgroundColor: colors.mint,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  amenityText: {
    color: colors.forest,
    fontSize: 12,
    fontWeight: '700',
  },
  daysRow: {
    marginTop: 13,
    flexDirection: 'row',
    gap: 9,
    paddingRight: 20,
  },
  dayCard: {
    width: 76,
    height: 92,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  dayCardSelected: {
    borderColor: colors.forest,
    backgroundColor: colors.forest,
  },
  dayWeekday: {
    color: colors.inkSoft,
    fontSize: 11,
    fontWeight: '700',
  },
  dayNumber: {
    marginVertical: 3,
    color: colors.ink,
    fontSize: 23,
    fontWeight: '900',
  },
  dayMonth: {
    color: colors.inkSoft,
    fontSize: 10,
  },
  dayTextSelected: {
    color: colors.white,
  },
  legend: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.line,
  },
  legendText: {
    color: colors.inkSoft,
    fontSize: 10,
  },
  slotsGrid: {
    marginTop: 13,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  slot: {
    width: '31%',
    minHeight: 94,
    padding: 11,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  slotSelected: {
    borderColor: colors.forest,
    backgroundColor: colors.forest,
  },
  slotDisabled: {
    backgroundColor: '#EBEEEC',
    borderColor: '#E1E5E2',
  },
  slotPeriod: {
    color: colors.inkSoft,
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  slotTime: {
    marginTop: 5,
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  slotEnd: {
    marginTop: 1,
    color: colors.inkSoft,
    fontSize: 9,
  },
  slotTextSelected: {
    color: colors.white,
  },
  slotTextDisabled: {
    color: '#A2ACA7',
  },
  conflictFlag: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  conflictText: {
    color: colors.red,
    fontSize: 8,
    fontWeight: '800',
  },
  bottomBar: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    minHeight: 82,
    paddingHorizontal: 20,
    paddingTop: 13,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.white,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
  },
  selectionSummary: {
    flex: 1,
  },
  selectionLabel: {
    color: colors.inkSoft,
    fontSize: 10,
  },
  selectionValue: {
    marginTop: 3,
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800',
  },
  bookButton: {
    height: 49,
    minWidth: 142,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderRadius: radii.md,
    backgroundColor: colors.forest,
  },
  bookButtonDisabled: {
    backgroundColor: '#9EAAA5',
  },
  bookButtonPressed: {
    opacity: 0.78,
  },
  bookButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '900',
  },
  notFoundTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  secondaryButton: {
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.forest,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: colors.forest,
    fontWeight: '800',
  },
});
