import { 
  GarmentId,
  GarmentDefinition, 
  ColorDefinition, 
  PatternDefinition, 
  ItemOption, 
  BottomId, 
  HeadwearId, 
  FootwearId, 
  AccessoryId, 
  EventId, 
  WeatherId, 
  LookbookPreset,
  OutfitConfig
} from '../types/vietphuc';

export const GARMENTS: GarmentDefinition[] = [
  {
    id: 'ao-tac',
    name: 'Áo Tấc (Áo Thụng)',
    dynasty: 'Triều Nguyễn (TK 19 - 20)',
    shortDesc: 'Lễ phục trang nghiêm với ống tay thụng rộng 30-50cm, cổ đứng cài 5 khuy kín đáo.',
    culturalSignificance: 'Áo Tấc là biểu tượng của sự đường bàng, lễ nghi và lòng tôn kính. Ống tay rộng buông chùng khi chắp tay tạo dáng chữ "Nhất", thể hiện tính khiêm hòa của người quân tử.',
    features: [
      'Tay thụng rộng buông quá bàn tay, mang nét đĩnh đạc, khoan thai',
      'Cổ áo đứng vuông góc ôm khít cổ (Lập lĩnh), cài 5 khuy cúc',
      'Độ dài vạt áo quá gối, thường mặc cùng áo lót lụa trắng bên trong'
    ],
    traditionalOccasions: ['Đại lễ triều đình', 'Cúng tế tổ tiên', 'Lễ gia tiên cưới hỏi', 'Dịp Tết Nguyên Đán'],
    modernVibe: 'Sang trọng, uy nghiêm kết hợp thần thái "Quiet Luxury" di sản cho Gen Z chụp kỷ yếu hoặc đi lễ.',
    recommendedColors: ['do-chu-sa', 'hoang-yen', 'lam-cham', 'tim-hue'],
    etiquetteNotes: [
      'Khi mặc Áo Tấc cần giữ tư thế ngay ngắn, hai tay chắp phía trước bụng trong vạt tay áo.',
      'Tránh xắn tay áo thụng lên tùy tiện vì làm mất phom dáng lễ nghi trang trọng.',
      'Không nên mặc cùng quần ngố hoặc trang phục hở hang bên dưới.'
    ],
    authenticity: 'documented',
    verificationNote: 'Có hiện vật và ảnh tư liệu thời Nguyễn. Số đo tay áo (30–50cm) là ước lượng tham khảo, thực tế thay đổi theo phẩm trật và thời kỳ.',
    sources: [
      { title: 'Ngàn năm áo mũ', author: 'Trần Quang Đức', publisher: 'Nhã Nam & NXB Thế Giới', year: '2013', type: 'book' },
      { title: 'Hiện vật lễ phục triều Nguyễn', publisher: 'Bảo tàng Cổ vật Cung đình Huế', type: 'museum' },
      { title: 'Trang phục Việt Nam', author: 'Đoàn Thị Tình', publisher: 'NXB Mỹ thuật', year: '2006', type: 'book' }
    ],
    targetGender: 'both',
    genderNote: 'Cả Nam & Nữ: Lễ phục trang nghiêm thời Nguyễn. Bản Nam phom rộng uy nghi, chắp tay phong thái quân tử; bản Nữ đoan trang, quyền quý.'
  },
  {
    id: 'ao-ngu-than',
    name: 'Áo Ngũ Thân (Tay Chẽn)',
    dynasty: 'Thời Chúa Nguyễn & Vua Minh Mạng chuẩn hóa',
    shortDesc: 'Trang phục chuẩn mực của người Việt xưa với 5 thân áo ôm thanh thoát, tay chẽn gọn gàng.',
    culturalSignificance: 'Là thường phục chuẩn của người Việt từ sau cải cách y phục thời chúa Nguyễn, mặc được cả trong sinh hoạt lẫn dịp lễ. Theo cách hiểu phổ biến trong dân gian, 5 thân áo tượng trưng cho cha mẹ hai bên ôm lấy thân con ở giữa, còn 5 khuy tượng trưng cho Ngũ thường (Nhân, Lễ, Nghĩa, Trí, Tín).',
    features: [
      '5 thân vải ghép lại: 2 thân trước, 2 thân sau và 1 thân con (tả lót) bên trong',
      'Ống tay chẽn gọn gàng, thuận tiện sinh hoạt hàng ngày lẫn công việc văn phòng/học đường',
      'Vạt áo uốn lượn hình cánh cung mềm mại, xẻ tà hai bên hông'
    ],
    traditionalOccasions: ['Sinh hoạt thường nhật của quan lại, sĩ tử và thị dân', 'Dạo hội xuân', 'Dạy học'],
    modernVibe: 'Streetwear Fusion đỉnh cao: cực hợp khi phối cùng sneaker trắng, kính râm và túi tote tối giản.',
    recommendedColors: ['lam-cham', 'ngoc-bich', 'trang-nga', 'den-mun', 'cam-bat-trang'],
    etiquetteNotes: [
      'Cài đủ 5 khuy cúc để giữ đúng biểu tượng Ngũ thường, không nên mở cúc phanh ngực bừa bãi.',
      'Ống tay chẽn ôm cổ tay thanh lịch, rất phù hợp mặc thường nhật của học sinh sinh viên.'
    ],
    authenticity: 'documented',
    verificationNote: 'Việc chúa Nguyễn Phúc Khoát định lệ y phục (1744) và vua Minh Mạng thống nhất trang phục (thập niên 1820–1830) được chép trong chính sử. Cách giải thích "5 thân = cha mẹ hai bên + bản thân" và "5 khuy = Ngũ thường" là diễn giải dân gian phổ biến, chưa thấy ghi trong văn bản gốc.',
    sources: [
      { title: 'Đại Nam thực lục (bản dịch)', publisher: 'Viện Sử học – NXB Giáo Dục', type: 'historical-record', note: 'Ghi chép cải cách y phục thời Nguyễn Phúc Khoát, Minh Mạng' },
      { title: 'Ngàn năm áo mũ', author: 'Trần Quang Đức', publisher: 'Nhã Nam & NXB Thế Giới', year: '2013', type: 'book' },
      { title: 'Trang phục Việt Nam', author: 'Đoàn Thị Tình', publisher: 'NXB Mỹ thuật', year: '2006', type: 'book' }
    ],
    targetGender: 'both',
    genderNote: 'Cả Nam & Nữ: Áo ngũ thân nam phom đứng đĩnh đạc, cổ cao nghiêm trang; áo ngũ thân nữ lượn eo nhẹ nhàng, vạt cánh cung thanh thoát.'
  },
  {
    id: 'ao-tu-than',
    name: 'Áo Tứ Thân & Yếm Đào',
    dynasty: 'Văn hóa Dân gian Đồng bằng Bắc Bộ',
    shortDesc: 'Vẻ đẹp mộc mạc, trữ tình xứ Kinh Bắc với 4 vạt áo thướt tha kết hợp yếm lụa và dải thắt lưng bao.',
    culturalSignificance: 'Trang phục thường ngày và ngày hội của phụ nữ đồng bằng Bắc Bộ, gắn với hình ảnh người phụ nữ tần tảo và dân ca Quan họ. Hai vạt trước có thể buộc lại với nhau hoặc để buông, tạo dáng gọn gàng và đoan trang.',
    features: [
      '4 vạt áo gồm 2 vạt sau may liền sống lưng và 2 vạt trước buông tơi hoặc buộc chéo',
      'Mặc lót yếm đào thắm màu bên trong, khoác ngoài dải thắt lưng lụa ngũ sắc',
      'Đi cùng nón quai thao hoặc khăn mỏ quạ đen tuyền Bắc Bộ'
    ],
    traditionalOccasions: ['Hội Lim Quan họ', 'Lễ hội làng quê Bắc Bộ', 'Dịp hát chèo dân gian'],
    modernVibe: 'Boho Heritage / Indie Folk: phối cùng chân váy xếp ly hiện đại, sandal dây quai mảnh hoặc guốc mộc.',
    recommendedColors: ['canh-sen', 'cam-bat-trang', 'hoang-yen', 'ngoc-bich'],
    etiquetteNotes: [
      'Yếm mặc bên trong cần vừa vặn, kín đáo vừa độ, không nên biến tấu hở hang quá mức làm mất nét đoan trang.',
      'Dải thắt lưng buông lơi tự nhiên phía trước hông tạo nhịp điệu thướt tha khi bước đi.'
    ],
    authenticity: 'documented',
    verificationNote: 'Trang phục dân gian Bắc Bộ, có ảnh tư liệu đầu thế kỷ 20 và hiện vật bảo tàng. Liên hệ "4 thân = 4 mùa / tứ thân phụ mẫu" là diễn giải dân gian. Quan họ Bắc Ninh là Di sản văn hóa phi vật thể đại diện của nhân loại (UNESCO, 2009).',
    sources: [
      { title: 'Trang phục truyền thống người Việt', publisher: 'Bảo tàng Dân tộc học Việt Nam', type: 'museum' },
      { title: 'Trang phục Việt Nam', author: 'Đoàn Thị Tình', publisher: 'NXB Mỹ thuật', year: '2006', type: 'book' },
      { title: 'Dân ca Quan họ Bắc Ninh – hồ sơ di sản', publisher: 'UNESCO', year: '2009', type: 'historical-record' }
    ],
    targetGender: 'female',
    genderNote: 'Dành cho Nữ giới: Nét đẹp mộc mạc, đoan trang của phụ nữ Kinh Bắc, đi cùng yếm thắm, thắt lưng bao và nón quai thao.'
  },
  {
    id: 'ao-nhat-binh',
    name: 'Áo Nhật Bình',
    dynasty: 'Lễ phục hậu phi, công chúa triều Nguyễn',
    shortDesc: 'Lễ phục lộng lẫy của nữ giới hoàng tộc, với cổ áo hình chữ nhật thêu hoa văn ngũ sắc và phượng.',
    culturalSignificance: 'Nhật Bình (cổ vuông/chữ nhật song song trước ngực) là hiện thân của trật tự vương quyền, phẩm trật cao quý và vẻ đẹp hoa mỹ tột bậc của cung đình Huế xưa.',
    features: [
      'Cổ áo chữ nhật đặc trưng thêu viền dải ngũ hành rực rỡ',
      'Hai dải thắt thả buông dài trước ngực với hoa văn bát bửu cát tường',
      'Cửa tay viền dải ngũ sắc (xanh, đỏ, vàng, trắng, chàm) đại diện ngũ phương'
    ],
    traditionalOccasions: ['Lễ tế Nam Giao', 'Hôn lễ quý tộc hoàng gia', 'Lễ tấn phong công chúa, hoàng hậu'],
    modernVibe: 'Vương giả & High-Fashion: diện trong lễ cưới cá nhân hoặc bộ ảnh kỷ yếu concept cung đình xa hoa.',
    recommendedColors: ['do-chu-sa', 'hoang-yen', 'tim-hue', 'ngoc-bich'],
    etiquetteNotes: [
      'Là trang phục mang tính lễ nghi cung đình cao, tuyệt đối không phối cùng trang phục quá bụi bặm như quần rách hay dép lê.',
      'Nên búi tóc gọn gàng hoặc đội khăn vành, bờm ngọc trai để tôn trọn vẹn phần cổ áo thêu công phu.'
    ],
    authenticity: 'documented',
    verificationNote: 'Có hiện vật tại Huế. Nhật bình là lễ phục/thường phục cao cấp của hậu phi, công chúa và nữ quan, không phải "triều phục" theo nghĩa hẹp. Màu sắc và hoa văn (phượng, rồng) phụ thuộc phẩm trật; bản mặc hiện nay là bản phỏng dựng.',
    sources: [
      { title: 'Hiện vật y phục hoàng gia triều Nguyễn', publisher: 'Bảo tàng Cổ vật Cung đình Huế', type: 'museum' },
      { title: 'Ngàn năm áo mũ', author: 'Trần Quang Đức', publisher: 'Nhã Nam & NXB Thế Giới', year: '2013', type: 'book' }
    ],
    targetGender: 'female',
    genderNote: 'Dành cho Nữ giới: Lễ phục cao quý của Hoàng Thái Hậu, Hoàng Hậu, Công Chúa và nữ quan triều đình Huế với cổ áo chữ nhật thêu hoa mỹ.'
  },
  {
    id: 'ao-giao-linh',
    name: 'Áo Giao Lĩnh (Cổ Chéo)',
    dynasty: 'Thời Lý - Trần - Lê sơ',
    shortDesc: 'Cổ áo vạt chéo đan qua ngực cổ kính, toát lên phong thái thư sinh nho nhã và khí phách ngàn năm.',
    culturalSignificance: 'Giao Lĩnh là cội nguồn của nhiều dạng thức trang phục cổ xưa, thể hiện tư duy đối xứng âm dương hài hòa trong văn hóa Á Đông hàng nghìn năm.',
    features: [
      'Vạt trái đè lên vạt phải (hữu nhậm – cổ áo tạo hình chữ "y"), thắt dây đai eo',
      'Phom dáng suông rộng, tạo cảm giác phiêu dật, phong nhã',
      'Cổ áo chéo hình chữ V kín đáo, tôn đường nét khuôn mặt'
    ],
    traditionalOccasions: ['Sĩ tử đi thi thời Lê', 'Tế lễ học sĩ', 'Sinh hoạt văn nhân đàm đạo'],
    modernVibe: 'Dark Academia / Minimalist Zen: phối cùng kính gọng tròn cổ điển, giày oxford và túi da thô mộc.',
    recommendedColors: ['lam-cham', 'trang-nga', 'den-mun', 'ngoc-bich'],
    etiquetteNotes: [
      'Quy tắc quan trọng: vạt trái đè lên vạt phải (hữu nhậm). Không mặc ngược (vạt phải đè trái – tả nhậm) vì theo quan niệm xưa đó là cách mặc cho người đã khuất.',
      'Đai thắt lưng nên thắt ngay ngắn giữa eo.'
    ],
    authenticity: 'reconstructed',
    verificationNote: 'Hiện vật vải thời Lý – Trần – Lê sơ gần như không còn; hình dáng được phỏng dựng từ tượng, tranh chân dung, bia ký và thư tịch. Các bản may hiện nay là phục dựng, chi tiết có thể khác nhau giữa các nhóm nghiên cứu.',
    sources: [
      { title: 'Ngàn năm áo mũ', author: 'Trần Quang Đức', publisher: 'Nhã Nam & NXB Thế Giới', year: '2013', type: 'book', note: 'Phần trang phục Lý – Trần – Lê' },
      { title: 'Tượng thờ, tranh chân dung các thời Lê – Mạc', publisher: 'Bảo tàng Lịch sử Quốc gia', type: 'museum' }
    ],
    targetGender: 'both',
    genderNote: 'Cả Nam & Nữ: Cổ phục thời Lý - Trần - Lê sơ cho cả văn nhân, sĩ tử nam giới lẫn nữ giới quý tộc với vạt chéo hữu nhậm.'
  },
  {
    id: 'ao-dai-tan-thoi',
    name: 'Áo Dài Tân Thời (Lemur Concept)',
    dynasty: 'Thập niên 1930 - Phong trào Thơ Mới',
    shortDesc: 'Sự giao thoa tuyệt mỹ giữa di sản ngũ thân và phong cách Art Deco phương Tây thời hoa lệ.',
    culturalSignificance: 'Đánh dấu bước ngoặt giải phóng hình thể phụ nữ Việt Nam, đề cao nét thanh xuân, tự tin bước vào thế giới hiện đại của giới trí thức trẻ Hà Thành xưa.',
    features: [
      'Phom dáng ôm sát eo nhẹ nhàng tôn dáng tự nhiên',
      'Cổ áo khoét tim nhẹ hoặc cổ bẻ thanh thoát cách điệu',
      'Hai tà buông dài chạm mắt cá chân, bay bổng trong gió'
    ],
    traditionalOccasions: ['Nữ sinh trường Đồng Khánh / Trưng Vương', 'Dạo phố hoa Hà Nội', 'Lễ hội nghệ thuật'],
    modernVibe: 'Y2K Retro Indochine: phối cùng kính mát râm, guốc mộc cao gót và bờm tóc bồng bềnh nữ tính.',
    recommendedColors: ['canh-sen', 'trang-nga', 'hoang-yen', 'lam-cham'],
    etiquetteNotes: [
      'Chọn chất liệu tơ tằm hoặc voan cát rủ vừa phải, tránh chất liệu mỏng manh xuyên thấu gây phản cảm.',
      'Nên kết hợp cùng quần lụa ống suông truyền thống hoặc váy suông để giữ bước đi khoan thai.'
    ],
    authenticity: 'modern',
    verificationNote: 'Là cải cách thời trang có tác giả: họa sĩ Nguyễn Cát Tường (Lemur) giới thiệu trên báo Phong Hóa năm 1934, sau đó họa sĩ Lê Phổ điều chỉnh. Đây là "truyền thống cận đại", nền tảng của áo dài ngày nay.',
    sources: [
      { title: 'Báo Phong Hóa – mục mốt y phục Lemur', publisher: 'Tự Lực Văn Đoàn', year: '1934', type: 'press' },
      { title: 'Trang phục Việt Nam', author: 'Đoàn Thị Tình', publisher: 'NXB Mỹ thuật', year: '2006', type: 'book' }
    ],
    targetGender: 'female',
    genderNote: 'Dành cho Nữ giới: Cải cách y phục của họa sĩ Lemur (1934) nhằm tôn vinh vóc dáng thanh xuân của phụ nữ Việt Nam thời Thơ Mới.'
  },
  // ⚠️ Append-only: share links encode catalog index. Add new items at the END.
  {
    id: 'ao-dai-hien-dai',
    name: 'Áo Dài Hiện Đại (Tay Raglan)',
    dynasty: 'Từ thập niên 1960 đến nay',
    shortDesc: 'Áo dài ôm dáng, tay raglan liền vai, cổ đứng 2–4cm, hai tà dài quá gối: trang phục truyền thống quen thuộc nhất của người Việt hôm nay.',
    culturalSignificance:
      'Kế thừa áo ngũ thân và cải cách Lemur, áo dài hiện đại trở thành biểu tượng văn hóa được mặc trong lễ Tết, cưới hỏi, trường học, công sở và các sự kiện ngoại giao. Đây là "truyền thống sống": vẫn tiếp tục được may, mặc và cách tân mỗi ngày.',
    features: [
      'Tay raglan nối chéo từ cổ xuống nách, giúp vai áo ôm tự nhiên, không nhăn',
      'Cổ đứng (cổ tàu) cao 2–4cm, hoặc cách tân thành cổ thuyền, cổ tim',
      'Thân áo ôm eo, xẻ tà hai bên từ eo, hai tà trước và sau dài quá gối đến mắt cá'
    ],
    traditionalOccasions: ['Tết Nguyên Đán', 'Lễ cưới, ăn hỏi', 'Đồng phục nữ sinh THPT', 'Lễ tốt nghiệp, kỷ yếu', 'Sự kiện ngoại giao, văn hóa'],
    modernVibe: 'Clean girl / Soft minimal: lụa trơn màu pastel, quần suông, sneaker trắng hoặc giày búp bê, túi mini và tóc buộc thấp.',
    recommendedColors: ['trang-nga', 'canh-sen', 'hoang-yen', 'ngoc-bich', 'do-chu-sa', 'tim-hue'],
    etiquetteNotes: [
      'Đi lễ chùa hoặc dự tang nên chọn màu trầm, trơn, tránh vải xuyên thấu và xẻ tà quá cao.',
      'Không cắt ngắn tà áo lên trên gối rồi vẫn gọi là "áo dài truyền thống". Nếu muốn cách tân, hãy gọi là "áo dài cách tân".',
      'Quần mặc cùng nên dài chạm gót, để tà áo buông thẳng khi đứng.'
    ],
    authenticity: 'modern',
    verificationNote:
      'Hình thành từ áo Lemur (1934), qua nhiều lần cải tiến. Kiểu tay raglan được các nhà may ở Sài Gòn phổ biến vào khoảng cuối thập niên 1950 đến 1960; tên nhà may và năm chính xác có nhiều tư liệu khác nhau. Các số đo trong phần mô tả chỉ mang tính tham khảo.',
    sources: [
      { title: 'Trang phục Việt Nam', author: 'Đoàn Thị Tình', publisher: 'NXB Mỹ thuật', year: '2006', type: 'book' },
      { title: 'Trưng bày trang phục người Việt thế kỷ 20', publisher: 'Bảo tàng Phụ nữ Việt Nam', type: 'museum' }
    ],
    targetGender: 'both',
    genderNote: 'Cả Nam & Nữ: Áo dài nữ chiết eo tà dài thướt tha; Áo dài nam hiện đại phom đứng đĩnh đạc, vạt qua gối lịch lãm.'
  },
  {
    id: 'ao-ba-ba',
    name: 'Áo Bà Ba Nam Bộ',
    dynasty: 'Nam Bộ, cuối thế kỷ 19 đến nay',
    shortDesc: 'Áo ngắn ngang hông, không cổ hoặc cổ tròn, xẻ tà nhỏ, cài nút giữa, thường có hai túi, là thường phục mộc mạc của miền sông nước.',
    culturalSignificance:
      'Gắn với đời sống lao động và sinh hoạt thường ngày ở Nam Bộ: gọn, thoáng, dễ xuống ghe, ra đồng. Áo bà ba đi cùng khăn rằn và nón lá đã thành hình ảnh quen thuộc của người miền Tây, được cả nam và nữ mặc.',
    features: [
      'Thân ngắn ngang hông, hai bên xẻ tà nhỏ',
      'Cổ tròn không bâu (hoặc cổ trái tim), hàng nút cài chính giữa phía trước',
      'Tay dài hơi rộng, thường có hai túi ở vạt trước; mặc với quần đen hoặc quần trắng'
    ],
    traditionalOccasions: ['Sinh hoạt, lao động thường ngày', 'Chợ nổi, lễ hội miền Tây', 'Đờn ca tài tử', 'Biểu diễn văn nghệ dân gian'],
    modernVibe: 'Mekong chill / Cottagecore: bà ba lụa trơn, quần ống suông, sandal quai mảnh, túi cói và nón lá. Rất hợp đi chụp ảnh ở chợ nổi hoặc quán cà phê vườn.',
    recommendedColors: ['trang-nga', 'den-mun', 'tim-hue', 'ngoc-bich', 'cam-bat-trang'],
    etiquetteNotes: [
      'Áo bà ba là thường phục. Dự đám cưới hay lễ trang trọng nên chọn áo dài.',
      'Chọn lụa hoặc vải cotton đứng dáng; tránh cắt ngắn để hở eo khi đi nơi đông người lớn tuổi.'
    ],
    authenticity: 'documented',
    verificationNote:
      'Có nhiều ảnh tư liệu đầu thế kỷ 20. Nguồn gốc tên gọi "bà ba" có nhiều giả thuyết (liên hệ với áo của người Baba/Peranakan ở Penang, hoặc gắn với một nhân vật cụ thể) nhưng chưa có kết luận thống nhất, nên ứng dụng không khẳng định giả thuyết nào.',
    sources: [
      { title: 'Trang phục truyền thống người Việt', publisher: 'Bảo tàng Dân tộc học Việt Nam', type: 'museum' },
      { title: 'Trang phục Việt Nam', author: 'Đoàn Thị Tình', publisher: 'NXB Mỹ thuật', year: '2006', type: 'book' }
    ],
    targetGender: 'both',
    genderNote: 'Cả Nam & Nữ: Thường phục Nam Bộ cho cả hai giới; Nam mặc phóng khoáng thuận tiện lao động, Nữ mặc chít eo nhẹ nhàng tôn nét duyên quê.'
  }
];

