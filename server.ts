import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI client (will pick up GEMINI_API_KEY from process.env)
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch (err) {
    console.error('Error initializing GoogleGenAI:', err);
  }
}

// API: AI Stylist & Cultural Consultant
app.post('/api/ai-stylist', async (req, res) => {
  const { query, outfit } = req.body;

  if (!ai || !process.env.GEMINI_API_KEY) {
    return res.status(503).json({
      error: 'Gemini API not configured. Falling back to local styling logic.'
    });
  }

  try {
    const prompt = `
Bạn là "Việt Phục Remix Stylist" - chuyên gia thời trang di sản văn hóa Việt Nam kiêm stylist thế hệ Gen Z cực kỳ sành điệu, thời thượng, có gu thẩm mỹ cao và am hiểu sâu sắc quy chuẩn cổ phục Việt (Áo Tấc, Ngũ Thân, Tứ Thân, Nhật Bình, Giao Lĩnh, Lemur...).

Thông tin bộ trang phục người dùng đang phối:
- Loại áo: ${outfit?.garment || 'Áo Ngũ Thân'} (${outfit?.dynasty || 'Triều Nguyễn'})
- Màu sắc: ${outfit?.color || 'Xanh Lam Chàm'}
- Hạ y: ${outfit?.bottom || 'Quần lụa trắng'}
- Giày dép: ${outfit?.footwear || 'Sneaker trắng'}
- Phụ kiện: ${outfit?.accessories || 'Tối giản'}
- Hoàn cảnh/Sự kiện: ${outfit?.event || 'Dạo phố cà phê'}

Câu hỏi của người dùng: "${query || 'Hãy nhận xét và thẩm định outfit này'}"

Yêu cầu câu trả lời:
1. Giọng văn: Trẻ trung, dí dỏm, thời trang Gen Z (có thể dùng khéo léo các từ như slay, aesthetic, điểm 10, vương giả...) nhưng TRỌNG TÂM là sự tôn trọng và bảo tồn giá trị văn hóa truyền thống.
2. Nêu rõ điểm khen đắt giá của bộ đồ (màu sắc, tỷ lệ thị giác, nét giao thoa truyền thống - hiện đại).
3. Đưa ra 1 gợi ý tạo dáng chụp ảnh hoặc chi tiết phụ kiện nhỏ để nâng tầm tổng thể.
4. Nhắc nhở văn hóa tế nhị nếu có nguy cơ sai lệch hoàn cảnh (ví dụ đi chùa cần giữ cổ kín, tránh phản cảm).
5. Độ dài súc tích, khoảng 120 - 180 từ, chia đoạn ngắn dễ đọc.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt
    });

    const reply = response.text || 'Outfit phối đồ của bạn rất ấn tượng và đậm chất di sản đương đại!';
    return res.json({ reply });
  } catch (error: any) {
    console.error('Error in /api/ai-stylist:', error);
    return res.status(500).json({ error: 'Failed to generate styling advice' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
