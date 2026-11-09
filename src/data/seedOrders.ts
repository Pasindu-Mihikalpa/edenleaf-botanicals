import { OrderRecord } from '../types';
import { ALL_PRODUCTS } from './products';

export const SEED_ORDERS: OrderRecord[] = [
  {
    id: 'ORD-8421',
    customerName: 'Victoria Sterling',
    phone: '+1 (555) 349-8812',
    email: 'victoria.sterling@estateflora.com',
    address: '742 Highland Crest Blvd, Penthouse 12A',
    notes: 'Please ensure ceramic moss pole is secured during courier transit.',
    items: [
      { product: ALL_PRODUCTS.find((p) => p.id === 'hayleys-fl-03') || ALL_PRODUCTS[2], quantity: 2 },
      { product: ALL_PRODUCTS.find((p) => p.id === 'hayleys-fh-08') || ALL_PRODUCTS[29], quantity: 1 }
    ],
    subtotal: 51.00,
    delivery: 0,
    total: 51.00,
    date: new Date(Date.now() - 3600000 * 3).toISOString(),
    dispatchMethod: 'WhatsApp',
    status: 'Pending'
  },
  {
    id: 'ORD-8419',
    customerName: 'Julian Beaumont',
    phone: '+1 (555) 782-9904',
    email: 'j.beaumont@botanicarch.design',
    address: '88 Conservatory Lane, Glasshouse Suite 3',
    notes: 'Gate entry code is #4092. Direct greenhouse delivery preferred.',
    items: [
      { product: ALL_PRODUCTS.find((p) => p.id === 'hayleys-fl-10') || ALL_PRODUCTS[9], quantity: 3 },
      { product: ALL_PRODUCTS.find((p) => p.id === 'hayleys-is-02') || ALL_PRODUCTS[36], quantity: 2 }
    ],
    subtotal: 104.00,
    delivery: 0,
    total: 104.00,
    date: new Date(Date.now() - 3600000 * 14).toISOString(),
    dispatchMethod: 'WhatsApp',
    status: 'Confirmed'
  },
  {
    id: 'ORD-8415',
    customerName: 'Eleanor Vance',
    phone: '+1 (555) 621-4309',
    email: 'eleanor.vance@solarium.org',
    address: '124 Evergreen Terrace, Suite 4B',
    notes: 'Leave under covered shaded veranda if away.',
    items: [
      { product: ALL_PRODUCTS.find((p) => p.id === 'hayleys-is-01') || ALL_PRODUCTS[35], quantity: 1 },
      { product: ALL_PRODUCTS.find((p) => p.id === 'hayleys-fh-01') || ALL_PRODUCTS[22], quantity: 1 }
    ],
    subtotal: 39.50,
    delivery: 0,
    total: 39.50,
    date: new Date(Date.now() - 3600000 * 28).toISOString(),
    dispatchMethod: 'Email',
    status: 'Dispatched'
  },
  {
    id: 'ORD-8408',
    customerName: 'Dr. Harrison Hayes',
    phone: '+1 (555) 890-2134',
    email: 'h.hayes@arboretum.edu',
    address: '450 Botanical Conservatory Way, Bio-Lab 2',
    notes: 'Delivered to greenhouse reception. Signed by Dr. Hayes.',
    items: [
      { product: ALL_PRODUCTS.find((p) => p.id === 'hayleys-fp-01') || ALL_PRODUCTS[45], quantity: 4 },
      { product: ALL_PRODUCTS.find((p) => p.id === 'hayleys-fl-11') || ALL_PRODUCTS[10], quantity: 1 }
    ],
    subtotal: 112.00,
    delivery: 0,
    total: 112.00,
    date: new Date(Date.now() - 3600000 * 72).toISOString(),
    dispatchMethod: 'WhatsApp',
    status: 'Delivered'
  }
];