export const HERITAGE_COLORS: ColorDefinition[] = [
  {
    id: 'do-chu-sa',
    name: 'Đỏ Chu Sa (Son Cung Đình)',
    hex: '#A82424',
    element: 'Hỏa',
    meaning: 'Tượng trưng cho sự may mắn, quyền uy, hỷ khánh và nguồn năng lượng dồi dào của mặt trời.',
    culturalBackground: 'Thường thấy trên triều phục hoàng gia, câu đối Tết và sơn mài truyền thống làng Hạ Thái.'
  },
  {
    id: 'hoang-yen',
    name: 'Vàng Hoàng Yến (Vàng Cung Phủ)',
    hex: '#D4A017',
    element: 'Thổ',
    meaning: 'Màu của đất mẹ phì nhiêu, sự vương giả, tri thức sâu sắc và ánh bình minh rạng rỡ.',
    culturalBackground: 'Thời Nguyễn, các tông màu vàng đậm chỉ dành cho bậc chí tôn; sắc vàng dịu là sắc áo của sĩ tử thi hương.'
  },
  {
    id: 'lam-cham',
    name: 'Xanh Lam Chàm (Chàm Tây Bắc & Đại Dương)',
    hex: '#1D3557',
    element: 'Thủy',
    meaning: 'Đại diện cho sự điềm tĩnh, trường cửu, tri thức uyên bác và chiều sâu của lòng người quân tử.',
    culturalBackground: 'Màu nhuộm từ lá chàm tự nhiên gắn liền với đồng bào miền núi và trang phục thường nhật của sĩ phu Việt.'
  },
  {
    id: 'ngoc-bich',
    name: 'Xanh Ngọc Bích (Trúc Diệp)',
    hex: '#2A6F55',
    element: 'Mộc',
    meaning: 'Sự thanh cao, sức sống sinh sôi nảy nở của cây cỏ mùa xuân và phẩm giá trong sạch như ngọc quý.',
    culturalBackground: 'Lấy cảm hứng từ ngọc bích quý phái và rặng tre ngà thân thuộc của làng quê Việt Nam.'
  },
  {
    id: 'canh-sen',
    name: 'Hồng Cánh Sen (Yếm Đào Thắm)',
    hex: '#D95B78',
    element: 'Hỏa',
    meaning: 'Nét duyên ngầm e ấp, tinh khôi và vẻ đẹp thanh tân của người thiếu nữ Kinh Bắc.',
    culturalBackground: 'Màu nhuộm cánh sen từ phẩm điều tự nhiên, xuất hiện trong các làn điệu dân ca Quan họ và áo yếm truyền thống.'
  },
  {
    id: 'tim-hue',
    name: 'Tím Cố Đô (Tím Hoa Cà)',
    hex: '#5E3A6E',
    element: 'Thủy',
    meaning: 'Sự thủy chung, trầm mặc, hoài niệm sâu lắng và vẻ đẹp kín đáo của xứ Thần Kinh.',
    culturalBackground: 'Màu sắc đặc trưng gắn liền với tà áo dài nữ sinh Đồng Khánh bên dòng sông Hương thơ mộng.'
  },
  {
    id: 'trang-nga',
    name: 'Trắng Ngà Tơ Tằm',
    hex: '#F4EEDB',
    element: 'Kim',
    meaning: 'Sự thuần khiết, chân phương, mộc mạc và phẩm chất thanh tao không vướng bụi trần.',
    culturalBackground: 'Sắc trắng mộc tự nhiên của kén tằm dệt lụa Vạn Phúc (Hà Đông) chưa qua tẩy hóa chất.'
  },
  {
    id: 'den-mun',
    name: 'Đen Mun Huyền Bí (Mực Tàu)',
    hex: '#1E1E1E',
    element: 'Thủy',
    meaning: 'Sự đĩnh đạc, bí ẩn, trang nghiêm và nền tảng vững chãi của chữ nghĩa thư pháp.',
    culturalBackground: 'Dùng nhiều cho áo ngũ thân nam giới và khăn đóng, tạo nên phong thái trí thức đĩnh đạc.'
  },
  {
    id: 'cam-bat-trang',
    name: 'Cam Gạch Nung Bát Tràng',
    hex: '#B85D35',
    element: 'Thổ',
    meaning: 'Sự ấm áp, cần mẫn, gắn bó keo sơn với cội nguồn đất gốm nung ngàn đời.',
    culturalBackground: 'Lấy cảm hứng từ màu men gốm men rạn và sắc gạch nung lò bầu Bát Tràng cổ xưa.'
  }
];

