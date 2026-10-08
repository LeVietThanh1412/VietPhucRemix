import { EVENT_COMBOS, GARMENTS } from '../data/heritageData';
import { EventId, ModelGender, OutfitConfig } from '../types/vietphuc';

/** A complete recipe must not inherit accessories or rendering overrides from the old look. */
export function eventCombo(event: EventId, gender: ModelGender = 'unisex'): Partial<OutfitConfig> {
  const combo: Partial<OutfitConfig> = {
    ...EVENT_COMBOS[event], targetEvent: event, accessories: [],
    customColorHex: undefined, layerVisibility: undefined
  };
  if (gender === 'male' && GARMENTS.find(g => g.id === combo.garmentId)?.targetGender === 'female') {
    combo.garmentId = event === 'dam-cuoi-ban-than' ? 'ao-tac' : 'ao-ngu-than';
    combo.bottomId = 'quan-lua-trang';
    combo.headwearId = 'khan-dong';
  }
  return combo;
}
