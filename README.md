# Việt Phục Remix

Ứng dụng giúp học sinh, sinh viên khám phá và phối trang phục truyền thống Việt Nam theo sự kiện, vùng miền hoặc phong cách cá nhân: vừa hiện đại, vừa tôn trọng giá trị văn hóa.

## Chạy dự án

```bash
npm install
cp .env.example .env    # tùy chọn: điền GEMINI_API_KEY để bật AI Stylist
npm run dev             # http://localhost:3000
npm run lint            # kiểm tra kiểu TypeScript
npm run build
```

Khi không có `GEMINI_API_KEY`, AI Stylist tự chuyển sang chế độ offline với nhận xét dựng sẵn.

---

## 1. Nhóm trang phục và bối cảnh văn hóa

| Trang phục | Bối cảnh | Mức độ tư liệu |
|---|---|---|
| Áo Tấc (áo thụng) | Lễ phục thời Nguyễn: tế lễ, gia tiên, cưới hỏi | Có tư liệu |
| Áo Ngũ Thân tay chẽn | Thường phục thời Nguyễn: sinh hoạt, học đường | Có tư liệu |
| Áo Tứ Thân và yếm | Dân gian Bắc Bộ, Quan họ Kinh Bắc | Có tư liệu |
| Áo Nhật Bình | Lễ phục của hậu phi, công chúa triều Nguyễn (Huế) | Có tư liệu |
| Áo Giao Lĩnh | Thời Lý – Trần – Lê sơ | Phỏng dựng |
| Áo Dài Tân Thời (Lemur) | Cải cách năm 1934, Hà Nội | Cách tân cận đại |

Phụ trợ: 9 màu theo Ngũ Hành, 6 hoa văn, 5 loại hạ y, 7 loại khăn/nón, 5 loại giày dép, 8 phụ kiện, 6 sự kiện và 4 mùa.

## 2. Nhu cầu người dùng

| Nhóm | Nhu cầu | Tính năng đáp ứng |
|---|---|---|
| Học sinh, sinh viên đi chụp kỷ yếu hoặc Tết | "Mặc gì cho hợp dịp mà không bị sai?" | Chọn sự kiện, cảnh báo văn hóa, gợi ý theo thời tiết |
| Người mới tìm hiểu cổ phục | "Áo này tên gì, có từ bao giờ, ý nghĩa ra sao?" | Tab Nguồn gốc / Ý nghĩa / Nguồn & Kiểm chứng |
| Người thích remix Gen Z | "Phối sneaker, kính râm có được không?" | Luật *remix* phân biệt thường phục với lễ phục |
| Người sáng tạo nội dung | "Muốn chia sẻ look lên mạng" | Xuất lookbook PNG, link chia sẻ `?look=` |

## 3. Trải nghiệm phối đồ

```
Chọn sự kiện / thời tiết ──► Chọn áo (có huy hiệu mức tư liệu)
        │                          │
        ▼                          ▼
 Màu · Hoa văn · Hạ y · Khăn/nón · Giày · Phụ kiện (tối đa 3)
        │
        ▼
 Mannequin SVG cập nhật ngay ─► Thẩm định văn hóa (điểm 0–100)
        │                      ─► Hài hòa màu Ngũ Hành / tỉ lệ 60-30-10
        ▼
 AI Stylist góp ý ─► So sánh với look mẫu ─► Xuất lookbook / chia sẻ link
```

- **Quiz 3 câu** (sự kiện → vùng miền + dáng người → phong cách), tự mở cho người dùng mới. Bộ gợi ý (`src/utils/quizEngine.ts`) duyệt khoảng 57 nghìn cách phối, **loại bỏ mọi phương án có lỗi văn hóa nghiêm trọng (critical)** và trừ điểm các phương án lệch truyền thống, rồi xếp hạng theo độ hợp sự kiện, vùng miền, phong cách, điểm văn hóa và độ hài hòa màu. Kết quả là 3 look đa dạng, mỗi look kèm lý do gợi ý.
- **Thời tiết thật** qua Open-Meteo (miễn phí, không cần key): chọn thành phố hoặc dùng định vị GPS. Nhiệt độ cảm nhận được quy về 4 mùa; mưa, UV, độ ẩm và gió sinh ra lời khuyên về chất liệu và giày dép, đồng thời tự điều chỉnh công thức phối (ví dụ trời mưa thì đổi guốc mộc sang giày bít mũi). Khi mất mạng, người dùng vẫn chọn mùa thủ công được.
- Look đang phối được lưu tự động vào `localStorage`, tải lại trang không bị mất.
- **Tủ đồ và so sánh:** lưu tối đa 12 look (có thể đổi tên, xóa, mặc lại), rồi so sánh 2–3 look bất kỳ (look hiện tại, look trong Tủ đồ hoặc look mẫu).
  - Bảng so sánh gồm: tổng điểm (45% văn hóa, 25% màu, 30% hợp dịp), điểm văn hóa, độ hài hòa màu, độ hợp sự kiện, độ trang trọng, tỉ lệ đồ truyền thống, số sai lệch/lưu ý và chi tiết từng món.
  - Có nhận xét tự động look nào nổi bật hơn và vì sao.
  - Tải được bảng so sánh thành ảnh PNG.
