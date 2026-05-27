export type ClassName = 'Warrior' | 'Paladin' | 'Hunter' | 'Rogue' | 'Priest' | 'Death Knight' | 'Shaman' | 'Mage' | 'Warlock' | 'Druid';

export interface GalleryItem {
  id: string;
  user_id: string;
  title: string;
  author: string;
  race: string;
  gender: string;
  visualWeight: string;
  upvotes: number;
  imageUrl: string;
  exportString: string;
}
