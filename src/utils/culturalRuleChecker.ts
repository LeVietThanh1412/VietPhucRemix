import { OutfitConfig, CulturalAlert } from '../types/vietphuc';
import { GARMENTS } from '../data/heritageData';

export function checkCulturalEtiquette(config: OutfitConfig): CulturalAlert[] {
  const alerts: CulturalAlert[] = [];
  const garment = GARMENTS.find(g => g.id === config.garmentId);

  // Check 1: Solemn temple / sacred places (Lễ chùa tâm linh)
  if (config.targetEvent === 'le-chua-tam-linh') {
    if (config.bottomId === 'quan-jeans-suong') {
      alerts.push({
        level: 'warning',
        title: 'Cảnh báo bối cảnh trang nghiêm',
        message: 'Đi lễ chùa hoặc nơi thờ tự không nên mặc quần jeans bụi bặm cùng cổ phục.',
        guidance: 'Nên đổi sang Quần Lụa Trắng hoặc Quần Lụa Đen dài trang nhã để thể hiện sự cung kính với tiền nhân.'
      });
    }

    if (config.accessories.includes('kinh-mat-y2k')) {
      alerts.push({
        level: 'warning',
        title: 'Lưu ý phụ kiện nơi cửa Phật',
        message: 'Kính râm đen Y2K chỉ phù hợp dạo phố, chụp lookbook thời trang.',
        guidance: 'Khi vào dâng hương, nên tháo kính râm để giữ ánh mắt thành tâm và thần sắc tôn nghiêm.'
      });
    }

    if (config.footwearId === 'sandal-toi-gian') {
      alerts.push({
        level: 'warning',
        title: 'Khuyến nghị giày dép trang trọng',
        message: 'Dép lê hoặc quai mảnh hở ngón chân có thể bị coi là kém chỉn chu tại chốn thiền môn.',
        guidance: 'Guốc mộc truyền thống hoặc giày bít mũi là lựa chọn vẹn toàn nhất.'
      });
    }
  }

  // Check 2: Áo Nhật Bình (Triều phục hoàng gia)
  if (config.garmentId === 'ao-nhat-binh') {
    if (config.bottomId === 'quan-jeans-suong') {
      alerts.push({
        level: 'warning',
        title: 'Lệch chuẩn triều phục cung đình',
        message: 'Áo Nhật Bình là dạng thức áo cao quý nhất của triều Nguyễn, không phù hợp phối với quần bò denim.',
        guidance: 'Hãy chọn Quần lụa trắng hoặc lụa đen để giữ đúng cốt cách vương giả của áo.'
      });
    } else {
      alerts.push({
        level: 'kudos',
        title: 'Bảo tồn nét hoa mỹ cung đình',
        message: 'Cổ áo hình chữ nhật viền ngũ sắc và hai dải thắt buông tơi là điểm đắt giá nhất của Nhật Bình.',
        guidance: 'Nên giữ tư thế khoan thai và để lộ trọn vẹn hoa văn chữ nhật trước ngực khi tạo dáng.'
      });
    }
  }

  // Check 3: Áo Tấc (Lễ phục trang trọng)
  if (config.garmentId === 'ao-tac') {
    if (config.bottomId === 'vay-xep-ly') {
      alerts.push({
        level: 'info',
        title: 'Gợi ý tỉ lệ trang phục Áo Tấc',
        message: 'Áo Tấc có vạt rất dài và tay thụng rộng, khi mặc chân váy xếp ly có thể làm mất phom dáng chữ Nhất truyền thống.',
        guidance: 'Quần lụa ống suông rộng chạm mu bàn chân sẽ tôn dáng áo thụng đẹp và bay bổng nhất.'
      });
    }

    if (config.headwearId === 'khan-van' || config.headwearId === 'khan-dong') {
      alerts.push({
        level: 'kudos',
        title: 'Chuẩn mực lễ phục truyền thống',
        message: 'Sự kết hợp giữa Áo Tấc và Khăn vấn/Khăn đóng tạo nên hình ảnh trang nghiêm, đĩnh đạc tuyệt đối.',
        guidance: 'Rất được hoan nghênh trong các dịp lễ gia tiên, rước dâu và chụp ảnh Tết.'
      });
    }
  }

  // Check 4: Áo Ngũ Thân kết hợp Sneaker Gen Z
  if (config.garmentId === 'ao-ngu-than' && config.footwearId === 'sneaker-trang') {
    alerts.push({
      level: 'kudos',
      title: 'Gen Z Remix thời thượng!',
      message: 'Áo Ngũ Thân tay chẽn gọn gàng phối cùng sneaker trắng là công thức phối đồ văn minh được cộng đồng giới trẻ khen ngợi.',
      guidance: 'Mang lại sự năng động, giúp Việt phục bước ra đời sống hiện đại chứ không chỉ nằm trong viện bảo tàng.'
    });
  }

  // Check 5: Áo Tứ Thân
  if (config.garmentId === 'ao-tu-than' && config.headwearId === 'non-quai-thao') {
    alerts.push({
      level: 'kudos',
      title: 'Hồn quê Quan họ Bắc Bộ',
      message: 'Hình ảnh nón ba tầm quai thao kết hợp yếm đào và áo tứ thân là biểu tượng kinh điển của cái nôi văn hiến Kinh Bắc.',
      guidance: 'Khi bước đi, nhịp nón nghiêng che vừa e ấp vừa duyên dáng.'
    });
  }

  // Default cultural appreciation
  if (alerts.length === 0) {
    alerts.push({
      level: 'kudos',
      title: 'Phối đồ chuẩn nét thanh lịch',
      message: `Phương án phối trang phục ${garment?.name || 'Việt phục'} hài hòa, giữ trọn vẹn sự tôn trọng với giá trị văn hóa tiền nhân.`,
      guidance: 'Tự tin diện outfit này trong các buổi chụp ảnh hoặc sự kiện văn hóa!'
    });
  }

  return alerts;
}
