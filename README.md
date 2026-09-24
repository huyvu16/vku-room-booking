<div align="center">
  <img src="./assets/app-icon.png" alt="VKU Room Booking" width="112" />
  <h1>VKU Room Booking</h1>
  <p>Ứng dụng đa nền tảng để tìm và đặt phòng học, phòng lab trong khuôn viên VKU.</p>

  [Live demo](https://huyvu16.github.io/vku-room-booking/) · [GitHub repository](https://github.com/huyvu16/vku-room-booking)
</div>

## Chức năng

- Tìm kiếm theo tên phòng, tòa nhà, tầng và tiện ích.
- Lọc đồng thời theo trạng thái, sức chứa, tòa nhà và thiết bị.
- `FlatList` responsive với 24 phòng mẫu và thiết lập tối ưu render.
- Chọn ngày, khung giờ và ngăn đặt trùng lịch.
- Luồng xác nhận, danh sách lịch đã đặt và hủy lịch.
- Lưu lịch đặt trên thiết bị, giữ booking qua các lần mở app.
- Kéo xuống để tải lại danh sách; room card có animation vào màn hình.
- Vuốt thẻ lịch đã đặt sang trái để bắt đầu thao tác hủy.
- Bottom Tabs: Khám phá, Lịch của tôi và Tài khoản.
- Safe area, giao diện tablet và xoay màn hình.
- Bản web PWA có thể thêm vào màn hình chính trên mobile.

## Tech stack

- React Native 0.86 + Expo SDK 57 (Managed Workflow)
- React 19 và TypeScript strict mode
- React Navigation 7 (Native Stack + Bottom Tabs)
- Zustand + AsyncStorage cho client state và lịch đặt lưu bền vững
- TanStack Query cho server state mô phỏng
- Reanimated + Gesture Handler cho animation và vuốt hủy lịch
- Expo Web/React Native Web và GitHub Pages

## Tải APK Android

Tải APK mới nhất từ [GitHub Releases](https://github.com/huyvu16/vku-room-booking/releases/latest). Trên Android, mở file APK đã tải và cho phép cài ứng dụng từ trình duyệt hoặc trình quản lý tệp nếu thiết bị yêu cầu.

Mỗi tag `v*` tạo một APK cài thử (debug build) và đăng lên GitHub Releases bằng GitHub Actions. Để tạo APK mới, đẩy tag phiên bản, ví dụ `v1.1.0`.

## Chạy ứng dụng mobile

```bash
npm install
npm run start
```

Trong Expo CLI:

- Quét QR bằng Expo Go trên thiết bị thật.
- Nhấn `a` để mở Android emulator.
- Trên iPhone vật lý, Expo CLI và Expo Go phải đăng nhập cùng một tài khoản Expo.

## Chạy bản web

```bash
npm run web
```

Tạo production bundle:

```bash
npm run export:web
```

Triển khai lại GitHub Pages sau khi đã cấu hình remote:

```bash
npm run deploy
```

## Cài live demo lên điện thoại

- **iPhone/iPad:** mở live demo bằng Safari → nút Share → **Add to Home Screen**.
- **Android:** mở bằng Chrome → menu ⋮ → **Install app** hoặc **Add to Home screen**.

## Kiểm tra

```bash
npm run typecheck
npx expo install --check
```

Ứng dụng đã được kiểm tra TypeScript strict, tính tương thích Expo SDK và production bundle cho Android/Web.

## Ghi chú

Ảnh phòng sử dụng URL Unsplash. Khi thiết bị ngoại tuyến, ứng dụng hiển thị khung ảnh dự phòng. Dữ liệu phòng và lịch đặt hiện là dữ liệu mô phỏng phục vụ Mini-Project 2.

## License

[MIT](./LICENSE)
