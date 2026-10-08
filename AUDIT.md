# Rà soát và sửa lỗi — 2026-10-08

Đã đọc các phần frontend, backend, dữ liệu, tiện ích, lưu trữ và cấu hình Docker; kiểm tra tương tác trên Chrome với app chạy trong Docker.

| Nhóm | Lỗi đã sửa |
| --- | --- |
| AI | Frontend gọi sai endpoint/body; model mặc định không hợp lệ; phản hồi cũ xuất hiện sau khi đổi look; dữ liệu offline không khớp catalog; phản hồi rỗng bị coi là thành công. |
| Backend | Xoay key bị ảnh hưởng bởi request đồng thời; thử mọi key với lỗi model; chờ vượt thời gian của frontend; request hủy vẫn gọi AI; key trùng/placeholder; rate limiter tăng bộ nhớ và reset toàn bộ khi đầy. |
| Kiểm tra dữ liệu | Màu Hex và layer chưa được kiểm tra đầy đủ; phụ kiện trùng; URL/API lỗi; payload quá lớn trả HTML; asset thiếu trả index.html; HTML bị cache lâu. |
| Link/QR | Mất màu Hex và lớp ẩn khi chia sẻ; link bỏ đường dẫn base; xuất trước khi URL/QR sẵn sàng; URL cấu hình chứa query/hash làm sai đường dẫn. |
| Tủ đồ | Custom look bị coi là trùng; ghi storage event gây đồng bộ ngược; báo lưu thành công khi quota/quyền lưu trữ lỗi; hai tab ghi đè; id trùng; Escape vẫn đổi tên. |
| So sánh | Giữ look đã xóa ở tab khác; lựa chọn thiếu/trùng; nhận xét chọn thắng khi đồng điểm; lỗi xuất ảnh không có thông báo. |
| Phối đồ | Công thức sự kiện giữ phụ kiện/custom layer từ look cũ; gợi ý nữ cho mannequin nam; màu custom không được dùng nhất quán trong đánh giá. |
| Thời tiết | City lưu không hợp lệ; request cũ ghi đè lựa chọn mới; mùa thủ công vẫn bị dữ liệu live áp dụng; dữ liệu thiếu/không phải số; chọn sneaker thay boots khi vừa lạnh vừa mưa. |
| Xuất ảnh | Sai kích thước Story/Post; avatar bị cắt trong Post; preview/canvas cũ vẫn tải được; JPG/chia sẻ đổi nội dung giữa thao tác; canShare ném lỗi không được xử lý; lỗi QR khiến chờ mãi. |
| Popup | Popup chồng nhau; Escape trước khi tải module không đóng; không phục hồi cuộn; Tab đi ra giao diện nền; lỗi tải module làm trắng trang. |
| Docker/dependency | Cài tsx ngoài lockfile trong image production; thiếu build arg VITE_PUBLIC_URL; dependency có advisory (source-map-js, esbuild). |

## Xác minh

- `npm run lint`: qua.
- `npm test`: 44/44 qua; có kiểm tra toàn bộ 288 tổ hợp quiz, 2.000 cấu hình link và 128 mask layer với/không màu custom.
- Build image `viet-phuc-remix` và chạy container cổng 3000: qua; runtime dùng Node 22.
- `npm run test:browser`: kiểm tra API, lưu nhiều tab, IndexedDB fallback, quota lỗi, so sánh, bàn phím, đổi tên, chia sẻ, JPG và module lỗi.
- Các ca thử bổ sung trên container: AI online bằng response mock và offline thật; hủy phản hồi cũ; thời tiết mock/live; chia sẻ lớp ẩn; PNG Story/Post ở cả hai engine; xuất bảng so sánh; storage bị chặn.
- Kiểm tra 24 màn hình ở 1440×1000, 390×844 và 320×740: không tràn ngang, không có lỗi JavaScript chưa xử lý. Đã xem ảnh chụp và ảnh xuất để kiểm tra bố cục/avatar.
- `npm audit`: 0 lỗ hổng được báo sau cập nhật lockfile.

## Phạm vi chưa kiểm chứng

Chưa gọi Gemini bằng key thật: container thử nghiệm dùng `YOUR_KEY`, được nhận diện là placeholder và chuyển sang offline. Logic xoay key/hủy/giới hạn đã có test bằng mock; kết nối với tài khoản thật, quota và native share dialog trên điện thoại cần xác minh trong môi trường có dịch vụ đó.

Tủ đồ vẫn dùng localStorage của từng trình duyệt, không đồng bộ tài khoản/thiết bị. Web Locks và IndexedDB bảo vệ thao tác giữa các tab; nếu trình duyệt chặn cả hai cơ chế khóa, app vẫn có thể lưu localStorage nhưng không đảm bảo ghi đồng thời giữa nhiều tab.

Rà soát này xác minh các luồng và lỗi nêu trên; không phải cam kết mọi lỗi có thể xảy ra đã được loại bỏ. Nội dung lịch sử và luật văn hóa chưa được thẩm định bởi chuyên gia trong lần sửa này.