export const PATTERNS: PatternDefinition[] = [
  {
    id: 'plain-silk',
    name: 'Lụa Trơn Vạn Phúc (Mộc)',
    description: 'Chất liệu lụa dệt mịn óng tự nhiên, không hoa văn cầu kỳ, tôn vinh phom dáng nguyên bản.',
    culturalOrigin: 'Làng lụa Vạn Phúc - Hà Đông hơn 1000 năm lịch sử.',
    symbolism: 'Vẻ đẹp chân phương "hữu xạ tự nhiên hương" của người thanh nhã.'
  },
  {
    id: 'van-may',
    name: 'Vân Mây Ngũ Sắc Triều Nguyễn',
    description: 'Đường mây cuộn uyển chuyển đan xen hình sóng nước thể hiện sự hanh thông, cát tường.',
    culturalOrigin: 'Hoa văn cung đình Huế thế kỷ 19.',
    symbolism: 'Mưa thuận gió hòa, vạn sự hanh thông và che chở từ đất trời.'
  },
  {
    id: 'hoa-sen',
    name: 'Hoa Sen Khắc Chìm (Thời Lý - Trần)',
    description: 'Cánh sen tỏa đều cách điệu theo phong cách mỹ thuật Phật giáo Đại Việt thế kỷ 11-13.',
    culturalOrigin: 'Chùa Phật Tích & Di tích Hoàng thành Thăng Long.',
    symbolism: 'Sự thanh tịnh, khí phách kiên cường "gần bùn mà chẳng hôi tanh mùi bùn".'
  },
  {
    id: 'bat-buu',
    name: 'Bát Bửu Cát Tường',
    description: 'Tám món báu vật quý (quạt lông, kiếm báu, bầu rượu, ống sáo...) dệt ẩn trên nền gấm.',
    culturalOrigin: 'Mỹ thuật trang trí cung đình và đền miếu cổ truyền.',
    symbolism: 'Hộ trì bình an, may mắn và trí tuệ cho người mang trên mình.'
  },
  {
    id: 'chu-tho',
    name: 'Chữ Thọ Cách Điệu Hoa Lá',
    description: 'Chữ Thọ triện tròn kết hợp dây leo uốn lượn thêu thủ công tinh xảo.',
    culturalOrigin: 'Trang phục quan viên và các cụ bô lão trong các dịp mừng thượng thọ.',
    symbolism: 'Sức khỏe trường tồn, phúc lộc song toàn và đạo hiếu vẹn tròn.'
  },
  {
    id: 'chu-dau',
    name: 'Họa Tiết Gốm Hoa Lam Chu Đậu',
    description: 'Họa tiết chim thiên nga và sóng nước đặc trưng của dòng gốm bác học thế kỷ 15.',
    culturalOrigin: 'Di chỉ khảo cổ gốm Chu Đậu (Hải Dương).',
    symbolism: 'Nét tinh tế, tài hoa và vẻ đẹp thuần Việt vươn tầm thế giới.'
  }
];

