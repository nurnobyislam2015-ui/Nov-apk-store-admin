
import { AppData } from './types';

export const APP_CATEGORIES = [
  'সব (All)', 
  'জনপ্রিয় (Popular)',
  'বাংলাদেশী (BD Local)',
  'গেমস (Games)', 
  'টুলস (Tools)',
  'সোশ্যাল (Social)',
  'ফিনটেক (Fintech)',
  'বিনোদন (OTT)',
  'শিক্ষা (Edu)'
];

const SCREENSHOTS = [
  'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=600'
];

export const MOCK_APPS: AppData[] = [
  {
    id: '1',
    name: 'নোভা মেসেঞ্জার',
    developer: 'Nova Labs',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=messenger&backgroundColor=4f46e5',
    banner: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&q=80&w=1200',
    screenshots: SCREENSHOTS,
    description: 'খুব দ্রুত এবং নিরাপদ মেসেজিং অ্যাপ। এতে পাবেন এন্ড-টু-এেন্ড এনক্রিপশন সুবিধা। নূর নবী ইসলামের তত্ত্বাবধানে এটি সম্পূর্ণ নিরাপদ।',
    category: 'সোশ্যাল (Social)',
    rating: 4.8,
    downloads: '10M+',
    size: '42MB',
    version: '3.1.0',
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'nagad-001',
    name: 'নগদ (Nagad)',
    developer: 'Nagad Ltd',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=nagad&backgroundColor=f44336',
    banner: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&q=80&w=1200',
    description: 'বাংলাদেশের সবচেয়ে দ্রুত বর্ধনশীল ডিজিটাল ফিন্যান্সিয়াল সার্ভিস। মোবাইল রিচার্জ, ক্যাশ আউট এবং পেমেন্ট করুন খুব সহজেই।',
    category: 'ফিনটেক (Fintech)',
    rating: 4.9,
    downloads: '50M+',
    size: '35MB',
    version: '5.2.1',
    status: 'published'
  },
  {
    id: 'pathao-002',
    name: 'পাঠাও (Pathao)',
    developer: 'Pathao Inc',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=pathao&backgroundColor=e91e63',
    banner: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1200',
    description: 'রাইড শেয়ারিং, ফুড ডেলিভারি এবং কুরিয়ার সার্ভিস - সব পাবেন এক অ্যাপে। মুভ করুন যখন খুশি, যেখানে খুশি।',
    category: 'বাংলাদেশী (BD Local)',
    rating: 4.7,
    downloads: '5M+',
    size: '55MB',
    version: '4.8.0',
    status: 'published'
  },
  {
    id: 'chorki-003',
    name: 'চরকি (Chorki)',
    developer: 'Mediastar Ltd',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=chorki&backgroundColor=ff9800',
    banner: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&q=80&w=1200',
    description: 'সেরা বাংলা কন্টেন্টের প্রিমিয়াম ওটিটি প্ল্যাটফর্ম। অরিজিনাল সিনেমা, ওয়েব সিরিজ এবং ড্রামা উপভোগ করুন যেকোনো সময়।',
    category: 'বিনোদন (OTT)',
    rating: 4.6,
    downloads: '1M+',
    size: '28MB',
    version: '2.1.5',
    status: 'published'
  },
  {
    id: 'shikho-004',
    name: 'শিখো (Shikho)',
    developer: 'Shikho Tech',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=shikho&backgroundColor=2196f3',
    banner: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200',
    description: 'অনলাইন লার্নিং এর সেরা অ্যাপ। এস এস সি, এইচ এস সি এবং অ্যাডমিশন প্রস্তুতির জন্য অ্যানিমেটেড লেসন এবং কুইজ।',
    category: 'শিক্ষা (Edu)',
    rating: 4.9,
    downloads: '2M+',
    size: '48MB',
    version: '3.0.1',
    status: 'published'
  },
  {
    id: 'tenms-005',
    name: '10 Minute School',
    developer: '10MS Team',
    icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=10ms&backgroundColor=4caf50',
    banner: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200',
    description: 'বাংলাদেশের বৃহত্তম লার্নিং প্ল্যাটফর্ম। একাডেমিক ক্লাস থেকে শুরু করে স্কিল ডেভেলপমেন্ট - সব শিখুন বিনামূল্যে।',
    category: 'শিক্ষা (Edu)',
    rating: 4.8,
    downloads: '10M+',
    size: '30MB',
    version: '4.5.2',
    status: 'published'
  }
];
