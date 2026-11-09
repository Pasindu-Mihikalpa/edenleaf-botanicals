import { TaxonomyCategory } from '../types';

export const TAXONOMY_CATEGORIES: TaxonomyCategory[] = [
  {
    id: 'flowers',
    name: 'Flowers',
    shortName: 'Flowers & Blooms',
    badge: 'Ornamental Blooms',
    description: 'Vibrant cut flowers, perennial garden stems, and fragrant flowering nursery cultivars.',
    count: 22,
    iconName: 'Flower2'
  },
  {
    id: 'foliage-herbs',
    name: 'Foliage & Herbs',
    shortName: 'Foliage & Herbs',
    badge: 'Herbal & Ferns',
    description: 'Culinary aromatic herbs, decorative indoor foliage, and lush heritage sword ferns.',
    count: 13,
    iconName: 'Leaf'
  },
  {
    id: 'indoors-succulents',
    name: 'Indoors, Cacti & Succulents',
    shortName: 'Indoors & Succulents',
    badge: 'Succulents & Cacti',
    description: 'Resilient architectural cacti, glaucous stonecrop succulents, and statement indoor flora.',
    count: 10,
    iconName: 'Sparkles'
  },
  {
    id: 'fruit-plants',
    name: 'Fruit Plants',
    shortName: 'Fruit & Orchard',
    badge: 'Commercial Cultivars',
    description: 'High-yield tissue-cultured tropical starter flora and fruiting nursery stock.',
    count: 1,
    iconName: 'Sprout'
  }
];