export const BOTTOMS: ItemOption<BottomId>[] = [
  {
    id: 'quan-lua-trang',
    name: 'Quần Lụa Trắng Ống Rộng',
    category: 'Truyền thống',
    description: 'Quần lụa trắng suông dài chạm mu bàn chân, phom dáng kinh điển thanh lịch của cổ phục.',
    genzTip: 'Chuẩn bài cho mọi dịp lễ nghi, tôn nét tao nhã khi bước đi.',
    formality: 'formal'
  },
  {
    id: 'quan-lua-den',
    name: 'Quần Lụa Đen Láng Hà Đông',
    category: 'Truyền thống',
    description: 'Quần đen tuyền bóng nhẹ, giữ độ đĩnh đạc và trầm ổn cho tổng thể trang phục.',
    genzTip: 'Rất hợp khi phối cùng áo màu Đỏ Chu Sa hoặc Cam Gạch để tạo độ tương phản mạnh mẽ.',
    formality: 'formal'
  },
  {
    id: 'vay-xep-ly',
    name: 'Chân Váy Xếp Ly Dài Cách Tân',
    category: 'Gen Z Remix',
    description: 'Chân váy xếp ly cạp cao hiện đại, bay bổng khi chuyển động.',
    genzTip: 'Phối cực đỉnh cùng Áo Tứ Thân hoặc Áo Ngũ Thân để tạo vibe thiếu nữ hiện đại dạo phố.',
    formality: 'semi-formal'
  },
  {
    id: 'quan-palazzo',
    name: 'Quần Palazzo Ống Rộng Cạp Cao',
    category: 'Gen Z Remix',
    description: 'Quần âu ống suông hiện đại với đường ly đứng sắc sảo.',
    genzTip: 'Hack chiều cao thần sầu cho các bạn trẻ khi chụp ảnh lookbook kỷ yếu.',
    formality: 'semi-formal'
  },
  {
    id: 'quan-jeans-suong',
    name: 'Quần Denim Ống Suông Streetwear',
    category: 'Streetwear Fusion',
    description: 'Quần bò denim xanh nhạt tạo nét phá cách bụi bặm nhưng trẻ trung.',
    genzTip: 'Chỉ nên diện đi cà phê cuối tuần hoặc triển lãm nghệ thuật; không mặc đến nơi thờ tự trang nghiêm.',
    formality: 'casual'
  }
];

