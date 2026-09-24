import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useBookingStore } from '../store/useBookingStore';
import { colors, radii } from '../theme';

const menuItems = [
  { icon: 'notifications-outline', label: 'Nhắc lịch', detail: 'Trước 15 phút' },
  { icon: 'shield-checkmark-outline', label: 'Quy định sử dụng', detail: 'Xem nội quy' },
  { icon: 'help-circle-outline', label: 'Trợ giúp', detail: 'FAQ & liên hệ' },
] as const;

export function ProfileScreen() {
  const bookingCount = useBookingStore((state) => state.bookings.length);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>HỒ SƠ SINH VIÊN</Text>
        <Text style={styles.heading}>Tài khoản</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>HV</Text>
          </View>
          <View style={styles.profileCopy}>
            <Text style={styles.name}>Nguyễn Huy Vũ</Text>
            <Text style={styles.studentId}>Mã SV: 23IT317</Text>
          </View>
          <View style={styles.verified}>
            <Ionicons color={colors.forest} name="checkmark-circle" size={18} />
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{bookingCount}</Text>
            <Text style={styles.statLabel}>Lịch sắp tới</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Giờ học tháng này</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.9</Text>
            <Text style={styles.statLabel}>Điểm uy tín</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Thiết lập</Text>
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <Pressable
              accessibilityRole="button"
              key={item.label}
              style={({ pressed }) => [
                styles.menuRow,
                index < menuItems.length - 1 && styles.menuBorder,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.menuIcon}>
                <Ionicons color={colors.forest} name={item.icon} size={20} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuDetail}>{item.detail}</Text>
              <Ionicons color={colors.inkSoft} name="chevron-forward" size={18} />
            </Pressable>
          ))}
        </View>

        <View style={styles.tipCard}>
          <Ionicons color={colors.amber} name="bulb-outline" size={24} />
          <View style={styles.tipCopy}>
            <Text style={styles.tipTitle}>Mẹo nhỏ</Text>
            <Text style={styles.tipText}>
              Hủy trước giờ bắt đầu ít nhất 30 phút để duy trì điểm uy tín của bạn.
            </Text>
          </View>
        </View>

        <Text style={styles.version}>VKU Room Booking · Phiên bản 1.1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 17,
    paddingBottom: 34,
  },
  eyebrow: {
    color: colors.forestSoft,
    fontSize: 11,
    letterSpacing: 1.1,
    fontWeight: '900',
  },
  heading: {
    marginTop: 5,
    color: colors.ink,
    fontSize: 28,
    fontWeight: '900',
  },
  profileCard: {
    marginTop: 22,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.lg,
    backgroundColor: colors.forest,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mintStrong,
  },
  avatarText: {
    color: colors.forest,
    fontSize: 19,
    fontWeight: '900',
  },
  profileCopy: {
    flex: 1,
    marginLeft: 13,
  },
  name: {
    color: colors.white,
    fontSize: 19,
    fontWeight: '900',
  },
  studentId: {
    marginTop: 4,
    color: '#C9DDD4',
    fontSize: 12,
  },
  verified: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  stats: {
    marginTop: 13,
    paddingVertical: 17,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.md,
    backgroundColor: colors.white,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 33,
    backgroundColor: colors.line,
  },
  statValue: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  statLabel: {
    marginTop: 3,
    color: colors.inkSoft,
    fontSize: 9,
    textAlign: 'center',
  },
  sectionTitle: {
    marginTop: 27,
    marginBottom: 11,
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  menuCard: {
    borderRadius: radii.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  menuRow: {
    minHeight: 64,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mint,
  },
  menuLabel: {
    flex: 1,
    marginLeft: 11,
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
  },
  menuDetail: {
    marginRight: 4,
    color: colors.inkSoft,
    fontSize: 10,
  },
  pressed: {
    opacity: 0.65,
  },
  tipCard: {
    marginTop: 19,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
    borderRadius: radii.md,
    backgroundColor: colors.amberSoft,
  },
  tipCopy: {
    flex: 1,
  },
  tipTitle: {
    color: '#704508',
    fontSize: 13,
    fontWeight: '900',
  },
  tipText: {
    marginTop: 3,
    color: '#8A641F',
    fontSize: 11,
    lineHeight: 16,
  },
  version: {
    marginTop: 27,
    color: colors.inkSoft,
    fontSize: 10,
    textAlign: 'center',
  },
});
