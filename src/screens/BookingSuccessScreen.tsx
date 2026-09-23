import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../navigation/types';
import { colors, radii } from '../theme';
import { formatBookingDate } from '../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'BookingSuccess'>;

export function BookingSuccessScreen({ navigation, route }: Props) {
  const { booking } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Ionicons color={colors.forest} name="checkmark" size={46} />
        </View>
        <Text style={styles.eyebrow}>ĐẶT PHÒNG THÀNH CÔNG</Text>
        <Text style={styles.title}>Không gian của bạn đã sẵn sàng.</Text>
        <Text style={styles.subtitle}>
          Hãy đến đúng giờ và giữ không gian thật tuyệt cho người dùng tiếp theo nhé.
        </Text>

        <View style={styles.ticket}>
          <View style={styles.ticketTop}>
            <View>
              <Text style={styles.ticketLabel}>MÃ ĐẶT PHÒNG</Text>
              <Text style={styles.ticketCode}>{booking.id}</Text>
            </View>
            <Ionicons color={colors.mintStrong} name="qr-code-outline" size={46} />
          </View>
          <View style={styles.dashedLine} />
          <View style={styles.ticketRow}>
            <Ionicons color={colors.forestSoft} name="business-outline" size={20} />
            <View style={styles.ticketCopy}>
              <Text style={styles.ticketLabel}>PHÒNG</Text>
              <Text style={styles.ticketValue}>{booking.roomName}</Text>
              <Text style={styles.ticketMeta}>{booking.building}</Text>
            </View>
          </View>
          <View style={styles.ticketRow}>
            <Ionicons color={colors.forestSoft} name="calendar-outline" size={20} />
            <View style={styles.ticketCopy}>
              <Text style={styles.ticketLabel}>THỜI GIAN</Text>
              <Text style={styles.ticketValue}>{formatBookingDate(booking.date)}</Text>
              <Text style={styles.ticketMeta}>
                {booking.slot.start} - {booking.slot.end}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={() => navigation.popTo('MainTabs')}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
        >
          <Text style={styles.primaryButtonText}>Về trang chủ</Text>
          <Ionicons color={colors.white} name="home-outline" size={18} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  successIcon: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mint,
    borderWidth: 8,
    borderColor: '#EDF8F3',
  },
  eyebrow: {
    marginTop: 23,
    color: colors.forestSoft,
    fontSize: 11,
    letterSpacing: 1.2,
    fontWeight: '900',
  },
  title: {
    maxWidth: 340,
    marginTop: 9,
    color: colors.ink,
    fontSize: 27,
    lineHeight: 33,
    textAlign: 'center',
    fontWeight: '900',
  },
  subtitle: {
    maxWidth: 350,
    marginTop: 10,
    color: colors.inkSoft,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  ticket: {
    width: '100%',
    maxWidth: 480,
    marginTop: 29,
    borderRadius: radii.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  ticketTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ticketLabel: {
    color: colors.inkSoft,
    fontSize: 9,
    letterSpacing: 0.8,
    fontWeight: '800',
  },
  ticketCode: {
    marginTop: 4,
    color: colors.ink,
    fontSize: 21,
    letterSpacing: 1,
    fontWeight: '900',
  },
  dashedLine: {
    marginVertical: 18,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.line,
  },
  ticketRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 18,
  },
  ticketCopy: {
    flex: 1,
  },
  ticketValue: {
    marginTop: 4,
    color: colors.ink,
    fontSize: 15,
    fontWeight: '800',
  },
  ticketMeta: {
    marginTop: 3,
    color: colors.inkSoft,
    fontSize: 12,
  },
  actions: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  primaryButton: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: radii.md,
    backgroundColor: colors.forest,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.78,
  },
});