export const HEADWEAR: ItemOption<HeadwearId>[] = [
  {
    id: 'none',
    name: 'Để Tự Nhiên / Tóc Hiện Đại',
    category: 'Gen Z',
    description: 'Tóc buông tự nhiên hoặc vuốt sáp nếp nhẹ nhàng hiện đại.',
    genzTip: 'Giữ vẻ tự nhiên, năng động cho các hoạt động thường ngày.',
    formality: 'casual'
  },
  {
    id: 'khan-van',
    name: 'Khăn Vấn Nhung Đen / Xanh',
    category: 'Truyền thống',
    description: 'Khăn vấn nhiều nếp ôm quanh đầu, nâng vầng trán sáng và tạo vẻ đoan trang quý phái.',
    genzTip: 'Điểm nhấn "signature" không thể thiếu cho Áo Tấc và Áo Ngũ Thân.',
    formality: 'formal'
  },
  {
    id: 'khan-dong',
    name: 'Khăn Đóng Xếp Nếp (Nam)',
    category: 'Truyền thống',
    description: 'Khăn đóng vải lụa hoặc nhung xếp nếp chữ "Nhân" trước trán.',
    genzTip: 'Khắc họa phong thái nho nhã của chàng trai sĩ tử thời hiện đại.',
    formality: 'formal'
  },
  {
    id: 'non-quai-thao',
    name: 'Nón Quai Thao (Nón Ba Tầm)',
    category: 'Dân gian',
    description: 'Nón tròn dẹt rộng vành lợp lá cọ tinh xảo, buông dải thao lụa mềm mại.',
    genzTip: 'Tuyệt phối với Áo Tứ Thân khi chụp ảnh concept đồng quê hoặc lễ hội văn hóa.',
    formality: 'semi-formal'
  },
  {
    id: 'non-la',
    name: 'Nón Lá Bài Thơ Xứ Huế',
    category: 'Truyền thống',
    description: 'Nón chóp nhọn khâu bằng lá cọ mỏng manh, soi dưới ánh nắng thấy ẩn hiện câu thơ.',
    genzTip: 'Mộc mạc nhưng che nắng cực tốt khi đi di tích Hoàng Thành hoặc phố cổ.',
    formality: 'semi-formal'
  },
  {
    id: 'bom-ngoc-trai',
    name: 'Bờm Nhung Đính Hạt Ngọc Trai',
    category: 'Gen Z Remix',
    description: 'Bờm cài tóc bọc nhung đính ngọc trai nước ngọt cách điệu từ khăn vấn.',
    genzTip: 'Trẻ trung, gọn nhẹ, dễ tháo cài và cực kỳ "ăn ảnh" trên Instagram.',
    formality: 'semi-formal'
  },
  {
    id: 'tram-cai-toc',
    name: 'Trâm Bạc Cài Tóc Hoa Mai',
    category: 'Di sản',
    description: 'Trâm kim loại mạ bạc hoặc đồng chạm khắc cành mai, gài trên búi tóc.',
    genzTip: 'Tôn nét cổ phong thanh khiết mà không hề nặng nề.',
    formality: 'formal'
  },
  {
    id: 'khan-ran',
    name: 'Khăn Rằn Nam Bộ',
    category: 'Dân gian',
    description: 'Khăn vải sọc caro đen trắng (hoặc nâu trắng) quàng cổ hay quấn đầu, gắn liền với người miền Tây sông nước.',
    genzTip: 'Quàng hờ quanh cổ khi mặc bà ba là đủ "chất" miền Tây. Có thể buộc làm băng đô cho vibe năng động.',
    formality: 'casual'
  }
];

