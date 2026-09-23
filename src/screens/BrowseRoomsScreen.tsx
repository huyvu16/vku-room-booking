import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRoomsQuery } from '../api/rooms';
import { FilterChip } from '../components/FilterChip';
import { RoomCard } from '../components/RoomCard';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import type { RootStackParamList } from '../navigation/types';
import { useBookingStore } from '../store/useBookingStore';
import { colors, radii } from '../theme';
import type { Room } from '../types';

type BrowseNavigation = NativeStackNavigationProp<RootStackParamList>;

export function BrowseRoomsScreen() {
  const navigation = useNavigation<BrowseNavigation>();
  const { data = [], isLoading, isError, refetch } = useRoomsQuery();
  const { columns, horizontalPadding, gap, cardWidth } = useResponsiveLayout();
  const filters = useBookingStore((state) => state.filters);
  const setQuery = useBookingStore((state) => state.setQuery);
  const toggleAvailable = useBookingStore((state) => state.toggleAvailable);
  const setMinCapacity = useBookingStore((state) => state.setMinCapacity);
  const setBuilding = useBookingStore((state) => state.setBuilding);
  const setFeature = useBookingStore((state) => state.setFeature);
  const clearFilters = useBookingStore((state) => state.clearFilters);

  const filteredRooms = useMemo(() => {
    const query = filters.query.trim().toLocaleLowerCase('vi-VN');
    return data.filter((room) => {
      const matchesQuery =
        !query ||
        [room.name, room.building, room.floor, ...room.features]
          .join(' ')
          .toLocaleLowerCase('vi-VN')
          .includes(query);
      const matchesAvailability = !filters.availableOnly || room.status === 'available';
      const matchesCapacity = room.capacity >= filters.minCapacity;
      const matchesBuilding = !filters.building || room.building.includes(filters.building);
      const matchesFeature = !filters.feature || room.features.includes(filters.feature);

      return (
        matchesQuery &&
        matchesAvailability &&
        matchesCapacity &&
        matchesBuilding &&
        matchesFeature
      );
    });
  }, [data, filters]);

  const activeFilterCount = [
    filters.availableOnly,
    filters.minCapacity > 0,
    Boolean(filters.building),
    Boolean(filters.feature),
  ].filter(Boolean).length;

  const openRoom = useCallback(
    (roomId: string) => navigation.navigate('RoomDetails', { roomId }),
    [navigation],
  );

  const renderRoom = useCallback(
    ({ item }: { item: Room }) => (
      <RoomCard onPress={openRoom} room={item} width={cardWidth} />
    ),
    [cardWidth, openRoom],
  );

  const listHeader = (
    <View>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.eyebrow}>VKU · ĐẶT PHÒNG HỌC</Text>
          <Text style={styles.greeting}>Chào buổi học tốt lành 👋</Text>
        </View>
        <Pressable accessibilityLabel="Thông báo" style={styles.iconButton}>
          <Ionicons color={colors.ink} name="notifications-outline" size={21} />
          <View style={styles.notificationDot} />
        </Pressable>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroLabel}>HỌC TẬP THEO CÁCH CỦA BẠN</Text>
          <Text style={styles.heroTitle}>Tìm một không gian để cùng tiến bộ.</Text>
          <Text style={styles.heroCaption}>
            Phòng học, lab và khu thảo luận - sẵn sàng chỉ trong vài chạm.
          </Text>
        </View>
        <View style={styles.heroMark}>
          <Ionicons color={colors.mintStrong} name="book-outline" size={42} />
        </View>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons color={colors.inkSoft} name="search" size={20} />
          <TextInput
            accessibilityLabel="Tìm kiếm phòng"
            autoCapitalize="none"
            onChangeText={setQuery}
            placeholder="Tìm tên phòng, tòa nhà, tiện ích..."
            placeholderTextColor="#819089"
            returnKeyType="search"
            style={styles.searchInput}
            value={filters.query}
          />
          {filters.query ? (
            <Pressable accessibilityLabel="Xóa từ khóa" hitSlop={10} onPress={() => setQuery('')}>
              <Ionicons color={colors.inkSoft} name="close-circle" size={19} />
            </Pressable>
          ) : null}
        </View>
        <View style={styles.filterSummary}>
          <Ionicons color={colors.white} name="options-outline" size={20} />
          {activeFilterCount > 0 ? (
            <View style={styles.filterCount}>
              <Text style={styles.filterCountText}>{activeFilterCount}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.chips}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <FilterChip
          icon="flash-outline"
          label="Đang trống"
          onPress={toggleAvailable}
          selected={filters.availableOnly}
        />
        <FilterChip
          icon="people-outline"
          label="20+ chỗ"
          onPress={() => setMinCapacity(20)}
          selected={filters.minCapacity === 20}
        />
        <FilterChip
          icon="people-outline"
          label="40+ chỗ"
          onPress={() => setMinCapacity(40)}
          selected={filters.minCapacity === 40}
        />
        <FilterChip
          icon="business-outline"
          label="Tòa A3"
          onPress={() => setBuilding('A3')}
          selected={filters.building === 'A3'}
        />
        <FilterChip
          icon="library-outline"
          label="Thư viện"
          onPress={() => setBuilding('Thư viện')}
          selected={filters.building === 'Thư viện'}
        />
        <FilterChip
          icon="easel-outline"
          label="Máy chiếu"
          onPress={() => setFeature('Máy chiếu')}
          selected={filters.feature === 'Máy chiếu'}
        />
        <FilterChip
          icon="volume-mute-outline"
          label="Yên tĩnh"
          onPress={() => setFeature('Yên tĩnh')}
          selected={filters.feature === 'Yên tĩnh'}
        />
      </ScrollView>

      <View style={styles.sectionHeading}>
        <View>
          <Text style={styles.sectionTitle}>Không gian dành cho bạn</Text>
          <Text style={styles.resultCount}>{filteredRooms.length} phòng phù hợp</Text>
        </View>
        {activeFilterCount > 0 ? (
          <Pressable accessibilityRole="button" onPress={clearFilters}>
            <Text style={styles.clearText}>Xóa bộ lọc</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.centered}>
        <ActivityIndicator color={colors.forest} size="large" />
        <Text style={styles.stateText}>Đang tìm phòng phù hợp...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.centered}>
        <Ionicons color={colors.red} name="cloud-offline-outline" size={38} />
        <Text style={styles.stateTitle}>Chưa tải được danh sách phòng</Text>
        <Pressable onPress={() => void refetch()} style={styles.retryButton}>
          <Text style={styles.retryText}>Thử lại</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <FlatList
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons color={colors.inkSoft} name="search-outline" size={36} />
            <Text style={styles.stateTitle}>Không tìm thấy phòng phù hợp</Text>
            <Text style={styles.stateText}>Hãy thử bỏ bớt bộ lọc hoặc đổi từ khóa.</Text>
          </View>
        }
        ListHeaderComponent={listHeader}
        columnWrapperStyle={columns > 1 ? { gap } : undefined}
        contentContainerStyle={{ paddingHorizontal: horizontalPadding, paddingBottom: 28 }}
        data={filteredRooms}
        initialNumToRender={8}
        ItemSeparatorComponent={() => <View style={{ height: gap }} />}
        key={columns}
        keyExtractor={(item) => item.id}
        maxToRenderPerBatch={6}
        numColumns={columns}
        removeClippedSubviews
        renderItem={renderRoom}
        showsVerticalScrollIndicator={false}
        updateCellsBatchingPeriod={40}
        windowSize={5}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
    backgroundColor: colors.cream,
  },
  topBar: {
    paddingTop: 10,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: colors.forestSoft,
    fontSize: 11,
    letterSpacing: 1.1,
    fontWeight: '800',
  },
  greeting: {
    marginTop: 4,
    color: colors.ink,
    fontSize: 18,
    fontWeight: '800',
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  notificationDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.amber,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  hero: {
    minHeight: 188,
    borderRadius: 28,
    padding: 22,
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: colors.forest,
  },
  heroCopy: {
    flex: 1,
    zIndex: 1,
  },
  heroLabel: {
    color: colors.mintStrong,
    fontSize: 10,
    letterSpacing: 1.2,
    fontWeight: '800',
  },
  heroTitle: {
    maxWidth: 360,
    marginTop: 11,
    color: colors.white,
    fontSize: 27,
    lineHeight: 33,
    fontWeight: '900',
  },
  heroCaption: {
    maxWidth: 380,
    marginTop: 10,
    color: '#D6E6DF',
    fontSize: 13,
    lineHeight: 19,
  },
  heroMark: {
    position: 'absolute',
    right: -18,
    bottom: -22,
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  searchRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 10,
  },
  searchBox: {
    flex: 1,
    height: 52,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  searchInput: {
    flex: 1,
    color: colors.ink,
    fontSize: 14,
    paddingVertical: 0,
  },
  filterSummary: {
    width: 52,
    height: 52,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.forest,
  },
  filterCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 19,
    height: 19,
    paddingHorizontal: 4,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.amber,
    borderWidth: 2,
    borderColor: colors.cream,
  },
  filterCountText: {
    color: colors.ink,
    fontSize: 10,
    fontWeight: '900',
  },
  chips: {
    paddingTop: 12,
    paddingBottom: 4,
  },
  sectionHeading: {
    marginTop: 22,
    marginBottom: 13,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  resultCount: {
    marginTop: 4,
    color: colors.inkSoft,
    fontSize: 12,
  },
  clearText: {
    color: colors.forestSoft,
    fontSize: 12,
    fontWeight: '800',
  },
  empty: {
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  stateTitle: {
    color: colors.ink,
    fontSize: 17,
    textAlign: 'center',
    fontWeight: '800',
  },
  stateText: {
    color: colors.inkSoft,
    fontSize: 13,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.forest,
    paddingHorizontal: 20,
    paddingVertical: 11,
  },
  retryText: {
    color: colors.white,
    fontWeight: '800',
  },
});
