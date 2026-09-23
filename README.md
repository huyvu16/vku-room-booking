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
- Bottom Tabs: Khám phá, Lịch của tôi và Tài khoản.
- Safe area, giao diện tablet và xoay màn hình.
- Bản web PWA có thể thêm vào màn hình chính trên mobile.

## Tech stack

- React Native 0.86 + Expo SDK 57 (Managed Workflow)
- React 19 và TypeScript strict mode
- React Navigation 7 (Native Stack + Bottom Tabs)
- Zustand cho client state
- TanStack Query cho server state mô phỏng
- Expo Web/React Native Web và GitHub Pages

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
