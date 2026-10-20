# Studyverse — Website học tập

Studyverse là bộ khung website học tập dùng **HTML, CSS và JavaScript thuần**, thiết kế dark navy, chia trang riêng và phù hợp triển khai frontend trên GitHub Pages.

## Những gì đã có trong bản khởi đầu

- Dashboard với checklist và biểu đồ thời gian học.
- Kho tài liệu lưu metadata + URL, không upload file.
- Pomodoro chạy theo timestamp.
- Flashcard với nhiều bộ thẻ mẫu.
- Quiz tính điểm và giải thích đáp án.
- Phòng luyện đề có đồng hồ và tự nộp khi hết giờ.
- Lộ trình cá nhân có thể thêm/xóa/đánh dấu hoàn thành.
- Thống kê từ dữ liệu đã ghi nhận.
- Cài đặt và xuất dữ liệu JSON.
- Trang đăng ký/đăng nhập mẫu, **chưa kết nối backend xác thực thật**.

## Chạy thử

Cách đơn giản:
1. Giải nén thư mục.
2. Mở `trangchu.html` trong trình duyệt.

Khuyến nghị dùng VS Code với extension Live Server để tránh các giới hạn trình duyệt khi mở file trực tiếp.

Các tính năng học tập mẫu lưu dữ liệu trong `localStorage` của trình duyệt hiện tại. Dữ liệu không tự đồng bộ giữa các thiết bị.

## Triển khai GitHub Pages

1. Tạo repository trên GitHub.
2. Upload toàn bộ nội dung bên trong thư mục `studyverse` lên repository (để `index.html` ở thư mục gốc).
3. Vào **Settings → Pages**.
4. Chọn **Deploy from a branch**.
5. Chọn branch `main` và folder `/(root)`, nhấn Save.
6. Mở URL GitHub Pages mà GitHub cung cấp.

Tất cả liên kết trang trong project dùng đường dẫn tương đối để phù hợp với URL dạng `username.github.io/repository-name/`.

## Quan trọng về đăng ký/đăng nhập không cần email

Các trang `dang-ky.html` và `dang-nhap.html` hiện là giao diện + kiểm tra biểu mẫu. Chúng **không tạo tài khoản thật**. Đây là chủ ý để không tạo ra một cơ chế giả an toàn bằng cách lưu mật khẩu trong trình duyệt.

Để triển khai tài khoản thật chỉ bằng tên tài khoản + mật khẩu:

1. Tạo dự án Supabase.
2. Chọn thiết kế xác thực phía máy chủ: ví dụ Supabase Edge Function làm lớp tiếp nhận username/password và ánh xạ an toàn đến cơ chế xác thực được hỗ trợ, hoặc dùng một dịch vụ xác thực phù hợp có hỗ trợ username/password.
3. Tạo schema dữ liệu và RLS cho hồ sơ, tiến độ học, flashcard cá nhân, lịch sử quiz/đề thi và tài liệu yêu thích.
4. Đặt giới hạn yêu cầu đăng nhập, chống dò mật khẩu, chuẩn hóa username và đảm bảo username duy nhất.
5. Không lưu mật khẩu dạng văn bản thuần, không đặt service-role key trong frontend.
6. Chỉ hiển thị trạng thái đăng nhập thành công khi backend xác nhận.

Supabase Auth mặc định không cung cấp username/password trực tiếp như một phương thức đăng nhập độc lập. Cần thiết kế và kiểm thử lớp xác thực bổ sung cẩn thận. Không triển khai một endpoint tùy chỉnh mà thiếu rate limiting, kiểm tra đầu vào và xử lý phiên an toàn.

## Kho tài liệu

Trong `js/pages.js`, mảng `docs` chứa các tài liệu mẫu. Mỗi item có `title`, `desc`, `category`, `topic`, `source` và `url`.

Để thêm tài liệu demo, bổ sung một item trong mảng `docs`. Đường link phải được kiểm tra trước khi đưa vào sử dụng. Một số nguồn có thể yêu cầu người dùng đăng nhập vào dịch vụ gốc.

Muốn quản lý tài liệu chung trực tiếp trên website:
- Lưu metadata trong Supabase.
- Tạo giao diện quản trị.
- Chỉ cho phép admin ghi/xóa dữ liệu qua chính sách backend/RLS.
- Không cần Supabase Storage nếu chỉ lưu link.

## Giới hạn hiện tại

- Đăng ký/đăng nhập thật chưa được tích hợp.
- Dữ liệu học tập đang lưu cục bộ trên trình duyệt.
- Dữ liệu mẫu chưa phải kho tài liệu được quản trị tập trung.
- Không có AI tạo nội dung trong bản này.
- Đây là bản nền tảng để tiếp tục phát triển, không phải hệ thống production đã được kiểm thử bảo mật.

## Cấu trúc

```text
studyverse/
├── index.html
├── trangchu.html
├── kho-tai-lieu.html
├── pomodoro.html
├── flashcard.html
├── quiz.html
├── de-thi.html
├── lo-trinh.html
├── thong-ke.html
├── cai-dat.html
├── dang-nhap.html
├── dang-ky.html
├── css/style.css
└── js/
    ├── app.js
    ├── home.js
    ├── pages.js
    └── auth-demo.js
```
