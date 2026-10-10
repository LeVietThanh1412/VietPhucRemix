# Việt Phục Remix

Ứng dụng giúp học sinh, sinh viên khám phá và phối trang phục truyền thống Việt Nam theo sự kiện, vùng miền hoặc phong cách cá nhân: vừa hiện đại, vừa tôn trọng giá trị văn hóa.

## Đăng bản demo lên GitHub Pages (không cần server)

1. Đẩy mã nguồn lên GitHub, bao gồm `.github/workflows/deploy-pages.yml`. Workflow tự chạy khi push vào `main`, `master` hoặc `Thanh`; sửa danh sách này nếu bạn dùng nhánh khác.
2. Trong repository, mở **Settings → Pages → Build and deployment → Source**, chọn **GitHub Actions**. Tài khoản GitHub Free cần repository public để dùng Pages.
3. Mở **Actions → Deploy GitHub Pages**. Nếu lần chạy đầu thất bại vì chưa bật Pages, bấm **Re-run all jobs** sau bước 2. Bạn cũng có thể bấm **Run workflow** khi workflow đã có trên nhánh mặc định.
4. Chờ hai job `build` và `deploy` thành công. Link ở **Settings → Pages** hoặc job `deploy` chính là URL điền vào ô **URL demo**.

Với repo hiện tại `minhmnq/VietPhucRemix`, địa chỉ dự kiến là **https://minhmnq.github.io/VietPhucRemix/**. Link chỉ hoạt động sau khi triển khai thành công. Nếu bạn upload sang tài khoản hoặc repo khác, lấy địa chỉ thực tế từ Settings → Pages.

Workflow tự lấy đường dẫn do GitHub Pages cấp, nên JS, CSS, font chữ và các cửa sổ tải động vẫn chạy trong thư mục của repo. Link chia sẻ và mã QR giữ nguyên đường dẫn ứng dụng. Chỉ thư mục `dist` được xuất bản; không upload `node_modules`, `.env`, video demo hoặc toàn bộ thư mục nguồn làm website.

**Bản Pages có:** quiz, phối đồ, thông tin và cảnh báo văn hóa, đánh giá màu, thời tiết, tủ đồ, so sánh, xuất ảnh và link chia sẻ. Tủ đồ lưu riêng trên trình duyệt của mỗi người dùng.

**Trợ lý trên Pages dùng tri thức cục bộ**, hiển thị đúng chế độ này và không gọi `/api/ai-stylist`. GitHub Pages không chạy Node.js/Express. Thêm `GEMINI_API_KEYS` vào GitHub Secrets không tự tạo backend; không đưa key vào biến `VITE_*`, HTML hoặc mã JavaScript. Nếu sau này muốn Gemini trực tuyến, dùng bản triển khai có backend ở mục Deploy phía dưới.

Thử bản Pages trên máy trước khi push:

```bash
npm run build:pages -- --base=/VietPhucRemix/
npm run preview -- --base=/VietPhucRemix/ --host 127.0.0.1
# Mở http://127.0.0.1:4173/VietPhucRemix/
```

Khi preview đang chạy, có thể kiểm tra luồng Pages bằng `npm run test:pages`. Dùng `CHROME_PATH` nếu chạy Chrome có sẵn hoặc `TEST_BASE_URL` nếu preview ở địa chỉ khác; bộ thử kiểm tra tải tài nguyên dưới đường dẫn repo, tư vấn cục bộ, tủ đồ, so sánh, xuất PNG và mở link chia sẻ trên trình duyệt mới.

`npm run build` và `npm run dev` vẫn dùng chế độ có backend như trước.

## Chạy dự án

```bash
npm install
cp .env.example .env    # tùy chọn: GEMINI_API_KEY, APP_URL, VITE_FEEDBACK_URL
npm run dev             # phát triển: http://localhost:3000
npm run demo            # build + chạy bản production (dùng khi trình diễn)
npm test                # kiểm tra: luật văn hóa, link chia sẻ, quiz, ngữ cảnh AI
npm run lint            # kiểm tra kiểu TypeScript
```

- **Không cần API key** vẫn chạy đầy đủ. AI Stylist sẽ dùng nhận xét offline và vẫn nhắc cảnh báo văn hóa.
- **Bật AI Stylist:** lấy key miễn phí tại https://aistudio.google.com/apikey rồi điền `GEMINI_API_KEY` trong `.env`.
- Font chữ được đóng gói sẵn trong app (có bộ ký tự tiếng Việt), nên mất mạng vẫn hiển thị đúng. Riêng thời tiết thật và AI cần Internet.

### Kiểm thử trên trình duyệt

Khởi chạy app hoặc container ở cổng 3000, rồi chạy:

```bash
npx playwright-core install chromium # một lần, nếu chưa có browser cho Playwright
npm run test:browser
# Hoặc dùng Chrome có sẵn:
CHROME_PATH=/path/to/chrome npm run test:browser
# TEST_BASE_URL=http://127.0.0.1:3000 có thể đổi địa chỉ app được kiểm tra.
```

Bộ thử dùng dữ liệu riêng của từng browser context: kiểm tra API lỗi, hai tab lưu đồng thời (cả khi không có Web Locks), quota lưu trữ, so sánh sau khi xóa look, focus popup, hủy đổi tên, chia sẻ/JPG và lỗi tải module. Xem [AUDIT.md](AUDIT.md) để biết phạm vi rà soát và kết quả.

### Trình diễn và mã QR

Mã QR và link chia sẻ dùng `APP_URL` nếu được cấu hình. Khi mở app trên localhost, giao diện lấy địa chỉ chia sẻ từ server theo thứ tự:

