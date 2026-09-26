import { CulturalRule, OutfitConfig } from '../types/vietphuc';

/**
 * Bộ luật thẩm định văn hóa (data-driven).
 * - critical: làm sai lệch đặc trưng/ý nghĩa của trang phục
 * - warning : không phù hợp bối cảnh, nên điều chỉnh
 * - info    : lưu ý / kiến thức bổ sung
 * - kudos   : cách phối đẹp, đúng tinh thần
 * Mỗi luật có `basis` nêu cơ sở văn hóa để người dùng hiểu "vì sao".
 */

const is = <K extends keyof OutfitConfig>(key: K, ...values: OutfitConfig[K][]) =>
  (c: OutfitConfig) => values.includes(c[key]);
const hasAcc = (...ids: OutfitConfig['accessories']) => (c: OutfitConfig) => ids.some(id => c.accessories.includes(id));
const all = (...fns: ((c: OutfitConfig) => boolean)[]) => (c: OutfitConfig) => fns.every(f => f(c));
const not = (fn: (c: OutfitConfig) => boolean) => (c: OutfitConfig) => !fn(c);

const CEREMONIAL = is('garmentId', 'ao-tac', 'ao-nhat-binh');
const SACRED = is('targetEvent', 'le-chua-tam-linh');

export const CULTURAL_RULES: CulturalRule[] = [
  // ───────────── CRITICAL: sai lệch đặc trưng ─────────────
  {
    id: 'nhat-binh-denim',
    level: 'critical',
    category: 'tang-lop',
    when: all(is('garmentId', 'ao-nhat-binh'), is('bottomId', 'quan-jeans-suong')),
    title: 'Lệch chuẩn lễ phục cung đình',
    message: 'Áo Nhật Bình là lễ phục của hậu phi, công chúa triều Nguyễn. Mặc với quần denim làm mất tính lễ nghi của áo.',
    guidance: 'Đổi sang Quần lụa trắng/đen hoặc váy xếp ly dài để giữ cốt cách của áo.',
    basis: 'Y phục cung đình Nguyễn được quy định chặt chẽ theo phẩm trật (Khâm định Đại Nam hội điển sự lệ).'
  },
  {
    id: 'ao-tac-denim',
    level: 'critical',
    category: 'tang-lop',
    when: all(is('garmentId', 'ao-tac'), is('bottomId', 'quan-jeans-suong')),
    title: 'Áo Tấc là lễ phục, không phải áo khoác streetwear',
    message: 'Áo Tấc (áo thụng) dùng trong tế lễ, gia tiên, cưới hỏi. Phối denim khiến bộ lễ phục trông như trang phục hóa trang.',
    guidance: 'Nếu muốn phong cách đời thường, hãy chọn Áo Ngũ Thân tay chẽn thay cho Áo Tấc.',
    basis: 'Áo tay thụng có tay rộng, dùng cho nghi lễ; áo tay chẽn dùng cho sinh hoạt thường ngày.'
  },
  {
    id: 'sacred-denim',
    level: 'critical',
    category: 'boi-canh',
    when: all(SACRED, is('bottomId', 'quan-jeans-suong')),
    title: 'Không phù hợp nơi thờ tự',
    message: 'Đi lễ chùa hoặc đền không nên mặc quần denim bụi bặm cùng cổ phục.',
    guidance: 'Đổi sang Quần lụa trắng hoặc Quần lụa đen dài, trang nhã.',
    basis: 'Nơi tôn nghiêm đòi hỏi trang phục kín đáo, trang trọng để thể hiện lòng thành kính.'
  },
  {
    id: 'wedding-mourning-colors',
    level: 'warning',
    category: 'mau-sac',
    when: all(is('targetEvent', 'dam-cuoi-ban-than'), is('colorId', 'den-mun', 'trang-nga'), is('patternId', 'plain-silk')),
    title: 'Tránh màu dễ liên tưởng tang lễ khi dự cưới',
    message: 'Áo trơn toàn đen hoặc toàn trắng thường được tránh khi dự đám cưới của người Việt.',
    guidance: 'Chọn Đỏ Chu Sa, Hồng Cánh Sen, Vàng Hoàng Yến, hoặc giữ màu nhưng thêm hoa văn/phụ kiện có màu ấm.',
    basis: 'Trắng là màu tang truyền thống (khăn tang, áo sô); đám cưới chuộng màu đỏ và hồng tượng trưng cho hỷ sự.'
  },

  // ───────────── WARNING: sai bối cảnh ─────────────
  {
    id: 'sacred-sunglasses',
    level: 'warning',
    category: 'boi-canh',
    when: all(SACRED, hasAcc('kinh-mat-y2k')),
    title: 'Tháo kính râm khi vào nơi thờ tự',
    message: 'Kính râm Y2K hợp để dạo phố và chụp lookbook, không hợp khi dâng hương.',
    guidance: 'Tháo kính khi vào chính điện; có thể đeo lại khi chụp ảnh bên ngoài.',
    basis: 'Phép lịch sự cơ bản khi vào nơi tôn nghiêm.'
  },
  {
    id: 'sacred-sandal',
    level: 'warning',
    category: 'boi-canh',
    when: all(SACRED, is('footwearId', 'sandal-toi-gian')),
    title: 'Nên chọn giày dép kín mũi',
    message: 'Sandal quai mảnh có thể bị coi là kém chỉn chu tại chốn thiền môn.',
    guidance: 'Guốc mộc truyền thống hoặc giày bít mũi là lựa chọn an toàn nhất.',
    basis: 'Quy ước ăn mặc phổ biến tại nhiều chùa, đền, di tích.'
  },
  {
    id: 'sacred-tu-than',
    level: 'info',
    category: 'boi-canh',
    when: all(SACRED, is('garmentId', 'ao-tu-than')),
    title: 'Buộc kín vạt áo khi đi lễ',
    message: 'Áo tứ thân thường để lộ yếm ở phía trước. Khi vào nơi thờ tự nên buộc kín vạt.',
    guidance: 'Buộc hai vạt trước lại với nhau hoặc mặc thêm áo cánh bên trong. Không mặc yếm riêng lẻ khi đi lễ.',
    basis: 'Yếm là áo lót của phụ nữ xưa; khi ra nơi trang trọng luôn có áo ngoài che.'
  },
  {
    id: 'ceremonial-sneaker',
    level: 'warning',
    category: 'tang-lop',
    when: all(CEREMONIAL, is('footwearId', 'sneaker-trang', 'sandal-toi-gian')),
    title: 'Lễ phục đi cùng giày thể thao/sandal',
    message: 'Áo Tấc và Nhật Bình là lễ phục nên cần giày dép trang trọng tương xứng.',
    guidance: 'Chọn Guốc mộc hoặc Giày Oxford. Nếu muốn mang sneaker, hãy đổi sang Áo Ngũ Thân.',
    basis: 'Mức độ trang trọng của giày dép nên tương đương với mức độ trang trọng của áo.'
  },
  {
    id: 'nhat-binh-casual',
    level: 'info',
    category: 'tang-lop',
    when: all(is('garmentId', 'ao-nhat-binh'), is('targetEvent', 'ca-phe-dao-pho')),
    title: 'Nhật Bình là lễ phục cung đình',
    message: 'Mặc Nhật Bình để chụp ảnh concept thì hoàn toàn ổn. Nhưng nếu mặc đi cà phê hằng ngày, áo dễ bị hiểu là trang phục hóa trang.',
    guidance: 'Để đi chơi hằng ngày, Áo Ngũ Thân hoặc Áo Dài Tân Thời phù hợp hơn.',
    basis: 'Mỗi loại áo gắn với một bối cảnh sử dụng; tôn trọng bối cảnh gốc giúp giữ nguyên ý nghĩa của trang phục.'
  },
  {
    id: 'chu-tho-youth',
    level: 'warning',
    category: 'hoa-van',
    when: all(is('patternId', 'chu-tho'), is('targetEvent', 'ky-yeu-hoc-duong', 'ca-phe-dao-pho', 'bieu-dien-van-nghe')),
    title: 'Hoa văn chữ Thọ dành cho dịp mừng thọ',
    message: 'Chữ Thọ thường dùng cho người cao tuổi và lễ mừng thọ. Dùng cho kỷ yếu hay dạo phố của người trẻ là lệch ý nghĩa.',
    guidance: 'Thử Vân Mây, Hoa Sen hoặc Gốm Chu Đậu. Chữ Thọ hợp nhất khi bạn mặc đi mừng thọ ông bà.',
    basis: 'Hoa văn chữ Thọ gắn với tục mừng thọ (lên lão) của người Việt.'
  },

  // ───────────── INFO: vùng miền / cấu trúc / giới ─────────────
  {
    id: 'giao-linh-wrap',
    level: 'info',
    category: 'cau-truc',
    when: is('garmentId', 'ao-giao-linh'),
    title: 'Nhớ chiều vạt: trái đè phải',
    message: 'Áo giao lĩnh phải mặc vạt trái đè lên vạt phải, cổ áo tạo thành hình chữ "y" khi nhìn từ phía trước.',
    guidance: 'Kiểm tra lại trước khi chụp ảnh: vạt phải đè trái (tả nhậm) là cách mặc cho người đã khuất.',
    basis: 'Quy ước "hữu nhậm" trong trang phục cổ truyền Việt Nam và Đông Á.'
  },
  {
    id: 'khan-dong-female',
    level: 'info',
    category: 'gioi',
    when: all(is('headwearId', 'khan-dong'), is('modelGender', 'female')),
    title: 'Khăn đóng vốn là của nam giới',
    message: 'Theo truyền thống, khăn đóng xếp nếp là phục sức của nam; nữ giới thường đội khăn vấn hoặc khăn mỏ quạ.',
    guidance: 'Nếu cố ý phối phá cách (gender-fluid), hãy ghi chú điều đó khi chia sẻ để người xem không hiểu nhầm là truyền thống.',
    basis: 'Phân biệt phục sức nam/nữ trong trang phục truyền thống người Việt.'
  },
  {
    id: 'ba-ba-formal',
    level: 'warning',
    category: 'tang-lop',
    when: all(is('garmentId', 'ao-ba-ba'), is('targetEvent', 'dam-cuoi-ban-than', 'le-chua-tam-linh')),
    title: 'Áo bà ba là thường phục',
    message: 'Áo bà ba là trang phục sinh hoạt và lao động thường ngày của người Nam Bộ, chưa đủ trang trọng cho đám cưới hay lễ chùa.',
    guidance: 'Với dịp trang trọng, hãy chọn Áo Dài Hiện Đại hoặc Áo Ngũ Thân. Áo bà ba hợp nhất khi đi chơi, đi chợ nổi hay biểu diễn đờn ca tài tử.',
    basis: 'Phân tầng lễ phục và thường phục trong trang phục Nam Bộ.'
  },
  {
    id: 'khan-ran-offregion',
    level: 'info',
    category: 'vung-mien',
    when: all(is('headwearId', 'khan-ran'), not(is('garmentId', 'ao-ba-ba', 'ao-ngu-than', 'ao-dai-hien-dai'))),
    title: 'Khăn rằn là nét riêng của Nam Bộ',
    message: 'Khăn rằn thường đi với áo bà ba. Phối với lễ phục cung đình hay áo tứ thân Bắc Bộ sẽ bị lẫn đặc trưng vùng miền.',
    guidance: 'Để giữ nét Nam Bộ, hãy mặc Áo Bà Ba với khăn rằn và nón lá.',
    basis: 'Mỗi vùng văn hóa có bộ phục sức đặc trưng riêng.'
  },
  {
    id: 'khan-ran-sacred',
    level: 'warning',
    category: 'boi-canh',
    when: all(is('headwearId', 'khan-ran'), is('targetEvent', 'le-chua-tam-linh', 'dam-cuoi-ban-than')),
    title: 'Khăn rằn là phụ kiện đời thường',
    message: 'Khăn rằn là phụ kiện lao động, đi đường, không hợp với dịp trang nghiêm.',
    guidance: 'Tháo khăn rằn hoặc thay bằng khăn vấn, khăn đóng.',
    basis: 'Mức độ trang trọng của phụ kiện nên tương đương với mức độ trang trọng của dịp.'
  },
  {
    id: 'ao-dai-denim-formal',
    level: 'warning',
    category: 'boi-canh',
    when: all(is('garmentId', 'ao-dai-hien-dai', 'ao-dai-tan-thoi'), is('bottomId', 'quan-jeans-suong'), is('targetEvent', 'tet-du-xuan', 'dam-cuoi-ban-than', 'ky-yeu-hoc-duong')),
    title: 'Áo dài đi quần jeans trong dịp trang trọng',
    message: 'Áo dài mặc với quần jeans hợp để dạo phố, nhưng ở lễ Tết, đám cưới hay lễ tốt nghiệp sẽ trông thiếu chỉn chu.',
    guidance: 'Chọn quần lụa ống suông trắng hoặc đen, dài chạm gót.',
    basis: 'Bộ áo dài chuẩn gồm áo và quần lụa ống suông.'
  },
  {
    id: 'ba-ba-khan-ran',
    level: 'kudos',
    category: 'vung-mien',
    when: all(is('garmentId', 'ao-ba-ba'), is('headwearId', 'khan-ran', 'non-la')),
    title: 'Chuẩn chất miền Tây sông nước',
    message: 'Áo bà ba đi cùng khăn rằn hoặc nón lá là hình ảnh quen thuộc của người Nam Bộ.',
    guidance: 'Thêm túi cói đan để trọn vibe chợ nổi và cà phê vườn.',
    basis: 'Bộ trang phục thường ngày đặc trưng của Nam Bộ.'
  },
  {
    id: 'ao-dai-proper',
    level: 'kudos',
    category: 'tang-lop',
    when: all(is('garmentId', 'ao-dai-hien-dai'), is('bottomId', 'quan-lua-trang', 'quan-lua-den'), is('targetEvent', 'tet-du-xuan', 'ky-yeu-hoc-duong', 'dam-cuoi-ban-than')),
    title: 'Áo dài chuẩn mực cho dịp lễ',
    message: 'Áo dài đi với quần lụa ống suông là trang phục được chấp nhận rộng rãi ở mọi dịp trang trọng.',
    guidance: 'Nên để tà áo buông thẳng khi đứng chụp; nữ sinh có thể kết hợp nón lá.',
    basis: 'Áo dài là trang phục lễ phổ biến nhất của người Việt hiện nay.'
  },
  {
    id: 'female-garment-male',
    level: 'info',
    category: 'gioi',
    when: all(is('garmentId', 'ao-tu-than', 'ao-nhat-binh'), is('modelGender', 'male')),
    title: 'Trang phục vốn dành cho nữ giới',
    message: 'Áo tứ thân (có yếm) và áo Nhật Bình theo truyền thống là trang phục của phụ nữ.',
    guidance: 'Với nam giới, nên chọn Áo Ngũ Thân, Áo Tấc hoặc Áo Giao Lĩnh. Nếu cố ý phối phá cách, hãy ghi chú rõ khi chia sẻ.',
    basis: 'Phân biệt trang phục nam/nữ trong y phục truyền thống người Việt.'
  },
  {
    id: 'quai-thao-offregion',
    level: 'info',
    category: 'vung-mien',
    when: all(is('headwearId', 'non-quai-thao'), not(is('garmentId', 'ao-tu-than'))),
    title: 'Nón quai thao thuộc bộ trang phục Kinh Bắc',
    message: 'Nón quai thao thường đi cùng áo tứ thân (Quan họ, Bắc Bộ), hiếm khi đi với trang phục cung đình hay áo tấc.',
    guidance: 'Nếu mặc cổ phục Huế, hãy chọn Nón lá; nếu mặc lễ phục, hãy chọn Khăn vấn hoặc Khăn đóng.',
    basis: 'Mỗi vùng văn hóa có bộ phục sức đặc trưng riêng.'
  },
  {
    id: 'ao-tac-pleated',
    level: 'info',
    category: 'cau-truc',
    when: all(is('garmentId', 'ao-tac'), is('bottomId', 'vay-xep-ly')),
    title: 'Gợi ý tỉ lệ cho Áo Tấc',
    message: 'Áo Tấc có vạt dài và tay thụng rộng; phối với chân váy xếp ly có thể làm rối phom dáng.',
    guidance: 'Quần lụa ống suông rộng chạm mu bàn chân sẽ tôn dáng áo thụng nhất.',
    basis: 'Phom dáng truyền thống của áo thụng đi kèm quần ống rộng.'
  },
  {
    id: 'imperial-yellow',
    level: 'info',
    category: 'mau-sac',
    when: all(is('colorId', 'hoang-yen'), CEREMONIAL),
    title: 'Vàng cung đình từng là màu hạn chế',
    message: 'Thời Nguyễn, sắc vàng đậm gắn với hoàng đế và hoàng tộc; dân thường không được dùng.',
    guidance: 'Ngày nay mặc chụp ảnh thì không sao, nhưng nên hiểu đây là màu tượng trưng cho vương quyền.',
    basis: 'Quy định sắc phục theo đẳng cấp thời phong kiến.'
  },

  // ───────────── KUDOS ─────────────
  {
    id: 'ngu-than-sneaker',
    level: 'kudos',
    category: 'remix',
    when: all(is('garmentId', 'ao-ngu-than'), is('footwearId', 'sneaker-trang'), not(SACRED)),
    title: 'Remix đúng tinh thần',
    message: 'Áo Ngũ Thân tay chẽn vốn là áo mặc thường ngày, nên phối sneaker cho sinh hoạt đời thường là hợp lý.',
    guidance: 'Giúp Việt phục bước ra đời sống hiện đại chứ không chỉ nằm trong bảo tàng.',
    basis: 'Áo tay chẽn là thường phục nên phù hợp với các biến tấu đời thường.'
  },
  {
    id: 'ao-tac-khan',
    level: 'kudos',
    category: 'tang-lop',
    when: all(is('garmentId', 'ao-tac'), is('headwearId', 'khan-van', 'khan-dong')),
    title: 'Chuẩn mực lễ phục',
    message: 'Áo Tấc đi cùng khăn vấn hoặc khăn đóng tạo nên hình ảnh trang nghiêm, đĩnh đạc.',
    guidance: 'Rất hợp với lễ gia tiên, rước dâu và chụp ảnh Tết.',
    basis: 'Bộ lễ phục truyền thống đầy đủ gồm áo thụng và khăn.'
  },
  {
    id: 'tu-than-quai-thao',
    level: 'kudos',
    category: 'vung-mien',
    when: all(is('garmentId', 'ao-tu-than'), is('headwearId', 'non-quai-thao')),
    title: 'Hồn Quan họ Bắc Bộ',
    message: 'Nón quai thao, yếm và áo tứ thân là hình ảnh biểu tượng của vùng Kinh Bắc.',
    guidance: 'Khi bước đi, hơi nghiêng nón để tạo nét duyên dáng.',
    basis: 'Bộ trang phục liền anh liền chị Quan họ.'
  },
  {
    id: 'nhat-binh-proper',
    level: 'kudos',
    category: 'tang-lop',
    when: all(is('garmentId', 'ao-nhat-binh'), is('bottomId', 'quan-lua-trang', 'quan-lua-den', 'vay-xep-ly')),
    title: 'Tôn trọn nét cung đình',
    message: 'Cổ áo hình chữ nhật và hai dải buông trước ngực là điểm đắt giá nhất của Nhật Bình.',
    guidance: 'Giữ tư thế khoan thai và để lộ trọn hoa văn trước ngực khi tạo dáng.',
    basis: 'Đặc trưng cấu trúc của áo Nhật Bình.'
  }
];

export const LEVEL_PENALTY: Record<CulturalRule['level'], number> = {
  critical: 30,
  warning: 12,
  info: 0,
  kudos: -5
};
