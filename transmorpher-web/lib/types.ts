export type ClassName = 'Warrior' | 'Paladin' | 'Hunter' | 'Rogue' | 'Priest' | 'Death Knight' | 'Shaman' | 'Mage' | 'Warlock' | 'Druid';

export interface GalleryItem {
  id: string;
  user_id: string;
  title: string;
  username: string;
  avatar_url: string | null;
  race: string;
  gender: string;
  visualWeight: string;
  likesCount: number;
  hasLiked: boolean;
  imageUrl: string;
  exportString: string;
}