export const FOOTWEAR: ItemOption<FootwearId>[] = [
  {
    id: 'sneaker-trang',
    name: 'Chunky Sneaker Trắng Tối Giản',
    category: 'Gen Z Remix',
    description: 'Giày thể thao trắng sạch sẽ, đế êm ái mang lại sự tương phản streetwear năng động.',
    genzTip: 'Cú twist thời thượng được giới trẻ toàn cầu nhiệt liệt hưởng ứng khi phối cùng Áo Ngũ Thân.',
    formality: 'casual'
  },
  {
    id: 'guoc-moc',
    name: 'Guốc Mộc Quai Nhung Cổ Truyền',
    category: 'Truyền thống',
    description: 'Guốc gỗ sơn mài hoặc gỗ mộc tự nhiên, quai nhung đỏ hoặc đen gõ tiếng "lách cách" thân thương.',
    genzTip: 'Đậm chất hồn quê Việt Nam, tôn dáng đứng thẳng thớm duyên dáng.',
    formality: 'semi-formal'
  },
  {
    id: 'giay-oxford',
    name: 'Giày Da Oxford / Derby Cổ Điển',
    category: 'Indochine Fusion',
    description: 'Giày da buộc dây màu nâu cánh gián hoặc đen bóng phong cách học đường xưa.',
    genzTip: 'Hoàn hảo cho vibe "Sĩ tử Kinh kỳ thời Thơ Mới" của các bạn sinh viên.',
    formality: 'formal'
  },
  {
    id: 'sandal-toi-gian',
    name: 'Sandal Dây Da Quai Mảnh',
    category: 'Tối giản',
    description: 'Sandal quai da mảnh màu be nhạt hoặc nâu thô, tạo sự thông thoáng trong mùa hè.',
    genzTip: 'Thoải mái khi đi bộ nhiều ngắm phố cổ hay tham quan bảo tàng.',
    formality: 'casual'
  },
  {
    id: 'boot-da-co-thap',
    name: 'Chelsea Boot Da Cổ Thấp',
    category: 'Gen Z Remix',
    description: 'Boot da đen phom đứng thời thượng, tạo phong thái cá tính mạnh mẽ.',
    genzTip: 'Tuyệt phối trong những ngày đông se lạnh Hà Nội.',
    formality: 'semi-formal'
  }
];