- **Lookbook Việt phục:**
  - Xuất ảnh dạng **Story 9:16** (1080×1920) hoặc **Post 4:5** (1080×1350), kèm **mã QR** mở lại đúng look.
  - Đặt tên look, chia sẻ ảnh qua Web Share API trên điện thoại (máy không hỗ trợ thì tự tải ảnh và sao chép caption), có caption và hashtag gợi ý.
  - Hiện cảnh báo trước khi chia sẻ nếu look còn sai lệch văn hóa.
- **Link chia sẻ ngắn** (khoảng 17 ký tự, ví dụ `?look=1-121010-04-3-2-1`), mỗi món đồ mã hóa bằng vị trí của nó trong danh mục nên mã QR nhỏ (QR v4 thay vì v15). Link cũ dạng base64 vẫn mở được. *Lưu ý: chỉ được thêm món mới vào cuối danh mục, không đổi thứ tự các món cũ.*
- Link chia sẻ mã hóa toàn bộ cấu hình vào URL, không cần backend. Khi mở link, dữ liệu được kiểm tra lại với danh mục có sẵn trước khi áp dụng.

## 4. Bảo đảm thông tin văn hóa phù hợp

1. **Ghi nguồn tham khảo:** mỗi loại áo có danh sách `sources[]` (sách, bảo tàng, sử liệu, báo chí), hiển thị trong tab *Nguồn & Kiểm chứng*.
2. **Gắn nhãn mức độ tư liệu:** *Có tư liệu* / *Phỏng dựng* / *Cách tân cận đại*, giúp người dùng không nhầm bản phục dựng với hiện vật gốc.
3. **Tách dữ kiện với diễn giải:** trường `verificationNote` nói rõ phần nào là sử liệu, phần nào là diễn giải dân gian (ví dụ "5 khuy = Ngũ thường").
4. **Luật văn hóa viết thành dữ liệu** (`src/data/culturalRules.ts`): mỗi luật có mức độ `critical`, `warning`, `info` hoặc `kudos`, kèm lời khuyên và **cơ sở văn hóa** (`basis`) để người dùng hiểu vì sao. Luật hiện bao phủ:
   - bối cảnh nơi thờ tự;
   - tầng lớp (lễ phục hay thường phục);
   - vùng miền;
   - màu sắc (màu tang, vàng cung đình);
   - hoa văn (chữ Thọ);
   - cấu trúc (chiều vạt giao lĩnh);
   - phục sức theo giới.
5. **Điểm tôn trọng văn hóa (0–100):** mỗi luật vi phạm bị trừ điểm theo mức độ, nhằm khuyến khích người dùng thay vì cấm đoán.
6. **Kênh góp ý:** nội dung ghi rõ đang chờ chuyên gia thẩm định. Hướng tiếp theo là mời giảng viên hoặc các nhóm phục dựng cổ phục duyệt lại `heritageData.ts` và `culturalRules.ts`.

### Thêm một luật mới

```ts
// src/data/culturalRules.ts
{
  id: 'vi-du',
  level: 'warning',
  category: 'boi-canh',
  when: all(is('targetEvent', 'le-chua-tam-linh'), is('colorId', 'do-chu-sa')),
  title: '...', message: '...', guidance: '...', basis: '...'
}
```

## Cấu trúc thư mục

```
server.ts                      Express, Vite middleware, /api/ai-stylist (Gemini)
src/App.tsx                    Studio phối đồ
src/data/heritageData.ts       Danh mục trang phục, màu, hoa văn, sự kiện, nguồn tham khảo
src/data/culturalRules.ts      Bộ luật thẩm định văn hóa
src/utils/culturalRuleChecker.ts  Chạy luật và tính điểm
src/utils/harmonyCalculator.ts    Tính hài hòa màu Ngũ Hành
src/utils/lookStorage.ts       Lưu localStorage, mã hóa/giải mã link chia sẻ
src/utils/quizEngine.ts        Bộ gợi ý look từ quiz (sự kiện × vùng × phong cách)
src/utils/weatherService.ts    Open-Meteo, quy đổi mùa, lời khuyên theo thời tiết
src/utils/savedLooks.ts        Tủ đồ (localStorage) + hook src/hooks/useSavedLooks.ts
src/utils/lookMetrics.ts       Chỉ số so sánh (văn hóa, màu, hợp dịp, trang trọng, truyền thống)
src/utils/lookbookExport.ts    Vẽ canvas story/post/bảng so sánh, QR, chia sẻ, caption
src/components/                Mannequin, Checker, AI, Lookbook, So sánh...
```