1. `APP_URL` trong `.env`, nếu đã deploy (ví dụ `https://viet-phuc-remix.onrender.com`).
2. Nếu không có, dùng **IP mạng LAN** của máy (ví dụ `http://192.168.1.10:3000`). Điện thoại dùng **cùng Wi-Fi** sẽ quét QR được ngay.
   - Nếu máy có nhiều card mạng (VPN, máy ảo...), server có thể chọn nhầm IP. Khi đó hãy đặt `APP_URL=http://<IP-Wi-Fi>:3000`.
   - Windows có thể hỏi quyền tường lửa cho Node.js lần đầu; hãy chọn *Allow*.

Khi truy cập bằng domain hoặc IP LAN, link mặc định dùng địa chỉ đang mở; `VITE_PUBLIC_URL` có thể ghi đè khi build. Nếu chạy trong Docker để điện thoại quét QR, đặt `APP_URL=http://<IP-Wi-Fi-của-máy-host>:3000` (IP tự dò trong container có thể chỉ truy cập được nội bộ Docker). Popup Lookbook hiện cảnh báo nếu link chỉ mở được trên máy hiện tại.

### Deploy (tùy chọn)

Có sẵn `Dockerfile`, chạy được trên Render, Railway, Fly.io hoặc Cloud Run:

```bash
docker build -t viet-phuc-remix .
docker run -p 3000:3000 -e APP_URL=https://<domain> -e GEMINI_API_KEY=<key> viet-phuc-remix
```

Trên Render: chọn *New → Web Service → Docker*, rồi thêm biến môi trường `APP_URL` (địa chỉ Render cấp) và `GEMINI_API_KEY`.

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
| **Áo Dài Hiện Đại** (tay raglan) | Từ thập niên 1960: Tết, cưới, kỷ yếu, đồng phục | Cách tân cận đại |
| **Áo Bà Ba** + khăn rằn | Thường phục Nam Bộ, miền Tây sông nước | Có tư liệu |

Phụ trợ: 9 màu theo Ngũ Hành, 6 hoa văn, 5 loại hạ y, 8 loại khăn/nón, 5 loại giày dép, 8 phụ kiện, 6 sự kiện và 4 mùa. Ba vùng văn hóa được thể hiện: **Bắc Bộ** (tứ thân, quai thao), **Huế** (cung đình Nguyễn), **Nam Bộ** (bà ba, khăn rằn).

> **Phạm vi:** phiên bản hiện tại chỉ gồm trang phục truyền thống của **người Kinh (Việt)**. Trang phục của 53 dân tộc anh em khác sẽ chỉ được bổ sung khi có tư liệu và sự tham vấn của cộng đồng sở hữu văn hóa, để tránh việc biến trang phục dân tộc thành "trang phục hóa trang".

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
- **Link chia sẻ ngắn** (khoảng 17 ký tự, ví dụ `?look=1-121010-04-3-2-1`), mỗi món đồ mã hóa bằng vị trí của nó trong danh mục nên mã QR nhỏ (QR v4 thay vì v15). Look có màu Hex tùy chỉnh hoặc lớp ẩn dùng mã phiên bản 2 để giữ nguyên hình ảnh khi mở lại. Link cũ dạng phiên bản 1 và base64 vẫn mở được. *Lưu ý: chỉ được thêm món mới vào cuối danh mục, không đổi thứ tự các món cũ.*
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
6. **AI Stylist bám theo dữ liệu của app:** server không gửi câu hỏi "trống" cho Gemini. Mỗi lần hỏi, server tự tạo phần ngữ cảnh (`src/utils/stylistContext.ts`) gồm: dữ liệu trang phục, ghi chú kiểm chứng, nguồn tham khảo, điểm và các cảnh báo từ bộ luật. System prompt yêu cầu AI:
   - chỉ dựa vào dữ liệu đó, không bịa năm, tên người hay tên sách;
   - nói "chưa có tư liệu kiểm chứng" khi không biết;
   - phân biệt sử liệu với diễn giải dân gian;
   - nêu cảnh báo văn hóa trước tiên;
   - không tình dục hóa trang phục;
   - bỏ qua mọi câu lệnh đổi vai trò.

   Server kiểm tra lại cấu hình look trước khi dùng, giới hạn câu hỏi 500 ký tự và giới hạn 15 lượt hỏi mỗi phút cho mỗi IP.
7. **Kênh góp ý:** nội dung ghi rõ đang chờ chuyên gia thẩm định. Đặt `VITE_FEEDBACK_URL` (ví dụ Google Form) để hiện link "Góp ý / báo sai thông tin văn hóa". Hướng tiếp theo là mời giảng viên hoặc các nhóm phục dựng cổ phục duyệt lại `heritageData.ts` và `culturalRules.ts`.
8. **Test tự động** (`npm test`):
   - mọi look mẫu, mọi công thức theo sự kiện và toàn bộ 288 tổ hợp câu trả lời quiz đều không có lỗi văn hóa;
   - thứ tự danh mục không bị đổi (để link cũ vẫn mở đúng);
   - mỗi trang phục đều có nguồn tham khảo.

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
server.ts                      Express: /api/ai-stylist (Gemini, bám dữ liệu), /api/public-url, static
src/utils/stylistContext.ts    System prompt và ngữ cảnh dữ liệu cho AI
src/fonts.ts                   Font đóng gói sẵn (latin, latin-ext, vietnamese)
src/__tests__/core.test.ts     Test vitest
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