export const ACCESSORIES: ItemOption<AccessoryId>[] = [
  {
    id: 'kinh-mat-y2k',
    name: 'Kính Râm Retro Mắt Mèo Y2K',
    category: 'Gen Z Remix',
    description: 'Kính râm gọng đen cá tính tạo điểm nhấn thời trang đối lập cực cuốn.',
    genzTip: 'Tạo thần thái lạnh lùng "chic" như đang sải bước trên sàn diễn thời trang quốc tế.',
    formality: 'casual'
  },
  {
    id: 'kinh-gong-tron',
    name: 'Kính Mắt Gọng Kim Loại Tròn',
    category: 'Trí thức xưa',
    description: 'Kính cận tròn phong cách học giả trí thức đầu thế kỷ 20.',
    genzTip: 'Tăng 200% nét thông thái, thư sinh nho nhã.',
    formality: 'semi-formal'
  },
  {
    id: 'kieng-bac',
    name: 'Kiềng Bạc Chạm Hoa Mai',
    category: 'Truyền thống',
    description: 'Vòng kiềng tròn chạm hoa văn mai lan cúc trúc ôm trọn phần cổ áo.',
    genzTip: 'Món trang sức gia bảo kinh điển giúp bộ trang phục bừng sáng vẻ cao quý.',
    formality: 'formal'
  },
  {
    id: 'choker-ngoc-trai',
    name: 'Choker Chuỗi Ngọc Trai Nước Ngọt',
    category: 'Gen Z Remix',
    description: 'Dây chuyền ngọc trai hạt tròn nhỏ ôm cổ thời thượng.',
    genzTip: 'Pha trộn nét tiểu thư đài các với phong cách quiet-luxury hiện đại.',
    formality: 'formal'
  },
  {
    id: 'tui-tote-cham',
    name: 'Túi Tote Vải Chàm Thêu Thư Pháp',
    category: 'Thủ công',
    description: 'Túi vải canvas nhuộm chàm tự nhiên, thêu chữ Nôm hoặc họa tiết gốm Việt.',
    genzTip: 'Tiện đựng laptop, sổ tay sinh viên đi học hoặc sách dạo cà phê.',
    formality: 'casual'
  },
  {
    id: 'tui-coi-dan',
    name: 'Túi Cói Mây Tre Đan Làng Nghề',
    category: 'Sinh thái',
    description: 'Túi xách tròn đan thủ công từ mây tre cói làng Phú Vinh.',
    genzTip: 'Vừa thân thiện môi trường vừa là đạo cụ "sống ảo" siêu nghệ thuật.',
    formality: 'casual'
  },
  {
    id: 'quat-giay-do',
    name: 'Quạt Xếp Giấy Dó In Thơ Nôm',
    category: 'Di sản',
    description: 'Quạt nan tre dán giấy Dó thủ công, in họa tiết hoa sen hoặc thơ cổ.',
    genzTip: 'Vừa quạt mát những trưa hè vừa tạo dáng tạo nét khoan thai cổ điển.',
    formality: 'formal'
  },
  {
    id: 'dai-ngu-sac',
    name: 'Dải Lụa Thắt Lưng Ngũ Sắc',
    category: 'Dân gian',
    description: 'Dải thắt lưng gồm nhiều dải màu hoa sen, lục ngọc, vàng nghệ buông lơi bên hông.',
    genzTip: 'Điểm nhấn rực rỡ đặc trưng của Áo Tứ Thân Kinh Bắc.',
    formality: 'semi-formal'
  }
];

export const EVENTS: { id: EventId; name: string; desc: string; weather: WeatherId; recommendedGarments: GarmentId[] }[] = [
  {
    id: 'tet-du-xuan',
    name: 'Tết Du Xuân & Phố Cổ',
    desc: 'Không khí se lạnh rộn ràng cành đào cành mai, thăm chúc họ hàng và dạo phố chụp ảnh đầu năm.',
    weather: 'xuan-se-lanh',
    recommendedGarments: ['ao-tac', 'ao-ngu-than', 'ao-nhat-binh', 'ao-dai-hien-dai']
  },
  {
    id: 'ky-yeu-hoc-duong',
    name: 'Lễ Tốt Nghiệp & Kỷ Yếu',
    desc: 'Lưu giữ khoảnh khắc thanh xuân rực rỡ bên giảng đường, thầy cô và bạn bè đồng niên.',
    weather: 'thu-diu-mat',
    recommendedGarments: ['ao-dai-hien-dai', 'ao-ngu-than', 'ao-dai-tan-thoi', 'ao-giao-linh']
  },
  {
    id: 'le-chua-tam-linh',
    name: 'Đi Lễ Đền Chùa & Nơi Tôn Nghiêm',
    desc: 'Cầu bình an, tìm về chốn tịnh tâm đòi hỏi trang phục kín kẽ, đoan trang, tôn trọng tín ngưỡng.',
    weather: 'xuan-se-lanh',
    recommendedGarments: ['ao-tac', 'ao-ngu-than', 'ao-giao-linh', 'ao-dai-hien-dai']
  },
  {
    id: 'ca-phe-dao-pho',
    name: 'Cà Phê Cuối Tuần & Triển Lãm',
    desc: 'Gặp gỡ bạn bè, ghé art-gallery hoặc cà phê phố cổ với phong cách thời trang trẻ trung, thoải mái.',
    weather: 'thu-diu-mat',
    recommendedGarments: ['ao-ngu-than', 'ao-tu-than', 'ao-dai-tan-thoi', 'ao-ba-ba', 'ao-dai-hien-dai']
  },
  {
    id: 'dam-cuoi-ban-than',
    name: 'Dự Lễ Cưới & Gia Tiên',
    desc: 'Chia vui cùng ngày trọng đại của bạn thân, sang trọng vừa đủ, tôn vinh cô dâu chú rể.',
    weather: 'thu-diu-mat',
    recommendedGarments: ['ao-tac', 'ao-nhat-binh', 'ao-ngu-than', 'ao-dai-hien-dai']
  },
  {
    id: 'bieu-dien-van-nghe',
    name: 'Biểu Diễn Văn Nghệ & Lễ Hội Trường',
    desc: 'Sân khấu biểu diễn nghệ thuật, múa dân gian, hội trại sinh viên đầy năng lượng tươi trẻ.',
    weather: 'ha-oi-nong',
    recommendedGarments: ['ao-tu-than', 'ao-giao-linh', 'ao-ngu-than', 'ao-ba-ba']
  }
];

