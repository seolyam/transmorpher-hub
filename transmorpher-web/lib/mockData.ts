export type ClassName = 'Warrior' | 'Paladin' | 'Hunter' | 'Rogue' | 'Priest' | 'Death Knight' | 'Shaman' | 'Mage' | 'Warlock' | 'Druid';

export interface GalleryItem {
  id: string;
  title: string;
  author: string;
  race: string;
  gender: string;
  visualWeight: string;
  upvotes: number;
  imageUrl: string;
  exportString: string;
}

export const mockGalleryItems: GalleryItem[] = [
  {
    id: '1',
    title: 'Relentless Gladiator Warlock',
    author: 'Dotz',
    race: 'Undead',
    gender: 'Male',
    visualWeight: 'Medium',
    upvotes: 210,
    imageUrl: 'https://lh3.googleusercontent.com/aida/ADBb0ui-7IITkmOaYPzN_AxP6t4_JALh54Xf93TDnyNKE5ytyNNUtJQeBu7ZoGmTLKkX9wCTFgwDlKCsUJnr5-z7Ei_EmOSTdyi5YrJh_Lri84r8Y6hu058n_GqnfriILZ2v_xv2QX7cnkK8XXjh-tdNxU67dBgRszl1_E4rxJIQbu6ewzJGHYSfej_sgV9aWBgEq2cYqlJRD8pt9TzJV1DCxUwE5jBjtYKL-JXR4VP31OV7sqWM-568019Q_g',
    exportString: 'Transmorpher:WarlockPvP:xyz123'
  },
  {
    id: '2',
    title: 'Death Knight Tier 10 Heroic',
    author: 'Arthas_Fan',
    race: 'Human',
    gender: 'Male',
    visualWeight: 'Massive',
    upvotes: 128,
    imageUrl: 'https://lh3.googleusercontent.com/aida/ADBb0uhhwHlaLoezlOBVh4SBfTZ1idsMu9C0WS0pEONlSdnmJ6Z12uK_mjn1AyTgfU3M7wiIUfZoiyMuxsW-XOEAm3ZXqTJG9JL5WQVQP9PPqJaD2slRyItFAZNNGtyKnHz4AzxptSucEUQYgzL9Oo1sKRTp8HAsIgsew2vwYeHpw1Msw6uzrQNsgrQQLJo-0P5kCKmAq4W_yqjMu_l3FAWqLcG0kULOvgQWV0h1ZssIWVJKyctFzPk8zseqmQ',
    exportString: 'Transmorpher:DK_T10:xyz123'
  },
  {
    id: '3',
    title: 'Sunwell Plateau Priest',
    author: 'Lightbringer',
    race: 'Blood Elf',
    gender: 'Female',
    visualWeight: 'Light',
    upvotes: 85,
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    exportString: 'Transmorpher:PriestSunwell:xyz123'
  },
  {
    id: '4',
    title: 'T6 Warrior Classic Look',
    author: 'TankMain',
    race: 'Orc',
    gender: 'Male',
    visualWeight: 'Heavy',
    upvotes: 91,
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    exportString: 'Transmorpher:WarriorT6:xyz123'
  },
  {
    id: '5',
    title: 'Ulduar Rogue T8',
    author: 'ShadowStep',
    race: 'Undead',
    gender: 'Female',
    visualWeight: 'Light',
    upvotes: 64,
    imageUrl: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&auto=format&fit=crop&q=80',
    exportString: 'Transmorpher:RogueUlduar:xyz123'
  },
  {
    id: '6',
    title: 'Val\'anyr Shaman Set',
    author: 'Thunder',
    race: 'Tauren',
    gender: 'Male',
    visualWeight: 'Medium',
    upvotes: 42,
    imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&auto=format&fit=crop&q=80',
    exportString: 'Transmorpher:ShamanValanyr:xyz123'
  }
];
