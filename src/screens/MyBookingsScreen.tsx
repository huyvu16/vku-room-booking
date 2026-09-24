import { Ionicons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';

import { useBookingStore } from '../store/useBookingStore';
import { colors, radii } from '../theme';
import type { Booking } from '../types';
import { formatBookingDate } from '../utils/date';

function BookingCard({ booking, onCancel }: { booking: Booking; onCancel: (id: string) => void }) {
  const translateX = useSharedValue(0);
  const pan = Gesture.Pan()
    .activeOffsetX(-12)
    .failOffsetY([-12, 12])
    .onUpdate((event) => {
      translateX.value = Math.min(0, event.translationX);
    })
    .onEnd((event) => {
      if (event.translationX < -120) runOnJS(onCancel)(booking.id);
      translateX.value = withSpring(0);
    });
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.card, animatedStyle]}>
      <View style={styles.dateRail}>
        <Text style={styles.dateDay}>{booking.date.slice(-2)}</Text>
        <Text style={styles.dateMonth}>THÁNG {Number(booking.date.slice(5, 7))}</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <View style={styles.confirmedBadge}>
            <View style={styles.confirmedDot} />
            <Text style={styles.confirmedText}>Đã xác nhận</Text>
          </View>
          <Text style={styles.code}>{booking.id}</Text>
        </View>
        <Text style={styles.roomName}>{booking.roomName}</Text>
        <View style={styles.metaLine}>
          <Ionicons color={colors.inkSoft} name="location-outline" size={15} />
          <Text style={styles.metaText}>{booking.building}</Text>
        </View>
        <View style={styles.timeBox}>
          <Ionicons color={colors.forest} name="time-outline" size={19} />
          <View>
            <Text style={styles.timeValue}>
              {booking.slot.start} - {booking.slot.end}
            </Text>
            <Text style={styles.fullDate}>{formatBookingDate(booking.date)}</Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => onCancel(booking.id)}
          style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}
        >
          <Text style={styles.cancelText}>Hủy lịch đặt</Text>
        </Pressable>
      </View>
      </Animated.View>
    </GestureDetector>
  );
}

export function MyBookingsScreen() {
  const bookings = useBookingStore((state) => state.bookings);
  const cancelBooking = useBookingStore((state) => state.cancelBooking);

  const requestCancel = (id: string) => {
    Alert.alert(
      'Hủy lịch đặt?',
      'Khung giờ này sẽ được trả lại cho người dùng khác.',
      [
        { text: 'Giữ lịch', style: 'cancel' },
        { text: 'Hủy lịch', style: 'destructive', onPress: () => cancelBooking(id) },
      ],
    );
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <FlatList
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons color={colors.forest} name="calendar-outline" size={38} />
            </View>
            <Text style={styles.emptyTitle}>Chưa có lịch đặt nào</Text>
            <Text style={styles.emptyText}>
              Chọn một phòng phù hợp và lịch của bạn sẽ xuất hiện tại đây.
            </Text>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>LỊCH HỌC CỦA BẠN</Text>
            <Text style={styles.title}>Phòng đã đặt</Text>
            <Text style={styles.subtitle}>
              {bookings.length > 0
                ? `${bookings.length} lịch sắp tới · Vuốt thẻ sang trái hoặc chạm Hủy lịch đặt để hủy.`
                : 'Mọi kế hoạch học tập trong một nơi.'}
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        data={[...bookings].sort((a, b) =>
          `${a.date}${a.slot.start}`.localeCompare(`${b.date}${b.slot.start}`),
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BookingCard booking={item} onCancel={requestCancel} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 28,
  },
  header: {
    paddingTop: 17,
    paddingBottom: 22,
  },
  eyebrow: {
    color: colors.forestSoft,
    fontSize: 11,
    letterSpacing: 1.1,
    fontWeight: '900',
  },
  title: {
    marginTop: 5,
    color: colors.ink,
    fontSize: 28,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 7,
    color: colors.inkSoft,
    fontSize: 13,
    lineHeight: 19,
  },
  separator: {
    height: 14,
  },
  card: {
    flexDirection: 'row',
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  dateRail: {
    width: 72,
    paddingTop: 22,
    alignItems: 'center',
    backgroundColor: colors.forest,
  },
  dateDay: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '900',
  },
  dateMonth: {
    marginTop: 1,
    color: colors.mintStrong,
    fontSize: 8,
    fontWeight: '800',
  },
  cardBody: {
    flex: 1,
    padding: 16,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  confirmedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: colors.mint,
  },
  confirmedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.forest,
  },
  confirmedText: {
    color: colors.forest,
    fontSize: 9,
    fontWeight: '800',
  },
  code: {
    color: colors.inkSoft,
    fontSize: 9,
    fontWeight: '700',
  },
  roomName: {
    marginTop: 13,
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
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
  timeBox: {
    marginTop: 15,
    padding: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    borderRadius: radii.sm,
    backgroundColor: colors.cream,
  },
  timeValue: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800',
  },
  fullDate: {
    marginTop: 2,
    color: colors.inkSoft,
    fontSize: 10,
  },
  cancelButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingVertical: 4,
  },
  cancelText: {
    color: colors.red,
    fontSize: 11,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.62,
  },
  empty: {
    minHeight: 430,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  emptyIcon: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mint,
  },
  emptyTitle: {
    marginTop: 17,
    color: colors.ink,
    fontSize: 19,
    fontWeight: '900',
  },
  emptyText: {
    maxWidth: 310,
    marginTop: 7,
    color: colors.inkSoft,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
});