/** Công thức phối chuẩn cho từng sự kiện (đã kiểm tra không vi phạm luật văn hóa). */
export const EVENT_COMBOS: Record<EventId, Partial<OutfitConfig>> = {
  'tet-du-xuan': { garmentId: 'ao-tac', colorId: 'do-chu-sa', patternId: 'van-may', bottomId: 'quan-lua-trang', headwearId: 'khan-van', footwearId: 'guoc-moc', backdrop: 'hoang-thanh' },
  'ky-yeu-hoc-duong': { garmentId: 'ao-dai-hien-dai', colorId: 'lam-cham', patternId: 'van-may', bottomId: 'quan-lua-trang', headwearId: 'khan-van', footwearId: 'sneaker-trang', backdrop: 'pho-co' },
  'le-chua-tam-linh': { garmentId: 'ao-giao-linh', colorId: 'trang-nga', patternId: 'hoa-sen', bottomId: 'quan-lua-den', headwearId: 'khan-van', footwearId: 'giay-oxford', backdrop: 'studio-zen' },
  'ca-phe-dao-pho': { garmentId: 'ao-tu-than', colorId: 'canh-sen', patternId: 'plain-silk', bottomId: 'vay-xep-ly', headwearId: 'bom-ngoc-trai', footwearId: 'guoc-moc', backdrop: 'pho-co' },
  'dam-cuoi-ban-than': { garmentId: 'ao-nhat-binh', colorId: 'do-chu-sa', patternId: 'bat-buu', bottomId: 'quan-lua-trang', headwearId: 'khan-van', footwearId: 'guoc-moc', backdrop: 'hoang-thanh' },
  'bieu-dien-van-nghe': { garmentId: 'ao-tu-than', colorId: 'cam-bat-trang', patternId: 'plain-silk', bottomId: 'vay-xep-ly', headwearId: 'non-quai-thao', footwearId: 'guoc-moc', backdrop: 'pho-co' }
};

export const PRESET_LOOKBOOKS: LookbookPreset[] = [
  {
    id: 'look-1',
    title: 'Kinh Kỳ Tân Thời',
    subtitle: 'Áo Ngũ Thân × Chunky Sneaker',
    vibe: 'Modern Streetwear Heritage',
    tagline: 'Phối màu Lam Chàm uyên bác kết hợp giày thể thao trắng năng động dạo phố cổ Hà Nội.',
    story: 'Sự giao thoa giữa phom dáng ngũ thân 5 khuy chuẩn mực và năng lượng tràn trề của giới trẻ thế hệ Z.',
    curatorNotes: 'Điểm nhấn là chiếc kính râm Y2K và túi tote vải chàm thủ công tạo nên tổng thể cực kỳ "slay".',
    config: {
      garmentId: 'ao-ngu-than',
      colorId: 'lam-cham',
      patternId: 'van-may',
      bottomId: 'quan-lua-trang',
      headwearId: 'khan-van',
      footwearId: 'sneaker-trang',
      accessories: ['kinh-mat-y2k', 'tui-tote-cham'],
      targetEvent: 'ca-phe-dao-pho',
      modelGender: 'unisex',
      backdrop: 'pho-co'
    }
  },
  {
    id: 'look-2',
    title: 'Hoàng Thành Mộng Điệp',
    subtitle: 'Áo Tấc Đỏ Son × Kiềng Bạc Cung Đình',
    vibe: 'Royal Quiet Luxury',
    tagline: 'Sắc Đỏ Chu Sa hoàng tộc tỏa sáng uy nghiêm bên thành quách Cố Đô.',
    story: 'Ống tay thụng rộng buông dài khoan thai, cổ áo lập lĩnh cài 5 cúc đá quý tôn nét kiêu sa chuẩn mực.',
    curatorNotes: 'Phù hợp tuyệt đối cho lễ cưới gia tiên hoặc những ngày đầu xuân năm mới chúc phúc.',
    config: {
      garmentId: 'ao-tac',
      colorId: 'do-chu-sa',
      patternId: 'bat-buu',
      bottomId: 'quan-lua-trang',
      headwearId: 'khan-van',
      footwearId: 'guoc-moc',
      accessories: ['kieng-bac', 'quat-giay-do'],
      targetEvent: 'tet-du-xuan',
      modelGender: 'female',
      backdrop: 'hoang-thanh'
    }
  },
  {
    id: 'look-3',
    title: 'Hội Lim Thao Thiết',
    subtitle: 'Áo Tứ Thân × Váy Xếp Ly Dạo Phố',
    vibe: 'Bohemian Folk Remix',
    tagline: 'Sắc Hồng Cánh Sen thắm đượm tình người Quan họ kết hợp chân váy xếp ly hiện đại.',
    story: 'Hòa quyện vẻ mộc mạc dân gian với tinh thần tự do phóng khoáng của những tâm hồn yêu nghệ thuật.',
    curatorNotes: 'Nón quai thao buông dải thao đen tạo bố cục tròn đầy hoàn hảo cho từng khuôn hình.',
    config: {
      garmentId: 'ao-tu-than',
      colorId: 'canh-sen',
      patternId: 'hoa-sen',
      bottomId: 'vay-xep-ly',
      headwearId: 'non-quai-thao',
      footwearId: 'guoc-moc',
      accessories: ['dai-ngu-sac', 'tui-coi-dan'],
      targetEvent: 'bieu-dien-van-nghe',
      modelGender: 'female',
      backdrop: 'pho-co'
    }
  },
  {
    id: 'look-4',
    title: 'Thư Sinh Thăng Long',
    subtitle: 'Áo Giao Lĩnh × Kính Tròn Học Giả',
    vibe: 'Dark Academia Heritage',
    tagline: 'Vạt chéo cổ kính thời Lê kết hợp giày Oxford và sổ ký họa tay.',
    story: 'Hình ảnh người sĩ tử chăm chỉ dùi mài kinh sử nơi Quốc Tử Giám được tái hiện đầy khí chất.',
    curatorNotes: 'Tông màu Trắng Ngà tơ tằm phối cùng quần lụa đen tạo cảm giác thanh sạch, đĩnh đạc.',
    config: {
      garmentId: 'ao-giao-linh',
      colorId: 'trang-nga',
      patternId: 'plain-silk',
      bottomId: 'quan-lua-den',
      headwearId: 'khan-dong',
      footwearId: 'giay-oxford',
      accessories: ['kinh-gong-tron', 'tui-tote-cham'],
      targetEvent: 'ky-yeu-hoc-duong',
      modelGender: 'male',
      backdrop: 'hieu-anh'
    }
  }
];
