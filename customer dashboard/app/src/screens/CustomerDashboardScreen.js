import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, ScrollView,
  Dimensions, TextInput, Platform, Modal, Alert, KeyboardAvoidingView, Animated
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');

// DUMMY DATA (NO FRUITS)
const BANNERS = [
  { id: 1, type: 'harvest', title: 'Fresh Summer Harvest', sub: 'Fast moving seasonal crops', bg: '#4ade80', image: 'https://images.unsplash.com/photo-1595802166542-fb75e0325bdf?w=800&q=80' },
  { id: 2, type: 'organic', title: 'Organic Farmers Market', sub: '100% Certified Organic', bg: '#facc15', image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80' },
];

const HARVEST_PRODUCTS = [
  { id: 201, name: 'Red Tomatoes', farmer: 'Ramesh Patel', rating: '4.9', price: 30, discount: '10% OFF', stock: '25 kg left', harvestTime: 'Harvested 2 hours ago', distance: '2.5 km away', delivery: 'Arrives in 30 mins', freshness: '98%', image: '🍅', farmImg: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=200&q=80' },
  { id: 202, name: 'Fresh Potatoes', farmer: 'Suresh Kumar', rating: '4.6', price: 25, discount: '15% OFF', stock: '120 kg left', harvestTime: 'Harvested Today', distance: '5 km away', delivery: 'Arrives in 45 mins', freshness: '95%', image: '🥔', farmImg: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&q=80' },
  { id: 203, name: 'Sweet Corn', farmer: 'Farm Fresh', rating: '4.8', price: 40, discount: '5% OFF', stock: 'Only 15 kg left', harvestTime: 'Harvested 4 hours ago', distance: '8 km away', delivery: 'Arrives in 1 hr', freshness: '96%', image: '🌽', farmImg: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&q=80' },
  { id: 204, name: 'Fresh Spinach', farmer: 'Leafy Greens', rating: '4.7', price: 20, discount: 'No Off', stock: '40 bundles left', harvestTime: 'Harvested 1 hour ago', distance: '1.2 km away', delivery: 'Arrives in 20 mins', freshness: '100%', image: '🥬', farmImg: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=200&q=80' },
  { id: 205, name: 'Lady Finger', farmer: 'Kisan Agri', rating: '4.5', price: 45, discount: '5% OFF', stock: '30 kg left', harvestTime: 'Harvested Today', distance: '6 km away', delivery: 'Arrives in 50 mins', freshness: '95%', image: '🥒', farmImg: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&q=80' },
  { id: 206, name: 'Fresh Harvest Bajra', farmer: 'Rural Hub', rating: '4.8', price: 25, discount: 'No Off', stock: '400 kg left', harvestTime: 'Harvested Yesterday', distance: '10 km away', delivery: 'Arrives in 1 hr', freshness: '99%', image: '🌾', farmImg: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&q=80' },
  { id: 207, name: 'Farm Fresh Maize', farmer: 'Golden Farms', rating: '4.6', price: 20, discount: '10% OFF', stock: '300 kg left', harvestTime: 'Harvested Today', distance: '8 km away', delivery: 'Arrives in 1.5 hr', freshness: '95%', image: '🌽', farmImg: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&q=80' },
  { id: 208, name: 'Organic Tomato', farmer: 'Eco Kisan', rating: '4.9', price: 80, discount: '10% OFF', stock: '10 kg left', harvestTime: 'Harvested Today', distance: '1.5 km away', delivery: 'Arrives in 30 mins', freshness: '99%', image: '🍅', farmImg: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=200&q=80' },
  { id: 209, name: 'Organic Spinach', farmer: 'Leafy Organics', rating: '4.9', price: 40, discount: 'No Off', stock: '30 bundles left', harvestTime: 'Harvested 1 hour ago', distance: '2 km away', delivery: 'Arrives in 20 mins', freshness: '100%', image: '🥬', farmImg: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=200&q=80' },
  { id: 210, name: 'Fresh Harvest Chana Dal', farmer: 'Eco Pulses', rating: '4.7', price: 90, discount: 'No Off', stock: '80 kg left', harvestTime: 'Harvested Last Week', distance: '12 km away', delivery: 'Arrives in 1 hr', freshness: '98%', image: '🥣', farmImg: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&q=80' },
  { id: 211, name: 'Natural Black Chana', farmer: 'Desi Chana Farm', rating: '4.8', price: 80, discount: '5% OFF', stock: '200 kg left', harvestTime: 'Harvested Recently', distance: '8 km away', delivery: 'Arrives in 1 hr', freshness: '95%', image: '🥣', farmImg: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&q=80' },
  { id: 212, name: 'High Yield Maize Seeds', farmer: 'Golden Farms', rating: '4.7', price: 800, discount: 'No Off', stock: '100 bags left', harvestTime: 'New Arrival', distance: '20 km away', delivery: 'Arrives in 1 day', freshness: '90% Germ', image: '🌱', farmImg: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&q=80' },
  { id: 213, name: 'Disease Resistant Chilli Seeds', farmer: 'Spicy Naturals', rating: '4.9', price: 500, discount: '5% OFF', stock: '110 pkts left', harvestTime: 'New Arrival', distance: '15 km away', delivery: 'Arrives in 2 days', freshness: '98% Germ', image: '🌱', farmImg: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&q=80' },
  { id: 214, name: 'Rainy Season Maize', farmer: 'Golden Farms', rating: '4.8', price: 25, discount: 'No Off', stock: '400 kg left', harvestTime: 'Harvested Today', distance: '20 km away', delivery: 'Arrives in 1 day', freshness: '98%', image: '🌽', farmImg: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&q=80' },
  { id: 215, name: 'Seasonal Fresh Peas', farmer: 'Green Pods', rating: '4.8', price: 60, discount: '5% OFF', stock: '150 kg left', harvestTime: 'New Arrival', distance: '15 km away', delivery: 'Arrives in 2 days', freshness: '100%', image: '🟢', farmImg: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&q=80' },
];

const ORGANIC_PRODUCTS = [
  { id: 301, name: 'Sharbati Wheat', farmer: 'Kisan Organics', rating: '4.9', price: 65, sustainability: '99%', certification: 'APEDA Certified', ecoBadge: 'Zero Chemical', story: 'Grown using ancient Vedic farming techniques without any synthetic pesticides.', image: '🌾', farmerImg: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=100&q=80' },
  { id: 302, name: 'Organic Onions', farmer: 'Green Earth Farm', rating: '4.8', price: 45, sustainability: '95%', certification: 'Jaivik Bharat', ecoBadge: 'Eco-Friendly Pack', story: 'Our farm runs 100% on solar power. We use natural compost for all our crops.', image: '🧅', farmerImg: 'https://images.unsplash.com/photo-1558904541-efa843a96f0a?w=100&q=80' },
  { id: 303, name: 'Desi Garlic (लहसुन)', farmer: 'Patel Naturals', rating: '4.9', price: 120, sustainability: '97%', certification: 'NPOP Certified', ecoBadge: 'Rainwater Harvested', story: 'Handpicked and dried naturally under the sun to preserve maximum flavor.', image: '🧄', farmerImg: 'https://images.unsplash.com/photo-1595802166542-fb75e0325bdf?w=100&q=80' },
  { id: 304, name: 'Organic Coriander', farmer: 'Aromatic Farm', rating: '4.9', price: 15, sustainability: '98%', certification: 'Jaivik Bharat', ecoBadge: 'Freshly Cut', story: 'Grown in nutrient-rich soil with zero chemical fertilizers. Pure aroma.', image: '🌿', farmerImg: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=100&q=80' },
  { id: 305, name: 'Organic Beetroot', farmer: 'Healthy Harvest', rating: '4.8', price: 40, sustainability: '96%', certification: 'Organic India', ecoBadge: 'Non-GMO', story: 'Earth-fresh beetroots, rich in iron and naturally sweet. Harvested today.', image: '🪴', farmerImg: 'https://images.unsplash.com/photo-1558904541-efa843a96f0a?w=100&q=80' },
  { id: 306, name: 'Organic Brown Rice', farmer: 'Healthy Grains', rating: '4.7', price: 85, sustainability: '96%', certification: 'Jaivik Bharat', ecoBadge: 'Unpolished', story: 'Retains the highly nutritious bran layer. Grown without synthetic chemicals.', image: '🍚', farmerImg: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=100&q=80' },
  { id: 307, name: 'Natural Oats', farmer: 'Morning Mills', rating: '4.8', price: 60, sustainability: '98%', certification: 'NPOP Certified', ecoBadge: 'Whole Grain', story: 'Freshly rolled oats from sustainably managed farms.', image: '🥣', farmerImg: 'https://images.unsplash.com/photo-1595802166542-fb75e0325bdf?w=100&q=80' },
  { id: 308, name: 'Organic Honey', farmer: 'Bee Naturals', rating: '4.9', price: 600, sustainability: '100%', certification: 'Jaivik Bharat', ecoBadge: 'Wild Forest', story: 'Ethically sourced raw honey from deep forest hives.', image: '🍯', farmerImg: 'https://images.unsplash.com/photo-1595802166542-fb75e0325bdf?w=100&q=80' },
  { id: 309, name: 'Organic Turmeric', farmer: 'Spice Roots', rating: '4.9', price: 300, sustainability: '99%', certification: 'NPOP Certified', ecoBadge: 'High Curcumin', story: 'Grown in pristine soils and stone ground to retain natural oils.', image: '🟡', farmerImg: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=100&q=80' },
  { id: 310, name: 'Organic Moong Dal', farmer: 'Pure Pulses', rating: '4.9', price: 180, sustainability: '98%', certification: 'Organic India', ecoBadge: 'Unpolished', story: 'Rich in protein, unpolished dal for maximum nutrition.', image: '🥣', farmerImg: 'https://images.unsplash.com/photo-1558904541-efa843a96f0a?w=100&q=80' },
  { id: 311, name: 'Farm Fresh Urad Dal', farmer: 'Healthy Pulses', rating: '4.9', price: 140, sustainability: '97%', certification: 'Organic India', ecoBadge: 'Premium Grade', story: 'Grown with zero synthetic inputs, ensuring authentic taste and high protein.', image: '🥣', farmerImg: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=100&q=80' },
  { id: 312, name: 'High Protein Green Gram', farmer: 'Green Pulses', rating: '4.8', price: 110, sustainability: '96%', certification: 'Jaivik Bharat', ecoBadge: 'Sprouted Quality', story: 'Packed with protein, harvested from chemical-free sustainable fields.', image: '🥣', farmerImg: 'https://images.unsplash.com/photo-1595802166542-fb75e0325bdf?w=100&q=80' },
  { id: 313, name: 'Organic Wheat Seeds', farmer: 'Beej Bhandar', rating: '4.9', price: 1200, sustainability: '99%', certification: 'Organic India', ecoBadge: 'Non-GMO', story: 'Preserving native wheat varieties with 95% guaranteed germination rate.', image: '🌱', farmerImg: 'https://images.unsplash.com/photo-1595802166542-fb75e0325bdf?w=100&q=80' },
  { id: 314, name: 'Organic Coriander Seeds', farmer: 'Aromatic Farm', rating: '4.8', price: 220, sustainability: '98%', certification: 'Jaivik Bharat', ecoBadge: 'High Purity', story: 'Organically grown, unadulterated coriander seeds perfect for planting.', image: '🌱', farmerImg: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=100&q=80' },
  { id: 315, name: 'Organic Winter Spinach', farmer: 'Leafy Organics', rating: '4.9', price: 40, sustainability: '99%', certification: 'Organic India', ecoBadge: 'Winter Fresh', story: 'Nutrient-dense spinach grown naturally in the cold winter months.', image: '🥬', farmerImg: 'https://images.unsplash.com/photo-1595802166542-fb75e0325bdf?w=100&q=80' },
  { id: 316, name: 'Premium Rabi Wheat', farmer: 'Beej Bhandar', rating: '4.9', price: 45, sustainability: '98%', certification: 'Jaivik Bharat', ecoBadge: 'High Purity', story: 'Organically grown winter wheat, carefully harvested for premium quality.', image: '🌾', farmerImg: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=100&q=80' },
];

const CATEGORIES = [
  { id: 1, name: 'Vegetables', icon: 'leaf' },
  { id: 2, name: 'Grains', icon: 'nutrition' },
  { id: 3, name: 'Pulses', icon: 'water' },
  { id: 4, name: 'Organic Products', icon: 'flower' },
  { id: 5, name: 'Seeds', icon: 'sunny' },
  { id: 6, name: 'Seasonal Crops', icon: 'calendar' },
];

const CATEGORY_DATA = {
  'Vegetables': [
    { id: 'v_401_1', productId: 401, name: 'Tomato', farmer: 'Patel Farm', location: 'Bhopal', price: 40, discount: '5% OFF', stock: '20kg', rating: '4.8', image: '🍅', freshTag: '98%', delivery: '30m', organic: true },
    { id: 'v_401_2', productId: 401, name: 'Tomato', farmer: 'Kumar Agri', location: 'Vidisha', price: 38, discount: 'No Off', stock: '50kg', rating: '4.6', image: '🍅', freshTag: '95%', delivery: '45m', organic: false },
    { id: 'v_402_1', productId: 402, name: 'Potato', farmer: 'Shiva Farms', location: 'Sehore', price: 30, discount: '10% OFF', stock: '100kg', rating: '4.7', image: '🥔', freshTag: '96%', delivery: '1h', organic: true },
    { id: 'v_403_1', productId: 403, name: 'Onion', farmer: 'Green Field', location: 'Raisen', price: 35, discount: '15% OFF', stock: '200kg', rating: '4.5', image: '🧅', freshTag: '94%', delivery: '40m', organic: true },
    { id: 'v_404_1', productId: 404, name: 'Carrot', farmer: 'Sagar Farms', location: 'Vidisha', price: 35, discount: '5% OFF', stock: '40kg', rating: '4.6', image: '🥕', freshTag: '97%', delivery: '50m', organic: false },
    { id: 'v_405_1', productId: 405, name: 'Cauliflower', farmer: 'Rural Hub', location: 'Bhopal', price: 45, discount: '5% OFF', stock: '15kg', rating: '4.4', image: '🥦', freshTag: '97%', delivery: '30m', organic: true },
    { id: 'v_406_1', productId: 406, name: 'Cabbage', farmer: 'Bharat Naturals', location: 'Hoshangabad', price: 30, discount: 'No Off', stock: '60kg', rating: '4.5', image: '🥬', freshTag: '95%', delivery: '1h', organic: true },
    { id: 'v_407_1', productId: 407, name: 'Brinjal (Eggplant)', farmer: 'Satpura Fields', location: 'Itarsi', price: 40, discount: '10% OFF', stock: '25kg', rating: '4.3', image: '🍆', freshTag: '93%', delivery: '1.5h', organic: false },
    { id: 'v_408_1', productId: 408, name: 'Lady Finger (Okra)', farmer: 'Indore Agri', location: 'Indore', price: 50, discount: '5% OFF', stock: '30kg', rating: '4.7', image: '🥒', freshTag: '96%', delivery: '40m', organic: true },
    { id: 'v_409_1', productId: 409, name: 'Capsicum', farmer: 'Green House', location: 'Bhopal', price: 60, discount: '15% OFF', stock: '20kg', rating: '4.8', image: '🫑', freshTag: '99%', delivery: '30m', organic: true },
    { id: 'v_410_1', productId: 410, name: 'Green Chilli', farmer: 'Spicy Fields', location: 'Raisen', price: 80, discount: 'No Off', stock: '15kg', rating: '4.9', image: '🌶️', freshTag: 'Fresh', delivery: '20m', organic: true },
    { id: 'v_411_1', productId: 411, name: 'Garlic', farmer: 'Local Roots', location: 'Ujjain', price: 120, discount: '20% OFF', stock: '100kg', rating: '4.9', image: '🧄', freshTag: 'Dried', delivery: '1h', organic: true },
    { id: 'v_412_1', productId: 412, name: 'Ginger', farmer: 'Pramod Farm', location: 'Bhopal', price: 150, discount: '10% OFF', stock: '10kg', rating: '4.8', image: '🫚', freshTag: 'Organic', delivery: '30m', organic: true },
    { id: 'v_413_1', productId: 413, name: 'Beetroot', farmer: 'Healthy Harvest', location: 'Sehore', price: 40, discount: '5% OFF', stock: '30kg', rating: '4.5', image: '🪴', freshTag: '94%', delivery: '1h', organic: true },
    { id: 'v_414_1', productId: 414, name: 'Radish', farmer: 'White Fields', location: 'Raisen', price: 20, discount: 'No Off', stock: '50kg', rating: '4.4', image: '🥬', freshTag: '92%', delivery: '45m', organic: false },
    { id: 'v_415_1', productId: 415, name: 'Spinach', farmer: 'Leafy Greens', location: 'Bhopal', price: 20, discount: '5% OFF', stock: '40 bundles', rating: '4.7', image: '🥬', freshTag: '100%', delivery: '25m', organic: true },
    { id: 'v_416_1', productId: 416, name: 'Coriander', farmer: 'Aromatic Farm', location: 'Vidisha', price: 10, discount: 'No Off', stock: '100 bundles', rating: '4.9', image: '🌿', freshTag: 'Freshly Cut', delivery: '30m', organic: true },
    { id: 'v_417_1', productId: 417, name: 'Mint', farmer: 'Cool Harvest', location: 'Bhopal', price: 15, discount: 'No Off', stock: '30 bundles', rating: '4.8', image: '🌱', freshTag: 'Strong Aroma', delivery: '20m', organic: true },
    { id: 'v_418_1', productId: 418, name: 'Fenugreek (Methi)', farmer: 'Natural Green', location: 'Raisen', price: 25, discount: '10% OFF', stock: '50 bundles', rating: '4.6', image: '🌿', freshTag: '95%', delivery: '40m', organic: true },
    { id: 'v_419_1', productId: 419, name: 'Bottle Gourd', farmer: 'Vine Fresh', location: 'Sehore', price: 30, discount: 'No Off', stock: '40kg', rating: '4.5', image: '🥒', freshTag: '96%', delivery: '1h', organic: true },
    { id: 'v_420_1', productId: 420, name: 'Bitter Gourd', farmer: 'Health First', location: 'Raisen', price: 40, discount: '5% OFF', stock: '20kg', rating: '4.4', image: '🥒', freshTag: '94%', delivery: '50m', organic: true },
    { id: 'v_421_1', productId: 421, name: 'Ridge Gourd', farmer: 'Daily Veggies', location: 'Bhopal', price: 35, discount: 'No Off', stock: '25kg', rating: '4.5', image: '🥒', freshTag: '95%', delivery: '35m', organic: false },
    { id: 'v_422_1', productId: 422, name: 'Pumpkin', farmer: 'Giant Harvest', location: 'Vidisha', price: 25, discount: '15% OFF', stock: '200kg', rating: '4.7', image: '🎃', freshTag: '98%', delivery: '2h', organic: true },
    { id: 'v_423_1', productId: 423, name: 'Cucumber', farmer: 'Cool Fields', location: 'Raisen', price: 30, discount: 'No Off', stock: '60kg', rating: '4.6', image: '🥒', freshTag: '97%', delivery: '40m', organic: true },
    { id: 'v_424_1', productId: 424, name: 'Sweet Corn', farmer: 'Corn Valley', location: 'Bhopal', price: 40, discount: '10% OFF', stock: '100kg', rating: '4.8', image: '🌽', freshTag: 'Sweetest', delivery: '30m', organic: false },
    { id: 'v_425_1', productId: 425, name: 'Peas', farmer: 'Winter Green', location: 'Sehore', price: 60, discount: 'No Off', stock: '80kg', rating: '4.9', image: '🫛', freshTag: '99%', delivery: '1h', organic: true },
  ],
  'Grains': [
    { id: 'g_501_1', productId: 501, name: 'Wheat', farmer: 'Anaj Mandi', location: 'Sehore', price: 22, stock: '500kg', rating: '4.9', image: '🌾', freshTag: '99%', delivery: '2h', organic: true },
    { id: 'g_501_2', productId: 501, name: 'Wheat', farmer: 'Kisan Grains', location: 'Hoshangabad', price: 21, stock: '1000kg', rating: '4.8', image: '🌾', freshTag: '97%', delivery: '3h', organic: false },
    { id: 'g_502_1', productId: 502, name: 'Rice', farmer: 'Basmati Hub', location: 'Hoshangabad', price: 45, stock: '200kg', rating: '4.8', image: '🍚', freshTag: '98%', delivery: '2h', organic: true },
    { id: 'g_503_1', productId: 503, name: 'Basmati Rice', farmer: 'Premium Fields', location: 'Vidisha', price: 110, discount: '5% OFF', stock: '150kg', rating: '4.9', image: '🍚', freshTag: 'Aged 1 Year', delivery: '1h', organic: true },
    { id: 'g_504_1', productId: 504, name: 'Brown Rice', farmer: 'Healthy Grains', location: 'Bhopal', price: 85, discount: 'No Off', stock: '80kg', rating: '4.7', image: '🍚', freshTag: 'Unpolished', delivery: '45m', organic: true },
    { id: 'g_505_1', productId: 505, name: 'Maize (Corn)', farmer: 'Golden Farms', location: 'Sehore', price: 20, discount: '10% OFF', stock: '300kg', rating: '4.6', image: '🌽', freshTag: '95%', delivery: '1.5h', organic: false },
    { id: 'g_506_1', productId: 506, name: 'Barley', farmer: 'Nutri Grains', location: 'Raisen', price: 30, discount: 'No Off', stock: '120kg', rating: '4.5', image: '🌾', freshTag: '98%', delivery: '2h', organic: true },
    { id: 'g_507_1', productId: 507, name: 'Oats', farmer: 'Morning Mills', location: 'Indore', price: 60, discount: '5% OFF', stock: '200kg', rating: '4.8', image: '🥣', freshTag: 'Rolled', delivery: '1h', organic: true },
    { id: 'g_508_1', productId: 508, name: 'Millet', farmer: 'Desi Roots', location: 'Vidisha', price: 40, discount: '15% OFF', stock: '100kg', rating: '4.7', image: '🌾', freshTag: '96%', delivery: '2.5h', organic: false },
    { id: 'g_509_1', productId: 509, name: 'Bajra', farmer: 'Rural Hub', location: 'Sehore', price: 25, discount: 'No Off', stock: '400kg', rating: '4.8', image: '🌾', freshTag: 'Fresh Harvest', delivery: '1h', organic: true },
    { id: 'g_510_1', productId: 510, name: 'Jowar', farmer: 'Village Grains', location: 'Hoshangabad', price: 28, discount: '5% OFF', stock: '250kg', rating: '4.6', image: '🌾', freshTag: '95%', delivery: '1.5h', organic: true },
    { id: 'g_511_1', productId: 511, name: 'Ragi', farmer: 'Health First', location: 'Bhopal', price: 45, discount: '10% OFF', stock: '90kg', rating: '4.9', image: '🌾', freshTag: 'Superfood', delivery: '45m', organic: true },
    { id: 'g_512_1', productId: 512, name: 'Quinoa', farmer: 'Exotic Farms', location: 'Indore', price: 250, discount: '20% OFF', stock: '50kg', rating: '4.8', image: '🥣', freshTag: 'Premium', delivery: '2h', organic: true },
    { id: 'g_513_1', productId: 513, name: 'Broken Wheat (Dalia)', farmer: 'Mill Fresh', location: 'Bhopal', price: 35, discount: 'No Off', stock: '150kg', rating: '4.7', image: '🥣', freshTag: 'Coarse', delivery: '30m', organic: false },
    { id: 'g_514_1', productId: 514, name: 'Poha', farmer: 'Indori Mills', location: 'Indore', price: 50, discount: '5% OFF', stock: '300kg', rating: '4.9', image: '🥣', freshTag: 'Thick', delivery: '1h', organic: false },
    { id: 'g_515_1', productId: 515, name: 'Semolina (Sooji)', farmer: 'Fine Grains', location: 'Sehore', price: 40, discount: 'No Off', stock: '100kg', rating: '4.6', image: '🥣', freshTag: 'Roasted', delivery: '45m', organic: false },
  ],
  'Pulses': [
    { id: 'p_601_1', productId: 601, name: 'Toor Dal', farmer: 'Dal Millers', location: 'Bhopal', price: 160, stock: '50kg', rating: '4.9', image: '🥣', freshTag: 'Premium', delivery: '1h', organic: true },
    { id: 'p_601_2', productId: 601, name: 'Toor Dal', farmer: 'Rural Pulses', location: 'Indore', price: 155, stock: '30kg', rating: '4.7', image: '🥣', freshTag: 'Gold', delivery: '1.5h', organic: true },
    { id: 'p_602_1', productId: 602, name: 'Moong Dal', farmer: 'Pure Pulses', location: 'Sehore', price: 120, discount: '5% OFF', stock: '100kg', rating: '4.8', image: '🥣', freshTag: 'High Protein', delivery: '45m', organic: false },
    { id: 'p_603_1', productId: 603, name: 'Chana Dal', farmer: 'Eco Pulses', location: 'Vidisha', price: 90, discount: 'No Off', stock: '80kg', rating: '4.7', image: '🥣', freshTag: '98%', delivery: '1h', organic: true },
    { id: 'p_604_1', productId: 604, name: 'Masoor Dal', farmer: 'Village Mill', location: 'Raisen', price: 100, discount: '10% OFF', stock: '60kg', rating: '4.8', image: '🥣', freshTag: '99%', delivery: '50m', organic: false },
    { id: 'p_605_1', productId: 605, name: 'Urad Dal', farmer: 'Healthy Pulses', location: 'Indore', price: 140, discount: '15% OFF', stock: '40kg', rating: '4.9', image: '🥣', freshTag: 'Premium', delivery: '1.5h', organic: true },
    { id: 'p_606_1', productId: 606, name: 'Arhar Dal', farmer: 'Rural Millers', location: 'Hoshangabad', price: 150, discount: '5% OFF', stock: '70kg', rating: '4.7', image: '🥣', freshTag: '95%', delivery: '1h', organic: false },
    { id: 'p_607_1', productId: 607, name: 'Kabuli Chana', farmer: 'Giant Chana', location: 'Bhopal', price: 130, discount: '10% OFF', stock: '120kg', rating: '4.9', image: '🥣', freshTag: 'Premium Size', delivery: '2h', organic: true },
    { id: 'p_608_1', productId: 608, name: 'Black Chana', farmer: 'Desi Chana Farm', location: 'Vidisha', price: 80, discount: 'No Off', stock: '200kg', rating: '4.8', image: '🥣', freshTag: 'Natural', delivery: '1h', organic: false },
    { id: 'p_609_1', productId: 609, name: 'Green Gram', farmer: 'Green Pulses', location: 'Sehore', price: 110, discount: '5% OFF', stock: '90kg', rating: '4.8', image: '🥣', freshTag: 'Sprouted', delivery: '45m', organic: true },
    { id: 'p_610_1', productId: 610, name: 'Yellow Moong Dal', farmer: 'Pure Pulses', location: 'Raisen', price: 125, discount: 'No Off', stock: '110kg', rating: '4.7', image: '🥣', freshTag: 'Polished', delivery: '1.5h', organic: false },
    { id: 'p_611_1', productId: 611, name: 'Split Urad Dal', farmer: 'Healthy Pulses', location: 'Bhopal', price: 145, discount: '10% OFF', stock: '50kg', rating: '4.9', image: '🥣', freshTag: 'Premium', delivery: '1h', organic: true },
    { id: 'p_612_1', productId: 612, name: 'Whole Masoor', farmer: 'Village Mill', location: 'Hoshangabad', price: 95, discount: '5% OFF', stock: '100kg', rating: '4.6', image: '🥣', freshTag: '96%', delivery: '2h', organic: false },
    { id: 'p_613_1', productId: 613, name: 'Rajma (Kidney Beans)', farmer: 'Red Valley', location: 'Indore', price: 160, discount: '15% OFF', stock: '80kg', rating: '4.9', image: '🥣', freshTag: 'Jumbo Size', delivery: '1h', organic: true },
    { id: 'p_614_1', productId: 614, name: 'White Peas', farmer: 'Pea Farmers', location: 'Vidisha', price: 70, discount: 'No Off', stock: '150kg', rating: '4.7', image: '🥣', freshTag: '95%', delivery: '1h', organic: false },
    { id: 'p_615_1', productId: 615, name: 'Horse Gram (Kulthi)', farmer: 'Nutri Pulses', location: 'Sehore', price: 85, discount: '10% OFF', stock: '60kg', rating: '4.8', image: '🥣', freshTag: 'Superfood', delivery: '45m', organic: true },
    { id: 'p_616_1', productId: 616, name: 'Moth Beans', farmer: 'Desi Pulses', location: 'Raisen', price: 90, discount: '5% OFF', stock: '70kg', rating: '4.7', image: '🥣', freshTag: '97%', delivery: '1.5h', organic: false },
    { id: 'p_617_1', productId: 617, name: 'Lobia (Black Eyed Peas)', farmer: 'Rural Millers', location: 'Bhopal', price: 110, discount: '10% OFF', stock: '90kg', rating: '4.8', image: '🥣', freshTag: '98%', delivery: '1h', organic: true },
  ],
  'Organic Products': [
    { id: 'o_701_1', productId: 701, name: 'Organic Tomato', farmer: 'Eco Kisan', location: 'Bhopal', price: 80, stock: '10kg', rating: '4.9', image: '🍅', freshTag: '99%', delivery: '30m', organic: true },
    { id: 'o_702_1', productId: 702, name: 'Organic Wheat', farmer: 'Bio Farm', location: 'Vidisha', price: 55, stock: '100kg', rating: '4.8', image: '🌾', freshTag: '98%', delivery: '2h', organic: true },
    { id: 'o_703_1', productId: 703, name: 'Organic Potato', farmer: 'Earth Fresh', location: 'Sehore', price: 60, discount: '10% OFF', stock: '50kg', rating: '4.7', image: '🥔', freshTag: '95%', delivery: '1h', organic: true },
    { id: 'o_704_1', productId: 704, name: 'Organic Onion', farmer: 'Green Field', location: 'Raisen', price: 50, discount: '5% OFF', stock: '80kg', rating: '4.8', image: '🧅', freshTag: '96%', delivery: '45m', organic: true },
    { id: 'o_705_1', productId: 705, name: 'Organic Carrot', farmer: 'Nature Roots', location: 'Bhopal', price: 70, discount: 'No Off', stock: '20kg', rating: '4.9', image: '🥕', freshTag: '100%', delivery: '30m', organic: true },
    { id: 'o_706_1', productId: 706, name: 'Organic Spinach', farmer: 'Leafy Organics', location: 'Indore', price: 40, discount: '10% OFF', stock: '30 bundles', rating: '4.9', image: '🥬', freshTag: 'Fresh', delivery: '20m', organic: true },
    { id: 'o_707_1', productId: 707, name: 'Organic Capsicum', farmer: 'Green House', location: 'Vidisha', price: 90, discount: '15% OFF', stock: '15kg', rating: '4.8', image: '🫑', freshTag: '98%', delivery: '40m', organic: true },
    { id: 'o_708_1', productId: 708, name: 'Organic Coriander', farmer: 'Aromatic Farm', location: 'Hoshangabad', price: 20, discount: 'No Off', stock: '50 bundles', rating: '4.9', image: '🌿', freshTag: 'Fresh Cut', delivery: '25m', organic: true },
    { id: 'o_709_1', productId: 709, name: 'Organic Cucumber', farmer: 'Cool Harvest', location: 'Sehore', price: 60, discount: '5% OFF', stock: '40kg', rating: '4.7', image: '🥒', freshTag: '97%', delivery: '35m', organic: true },
    { id: 'o_710_1', productId: 710, name: 'Organic Beetroot', farmer: 'Healthy Harvest', location: 'Raisen', price: 55, discount: '10% OFF', stock: '25kg', rating: '4.8', image: '🪴', freshTag: '95%', delivery: '1h', organic: true },
    { id: 'o_711_1', productId: 711, name: 'Organic Green Chilli', farmer: 'Spicy Naturals', location: 'Bhopal', price: 100, discount: '20% OFF', stock: '10kg', rating: '4.9', image: '🌶️', freshTag: 'Organic', delivery: '30m', organic: true },
    { id: 'o_712_1', productId: 712, name: 'Organic Rice', farmer: 'Eco Grains', location: 'Sehore', price: 80, discount: 'No Off', stock: '200kg', rating: '4.8', image: '🍚', freshTag: '99%', delivery: '1.5h', organic: true },
    { id: 'o_713_1', productId: 713, name: 'Organic Basmati Rice', farmer: 'Premium Organics', location: 'Vidisha', price: 160, discount: '10% OFF', stock: '100kg', rating: '4.9', image: '🍚', freshTag: 'Aged', delivery: '1h', organic: true },
    { id: 'o_714_1', productId: 714, name: 'Organic Brown Rice', farmer: 'Healthy Grains', location: 'Hoshangabad', price: 120, discount: '5% OFF', stock: '50kg', rating: '4.8', image: '🍚', freshTag: 'Unpolished', delivery: '2h', organic: true },
    { id: 'o_715_1', productId: 715, name: 'Organic Bajra', farmer: 'Rural Hub', location: 'Raisen', price: 60, discount: 'No Off', stock: '80kg', rating: '4.7', image: '🌾', freshTag: '96%', delivery: '45m', organic: true },
    { id: 'o_716_1', productId: 716, name: 'Organic Jowar', farmer: 'Village Grains', location: 'Sehore', price: 65, discount: '10% OFF', stock: '70kg', rating: '4.8', image: '🌾', freshTag: '97%', delivery: '1h', organic: true },
    { id: 'o_717_1', productId: 717, name: 'Organic Ragi', farmer: 'Health First', location: 'Bhopal', price: 80, discount: '5% OFF', stock: '40kg', rating: '4.9', image: '🌾', freshTag: 'Superfood', delivery: '30m', organic: true },
    { id: 'o_718_1', productId: 718, name: 'Organic Oats', farmer: 'Morning Mills', location: 'Indore', price: 150, discount: '15% OFF', stock: '60kg', rating: '4.8', image: '🥣', freshTag: 'Rolled', delivery: '2h', organic: true },
    { id: 'o_719_1', productId: 719, name: 'Organic Maize', farmer: 'Golden Farms', location: 'Vidisha', price: 40, discount: 'No Off', stock: '100kg', rating: '4.6', image: '🌽', freshTag: '95%', delivery: '1h', organic: true },
    { id: 'o_720_1', productId: 720, name: 'Organic Moong Dal', farmer: 'Pure Pulses', location: 'Sehore', price: 180, discount: '10% OFF', stock: '50kg', rating: '4.9', image: '🥣', freshTag: 'Premium', delivery: '1h', organic: true },
    { id: 'o_721_1', productId: 721, name: 'Organic Toor Dal', farmer: 'Dal Millers', location: 'Hoshangabad', price: 200, discount: '5% OFF', stock: '40kg', rating: '4.8', image: '🥣', freshTag: 'Gold', delivery: '1.5h', organic: true },
    { id: 'o_722_1', productId: 722, name: 'Organic Chana Dal', farmer: 'Eco Pulses', location: 'Bhopal', price: 150, discount: 'No Off', stock: '60kg', rating: '4.7', image: '🥣', freshTag: '98%', delivery: '45m', organic: true },
    { id: 'o_723_1', productId: 723, name: 'Organic Masoor Dal', farmer: 'Village Mill', location: 'Raisen', price: 140, discount: '15% OFF', stock: '30kg', rating: '4.8', image: '🥣', freshTag: '99%', delivery: '50m', organic: true },
    { id: 'o_724_1', productId: 724, name: 'Organic Urad Dal', farmer: 'Healthy Pulses', location: 'Vidisha', price: 190, discount: '10% OFF', stock: '25kg', rating: '4.9', image: '🥣', freshTag: 'Premium', delivery: '1h', organic: true },
    { id: 'o_725_1', productId: 725, name: 'Organic Honey', farmer: 'Bee Naturals', location: 'Satpura', price: 600, discount: '5% OFF', stock: '20 jars', rating: '4.9', image: '🍯', freshTag: 'Raw', delivery: '2h', organic: true },
    { id: 'o_726_1', productId: 726, name: 'Organic Jaggery', farmer: 'Sweet Canes', location: 'Narsinghpur', price: 100, discount: 'No Off', stock: '100kg', rating: '4.8', image: '🫙', freshTag: 'Chemical Free', delivery: '1.5h', organic: true },
    { id: 'o_727_1', productId: 727, name: 'Organic Turmeric', farmer: 'Spice Roots', location: 'Haldwani', price: 300, discount: '20% OFF', stock: '15kg', rating: '4.9', image: '🟡', freshTag: 'High Curcumin', delivery: '1d', organic: true },
    { id: 'o_728_1', productId: 728, name: 'Organic Red Chilli Powder', farmer: 'Fiery Farms', location: 'Guntur', price: 400, discount: '10% OFF', stock: '25kg', rating: '4.8', image: '🌶️', freshTag: 'Stone Ground', delivery: '2d', organic: true },
    { id: 'o_729_1', productId: 729, name: 'Organic Coriander Powder', farmer: 'Aroma Spices', location: 'Indore', price: 250, discount: '5% OFF', stock: '30kg', rating: '4.7', image: '🌿', freshTag: 'Fresh Ground', delivery: '1d', organic: true },
  ],
  'Seeds': [
    { id: 's_801_1', productId: 801, name: 'Organic Wheat Seeds', farmer: 'Beej Bhandar', location: 'Sehore', price: 1200, stock: '50 bags', rating: '4.9', image: '🌱', freshTag: '95% Germ', delivery: '1d', organic: true },
    { id: 's_802_1', productId: 802, name: 'Premium Rice Seeds', farmer: 'Kisan Seeds', location: 'Hoshangabad', price: 1500, stock: '40 bags', rating: '4.8', image: '🌱', freshTag: '98% Germ', delivery: '2d', organic: false },
    { id: 's_803_1', productId: 803, name: 'High Yield Maize Seeds', farmer: 'Golden Farms', location: 'Vidisha', price: 800, stock: '100 bags', rating: '4.7', image: '🌱', freshTag: '90% Germ', delivery: '1d', organic: false },
    { id: 's_804_1', productId: 804, name: 'Bajra Seeds', farmer: 'Rural Hub', location: 'Raisen', price: 600, stock: '80 bags', rating: '4.6', image: '🌱', freshTag: '92% Germ', delivery: '1d', organic: false },
    { id: 's_805_1', productId: 805, name: 'Jowar Seeds', farmer: 'Village Seeds', location: 'Bhopal', price: 650, stock: '70 bags', rating: '4.8', image: '🌱', freshTag: '95% Germ', delivery: '2d', organic: true },
    { id: 's_806_1', productId: 806, name: 'Ragi Seeds', farmer: 'Health First', location: 'Sehore', price: 900, stock: '30 bags', rating: '4.9', image: '🌱', freshTag: '99% Germ', delivery: '1d', organic: true },
    { id: 's_807_1', productId: 807, name: 'Millet Seeds', farmer: 'Desi Seeds', location: 'Indore', price: 750, stock: '60 bags', rating: '4.7', image: '🌱', freshTag: '94% Germ', delivery: '2d', organic: false },
    { id: 's_808_1', productId: 808, name: 'Moong Seeds', farmer: 'Pure Pulses', location: 'Hoshangabad', price: 1100, stock: '45 bags', rating: '4.8', image: '🌱', freshTag: '96% Germ', delivery: '1d', organic: true },
    { id: 's_809_1', productId: 809, name: 'Chana Seeds', farmer: 'Eco Seeds', location: 'Vidisha', price: 1300, stock: '55 bags', rating: '4.9', image: '🌱', freshTag: '98% Germ', delivery: '1d', organic: false },
    { id: 's_810_1', productId: 810, name: 'Toor Seeds', farmer: 'Dal Millers', location: 'Bhopal', price: 1400, stock: '40 bags', rating: '4.7', image: '🌱', freshTag: '95% Germ', delivery: '2d', organic: true },
    { id: 's_811_1', productId: 811, name: 'Urad Seeds', farmer: 'Healthy Seeds', location: 'Raisen', price: 1250, stock: '50 bags', rating: '4.8', image: '🌱', freshTag: '97% Germ', delivery: '1d', organic: false },
    { id: 's_812_1', productId: 812, name: 'Rajma Seeds', farmer: 'Red Valley', location: 'Indore', price: 1600, stock: '35 bags', rating: '4.9', image: '🌱', freshTag: '99% Germ', delivery: '2d', organic: true },
    { id: 's_813_1', productId: 813, name: 'Hybrid Tomato Seeds', farmer: 'Eco Kisan', location: 'Sehore', price: 400, stock: '200 pkts', rating: '4.9', image: '🌱', freshTag: '99% Germ', delivery: '1d', organic: false },
    { id: 's_814_1', productId: 814, name: 'Onion Seeds', farmer: 'Green Field', location: 'Vidisha', price: 350, stock: '150 pkts', rating: '4.8', image: '🌱', freshTag: '95% Germ', delivery: '2d', organic: true },
    { id: 's_815_1', productId: 815, name: 'Potato Seeds', farmer: 'Earth Fresh', location: 'Hoshangabad', price: 500, stock: '100 pkts', rating: '4.7', image: '🌱', freshTag: '92% Germ', delivery: '1d', organic: false },
    { id: 's_816_1', productId: 816, name: 'Carrot Seeds', farmer: 'Nature Roots', location: 'Bhopal', price: 300, stock: '180 pkts', rating: '4.8', image: '🌱', freshTag: '96% Germ', delivery: '1d', organic: true },
    { id: 's_817_1', productId: 817, name: 'Cabbage Seeds', farmer: 'Green House', location: 'Indore', price: 250, stock: '200 pkts', rating: '4.6', image: '🌱', freshTag: '94% Germ', delivery: '2d', organic: false },
    { id: 's_818_1', productId: 818, name: 'Cauliflower Seeds', farmer: 'Leafy Seeds', location: 'Raisen', price: 280, stock: '190 pkts', rating: '4.7', image: '🌱', freshTag: '95% Germ', delivery: '1d', organic: true },
    { id: 's_819_1', productId: 819, name: 'Brinjal Seeds', farmer: 'Desi Seeds', location: 'Sehore', price: 320, stock: '160 pkts', rating: '4.8', image: '🌱', freshTag: '97% Germ', delivery: '1d', organic: false },
    { id: 's_820_1', productId: 820, name: 'Okra Seeds', farmer: 'Kisan Agri', location: 'Vidisha', price: 380, stock: '140 pkts', rating: '4.9', image: '🌱', freshTag: '98% Germ', delivery: '2d', organic: true },
    { id: 's_821_1', productId: 821, name: 'Capsicum Seeds', farmer: 'Green House', location: 'Bhopal', price: 450, stock: '120 pkts', rating: '4.7', image: '🌱', freshTag: '96% Germ', delivery: '1d', organic: false },
    { id: 's_822_1', productId: 822, name: 'Cucumber Seeds', farmer: 'Cool Harvest', location: 'Hoshangabad', price: 340, stock: '170 pkts', rating: '4.8', image: '🌱', freshTag: '95% Germ', delivery: '1d', organic: true },
    { id: 's_823_1', productId: 823, name: 'Pumpkin Seeds', farmer: 'Golden Farms', location: 'Indore', price: 290, stock: '150 pkts', rating: '4.6', image: '🌱', freshTag: '93% Germ', delivery: '2d', organic: false },
    { id: 's_824_1', productId: 824, name: 'Farm Grade Spinach Seeds', farmer: 'Leafy Organics', location: 'Sehore', price: 200, stock: '250 pkts', rating: '4.9', image: '🌱', freshTag: '99% Germ', delivery: '1d', organic: true },
    { id: 's_825_1', productId: 825, name: 'Organic Coriander Seeds', farmer: 'Aromatic Farm', location: 'Vidisha', price: 220, stock: '220 pkts', rating: '4.8', image: '🌱', freshTag: '97% Germ', delivery: '1d', organic: true },
    { id: 's_826_1', productId: 826, name: 'Disease Resistant Chilli Seeds', farmer: 'Spicy Naturals', location: 'Raisen', price: 500, stock: '110 pkts', rating: '4.9', image: '🌱', freshTag: '98% Germ', delivery: '2d', organic: false },
  ],
  'Seasonal Crops': [
    { id: 'sc_901_1', productId: 901, name: 'Fresh Summer Cucumber', farmer: 'Cool Harvest', location: 'Sehore', price: 40, stock: '100kg', rating: '4.8', image: '🥒', freshTag: 'Summer Special', delivery: '1h', organic: true },
    { id: 'sc_902_1', productId: 902, name: 'Bottle Gourd', farmer: 'Green Farms', location: 'Vidisha', price: 30, stock: '150kg', rating: '4.7', image: '🥒', freshTag: 'Fresh', delivery: '2h', organic: false },
    { id: 'sc_903_1', productId: 903, name: 'Bitter Gourd', farmer: 'Healthy Roots', location: 'Hoshangabad', price: 45, stock: '80kg', rating: '4.6', image: '🥒', freshTag: 'Summer', delivery: '1.5h', organic: true },
    { id: 'sc_904_1', productId: 904, name: 'Watermelon', farmer: 'Sweet Vines', location: 'Bhopal', price: 20, stock: '300kg', rating: '4.9', image: '🍉', freshTag: 'Juicy Summer', delivery: '2h', organic: false },
    { id: 'sc_905_1', productId: 905, name: 'Muskmelon', farmer: 'Golden Melons', location: 'Raisen', price: 35, stock: '120kg', rating: '4.8', image: '🍈', freshTag: 'Sweet', delivery: '1h', organic: true },
    { id: 'sc_906_1', productId: 906, name: 'Winter Fresh Carrot', farmer: 'Nature Roots', location: 'Indore', price: 50, stock: '200kg', rating: '4.9', image: '🥕', freshTag: 'Winter Harvest', delivery: '1d', organic: true },
    { id: 'sc_907_1', productId: 907, name: 'Seasonal Fresh Peas', farmer: 'Green Pods', location: 'Sehore', price: 60, stock: '150kg', rating: '4.8', image: '🟢', freshTag: 'Winter Fresh', delivery: '2d', organic: false },
    { id: 'sc_908_1', productId: 908, name: 'Radish', farmer: 'Earth Fresh', location: 'Vidisha', price: 25, stock: '180kg', rating: '4.7', image: '🥕', freshTag: 'Winter Crop', delivery: '1h', organic: true },
    { id: 'sc_909_1', productId: 909, name: 'Cauliflower', farmer: 'Leafy Seeds', location: 'Hoshangabad', price: 30, stock: '200kg', rating: '4.6', image: '🥦', freshTag: 'Winter Special', delivery: '1.5h', organic: false },
    { id: 'sc_910_1', productId: 910, name: 'Cabbage', farmer: 'Green House', location: 'Bhopal', price: 20, stock: '250kg', rating: '4.7', image: '🥬', freshTag: 'Winter', delivery: '2h', organic: true },
    { id: 'sc_911_1', productId: 911, name: 'Organic Winter Spinach', farmer: 'Leafy Organics', location: 'Raisen', price: 40, stock: '100 bundles', rating: '4.9', image: '🥬', freshTag: 'Winter Fresh', delivery: '1h', organic: true },
    { id: 'sc_912_1', productId: 912, name: 'Rainy Season Maize', farmer: 'Golden Farms', location: 'Indore', price: 25, stock: '400kg', rating: '4.8', image: '🌽', freshTag: 'Monsoon Crop', delivery: '1d', organic: false },
    { id: 'sc_913_1', productId: 913, name: 'Rainy Brinjal', farmer: 'Desi Seeds', location: 'Sehore', price: 35, stock: '160kg', rating: '4.7', image: '🍆', freshTag: 'Rainy Season', delivery: '2d', organic: true },
    { id: 'sc_914_1', productId: 914, name: 'Ridge Gourd', farmer: 'Green Vines', location: 'Vidisha', price: 40, stock: '140kg', rating: '4.6', image: '🥒', freshTag: 'Monsoon Fresh', delivery: '1h', organic: false },
    { id: 'sc_915_1', productId: 915, name: 'Kharif Rice Harvest', farmer: 'Kisan Grains', location: 'Hoshangabad', price: 50, stock: '500kg', rating: '4.9', image: '🍚', freshTag: 'Kharif Crop', delivery: '2d', organic: true },
    { id: 'sc_916_1', productId: 916, name: 'Kharif Soybean', farmer: 'Oil Seeds Farm', location: 'Bhopal', price: 70, stock: '300kg', rating: '4.8', image: '🫘', freshTag: 'Kharif', delivery: '1d', organic: false },
    { id: 'sc_917_1', productId: 917, name: 'Premium Rabi Wheat', farmer: 'Beej Bhandar', location: 'Raisen', price: 45, stock: '600kg', rating: '4.9', image: '🌾', freshTag: 'Rabi Harvest', delivery: '2d', organic: true },
    { id: 'sc_918_1', productId: 918, name: 'Rabi Mustard', farmer: 'Yellow Fields', location: 'Indore', price: 80, stock: '200kg', rating: '4.8', image: '🌼', freshTag: 'Rabi Crop', delivery: '1d', organic: false },
    { id: 'sc_919_1', productId: 919, name: 'Rabi Gram', farmer: 'Chana Farm', location: 'Sehore', price: 90, stock: '150kg', rating: '4.7', image: '🥣', freshTag: 'Rabi Harvest', delivery: '2d', organic: true },
  ]
};

const RECOMMENDED = [
  {
    id: 1,
    name: 'Organic Tomatoes',
    price: 40,
    oldPrice: '₹55',
    rating: '4.8',
    image: '🍅',
    organic: true,
    aiTag: 'Best Value Today',
    description: 'Fresh organic tomatoes sourced from certified local farms. Rich in flavor and nutrients.',
    freshness: '98%',
    stock: 'In Stock',
    delivery: '30 mins',
    harvestDate: 'Today',
    farmers: [
      { id: 1011, name: 'Ramesh Patel', price: 40, stock: '20kg', delivery: '30 mins', rating: '4.9', distance: '2.5km', image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=200&q=80', cert: 'APEDA' },
      { id: 1012, name: 'Suresh Kumar', price: 38, stock: '15kg', delivery: '45 mins', rating: '4.7', distance: '5.1km', image: 'https://images.unsplash.com/photo-1558904541-efa843a96f0a?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&q=80', cert: 'Jaivik Bharat' }
    ]
  },
  {
    id: 2,
    name: 'Fresh Onions',
    price: 30,
    oldPrice: '₹40',
    rating: '4.5',
    image: '🧅',
    organic: false,
    aiTag: 'Trending in Area',
    description: 'Large sized, crisp onions directly from Nashik farms. Perfect for daily cooking.',
    freshness: '95%',
    stock: '100+ kg',
    delivery: '25 mins',
    harvestDate: 'Yesterday',
    farmers: [
      { id: 1021, name: 'Nashik Direct', price: 30, stock: '100kg', delivery: '25 mins', rating: '4.5', distance: '12km', image: 'https://images.unsplash.com/photo-1595802166542-fb75e0325bdf?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&q=80', cert: 'FSSAI' }
    ]
  },
  {
    id: 3,
    name: 'Farm Potatoes',
    price: 25,
    oldPrice: '₹35',
    rating: '4.7',
    image: '🥔',
    organic: true,
    aiTag: 'Bought Recently',
    description: 'Soil-fresh potatoes from Bhopal surroundings. High starch content and great shelf life.',
    freshness: '96%',
    stock: '50kg',
    delivery: '40 mins',
    harvestDate: 'Today',
    farmers: [
      { id: 1031, name: 'Bhopal Agri', price: 25, stock: '50kg', delivery: '40 mins', rating: '4.7', distance: '3.5km', image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&q=80', cert: 'Organic India' }
    ]
  },
  {
    id: 4,
    name: 'Fresh Carrots',
    price: 35,
    oldPrice: '₹45',
    rating: '4.6',
    image: '🥕',
    organic: false,
    aiTag: 'Popular Choice',
    description: 'Crunchy and sweet carrots perfect for salads and juices. Directly from local growers.',
    freshness: '97%',
    stock: '30kg',
    delivery: '45 mins',
    harvestDate: 'Yesterday',
    farmers: [
      { id: 1041, name: 'Sagar Farms', price: 35, stock: '30kg', delivery: '45 mins', rating: '4.6', distance: '8km', image: 'https://images.unsplash.com/photo-1595802166542-fb75e0325bdf?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&q=80', cert: 'Local GAP' }
    ]
  },
  {
    id: 5,
    name: 'Green Capsicum',
    price: 60,
    oldPrice: '₹75',
    rating: '4.8',
    image: '🫑',
    organic: true,
    aiTag: 'High Demand',
    description: 'Vibrant and crisp green capsicums. Hand-picked for the best quality.',
    freshness: '99%',
    stock: '15kg',
    delivery: '30 mins',
    harvestDate: 'Today',
    farmers: [
      { id: 1051, name: 'Green House Agri', price: 60, stock: '15kg', delivery: '30 mins', rating: '4.8', distance: '4km', image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&q=80', cert: 'Jaivik Bharat' }
    ]
  },
  {
    id: 6,
    name: 'Fresh Spinach Bundle',
    price: 20,
    oldPrice: '₹30',
    rating: '4.9',
    image: '🥬',
    organic: true,
    aiTag: 'Direct from Farm',
    description: 'Nutrient-rich spinach bundles. Cleaned and ready for cooking.',
    freshness: '100%',
    stock: '40 bundles',
    delivery: '20 mins',
    harvestDate: 'Today',
    farmers: [
      { id: 1061, name: 'Leafy Greens', price: 20, stock: '40 bundles', delivery: '25 mins', rating: '4.7', distance: '1.2km', image: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&q=80', cert: 'Eco Certified' }
    ]
  },
  {
    id: 7,
    name: 'Organic Coriander',
    price: 15,
    oldPrice: '₹20',
    rating: '4.8',
    image: '🌿',
    organic: true,
    aiTag: 'Aromatic Pick',
    description: 'Highly aromatic coriander leaves. Essential for every meal.',
    freshness: '99%',
    stock: '25 bundles',
    delivery: '30 mins',
    harvestDate: 'Today',
    farmers: [
      { id: 1071, name: 'Aromatic Farm', price: 15, stock: '25 bundles', delivery: '30 mins', rating: '4.9', distance: '3km', image: 'https://images.unsplash.com/photo-1558904541-efa843a96f0a?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=200&q=80', cert: 'Jaivik Bharat' }
    ]
  },
  {
    id: 8,
    name: 'Farm Fresh Peas',
    price: 60,
    oldPrice: '₹80',
    rating: '4.9',
    image: '🫛',
    organic: true,
    aiTag: 'Seasonal Favorite',
    description: 'Sweet and tender green peas. Freshly shelled options also available.',
    freshness: '99%',
    stock: '80kg',
    delivery: '1 hour',
    harvestDate: 'Today',
    farmers: [
      { id: 1081, name: 'Winter Green', price: 60, stock: '80kg', delivery: '1 hour', rating: '4.9', distance: '15km', image: 'https://images.unsplash.com/photo-1595802166542-fb75e0325bdf?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&q=80', cert: 'Organic India' }
    ]
  },
  {
    id: 9,
    name: 'Premium Basmati Rice',
    price: 110,
    oldPrice: '₹130',
    rating: '4.9',
    image: '🍚',
    organic: true,
    aiTag: 'Aged 1 Year',
    description: 'Long grain, aromatic basmati rice perfect for biryani and special occasions.',
    freshness: '100%',
    stock: '150kg',
    delivery: '1 hour',
    harvestDate: 'Last Season',
    farmers: [
      { id: 1091, name: 'Premium Fields', price: 110, stock: '150kg', delivery: '1 hour', rating: '4.9', distance: '12km', image: 'https://images.unsplash.com/photo-1595802166542-fb75e0325bdf?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&q=80', cert: 'Organic India' }
    ]
  },
  {
    id: 10,
    name: 'Organic Ragi',
    price: 45,
    oldPrice: '₹55',
    rating: '4.9',
    image: '🌾',
    organic: true,
    aiTag: 'Superfood',
    description: 'Calcium-rich finger millet, perfect for healthy breakfast and baking.',
    freshness: '98%',
    stock: '90kg',
    delivery: '45 mins',
    harvestDate: 'Recent',
    farmers: [
      { id: 1101, name: 'Health First', price: 45, stock: '90kg', delivery: '45 mins', rating: '4.9', distance: '5km', image: 'https://images.unsplash.com/photo-1558904541-efa843a96f0a?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&q=80', cert: 'Jaivik Bharat' }
    ]
  },
  {
    id: 11,
    name: 'Organic Honey',
    price: 600,
    oldPrice: '₹700',
    rating: '4.9',
    image: '🍯',
    organic: true,
    aiTag: 'Pure & Raw',
    description: '100% natural, unprocessed forest honey. Rich in antioxidants.',
    freshness: '100%',
    stock: '20 jars',
    delivery: '2 hours',
    harvestDate: 'Recent',
    farmers: [
      { id: 1111, name: 'Bee Naturals', price: 600, stock: '20 jars', delivery: '2 hours', rating: '4.9', distance: '15km', image: 'https://images.unsplash.com/photo-1595802166542-fb75e0325bdf?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&q=80', cert: 'Jaivik Bharat' }
    ]
  },
  {
    id: 12,
    name: 'Organic Jaggery',
    price: 100,
    oldPrice: '₹120',
    rating: '4.8',
    image: '🫙',
    organic: true,
    aiTag: 'Chemical Free',
    description: 'Traditional chemical-free jaggery made from organic sugarcane.',
    freshness: '95%',
    stock: '100kg',
    delivery: '1.5 hours',
    harvestDate: 'This Season',
    farmers: [
      { id: 1121, name: 'Sweet Canes', price: 100, stock: '100kg', delivery: '1.5 hours', rating: '4.8', distance: '25km', image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&q=80', cert: 'Organic India' }
    ]
  },
  {
    id: 13,
    name: 'Village Rajma',
    price: 160,
    oldPrice: '₹190',
    rating: '4.9',
    image: '🥣',
    organic: true,
    aiTag: 'High Protein',
    description: 'Jumbo size red kidney beans directly from the village farms. Perfect for thick curries.',
    freshness: '100%',
    stock: '80kg',
    delivery: '1 hour',
    harvestDate: 'Recent',
    farmers: [
      { id: 1131, name: 'Red Valley', price: 160, stock: '80kg', delivery: '1 hour', rating: '4.9', distance: '10km', image: 'https://images.unsplash.com/photo-1595802166542-fb75e0325bdf?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&q=80', cert: 'Organic India' }
    ]
  },
  {
    id: 14,
    name: 'Organic Kabuli Chana',
    price: 130,
    oldPrice: '₹150',
    rating: '4.9',
    image: '🥣',
    organic: true,
    aiTag: 'Premium Size',
    description: 'Extra-large chickpeas packed with protein and fiber. Ideal for authentic chole.',
    freshness: '98%',
    stock: '120kg',
    delivery: '2 hours',
    harvestDate: 'This Season',
    farmers: [
      { id: 1141, name: 'Giant Chana', price: 130, stock: '120kg', delivery: '2 hours', rating: '4.9', distance: '15km', image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&q=80', cert: 'Jaivik Bharat' }
    ]
  },
  {
    id: 15,
    name: 'Hybrid Tomato Seeds',
    price: 400,
    oldPrice: '₹450',
    rating: '4.9',
    image: '🌱',
    organic: false,
    aiTag: 'High Yield',
    description: 'Premium hybrid tomato seeds known for high yield and disease resistance. 99% germination guaranteed.',
    freshness: '100%',
    stock: '200 pkts',
    delivery: '1 day',
    harvestDate: 'New Batch',
    farmers: [
      { id: 1151, name: 'Eco Kisan', price: 400, stock: '200 pkts', delivery: '1 day', rating: '4.9', distance: '15km', image: 'https://images.unsplash.com/photo-1595802166542-fb75e0325bdf?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&q=80', cert: 'Seed Board' }
    ]
  },
  {
    id: 16,
    name: 'Fresh Summer Cucumber',
    price: 40,
    oldPrice: '₹50',
    rating: '4.8',
    image: '🥒',
    organic: true,
    aiTag: 'Summer Refresh',
    description: 'Crisp and hydrating cucumbers harvested early morning for maximum summer freshness.',
    freshness: '100%',
    stock: '100kg',
    delivery: '1 hour',
    harvestDate: 'Today',
    farmers: [
      { id: 1161, name: 'Cool Harvest', price: 40, stock: '100kg', delivery: '1 hour', rating: '4.8', distance: '12km', image: 'https://images.unsplash.com/photo-1595802166542-fb75e0325bdf?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&q=80', cert: 'Organic India' }
    ]
  }
];

export default function CustomerDashboardScreen({ navigation, route }) {
  const kisan = route?.params?.kisan || {};
  const [activeModal, setActiveModal] = useState(null); // 'filter', 'location', 'notifications', 'search', 'banner_harvest', 'banner_organic', 'category_details', 'product_details', 'farmer_profile', 'cart', 'orders', 'order_success'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [activeSearchFilter, setActiveSearchFilter] = useState('All');
  const [activeSort, setActiveSort] = useState('Popularity');
  const [activeFilters, setActiveFilters] = useState({
    'Organic only': false, 'Nearby farmers': false, 'Fresh harvest': false, 
    'Pre-book available': false, 'Fast delivery': false, 'Top rated': false
  });

  const [cart, setCart] = useState({});
  const [orders, setOrders] = useState([]);
  const [activeOrderTab, setActiveOrderTab] = useState('Active'); // 'Active', 'Delivered', 'Cancelled', 'Returns'

  const toggleFilter = (key) => setActiveFilters(prev => ({...prev, [key]: !prev[key]}));

  const updateCart = (productId, delta) => {
    setCart(prev => {
      const currentQty = prev[productId] || 0;
      const newQty = currentQty + delta;
      if (newQty <= 0) {
        const newCart = {...prev};
        delete newCart[productId];
        return newCart;
      }
      return { ...prev, [productId]: newQty };
    });
  };

  const cartTotalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  const getCartDetails = () => {
    let details = [];
    Object.keys(cart).forEach(key => {
      let prod = null;
      // Search in Category Data
      Object.values(CATEGORY_DATA).forEach(catList => {
        const found = catList.find(p => p.id === key);
        if (found) prod = found;
      });
      // Search in Recommended
      if (!prod) {
        const [pId, fId] = key.split('_');
        const recommendedProd = RECOMMENDED.find(p => p.id === parseInt(pId));
        if (recommendedProd) {
          const farmer = recommendedProd.farmers.find(f => f.id === parseInt(fId));
          if (farmer) {
            prod = { ...recommendedProd, ...farmer, id: key, price: farmer.price };
          }
        }
      }
      if (prod) details.push({ ...prod, qty: cart[key] });
    });
    return details;
  };

  const calculateTotal = () => {
    const subtotal = getCartDetails().reduce((acc, item) => acc + (item.price * item.qty), 0);
    const delivery = subtotal > 500 ? 0 : 40;
    return { subtotal, delivery, total: subtotal + delivery };
  };

  const placeOrder = () => {
    const cartItems = getCartDetails();
    if (cartItems.length === 0) return;

    const newOrder = {
      id: `ORD${Math.floor(100000 + Math.random() * 900000)}`,
      items: cartItems,
      total: calculateTotal().total,
      status: 'Active',
      paymentStatus: 'Paid (Wallet)',
      orderDate: new Date().toLocaleDateString(),
      estimatedDelivery: 'Tomorrow, 10:00 AM',
      trackingStep: 1
    };

    setOrders([newOrder, ...orders]);
    setCart({});
    setActiveModal('order_success');
    setTimeout(() => {
      setActiveModal('orders');
    }, 2000);
  };

  const renderFilterAndSortBar = (type) => (
    <View style={styles.bannerFilterBar}>
      <TouchableOpacity style={styles.bannerFilterBtn} onPress={() => setActiveModal('filter')}>
        <Ionicons name="filter" size={16} color={COLORS.textPrimary} />
        <Text style={styles.bannerFilterText}>Filters</Text>
      </TouchableOpacity>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginLeft: 10}}>
        {['Price: Low to High', 'Price: High to Low', 'Popularity', 'Freshness', 'Nearest farms'].map(f => (
          <TouchableOpacity key={f} style={styles.bannerQuickSort}><Text style={styles.bannerQuickSortText}>{f}</Text></TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderCategoryProduct = (prod) => {
    const qty = cart[prod.id] || 0;
    return (
      <View key={prod.id} style={styles.categoryProductCard}>
        <View style={styles.categoryProductHeader}>
          <View style={styles.categoryProductEmojiWrap}>
            <Text style={{fontSize: 32}}>{prod.image}</Text>
            {prod.organic && <View style={styles.miniOrganicBadge}><Ionicons name="leaf" size={10} color={COLORS.white} /></View>}
          </View>
          <View style={{flex: 1, marginLeft: 12}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
              <View>
                <Text style={styles.categoryProductName}>{prod.name}</Text>
                <TouchableOpacity 
                  activeOpacity={0.7} 
                  onPress={() => { 
                    setSelectedFarmer({ 
                      id: prod.productId + 1000, 
                      name: prod.farmer, 
                      rating: prod.rating, 
                      distance: '5km', 
                      cert: prod.organic ? 'Jaivik Bharat' : 'Verified', 
                      delivery: prod.delivery, 
                      stock: prod.stock, 
                      image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=100&q=80', 
                      price: prod.price 
                    }); 
                    setActiveModal('farmer_profile'); 
                  }}
                >
                  <Text style={styles.categoryProductFarmer}>🧑‍🌾 {prod.farmer}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.ratingBadgeSmall}><Ionicons name="star" size={10} color="#EAB308" /><Text style={styles.ratingTextSmall}>{prod.rating}</Text></View>
            </View>
            <View style={styles.prodDetailsLine}>
              <Text style={styles.prodDetailsText}>📍 {prod.location}</Text>
              <Text style={styles.prodDetailsDivider}>•</Text>
              <Text style={styles.prodDetailsText}>📦 {prod.stock} left</Text>
            </View>
            
            <View style={styles.tagRowSmall}>
              <View style={styles.freshTag}><Text style={styles.freshTagText}>✨ {prod.freshTag} Fresh</Text></View>
              <View style={styles.deliveryTagSmall}><Text style={styles.deliveryTagTextSmall}>🚚 {prod.delivery}</Text></View>
            </View>
          </View>
        </View>

        <View style={styles.categoryProductDivider} />

        <View style={styles.categoryProductFooter}>
          <View>
            <Text style={styles.categoryProductPrice}>₹{prod.price}<Text style={{fontSize: 12, color: COLORS.textMuted}}>/kg</Text></Text>
            {prod.discount && prod.discount !== 'No Off' && <Text style={styles.categoryProductDiscount}>{prod.discount}</Text>}
          </View>

          <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
            <TouchableOpacity 
              style={styles.viewFarmerBtn} 
              onPress={() => { 
                setSelectedFarmer({ 
                  id: prod.productId + 1000, 
                  name: prod.farmer, 
                  rating: prod.rating, 
                  distance: '5km', 
                  cert: prod.organic ? 'Jaivik Bharat' : 'Verified', 
                  delivery: prod.delivery, 
                  stock: prod.stock, 
                  image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=100&q=80', 
                  price: prod.price 
                }); 
                setActiveModal('farmer_profile'); 
              }}
            >
              <Ionicons name="person-circle" size={20} color={COLORS.indiaGreen} />
            </TouchableOpacity>
            
            {qty === 0 ? (
              <TouchableOpacity style={styles.catAddBtn} onPress={() => updateCart(prod.id, 1)}>
                <Text style={styles.catAddBtnText}>Add</Text>
                <Ionicons name="add" size={16} color={COLORS.white} />
              </TouchableOpacity>
            ) : (
              <View style={styles.catQtyControl}>
                <TouchableOpacity style={styles.catQtyBtn} onPress={() => updateCart(prod.id, -1)}><Ionicons name="remove" size={16} color={COLORS.indiaGreen} /></TouchableOpacity>
                <Text style={styles.catQtyText}>{qty}</Text>
                <TouchableOpacity style={styles.catQtyBtn} onPress={() => updateCart(prod.id, 1)}><Ionicons name="add" size={16} color={COLORS.indiaGreen} /></TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const MOCK_SEARCH_RESULTS = [
    {
      id: 501,
      name: 'Fresh Red Tomatoes',
      price: 35,
      oldPrice: '₹50',
      rating: '4.8',
      image: '🍅',
      organic: true,
      discount: '30% OFF',
      stock: '25kg',
      delivery: '30 mins',
      unit: '1 kg',
      farmer: 'Sagar Farms',
      distance: '3km',
      tags: ['tomato', 'tamatar', 'red', 'vegetable', 'fresh', 'organic'],
      farmers: [
        { id: 2001, name: 'Sagar Farms', price: 35, stock: '25kg', delivery: '30 mins', rating: '4.8', distance: '3km', image: 'https://images.unsplash.com/photo-1595802166542-fb75e0325bdf?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&q=80', cert: 'Jaivik Bharat' },
        { id: 2002, name: 'Ramesh Patel', price: 38, stock: '10kg', delivery: '45 mins', rating: '4.6', distance: '5km', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&q=80', cert: 'Verified' }
      ]
    },
    {
      id: 502,
      name: 'Premium Sharbati Wheat',
      price: 45,
      oldPrice: '₹55',
      rating: '4.9',
      image: '🌾',
      organic: true,
      discount: '15% OFF',
      stock: '500kg',
      delivery: '1 day',
      unit: '1 kg',
      farmer: 'Bhopal Agri',
      distance: '8km',
      tags: ['wheat', 'gehun', 'gehu', 'grain', 'organic', 'bio', 'sharbati'],
      farmers: [
        { id: 2003, name: 'Bhopal Agri', price: 45, stock: '500kg', delivery: '1 day', rating: '4.9', distance: '8km', image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&q=80', cert: 'Organic India' }
      ]
    },
    {
      id: 503,
      name: 'Organic Basmati Rice',
      price: 120,
      oldPrice: '₹150',
      rating: '4.8',
      image: '🍚',
      organic: true,
      discount: '20% OFF',
      stock: '200kg',
      delivery: '1 day',
      unit: '1 kg',
      farmer: 'Verma Fields',
      distance: '12km',
      tags: ['rice', 'chawal', 'basmati', 'grain', 'organic', 'bio'],
      farmers: [
        { id: 2004, name: 'Verma Fields', price: 120, stock: '200kg', delivery: '1 day', rating: '4.8', distance: '12km', image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&q=80', cert: 'GAP Certified' }
      ]
    },
    {
      id: 504,
      name: 'Moong Dal (Yellow)',
      price: 110,
      oldPrice: '₹130',
      rating: '4.7',
      image: '🥣',
      organic: false,
      discount: '10% OFF',
      stock: '150kg',
      delivery: '2 hours',
      unit: '1 kg',
      farmer: 'Kisan Organics',
      distance: '2km',
      tags: ['dal', 'moong', 'pulses', 'yellow dal', 'grain'],
      farmers: [
        { id: 2005, name: 'Kisan Organics', price: 110, stock: '150kg', delivery: '2 hours', rating: '4.7', distance: '2km', image: 'https://images.unsplash.com/photo-1595802166542-fb75e0325bdf?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&q=80', cert: 'Verified' }
      ]
    },
    {
      id: 505,
      name: 'High-Yield Wheat Seeds',
      price: 80,
      oldPrice: '₹100',
      rating: '4.9',
      image: '🌱',
      organic: true,
      discount: '20% OFF',
      stock: '1000kg',
      delivery: '2 days',
      unit: '1 kg',
      farmer: 'Sagar Seed Bank',
      distance: '15km',
      tags: ['seed', 'seeds', 'wheat seeds', 'gehun', 'bio', 'organic', 'planting'],
      farmers: [
        { id: 2006, name: 'Sagar Seed Bank', price: 80, stock: '1000kg', delivery: '2 days', rating: '4.9', distance: '15km', image: 'https://images.unsplash.com/photo-1595802166542-fb75e0325bdf?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&q=80', cert: 'Govt Certified' }
      ]
    },
    {
      id: 506,
      name: 'Bio Fertilizer (10kg)',
      price: 250,
      oldPrice: '₹300',
      rating: '4.9',
      image: '🪴',
      organic: true,
      discount: '15% OFF',
      stock: '100 bags',
      delivery: '1 day',
      unit: '1 bag',
      farmer: 'Eco Care Solutions',
      distance: '10km',
      tags: ['fertilizer', 'bio fertilizer', 'organic', 'compost', 'khad', 'soil'],
      farmers: [
        { id: 2007, name: 'Eco Care Solutions', price: 250, stock: '100 bags', delivery: '1 day', rating: '4.9', distance: '10km', image: 'https://images.unsplash.com/photo-1595802166542-fb75e0325bdf?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&q=80', cert: 'Govt Certified' }
      ]
    },
    {
      id: 507,
      name: 'Premium Capsicum',
      price: 60,
      oldPrice: '₹75',
      rating: '4.8',
      image: '🫑',
      organic: true,
      discount: '15% OFF',
      stock: '20kg',
      delivery: '30 mins',
      unit: '1 kg',
      farmer: 'Green House',
      distance: '4km',
      tags: ['capsicum', 'shimla mirch', 'bell pepper', 'green', 'vegetable'],
      farmers: [
        { id: 2008, name: 'Green House Agri', price: 60, stock: '20kg', delivery: '30 mins', rating: '4.8', distance: '4km', image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&q=80', cert: 'Jaivik Bharat' }
      ]
    },
    {
      id: 508,
      name: 'Lady Finger (Okra)',
      price: 50,
      oldPrice: '₹60',
      rating: '4.7',
      image: '🥒',
      organic: true,
      discount: '5% OFF',
      stock: '30kg',
      delivery: '40 mins',
      unit: '1 kg',
      farmer: 'Indore Agri',
      distance: '6km',
      tags: ['lady finger', 'okra', 'bhindi', 'green', 'vegetable'],
      farmers: [
        { id: 2009, name: 'Indore Agri', price: 50, stock: '30kg', delivery: '40 mins', rating: '4.7', distance: '6km', image: 'https://images.unsplash.com/photo-1558904541-efa843a96f0a?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=200&q=80', cert: 'Verified' }
      ]
    },
    {
      id: 509,
      name: 'Fresh Spinach Bundle',
      price: 20,
      oldPrice: '₹30',
      rating: '4.9',
      image: '🥬',
      organic: true,
      discount: '5% OFF',
      stock: '40 bundles',
      delivery: '25 mins',
      unit: '1 bundle',
      farmer: 'Leafy Greens',
      distance: '1.2km',
      tags: ['spinach', 'palak', 'green', 'leafy', 'vegetable'],
      farmers: [
        { id: 2010, name: 'Leafy Greens', price: 20, stock: '40 bundles', delivery: '25 mins', rating: '4.7', distance: '1.2km', image: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&q=80', cert: 'Eco Certified' }
      ]
    },
    {
      id: 510,
      name: 'Local Garlic',
      price: 120,
      oldPrice: '₹150',
      rating: '4.9',
      image: '🧄',
      organic: true,
      discount: '20% OFF',
      stock: '100kg',
      delivery: '1 hour',
      unit: '1 kg',
      farmer: 'Local Roots',
      distance: '10km',
      tags: ['garlic', 'lehsun', 'spices', 'vegetable'],
      farmers: [
        { id: 2011, name: 'Local Roots', price: 120, stock: '100kg', delivery: '1 hour', rating: '4.9', distance: '10km', image: 'https://images.unsplash.com/photo-1595802166542-fb75e0325bdf?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&q=80', cert: 'Jaivik Bharat' }
      ]
    },
    {
      id: 511,
      name: 'Farm Fresh Peas',
      price: 60,
      oldPrice: '₹80',
      rating: '4.9',
      image: '🫛',
      organic: true,
      discount: 'No Off',
      stock: '80kg',
      delivery: '1 hour',
      unit: '1 kg',
      farmer: 'Winter Green',
      distance: '15km',
      tags: ['peas', 'matar', 'green', 'vegetable'],
      farmers: [
        { id: 2012, name: 'Winter Green', price: 60, stock: '80kg', delivery: '1 hour', rating: '4.9', distance: '15km', image: 'https://images.unsplash.com/photo-1595802166542-fb75e0325bdf?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&q=80', cert: 'Organic India' }
      ]
    },
    {
      id: 512,
      name: 'Organic Coriander',
      price: 15,
      oldPrice: '₹20',
      rating: '4.8',
      image: '🌿',
      organic: true,
      discount: 'No Off',
      stock: '25 bundles',
      delivery: '30 mins',
      unit: '1 bundle',
      farmer: 'Aromatic Farm',
      distance: '3km',
      tags: ['coriander', 'dhaniya', 'green', 'leafy', 'vegetable'],
      farmers: [
        { id: 2013, name: 'Aromatic Farm', price: 15, stock: '25 bundles', delivery: '30 mins', rating: '4.9', distance: '3km', image: 'https://images.unsplash.com/photo-1558904541-efa843a96f0a?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=100&q=80', cert: 'Jaivik Bharat' }
      ]
    },
    {
      id: 513,
      name: 'Organic Wheat',
      price: 35,
      oldPrice: '₹45',
      rating: '4.9',
      image: '🌾',
      organic: true,
      discount: '10% OFF',
      stock: '200kg',
      delivery: '1 day',
      unit: '1 kg',
      farmer: 'Kisan Organics',
      distance: '15km',
      tags: ['wheat', 'gehun', 'grain', 'organic'],
      farmers: [
        { id: 2014, name: 'Kisan Organics', price: 35, stock: '200kg', delivery: '1 day', rating: '4.9', distance: '15km', image: 'https://images.unsplash.com/photo-1558904541-efa843a96f0a?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&q=80', cert: 'Organic India' }
      ]
    },
    {
      id: 514,
      name: 'Village Jowar',
      price: 28,
      oldPrice: '₹35',
      rating: '4.6',
      image: '🌾',
      organic: true,
      discount: '5% OFF',
      stock: '250kg',
      delivery: '1.5 hours',
      unit: '1 kg',
      farmer: 'Village Grains',
      distance: '20km',
      tags: ['jowar', 'sorghum', 'grain', 'millet'],
      farmers: [
        { id: 2015, name: 'Village Grains', price: 28, stock: '250kg', delivery: '1.5 hours', rating: '4.6', distance: '20km', image: 'https://images.unsplash.com/photo-1595802166542-fb75e0325bdf?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&q=80', cert: 'Verified' }
      ]
    },
    {
      id: 515,
      name: 'Poha',
      price: 50,
      oldPrice: '₹60',
      rating: '4.9',
      image: '🥣',
      organic: false,
      discount: '5% OFF',
      stock: '300kg',
      delivery: '1 hour',
      unit: '1 kg',
      farmer: 'Indori Mills',
      distance: '5km',
      tags: ['poha', 'rice flakes', 'breakfast', 'grain'],
      farmers: [
        { id: 2016, name: 'Indori Mills', price: 50, stock: '300kg', delivery: '1 hour', rating: '4.9', distance: '5km', image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=200&q=80', cert: 'Verified' }
      ]
    },
    {
      id: 516,
      name: 'Broken Wheat (Dalia)',
      price: 35,
      oldPrice: '₹40',
      rating: '4.7',
      image: '🥣',
      organic: false,
      discount: 'No Off',
      stock: '150kg',
      delivery: '30 mins',
      unit: '1 kg',
      farmer: 'Mill Fresh',
      distance: '3km',
      tags: ['dalia', 'broken wheat', 'breakfast', 'grain'],
      farmers: [
        { id: 2017, name: 'Mill Fresh', price: 35, stock: '150kg', delivery: '30 mins', rating: '4.7', distance: '3km', image: 'https://images.unsplash.com/photo-1558904541-efa843a96f0a?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&q=80', cert: 'FSSAI' }
      ]
    },
    {
      id: 517,
      name: 'Organic Toor Dal',
      price: 200,
      oldPrice: '₹220',
      rating: '4.8',
      image: '🥣',
      organic: true,
      discount: '5% OFF',
      stock: '40kg',
      delivery: '1.5 hours',
      unit: '1 kg',
      farmer: 'Dal Millers',
      distance: '10km',
      tags: ['dal', 'toor', 'pulses', 'organic', 'arhar'],
      farmers: [
        { id: 2018, name: 'Dal Millers', price: 200, stock: '40kg', delivery: '1.5 hours', rating: '4.8', distance: '10km', image: 'https://images.unsplash.com/photo-1558904541-efa843a96f0a?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&q=80', cert: 'Organic India' }
      ]
    },
    {
      id: 518,
      name: 'Organic Honey',
      price: 600,
      oldPrice: '₹700',
      rating: '4.9',
      image: '🍯',
      organic: true,
      discount: '15% OFF',
      stock: '20 jars',
      delivery: '2 hours',
      unit: '1 jar',
      farmer: 'Bee Naturals',
      distance: '15km',
      tags: ['honey', 'sweet', 'organic', 'raw', 'forest'],
      farmers: [
        { id: 2019, name: 'Bee Naturals', price: 600, stock: '20 jars', delivery: '2 hours', rating: '4.9', distance: '15km', image: 'https://images.unsplash.com/photo-1595802166542-fb75e0325bdf?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&q=80', cert: 'Jaivik Bharat' }
      ]
    },
    {
      id: 519,
      name: 'Organic Turmeric Powder',
      price: 300,
      oldPrice: '₹380',
      rating: '4.9',
      image: '🟡',
      organic: true,
      discount: '20% OFF',
      stock: '15kg',
      delivery: '1 day',
      unit: '1 kg',
      farmer: 'Spice Roots',
      distance: '40km',
      tags: ['turmeric', 'haldi', 'spice', 'organic', 'powder'],
      farmers: [
        { id: 2020, name: 'Spice Roots', price: 300, stock: '15kg', delivery: '1 day', rating: '4.9', distance: '40km', image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=200&q=80', cert: 'NPOP Certified' }
      ]
    },
    {
      id: 520,
      name: 'Village Rajma',
      price: 160,
      oldPrice: '₹190',
      rating: '4.9',
      image: '🥣',
      organic: true,
      discount: '15% OFF',
      stock: '80kg',
      delivery: '1 hour',
      unit: '1 kg',
      farmer: 'Red Valley',
      distance: '10km',
      tags: ['rajma', 'kidney beans', 'pulses', 'organic', 'village'],
      farmers: [
        { id: 2021, name: 'Red Valley', price: 160, stock: '80kg', delivery: '1 hour', rating: '4.9', distance: '10km', image: 'https://images.unsplash.com/photo-1558904541-efa843a96f0a?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&q=80', cert: 'Organic India' }
      ]
    },
    {
      id: 521,
      name: 'Organic Kabuli Chana',
      price: 130,
      oldPrice: '₹150',
      rating: '4.9',
      image: '🥣',
      organic: true,
      discount: '10% OFF',
      stock: '120kg',
      delivery: '2 hours',
      unit: '1 kg',
      farmer: 'Giant Chana',
      distance: '15km',
      tags: ['chana', 'chole', 'kabuli', 'pulses', 'organic'],
      farmers: [
        { id: 2022, name: 'Giant Chana', price: 130, stock: '120kg', delivery: '2 hours', rating: '4.9', distance: '15km', image: 'https://images.unsplash.com/photo-1595802166542-fb75e0325bdf?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&q=80', cert: 'Jaivik Bharat' }
      ]
    },
    {
      id: 522,
      name: 'Farm Fresh Urad Dal',
      price: 140,
      oldPrice: '₹165',
      rating: '4.9',
      image: '🥣',
      organic: true,
      discount: '15% OFF',
      stock: '40kg',
      delivery: '1.5 hours',
      unit: '1 kg',
      farmer: 'Healthy Pulses',
      distance: '8km',
      tags: ['urad', 'dal', 'pulses', 'organic', 'black gram'],
      farmers: [
        { id: 2023, name: 'Healthy Pulses', price: 140, stock: '40kg', delivery: '1.5 hours', rating: '4.9', distance: '8km', image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=200&q=80', cert: 'Organic India' }
      ]
    },
    {
      id: 523,
      name: 'Organic Wheat Seeds',
      price: 1200,
      oldPrice: '₹1350',
      rating: '4.9',
      image: '🌱',
      organic: true,
      discount: '10% OFF',
      stock: '50 bags',
      delivery: '1 day',
      unit: '1 bag',
      farmer: 'Beej Bhandar',
      distance: '20km',
      tags: ['seeds', 'wheat seeds', 'organic seeds', 'farming', 'gehun beej'],
      farmers: [
        { id: 2024, name: 'Beej Bhandar', price: 1200, stock: '50 bags', delivery: '1 day', rating: '4.9', distance: '20km', image: 'https://images.unsplash.com/photo-1558904541-efa843a96f0a?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&q=80', cert: 'Organic India' }
      ]
    },
    {
      id: 524,
      name: 'Hybrid Tomato Seeds',
      price: 400,
      oldPrice: '₹450',
      rating: '4.9',
      image: '🌱',
      organic: false,
      discount: 'No Off',
      stock: '200 pkts',
      delivery: '1 day',
      unit: '1 pkt',
      farmer: 'Eco Kisan',
      distance: '15km',
      tags: ['seeds', 'tomato seeds', 'hybrid seeds', 'vegetable seeds', 'tamatar beej'],
      farmers: [
        { id: 2025, name: 'Eco Kisan', price: 400, stock: '200 pkts', delivery: '1 day', rating: '4.9', distance: '15km', image: 'https://images.unsplash.com/photo-1595802166542-fb75e0325bdf?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&q=80', cert: 'Seed Board' }
      ]
    },
    {
      id: 525,
      name: 'Premium Rice Seeds',
      price: 1500,
      oldPrice: '₹1650',
      rating: '4.8',
      image: '🌱',
      organic: false,
      discount: '5% OFF',
      stock: '40 bags',
      delivery: '2 days',
      unit: '1 bag',
      farmer: 'Kisan Seeds',
      distance: '30km',
      tags: ['seeds', 'rice seeds', 'paddy seeds', 'grain seeds', 'dhan beej'],
      farmers: [
        { id: 2026, name: 'Kisan Seeds', price: 1500, stock: '40 bags', delivery: '2 days', rating: '4.8', distance: '30km', image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=200&q=80', cert: 'Verified' }
      ]
    },
    {
      id: 526,
      name: 'Fresh Summer Cucumber',
      price: 40,
      oldPrice: '₹50',
      rating: '4.8',
      image: '🥒',
      organic: true,
      discount: '10% OFF',
      stock: '100kg',
      delivery: '1 hour',
      unit: '1 kg',
      farmer: 'Cool Harvest',
      distance: '12km',
      tags: ['cucumber', 'summer crops', 'seasonal', 'vegetables', 'kheera'],
      farmers: [
        { id: 2027, name: 'Cool Harvest', price: 40, stock: '100kg', delivery: '1 hour', rating: '4.8', distance: '12km', image: 'https://images.unsplash.com/photo-1558904541-efa843a96f0a?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&q=80', cert: 'Organic India' }
      ]
    },
    {
      id: 527,
      name: 'Premium Rabi Wheat',
      price: 45,
      oldPrice: '₹55',
      rating: '4.9',
      image: '🌾',
      organic: true,
      discount: 'No Off',
      stock: '600kg',
      delivery: '2 days',
      unit: '1 kg',
      farmer: 'Beej Bhandar',
      distance: '25km',
      tags: ['wheat', 'rabi crops', 'seasonal', 'grains', 'gehun'],
      farmers: [
        { id: 2028, name: 'Beej Bhandar', price: 45, stock: '600kg', delivery: '2 days', rating: '4.9', distance: '25km', image: 'https://images.unsplash.com/photo-1595802166542-fb75e0325bdf?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&q=80', cert: 'Jaivik Bharat' }
      ]
    },
    {
      id: 528,
      name: 'Kharif Rice Harvest',
      price: 50,
      oldPrice: '₹60',
      rating: '4.9',
      image: '🍚',
      organic: true,
      discount: '5% OFF',
      stock: '500kg',
      delivery: '2 days',
      unit: '1 kg',
      farmer: 'Kisan Grains',
      distance: '30km',
      tags: ['rice', 'kharif crops', 'seasonal', 'grains', 'chawal'],
      farmers: [
        { id: 2029, name: 'Kisan Grains', price: 50, stock: '500kg', delivery: '2 days', rating: '4.9', distance: '30km', image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=100&q=80', farmImg: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=200&q=80', cert: 'Organic India' }
      ]
    }
  ];

  const renderModals = () => (
    <Modal visible={activeModal !== null} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        
        {/* --- SEARCH MODAL --- */}
        {activeModal === 'search' && (
          <View style={[styles.modalContent, {height: '100%', marginTop: 0, paddingHorizontal: 0, borderRadius: 0, backgroundColor: '#F8FAFC'}]}>
            {/* Search Header */}
            <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingTop: Platform.OS === 'ios' ? 50 : 20, paddingBottom: 10, backgroundColor: COLORS.white, borderBottomWidth: 1, borderColor: '#E2E8F0'}}>
              <TouchableOpacity onPress={() => {setActiveModal(null); setSearchQuery(''); setSearchResults(null);}} style={{padding: 5}}>
                <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: RADIUS.lg, marginHorizontal: 10, paddingHorizontal: 15, height: 45}}>
                <Ionicons name="search" size={20} color={COLORS.textMuted} />
                <TextInput 
                  autoFocus
                  style={{flex: 1, marginLeft: 10, fontSize: 16, color: COLORS.textPrimary}}
                  placeholder="Search vegetables, grains, farmers..."
                  placeholderTextColor={COLORS.textMuted}
                  value={searchQuery}
                  onChangeText={(text) => {
                    setSearchQuery(text);
                    if (text.trim().length > 1) {
                      const lowerText = text.toLowerCase().trim();
                      const results = MOCK_SEARCH_RESULTS.filter(i => {
                        const nameMatch = i.name.toLowerCase().includes(lowerText);
                        const farmerMatch = i.farmer.toLowerCase().includes(lowerText);
                        const tagMatch = i.tags && i.tags.some(t => t.toLowerCase().includes(lowerText) || lowerText.includes(t.toLowerCase()));
                        return nameMatch || farmerMatch || tagMatch;
                      });
                      setSearchResults(results);
                    } else {
                      setSearchResults(null);
                    }
                  }}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => {setSearchQuery(''); setSearchResults(null);}}>
                    <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity style={{padding: 5}}>
                <Ionicons name="mic" size={24} color={COLORS.indiaGreen} />
              </TouchableOpacity>
            </View>

            {/* Filter Pills */}
            <View style={{backgroundColor: COLORS.white, paddingVertical: 10, borderBottomWidth: 1, borderColor: '#E2E8F0'}}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 15, gap: 10}}>
                <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, gap: 5}}>
                  <Ionicons name="options" size={16} color={COLORS.textPrimary} />
                  <Text style={{fontWeight: '600', color: COLORS.textPrimary}}>Filter</Text>
                </TouchableOpacity>
                {['All', 'Categories', 'Brands', 'Price: Low to High', 'Organic Only', 'Discount', 'Rating 4.5+'].map(f => (
                  <TouchableOpacity 
                    key={f} 
                    style={{backgroundColor: activeSearchFilter === f ? COLORS.indiaGreen : '#F1F5F9', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20}}
                    onPress={() => setActiveSearchFilter(f)}
                  >
                    <Text style={{color: activeSearchFilter === f ? COLORS.white : COLORS.textPrimary, fontWeight: '500'}}>{f}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>
              {!searchQuery && !searchResults ? (
                /* Empty State / Suggestions */
                <View style={{padding: 20}}>
                  <Text style={{fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 15}}>Recent Searches</Text>
                  <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 30}}>
                    {['Premium Sharbati Wheat', 'Moong Dal (Yellow)', 'Organic Basmati Rice', 'High-Yield Wheat Seeds'].map(r => (
                      <TouchableOpacity key={r} style={{flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, paddingHorizontal: 15, paddingVertical: 10, borderRadius: RADIUS.md, ...SHADOWS.small, gap: 8}} onPress={() => {setSearchQuery(r); setSearchResults(MOCK_SEARCH_RESULTS);}}>
                        <Ionicons name="time-outline" size={16} color={COLORS.textMuted} />
                        <Text style={{color: COLORS.textPrimary}}>{r}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  
                  <Text style={{fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 15}}>Trending Now</Text>
                  <View style={{gap: 15}}>
                    {['High-Yield Wheat Seeds - 20% OFF', 'Premium Sharbati Wheat', 'Organic Basmati Rice'].map((t, idx) => (
                      <TouchableOpacity key={idx} style={{flexDirection: 'row', alignItems: 'center', gap: 15}} onPress={() => {setSearchQuery(t); setSearchResults(MOCK_SEARCH_RESULTS);}}>
                        <View style={{width: 30, height: 30, borderRadius: 15, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center'}}>
                          <Ionicons name="trending-up" size={16} color="#3B82F6" />
                        </View>
                        <Text style={{fontSize: 15, color: COLORS.textPrimary, flex: 1}}>{t}</Text>
                        <Ionicons name="arrow-forward" size={16} color={COLORS.textMuted} />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : searchResults && searchResults.length > 0 ? (
                /* Grid Results */
                <View style={{padding: 15}}>
                  <Text style={{fontSize: 14, color: COLORS.textMuted, marginBottom: 15}}>{searchResults.length} results found for "{searchQuery}"</Text>
                  <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}}>
                    {(() => {
                      let displayResults = [...searchResults];
                      if (activeSearchFilter === 'Organic Only') displayResults = displayResults.filter(p => p.organic);
                      else if (activeSearchFilter === 'Discount') displayResults = displayResults.filter(p => p.discount);
                      else if (activeSearchFilter === 'Rating 4.5+') displayResults = displayResults.filter(p => parseFloat(p.rating) >= 4.5);
                      else if (activeSearchFilter === 'Price: Low to High') displayResults.sort((a,b) => a.price - b.price);
                      
                      if (displayResults.length === 0) return <Text style={{color: COLORS.textMuted, width: '100%', textAlign: 'center', marginTop: 20}}>No products match the selected filter.</Text>;

                      return displayResults.map(prod => {
                        const qty = cart[prod.id] || 0;
                        return (
                        <View key={prod.id} style={{width: '48%', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: 12, marginBottom: 15, ...SHADOWS.small}}>
                          <TouchableOpacity activeOpacity={0.8} onPress={() => {setSelectedProduct({...prod, description: 'Freshly harvested product from local farms. Rich in nutrients.', aiTag: 'Best Match', freshness: '99%'}); setActiveModal('product_details');}}>
                            <View style={{height: 100, backgroundColor: '#F1F5F9', borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', marginBottom: 10}}>
                              <Text style={{fontSize: 50}}>{prod.image}</Text>
                              {prod.organic && <View style={{position: 'absolute', top: 5, left: 5, backgroundColor: COLORS.indiaGreen, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, flexDirection: 'row', alignItems: 'center', gap: 3}}><Ionicons name="leaf" size={10} color={COLORS.white} /><Text style={{color: COLORS.white, fontSize: 8, fontWeight: 'bold'}}>ORGANIC</Text></View>}
                              {prod.discount && <View style={{position: 'absolute', top: 5, right: 5, backgroundColor: '#EF4444', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4}}><Text style={{color: COLORS.white, fontSize: 8, fontWeight: 'bold'}}>{prod.discount}</Text></View>}
                            </View>
                            
                            <Text style={{fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4}} numberOfLines={1}>{prod.name}</Text>
                            
                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8}} activeOpacity={0.7} onPress={() => {setSelectedFarmer(prod.farmers[0]); setActiveModal('farmer_profile');}}>
                              <Ionicons name="person-circle" size={14} color={COLORS.indiaGreen} />
                              <Text style={{fontSize: 11, color: COLORS.textSecondary}} numberOfLines={1}>{prod.farmer}</Text>
                            </TouchableOpacity>

                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8}}>
                              <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF08A', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4}}>
                                <Ionicons name="star" size={10} color="#CA8A04" />
                                <Text style={{fontSize: 10, color: '#CA8A04', fontWeight: 'bold', marginLeft: 2}}>{prod.rating}</Text>
                              </View>
                              <Text style={{fontSize: 10, color: COLORS.textMuted}}>• {prod.delivery}</Text>
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                              <View>
                                <Text style={{fontSize: 16, fontWeight: '800', color: COLORS.textPrimary}}>₹{prod.price}<Text style={{fontSize: 10, color: COLORS.textMuted}}>/{prod.unit}</Text></Text>
                                <Text style={{fontSize: 11, color: COLORS.textMuted, textDecorationLine: 'line-through'}}>{prod.oldPrice}</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                          
                          <View style={{marginTop: 10}}>
                            {qty === 0 ? (
                              <TouchableOpacity style={{backgroundColor: '#F1F5F9', borderColor: COLORS.indiaGreen, borderWidth: 1, paddingVertical: 8, borderRadius: RADIUS.md, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 5}} onPress={() => updateCart(prod.id, 1)}>
                                <Text style={{color: COLORS.indiaGreen, fontWeight: '700', fontSize: 13}}>Add</Text>
                                <Ionicons name="add" size={14} color={COLORS.indiaGreen} />
                              </TouchableOpacity>
                            ) : (
                              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.indiaGreen, borderRadius: RADIUS.md, paddingHorizontal: 5, paddingVertical: 4}}>
                                <TouchableOpacity style={{padding: 5}} onPress={() => updateCart(prod.id, -1)}><Ionicons name="remove" size={16} color={COLORS.white} /></TouchableOpacity>
                                <Text style={{color: COLORS.white, fontWeight: '700', fontSize: 13}}>{qty}</Text>
                                <TouchableOpacity style={{padding: 5}} onPress={() => updateCart(prod.id, 1)}><Ionicons name="add" size={16} color={COLORS.white} /></TouchableOpacity>
                              </View>
                            )}
                          </View>
                        </View>
                      );
                    });
                    })()}
                  </View>
                </View>
              ) : (
                /* No Results */
                <View style={{padding: 40, alignItems: 'center'}}>
                  <Ionicons name="search-outline" size={60} color="#E2E8F0" />
                  <Text style={{fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginTop: 20}}>No exact matches</Text>
                  <Text style={{fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: 10}}>Try searching for something else like "Wheat", "Rice", or "Dal"</Text>
                  
                  <View style={{marginTop: 30, width: '100%', alignItems: 'flex-start'}}>
                    <Text style={{fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 15}}>Did you mean?</Text>
                    {(() => {
                      const q = searchQuery.toLowerCase().trim();
                      let suggestions = ['Premium Sharbati Wheat', 'Organic Basmati Rice'];
                      if (q.includes('gehu') || q.includes('wheat')) suggestions = ['Premium Sharbati Wheat', 'High-Yield Wheat Seeds', 'Organic Basmati Rice'];
                      else if (q.includes('chaw') || q.includes('rice')) suggestions = ['Organic Basmati Rice', 'Premium Sharbati Wheat'];
                      else if (q.includes('dal') || q.includes('moong')) suggestions = ['Moong Dal (Yellow)', 'Organic Basmati Rice'];
                      else if (q.includes('seed')) suggestions = ['High-Yield Wheat Seeds'];
                      else if (q.includes('bio') || q.includes('org')) suggestions = ['Organic Basmati Rice', 'Premium Sharbati Wheat', 'Fresh Red Tomatoes'];
                      else if (q.includes('tom') || q.includes('tam')) suggestions = ['Fresh Red Tomatoes', 'Premium Sharbati Wheat'];

                      return suggestions.map((s, idx) => (
                        <TouchableOpacity key={idx} style={{paddingVertical: 10, borderBottomWidth: 1, borderColor: '#F1F5F9', width: '100%'}} onPress={() => {
                          setSearchQuery(s);
                          const lowerS = s.toLowerCase();
                          setSearchResults(MOCK_SEARCH_RESULTS.filter(i => i.name.toLowerCase().includes(lowerS) || (i.tags && i.tags.some(t => t.toLowerCase().includes(lowerS) || lowerS.includes(t.toLowerCase())))));
                        }}>
                          <Text style={{color: '#3B82F6', fontSize: 15}}>{s}</Text>
                        </TouchableOpacity>
                      ));
                    })()}
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        )}

        {/* --- CART MODAL --- */}
        {activeModal === 'cart' && (
          <View style={[styles.modalContent, {height: '95%', marginTop: 'auto', paddingHorizontal: 0}]}>
            <View style={[styles.modalHeader, {paddingHorizontal: 20}]}>
              <View>
                <Text style={[styles.modalTitle, {fontSize: 22, color: COLORS.indiaGreen}]}>My Smart Cart</Text>
                <Text style={{fontSize: 13, color: COLORS.textSecondary}}>{cartTotalItems} items ready to harvest</Text>
              </View>
              <TouchableOpacity onPress={() => setActiveModal(null)}><Ionicons name="close-circle" size={32} color={COLORS.textMuted} /></TouchableOpacity>
            </View>

            {cartTotalItems === 0 ? (
              <View style={styles.emptyCart}>
                <Ionicons name="cart-outline" size={80} color="#E2E8F0" />
                <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
                <Text style={styles.emptyCartSub}>Add some fresh farm products to get started!</Text>
                <TouchableOpacity style={styles.continueBtn} onPress={() => setActiveModal(null)}>
                  <Text style={styles.continueBtnText}>Continue Shopping</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <ScrollView showsVerticalScrollIndicator={false} style={{paddingHorizontal: 20}}>
                  {getCartDetails().map((item) => (
                    <View key={item.id} style={styles.cartItem}>
                      <View style={styles.cartItemEmojiWrap}>
                        <Text style={{fontSize: 32}}>{item.image}</Text>
                        {item.organic && <View style={styles.miniOrganicBadge}><Ionicons name="leaf" size={10} color={COLORS.white} /></View>}
                      </View>
                      <View style={{flex: 1, marginLeft: 15}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                          <Text style={styles.cartItemName}>{item.name}</Text>
                          <TouchableOpacity onPress={() => updateCart(item.id, -item.qty)}>
                            <Ionicons name="trash-outline" size={18} color={COLORS.error} />
                          </TouchableOpacity>
                        </View>
                        <Text style={styles.cartItemFarmer}>🧑‍🌾 {item.farmer}</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10}}>
                          <Text style={styles.cartItemPrice}>₹{item.price * item.qty}</Text>
                          <View style={styles.catQtyControl}>
                            <TouchableOpacity style={styles.catQtyBtn} onPress={() => updateCart(item.id, -1)}><Ionicons name="remove" size={16} color={COLORS.indiaGreen} /></TouchableOpacity>
                            <Text style={styles.catQtyText}>{item.qty}</Text>
                            <TouchableOpacity style={styles.catQtyBtn} onPress={() => updateCart(item.id, 1)}><Ionicons name="add" size={16} color={COLORS.indiaGreen} /></TouchableOpacity>
                          </View>
                        </View>
                        <Text style={styles.cartItemDelivery}>🚚 Est. Delivery: {item.delivery || '45m'}</Text>
                      </View>
                    </View>
                  ))}

                  <View style={styles.orderSummary}>
                    <Text style={styles.summaryTitle}>Bill Details</Text>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Subtotal</Text>
                      <Text style={styles.summaryValue}>₹{calculateTotal().subtotal}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Delivery Charges</Text>
                      <Text style={[styles.summaryValue, calculateTotal().delivery === 0 && {color: COLORS.indiaGreen}]}>
                        {calculateTotal().delivery === 0 ? 'FREE' : `₹${calculateTotal().delivery}`}
                      </Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryRow}>
                      <Text style={styles.totalLabel}>Total Payable</Text>
                      <Text style={styles.totalValue}>₹{calculateTotal().total}</Text>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.saveForLaterBtn} onPress={() => Alert.alert('Saved', 'Item saved for later purchase')}>
                    <Ionicons name="bookmark-outline" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.saveForLaterText}>Save all items for later</Text>
                  </TouchableOpacity>
                </ScrollView>

                <View style={styles.cartFooter}>
                  <View>
                    <Text style={styles.footerTotal}>₹{calculateTotal().total}</Text>
                    <Text style={styles.footerLabel}>Total Amount</Text>
                  </View>
                  <TouchableOpacity style={styles.placeOrderBtn} onPress={placeOrder}>
                    <Text style={styles.placeOrderText}>Confirm & Place Order</Text>
                    <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}

        {/* --- ORDERS MODAL --- */}
        {activeModal === 'orders' && (
          <View style={[styles.modalContent, {height: '95%', marginTop: 'auto', paddingHorizontal: 0}]}>
            <View style={[styles.modalHeader, {paddingHorizontal: 20}]}>
              <View>
                <Text style={[styles.modalTitle, {fontSize: 22, color: COLORS.indiaGreen}]}>My Orders</Text>
                <Text style={{fontSize: 13, color: COLORS.textSecondary}}>Track and manage your farm harvests</Text>
              </View>
              <TouchableOpacity onPress={() => setActiveModal(null)}><Ionicons name="close-circle" size={32} color={COLORS.textMuted} /></TouchableOpacity>
            </View>

            <View style={styles.orderTabs}>
              {['Active', 'Delivered', 'Cancelled', 'Returns'].map((tab) => (
                <TouchableOpacity 
                  key={tab} 
                  style={[styles.orderTab, activeOrderTab === tab && styles.orderTabActive]}
                  onPress={() => setActiveOrderTab(tab)}
                >
                  <Text style={[styles.orderTabText, activeOrderTab === tab && styles.orderTabTextActive]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{paddingHorizontal: 20}}>
              {orders.filter(o => o.status === activeOrderTab).length === 0 ? (
                <View style={styles.emptyOrders}>
                  <Ionicons name="receipt-outline" size={60} color="#E2E8F0" />
                  <Text style={styles.emptyOrdersTitle}>No {activeOrderTab} Orders</Text>
                </View>
              ) : (
                orders.filter(o => o.status === activeOrderTab).map((order) => (
                  <View key={order.id} style={styles.orderCard}>
                    <View style={styles.orderCardHeader}>
                      <View>
                        <Text style={styles.orderId}>{order.id}</Text>
                        <Text style={styles.orderDate}>{order.orderDate}</Text>
                      </View>
                      <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>{order.status}</Text>
                      </View>
                    </View>

                    <View style={styles.orderItems}>
                      {order.items.map((item, idx) => (
                        <View key={idx} style={styles.orderItemRow}>
                          <Text style={styles.orderItemEmoji}>{item.image}</Text>
                          <View style={{flex: 1, marginLeft: 10}}>
                            <Text style={styles.orderItemName}>{item.name} x {item.qty}</Text>
                            <Text style={styles.orderItemFarmer}>🧑‍🌾 {item.farmer}</Text>
                          </View>
                          <Text style={styles.orderItemPrice}>₹{item.price * item.qty}</Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.orderTracking}>
                      <View style={styles.trackingLine}>
                        <View style={[styles.trackingDot, {backgroundColor: COLORS.indiaGreen}]} />
                        <View style={[styles.trackingBar, {backgroundColor: '#E2E8F0'}]} />
                        <View style={styles.trackingDot} />
                        <View style={[styles.trackingBar, {backgroundColor: '#E2E8F0'}]} />
                        <View style={styles.trackingDot} />
                      </View>
                      <View style={styles.trackingLabels}>
                        <Text style={styles.trackingLabelActive}>Ordered</Text>
                        <Text style={styles.trackingLabel}>Packed</Text>
                        <Text style={styles.trackingLabel}>Delivery</Text>
                      </View>
                    </View>

                    <View style={styles.orderFooter}>
                      <Text style={styles.orderTotal}>Total: ₹{order.total}</Text>
                      <View style={styles.orderActions}>
                        <TouchableOpacity style={styles.orderActionBtn} onPress={() => Alert.alert('Tracking', 'Redirecting to live map tracking...')}>
                          <Text style={styles.orderActionText}>Track</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.orderActionBtn, {backgroundColor: COLORS.indiaGreen}]} onPress={() => Alert.alert('Reorder', 'Adding items back to cart...')}>
                          <Text style={[styles.orderActionText, {color: COLORS.white}]}>Reorder</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.orderExtraActions}>
                      <TouchableOpacity style={styles.extraAction}><Ionicons name="document-text-outline" size={16} color={COLORS.textSecondary}/><Text style={styles.extraActionText}>Invoice</Text></TouchableOpacity>
                      <TouchableOpacity style={styles.extraAction} onPress={() => Alert.alert('Support', 'Connecting to MKisans support...')}><Ionicons name="help-circle-outline" size={16} color={COLORS.textSecondary}/><Text style={styles.extraActionText}>Help</Text></TouchableOpacity>
                      {order.status === 'Active' && <TouchableOpacity style={styles.extraAction} onPress={() => Alert.alert('Cancel', 'Confirm order cancellation?')}><Ionicons name="close-circle-outline" size={16} color={COLORS.error}/><Text style={[styles.extraActionText, {color: COLORS.error}]}>Cancel</Text></TouchableOpacity>}
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        )}

        {/* --- ORDER SUCCESS ANIMATION --- */}
        {activeModal === 'order_success' && (
          <View style={styles.successOverlay}>
            <View style={styles.successContent}>
              <View style={styles.successIconWrap}>
                <Ionicons name="checkmark-done" size={60} color={COLORS.white} />
              </View>
              <Text style={styles.successTitle}>Harvest Confirmed!</Text>
              <Text style={styles.successSub}>Your order has been placed successfully.</Text>
            </View>
          </View>
        )}

        {/* --- COMMON FILTERS --- */}
        {activeModal === 'filter' && (
          <View style={[styles.modalContent, {height: '80%', marginTop: 'auto'}]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter & Sort</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}><Ionicons name="close-circle" size={30} color={COLORS.textMuted} /></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 80 }}>
              <Text style={styles.filterSectionTitle}>Sort By</Text>
              <View style={styles.chipRow}>
                {['Popularity', 'Price: Low to High', 'Price: High to Low', 'Freshness', 'Nearest farms', 'Highest rated'].map(sort => (
                  <TouchableOpacity key={sort} style={[styles.filterChip, activeSort === sort && styles.filterChipActive]} onPress={() => setActiveSort(sort)}>
                    <Text style={[styles.filterChipText, activeSort === sort && {color: '#fff'}]}>{sort}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <View style={styles.filterFooter}>
              <TouchableOpacity style={styles.resetBtn} onPress={() => { setActiveSort('Popularity'); }}>
                <Text style={styles.resetBtnText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} onPress={() => setActiveModal(null)}><Text style={styles.applyBtnText}>Apply Filters</Text></TouchableOpacity>
            </View>
          </View>
        )}

        {/* --- BANNER HARVEST MODAL --- */}
        {activeModal === 'banner_harvest' && (
          <View style={[styles.modalContent, {height: '95%', marginTop: 'auto', paddingHorizontal: 0, backgroundColor: '#F8FAFC'}]}>
            <View style={[styles.modalHeader, {paddingHorizontal: 20}]}>
              <View>
                <Text style={[styles.modalTitle, {fontSize: 22, color: COLORS.indiaGreen}]}>Fresh Summer Harvest</Text>
                <Text style={{fontSize: 13, color: COLORS.textSecondary}}>Direct from farm to you in minutes</Text>
              </View>
              <TouchableOpacity onPress={() => setActiveModal(null)}><Ionicons name="close-circle" size={32} color={COLORS.textMuted} /></TouchableOpacity>
            </View>
            
            {renderFilterAndSortBar('harvest')}

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{padding: 20, paddingBottom: 100}}>
              {HARVEST_PRODUCTS.map((prod) => {
                const qty = cart[prod.id] || 0;
                return (
                  <View key={prod.id} style={styles.harvestCard}>
                    <View style={styles.harvestTopBar}>
                      <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                        <View style={styles.pulsingDot} />
                        <Text style={styles.liveStockText}>{prod.stock}</Text>
                      </View>
                      <Text style={styles.harvestTimeText}>{prod.harvestTime}</Text>
                    </View>

                    <View style={{flexDirection: 'row', gap: 15}}>
                      <View style={styles.harvestImgWrap}>
                        <Image source={{uri: prod.farmImg}} style={{width: '100%', height: '100%'}} />
                        <View style={styles.harvestEmojiOverlay}><Text style={{fontSize: 24}}>{prod.image}</Text></View>
                      </View>
                      <View style={{flex: 1}}>
                        <Text style={styles.productName}>{prod.name}</Text>
                        <Text style={styles.farmerName}>🧑‍🌾 {prod.farmer}</Text>
                        <View style={styles.harvestBadgesRow}>
                          <View style={styles.freshnessBadge}><Text style={styles.freshnessBadgeText}>✨ {prod.freshness} Fresh</Text></View>
                          <View style={styles.deliveryBadge}><Text style={styles.deliveryBadgeText}>🚀 {prod.delivery}</Text></View>
                        </View>
                        <Text style={styles.etaText}>📍 {prod.distance} away</Text>
                      </View>
                    </View>

                    <View style={styles.harvestDivider} />

                    <View style={styles.harvestBottomBar}>
                      <View>
                        <Text style={styles.pricePerKg}>₹{prod.price}<Text style={{fontSize: 14, color: COLORS.textMuted}}>/kg</Text></Text>
                        <Text style={{fontSize: 12, color: '#EF4444', fontWeight: '700'}}>{prod.discount}</Text>
                      </View>
                      <View style={{flexDirection: 'row', gap: 10}}>
                        <TouchableOpacity style={styles.compareBtn}><Ionicons name="git-compare-outline" size={20} color={COLORS.textSecondary} /></TouchableOpacity>
                        {qty === 0 ? (
                          <TouchableOpacity style={styles.buyNowBtn} onPress={() => updateCart(prod.id, 1)}>
                            <Text style={styles.buyNowText}>Add to Cart</Text>
                          </TouchableOpacity>
                        ) : (
                          <View style={styles.cartControlWrap}>
                            <TouchableOpacity style={styles.cartBtn} onPress={() => updateCart(prod.id, -1)}><Ionicons name="remove" size={18} color={COLORS.white} /></TouchableOpacity>
                            <Text style={styles.cartQtyTextWhite}>{qty}</Text>
                            <TouchableOpacity style={styles.cartBtn} onPress={() => updateCart(prod.id, 1)}><Ionicons name="add" size={18} color={COLORS.white} /></TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* --- BANNER ORGANIC MODAL --- */}
        {activeModal === 'banner_organic' && (
          <View style={[styles.modalContent, {height: '95%', marginTop: 'auto', paddingHorizontal: 0, backgroundColor: '#F0FDF4'}]}>
            <View style={[styles.modalHeader, {paddingHorizontal: 20}]}>
              <View>
                <Text style={[styles.modalTitle, {fontSize: 22, color: '#15803D'}]}>Organic Farmers Market</Text>
                <Text style={{fontSize: 13, color: '#166534'}}>100% Certified Chemical-Free</Text>
              </View>
              <TouchableOpacity onPress={() => setActiveModal(null)}><Ionicons name="close-circle" size={32} color={COLORS.textMuted} /></TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{padding: 20, paddingBottom: 100}}>
              {ORGANIC_PRODUCTS.map((prod) => {
                const qty = cart[prod.id] || 0;
                return (
                  <View key={prod.id} style={styles.organicCard}>
                    <View style={styles.organicHeader}>
                      <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                        <Image source={{uri: prod.farmerImg}} style={styles.farmerAvatarImg} />
                        <View>
                          <Text style={styles.organicFarmerName}>{prod.farmer}</Text>
                          <Text style={styles.certText}>✅ {prod.certification}</Text>
                        </View>
                      </View>
                      <TouchableOpacity style={styles.followBtn}><Text style={styles.followBtnText}>Follow</Text></TouchableOpacity>
                    </View>

                    <View style={styles.organicProductDetails}>
                      <View style={styles.organicIconWrap}><Text style={{fontSize: 40}}>{prod.image}</Text></View>
                      <View style={{flex: 1, marginLeft: 15}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                          <Text style={styles.organicProductName}>{prod.name}</Text>
                          <View style={styles.scoreBadge}><Ionicons name="leaf" size={10} color="#15803D"/><Text style={styles.scoreText}>{prod.sustainability}</Text></View>
                        </View>
                        <View style={styles.ecoBadgeRow}>
                          <Text style={styles.ecoBadgeText}>🌿 {prod.ecoBadge}</Text>
                        </View>
                        <Text style={styles.farmerStoryText} numberOfLines={2}>"{prod.story}"</Text>
                      </View>
                    </View>

                    <TouchableOpacity style={styles.labTestBtn} onPress={() => Alert.alert('Lab Report', 'Downloading certified residue test report...')}>
                      <Ionicons name="document-text" size={16} color="#047857" />
                      <Text style={styles.labTestText}>View Lab Test Report</Text>
                    </TouchableOpacity>

                    <View style={styles.organicBottomBar}>
                      <View>
                        <Text style={styles.organicPrice}>₹{prod.price}<Text style={{fontSize: 14, color: '#166534'}}>/kg</Text></Text>
                        <Text style={{fontSize: 10, color: '#15803D', fontWeight: '700'}}>Organic Certified</Text>
                      </View>
                      <View style={{flexDirection: 'row', gap: 12, alignItems: 'center'}}>
                        <TouchableOpacity style={styles.chatBtn}><Ionicons name="chatbubbles" size={20} color="#059669"/></TouchableOpacity>
                        {qty === 0 ? (
                          <TouchableOpacity style={styles.organicAddBtn} onPress={() => updateCart(prod.id, 1)}>
                            <Text style={styles.organicAddText}>Add to Cart</Text>
                          </TouchableOpacity>
                        ) : (
                          <View style={styles.organicCartControl}>
                            <TouchableOpacity style={{padding: 10}} onPress={() => updateCart(prod.id, -1)}><Ionicons name="remove" size={18} color="#047857" /></TouchableOpacity>
                            <Text style={styles.organicQtyText}>{qty}</Text>
                            <TouchableOpacity style={{padding: 10}} onPress={() => updateCart(prod.id, 1)}><Ionicons name="add" size={18} color="#047857" /></TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* --- CATEGORY DETAILS MODAL --- */}
        {activeModal === 'category_details' && (
          <View style={[styles.modalContent, {height: '95%', marginTop: 'auto', paddingHorizontal: 0, backgroundColor: '#F8FAFC'}]}>
            <View style={[styles.modalHeader, {paddingHorizontal: 20}]}>
              <View>
                <Text style={[styles.modalTitle, {fontSize: 22, color: COLORS.indiaGreen}]}>{selectedCategory}</Text>
                <Text style={{fontSize: 13, color: COLORS.textSecondary}}>Browsing best items in {selectedCategory}</Text>
              </View>
              <TouchableOpacity onPress={() => {setActiveModal(null); setSelectedCategory(null);}}><Ionicons name="close-circle" size={32} color={COLORS.textMuted} /></TouchableOpacity>
            </View>
            
            {renderFilterAndSortBar('category')}

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>
              {/* AVAILABLE PRODUCTS THROUGH FARMERS SECTION */}
              <View style={styles.availableSection}>
                <View style={styles.availableHeader}>
                  <Ionicons name="basket" size={20} color={COLORS.indiaGreen} />
                  <Text style={styles.availableTitle}>Available Products Through Farmers</Text>
                </View>
                <Text style={styles.availableSub}>Direct from field to your table</Text>
                
                <View style={{paddingHorizontal: 15, marginTop: 15}}>
                  {CATEGORY_DATA[selectedCategory]?.map((prod) => renderCategoryProduct(prod))}
                </View>
              </View>
            </ScrollView>
          </View>
        )}

        {/* --- PRODUCT DETAILS MODAL (RECOMMENDED) --- */}
        {activeModal === 'product_details' && selectedProduct && (
          <View style={[styles.modalContent, {height: '95%', marginTop: 'auto', paddingHorizontal: 0, backgroundColor: '#F8FAFC'}]}>
            <View style={[styles.modalHeader, {paddingHorizontal: 20}]}>
              <View>
                <Text style={[styles.modalTitle, {fontSize: 22, color: COLORS.indiaGreen}]}>{selectedProduct.name}</Text>
                <Text style={{fontSize: 13, color: COLORS.textSecondary}}>{selectedProduct.aiTag}</Text>
              </View>
              <TouchableOpacity onPress={() => {setActiveModal(null); setSelectedProduct(null);}}><Ionicons name="close-circle" size={32} color={COLORS.textMuted} /></TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>
              {/* Product Hero */}
              <View style={styles.prodHero}>
                <View style={styles.prodHeroImgWrap}>
                  <Text style={{fontSize: 80}}>{selectedProduct.image}</Text>
                </View>
                <View style={styles.prodInfoBox}>
                  <Text style={styles.prodDesc}>{selectedProduct.description}</Text>
                  <View style={styles.prodMetaRow}>
                    <View style={styles.prodMetaItem}><Ionicons name="leaf" size={16} color={COLORS.indiaGreen}/><Text style={styles.prodMetaText}>{selectedProduct.freshness} Fresh</Text></View>
                    <View style={styles.prodMetaItem}><Ionicons name="time" size={16} color="#3B82F6"/><Text style={styles.prodMetaText}>{selectedProduct.delivery} delivery</Text></View>
                    <View style={styles.prodMetaItem}><Ionicons name="cube" size={16} color="#F59E0B"/><Text style={styles.prodMetaText}>{selectedProduct.stock}</Text></View>
                  </View>
                </View>
              </View>

              <View style={[styles.bannerFilterBar, {backgroundColor: '#F1F5F9', marginTop: 10}]}>
                <Text style={{fontWeight: '800', color: COLORS.textPrimary}}>Available from {selectedProduct.farmers.length} Farmers</Text>
                <TouchableOpacity style={[styles.bannerFilterBtn, {marginLeft: 'auto'}]} onPress={() => setActiveModal('filter')}>
                  <Ionicons name="options" size={16} color={COLORS.textPrimary} />
                  <Text style={styles.bannerFilterText}>Sort</Text>
                </TouchableOpacity>
              </View>

              <View style={{padding: 20}}>
                {selectedProduct.farmers.map((farmer) => {
                  const qty = cart[`${selectedProduct.id}_${farmer.id}`] || 0;
                  return (
                    <View key={farmer.id} style={styles.farmerProductCard}>
                      <TouchableOpacity 
                        style={{flexDirection: 'row'}}
                        activeOpacity={0.7}
                        onPress={() => {
                          setSelectedFarmer(farmer);
                          setActiveModal('farmer_profile');
                        }}
                      >
                        <Image source={{uri: farmer.image}} style={styles.farmerAvatarDetail} />
                        <View style={{flex: 1, marginLeft: 12}}>
                          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={styles.farmerNameDetail}>{farmer.name}</Text>
                            <View style={styles.ratingBadgeSmall}><Ionicons name="star" size={10} color="#EAB308" /><Text style={styles.ratingTextSmall}>{farmer.rating}</Text></View>
                          </View>
                          <Text style={styles.farmerDistDetail}>📍 {farmer.distance} away • {farmer.cert} Certified</Text>
                          <Text style={styles.farmerDeliveryDetail}>🚚 {farmer.delivery} • {farmer.stock} left</Text>
                        </View>
                      </TouchableOpacity>

                      <View style={styles.farmerDivider} />

                      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={styles.farmerPriceDetail}>₹{farmer.price}<Text style={{fontSize: 14, color: COLORS.textMuted}}>/kg</Text></Text>
                        <View style={{flexDirection: 'row', gap: 8}}>
                          {qty === 0 ? (
                            <TouchableOpacity style={styles.farmerAddBtn} onPress={() => updateCart(`${selectedProduct.id}_${farmer.id}`, 1)}>
                              <Text style={styles.farmerAddText}>Add to Cart</Text>
                            </TouchableOpacity>
                          ) : (
                            <View style={styles.farmerQtyControl}>
                              <TouchableOpacity style={styles.catQtyBtn} onPress={() => updateCart(`${selectedProduct.id}_${farmer.id}`, -1)}><Ionicons name="remove" size={16} color={COLORS.indiaGreen} /></TouchableOpacity>
                              <Text style={styles.farmerQtyText}>{qty}</Text>
                              <TouchableOpacity style={styles.catQtyBtn} onPress={() => updateCart(`${selectedProduct.id}_${farmer.id}`, 1)}><Ionicons name="add" size={16} color={COLORS.indiaGreen} /></TouchableOpacity>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        )}

        {/* --- FARMER SOCIAL PROFILE MODAL --- */}
        {activeModal === 'farmer_profile' && selectedFarmer && (
          <View style={[styles.modalContent, {height: '95%', marginTop: 'auto', paddingHorizontal: 0, backgroundColor: '#F8FAFC'}]}>
            <View style={[styles.modalHeader, {paddingHorizontal: 20, paddingBottom: 10}]}>
              <View>
                <Text style={[styles.modalTitle, {fontSize: 22, color: COLORS.indiaGreen}]}>Farmer Profile</Text>
                <Text style={{fontSize: 13, color: COLORS.textSecondary}}>Social Feed & Store</Text>
              </View>
              <TouchableOpacity onPress={() => {setActiveModal(selectedProduct ? 'product_details' : 'category_details'); setSelectedFarmer(null);}}><Ionicons name="arrow-back-circle" size={32} color={COLORS.textMuted} /></TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 120}}>
              {/* Profile Header */}
              <View style={{padding: 20, backgroundColor: COLORS.white, borderBottomWidth: 1, borderColor: '#E2E8F0'}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image source={{uri: selectedFarmer.image}} style={{width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: COLORS.indiaGreen}} />
                  <View style={{flex: 1, marginLeft: 15}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                      <Text style={{fontSize: 20, fontWeight: '800', color: COLORS.textPrimary}}>{selectedFarmer.name}</Text>
                      <Ionicons name="checkmark-circle" size={18} color="#3B82F6" />
                    </View>
                    <Text style={{fontSize: 14, color: COLORS.textSecondary, marginTop: 2}}>📍 {selectedFarmer.distance} away • {selectedFarmer.cert} Certified</Text>
                    <View style={{flexDirection: 'row', marginTop: 12, gap: 20}}>
                      <View style={{alignItems: 'center'}}><Text style={{fontWeight: '800', fontSize: 16, color: COLORS.textPrimary}}>2.4K</Text><Text style={{fontSize: 12, color: COLORS.textMuted}}>Followers</Text></View>
                      <View style={{alignItems: 'center'}}><Text style={{fontWeight: '800', fontSize: 16, color: COLORS.textPrimary}}>150</Text><Text style={{fontSize: 12, color: COLORS.textMuted}}>Following</Text></View>
                      <View style={{alignItems: 'center'}}><Text style={{fontWeight: '800', fontSize: 16, color: COLORS.textPrimary}}>{selectedFarmer.rating}</Text><Text style={{fontSize: 12, color: COLORS.textMuted}}>Rating</Text></View>
                    </View>
                  </View>
                </View>
                
                {/* Actions */}
                <View style={{flexDirection: 'row', gap: 10, marginTop: 20}}>
                  <TouchableOpacity style={{flex: 1, backgroundColor: COLORS.indiaGreen, paddingVertical: 10, borderRadius: RADIUS.md, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 5}}>
                    <Ionicons name="person-add" size={18} color={COLORS.white} />
                    <Text style={{color: COLORS.white, fontWeight: '700'}}>Follow</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{flex: 1, backgroundColor: '#EFF6FF', paddingVertical: 10, borderRadius: RADIUS.md, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 5}}>
                    <Ionicons name="chatbubble-ellipses" size={18} color="#3B82F6" />
                    <Text style={{color: '#3B82F6', fontWeight: '700'}}>Message</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Feed Tabs */}
              <View style={{flexDirection: 'row', backgroundColor: COLORS.white, borderBottomWidth: 1, borderColor: '#E2E8F0'}}>
                <View style={{flex: 1, paddingVertical: 15, alignItems: 'center', borderBottomWidth: 2, borderColor: COLORS.indiaGreen}}>
                  <Ionicons name="grid" size={20} color={COLORS.indiaGreen} />
                </View>
                <View style={{flex: 1, paddingVertical: 15, alignItems: 'center'}}>
                  <Ionicons name="play-circle-outline" size={20} color={COLORS.textMuted} />
                </View>
                <View style={{flex: 1, paddingVertical: 15, alignItems: 'center'}}>
                  <Ionicons name="pricetags-outline" size={20} color={COLORS.textMuted} />
                </View>
              </View>

              {/* Social Feed Content */}
              <View style={{padding: 15, gap: 20}}>
                {/* Post 1 */}
                <View style={{backgroundColor: COLORS.white, borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOWS.small}}>
                  <View style={{padding: 15, flexDirection: 'row', alignItems: 'center', gap: 10}}>
                    <Image source={{uri: selectedFarmer.image}} style={{width: 40, height: 40, borderRadius: 20}} />
                    <View>
                      <Text style={{fontWeight: '700', color: COLORS.textPrimary}}>{selectedFarmer.name}</Text>
                      <Text style={{fontSize: 12, color: COLORS.textMuted}}>2 hours ago • Organic Farming</Text>
                    </View>
                    <TouchableOpacity style={{marginLeft: 'auto'}}><Ionicons name="ellipsis-horizontal" size={20} color={COLORS.textMuted} /></TouchableOpacity>
                  </View>
                  <Image source={{uri: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=600&q=80'}} style={{width: '100%', height: 250}} />
                  <View style={{padding: 15}}>
                    <Text style={{color: COLORS.textPrimary, lineHeight: 22}}>Fresh vegetable harvest today! No chemicals used, completely natural and healthy. 🌱🚜 #OrganicFarming #FreshHarvest</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, borderTopWidth: 1, borderColor: '#F1F5F9', paddingTop: 15}}>
                      <View style={{flexDirection: 'row', gap: 20}}>
                        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', gap: 6}}><Ionicons name="heart-outline" size={24} color={COLORS.textPrimary} /><Text style={{fontWeight: '600'}}>245</Text></TouchableOpacity>
                        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', gap: 6}}><Ionicons name="chatbubble-outline" size={22} color={COLORS.textPrimary} /><Text style={{fontWeight: '600'}}>18</Text></TouchableOpacity>
                        <TouchableOpacity><Ionicons name="paper-plane-outline" size={22} color={COLORS.textPrimary} /></TouchableOpacity>
                      </View>
                      <TouchableOpacity><Ionicons name="bookmark-outline" size={22} color={COLORS.textPrimary} /></TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Post 2 */}
                <View style={{backgroundColor: COLORS.white, borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOWS.small}}>
                  <View style={{padding: 15, flexDirection: 'row', alignItems: 'center', gap: 10}}>
                    <Image source={{uri: selectedFarmer.image}} style={{width: 40, height: 40, borderRadius: 20}} />
                    <View>
                      <Text style={{fontWeight: '700', color: COLORS.textPrimary}}>{selectedFarmer.name}</Text>
                      <Text style={{fontSize: 12, color: COLORS.textMuted}}>Yesterday • Farm Preparation</Text>
                    </View>
                    <TouchableOpacity style={{marginLeft: 'auto'}}><Ionicons name="ellipsis-horizontal" size={20} color={COLORS.textMuted} /></TouchableOpacity>
                  </View>
                  <Image source={{uri: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&q=80'}} style={{width: '100%', height: 250}} />
                  <View style={{padding: 15}}>
                    <Text style={{color: COLORS.textPrimary, lineHeight: 22}}>Preparing the fields for the next season. The soil is looking great after our natural compost treatment! 🌾 #Agriculture</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, borderTopWidth: 1, borderColor: '#F1F5F9', paddingTop: 15}}>
                      <View style={{flexDirection: 'row', gap: 20}}>
                        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', gap: 6}}><Ionicons name="heart-outline" size={24} color={COLORS.textPrimary} /><Text style={{fontWeight: '600'}}>180</Text></TouchableOpacity>
                        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', gap: 6}}><Ionicons name="chatbubble-outline" size={22} color={COLORS.textPrimary} /><Text style={{fontWeight: '600'}}>12</Text></TouchableOpacity>
                        <TouchableOpacity><Ionicons name="paper-plane-outline" size={22} color={COLORS.textPrimary} /></TouchableOpacity>
                      </View>
                      <TouchableOpacity><Ionicons name="bookmark-outline" size={22} color={COLORS.textPrimary} /></TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Sticky Bottom Actions */}
            <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, padding: 15, backgroundColor: COLORS.white, borderTopWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', gap: 15, alignItems: 'center'}}>
              <TouchableOpacity style={{flex: 1, backgroundColor: '#F1F5F9', paddingVertical: 14, borderRadius: RADIUS.md, alignItems: 'center'}} onPress={() => Alert.alert('Products', `Viewing all crops from ${selectedFarmer.name}`)}>
                <Text style={{color: COLORS.textPrimary, fontWeight: '700'}}>Available Crops</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{flex: 1, backgroundColor: COLORS.indiaGreen, paddingVertical: 14, borderRadius: RADIUS.md, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8}} onPress={() => {setActiveModal(selectedProduct ? 'product_details' : 'category_details'); setSelectedFarmer(null);}}>
                <Ionicons name="basket" size={20} color={COLORS.white} />
                <Text style={{color: COLORS.white, fontWeight: '700'}}>Buy From Farmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* --- GLOBAL FLOATING CART FOR ALL MODALS --- */}
        {activeModal && (activeModal.startsWith('banner_') || activeModal === 'category_details' || activeModal === 'product_details' || activeModal === 'search') && cartTotalItems > 0 && (
          <View style={styles.floatingCartBar}>
            <View>
              <Text style={styles.floatingCartItems}>{cartTotalItems} Item{cartTotalItems > 1 ? 's' : ''} added</Text>
              <Text style={styles.floatingCartSub}>Ready for checkout</Text>
            </View>
            <TouchableOpacity style={styles.checkoutBtn} onPress={() => setActiveModal('cart')}>
              <Text style={styles.checkoutBtnText}>View Cart</Text>
              <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        )}

      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* MAIN HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require('../../assets/logo.jpg')} style={styles.logo} />
          <TouchableOpacity onPress={() => setActiveModal('location')} activeOpacity={0.7}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
              <Text style={styles.deliverToText}>Delivering to</Text>
              <Ionicons name="chevron-down" size={12} color={COLORS.textMuted} />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
              <Ionicons name="location" size={14} color={COLORS.indiaGreen} />
              <Text style={styles.locationText}>Bhopal, MP 462001</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setActiveModal('cart')} activeOpacity={0.7}>
            <Ionicons name="cart-outline" size={26} color={COLORS.textPrimary} />
            {cartTotalItems > 0 && <View style={styles.badge}><Text style={{color: '#fff', fontSize: 8, fontWeight: '900'}}>{cartTotalItems}</Text></View>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setActiveModal('orders')} activeOpacity={0.7}>
            <Ionicons name="receipt-outline" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')} activeOpacity={0.8}>
            <Ionicons name="person" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* SMART SEARCH */}
        <View style={styles.searchSection}>
          <TouchableOpacity style={styles.searchBar} onPress={() => setActiveModal('search')} activeOpacity={0.9}>
            <Ionicons name="search" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
            <Text style={[styles.searchInput, {color: COLORS.textMuted, paddingTop: 14}]}>Search vegetables, grains, farmers...</Text>
            <TouchableOpacity onPress={() => Alert.alert('Voice Search', 'Listening...')} style={{marginRight: 10, padding: 5}}>
              <Ionicons name="mic" size={20} color={COLORS.indiaGreen} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveModal('filter')} style={styles.filterIconBtn}>
              <Ionicons name="options" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {/* HERO BANNER SLIDER */}
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.bannerContainer}>
          {BANNERS.map((b) => (
            <TouchableOpacity key={b.id} activeOpacity={0.9} onPress={() => setActiveModal(`banner_${b.type}`)}>
              {b.image ? (
                <ImageBackground 
                  source={{ uri: b.image }} 
                  style={[styles.banner, { overflow: 'hidden' }]} 
                  imageStyle={{ resizeMode: 'cover' }}
                >
                  <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' }} />
                  <View style={styles.bannerContent}>
                    <Text style={styles.bannerTitle}>{b.title}</Text>
                    <Text style={styles.bannerSub}>{b.sub}</Text>
                    <View style={styles.bannerBtn}><Text style={styles.bannerBtnText}>View Products</Text></View>
                  </View>
                </ImageBackground>
              ) : (
                <View style={[styles.banner, { backgroundColor: b.bg }]}>
                  <View style={styles.bannerContent}>
                    <Text style={styles.bannerTitle}>{b.title}</Text>
                    <Text style={styles.bannerSub}>{b.sub}</Text>
                    <View style={styles.bannerBtn}><Text style={styles.bannerBtnText}>View Products</Text></View>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity activeOpacity={0.8} style={styles.walletCard} onPress={() => navigation.navigate('Profile')}>
          <View>
            <Text style={styles.walletLabel}>Wallet Balance</Text>
            <Text style={styles.walletAmount}>₹1,250.00</Text>
          </View>
          <View style={styles.rewardSection}>
            <Text style={styles.rewardText}>🌟 450 Points</Text>
            <View style={styles.addMoneyBtn}><Text style={styles.addMoneyText}>+ Add</Text></View>
          </View>
        </TouchableOpacity>

        {/* CATEGORY GRID */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map(c => (
              <TouchableOpacity key={c.id} style={styles.categoryItem} onPress={() => {setSelectedCategory(c.name); setActiveModal('category_details');}}>
                <View style={styles.categoryIconWrap}>
                  <Ionicons name={c.icon} size={28} color={COLORS.indiaGreen} />
                </View>
                <Text style={styles.categoryName}>{c.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* RECOMMENDED FOR YOU */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended for You ✨</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {RECOMMENDED.map(p => (
              <TouchableOpacity key={p.id} activeOpacity={0.9} style={styles.productCard} onPress={() => {setSelectedProduct(p); setActiveModal('product_details');}}>
                <View style={styles.aiBadge}><Text style={styles.aiBadgeText}>{p.aiTag}</Text></View>
                {p.organic && <View style={styles.organicBadge}><Text style={styles.organicText}>Organic</Text></View>}
                <View style={styles.productImagePlaceholder}><Text style={styles.productEmoji}>{p.image}</Text></View>
                <Text style={styles.productName}>{p.name}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>₹{p.price}/kg</Text>
                  <Text style={styles.oldPrice}>{p.oldPrice}</Text>
                </View>
                <TouchableOpacity style={styles.addToCartBtn} onPress={() => {setSelectedProduct(p); setActiveModal('product_details');}}>
                  <Text style={styles.addToCartText}>View Deals</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{height: 100}} />
      </ScrollView>

      {/* GLOBAL FLOATING ACTION BUTTONS */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fabCart} onPress={() => setActiveModal('cart')}>
          <Ionicons name="cart" size={24} color={COLORS.white} />
          {cartTotalItems > 0 && <View style={styles.fabBadge}><Text style={styles.fabBadgeText}>{cartTotalItems}</Text></View>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.fabAI} onPress={() => Alert.alert('Jarvis', 'Opening MKisans Assistant')}>
          <Ionicons name="sparkles" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {renderModals()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 15,
    backgroundColor: COLORS.white, ...SHADOWS.small, zIndex: 10
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: COLORS.indiaGreen },
  deliverToText: { fontSize: 11, color: COLORS.textMuted },
  locationText: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn: { padding: 4 },
  badge: { position: 'absolute', top: 0, right: 0, width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.error, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#fff' },
  profileBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.indiaGreen, justifyContent: 'center', alignItems: 'center' },
  
  scrollContent: { paddingBottom: SPACING.xxl },
  
  searchSection: { padding: SPACING.xl, backgroundColor: COLORS.white, borderBottomLeftRadius: RADIUS.xl, borderBottomRightRadius: RADIUS.xl, ...SHADOWS.small },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: RADIUS.lg, paddingLeft: 15, height: 48 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.textPrimary },
  filterIconBtn: { backgroundColor: COLORS.indiaGreen, height: 48, width: 48, borderTopRightRadius: RADIUS.lg, borderBottomRightRadius: RADIUS.lg, justifyContent: 'center', alignItems: 'center' },
  
  bannerContainer: { marginTop: SPACING.lg, paddingLeft: SPACING.xl },
  banner: { width: width * 0.8, height: 160, borderRadius: RADIUS.xl, marginRight: SPACING.md, padding: SPACING.lg, justifyContent: 'center' },
  bannerTitle: { fontSize: 24, fontWeight: '800', color: COLORS.white, width: '70%' },
  bannerSub: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 5, marginBottom: 15 },
  bannerBtn: { backgroundColor: COLORS.white, paddingHorizontal: 20, paddingVertical: 8, borderRadius: RADIUS.full, alignSelf: 'flex-start' },
  bannerBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.indiaGreen },

  walletCard: { margin: SPACING.xl, padding: SPACING.lg, backgroundColor: COLORS.indiaGreen, borderRadius: RADIUS.xl, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ...SHADOWS.medium },
  walletLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  walletAmount: { fontSize: 24, fontWeight: '800', color: COLORS.white },
  rewardSection: { alignItems: 'flex-end' },
  rewardText: { fontSize: 12, fontWeight: '700', color: '#FDE047', marginBottom: 5 },
  addMoneyBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.full },
  addMoneyText: { fontSize: 12, fontWeight: '600', color: COLORS.white },

  section: { marginTop: SPACING.xl, paddingHorizontal: SPACING.xl },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 15 },
  
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: SPACING.lg },
  categoryItem: { width: '48%', alignItems: 'center', backgroundColor: COLORS.white, paddingVertical: 15, borderRadius: RADIUS.lg, ...SHADOWS.small },
  categoryIconWrap: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ECFDF5', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  categoryName: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary },

  productCard: { width: 150, backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginRight: SPACING.md, ...SHADOWS.small },
  aiBadge: { position: 'absolute', top: -8, right: 8, backgroundColor: '#8B5CF6', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, zIndex: 10 },
  aiBadgeText: { color: COLORS.white, fontSize: 9, fontWeight: '800' },
  organicBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#22C55E', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, zIndex: 1 },
  organicText: { fontSize: 9, fontWeight: '700', color: COLORS.white },
  productImagePlaceholder: { height: 90, backgroundColor: '#F3F4F6', borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  productEmoji: { fontSize: 45 },
  productName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  price: { fontSize: 14, fontWeight: '700', color: COLORS.indiaGreen },
  oldPrice: { fontSize: 11, color: COLORS.textMuted, textDecorationLine: 'line-through' },
  addToCartBtn: { backgroundColor: '#F3F4F6', paddingVertical: 8, borderRadius: RADIUS.md, alignItems: 'center' },
  addToCartText: { fontSize: 12, fontWeight: '700', color: COLORS.indiaGreen },

  fabContainer: { position: 'absolute', bottom: 90, right: 20, gap: 15 },
  fabAI: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#8B5CF6', justifyContent: 'center', alignItems: 'center', ...SHADOWS.large },
  fabCart: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.saffron, justifyContent: 'center', alignItems: 'center', ...SHADOWS.large },
  fabBadge: { position: 'absolute', top: -5, right: -5, backgroundColor: COLORS.error, width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.white },
  fabBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: '800' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, ...SHADOWS.large },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  
  filterSectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 10 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  filterChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 8, backgroundColor: '#F3F4F6', borderRadius: RADIUS.full, borderWidth: 1, borderColor: '#E5E7EB' },
  filterChipActive: { backgroundColor: COLORS.indiaGreen, borderColor: COLORS.indiaGreen },
  filterChipText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  filterFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.white, padding: 20, flexDirection: 'row', gap: 15, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  resetBtn: { flex: 1, paddingVertical: 14, borderRadius: RADIUS.md, alignItems: 'center', backgroundColor: '#F3F4F6' },
  resetBtnText: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 15 },
  applyBtn: { flex: 2, paddingVertical: 14, borderRadius: RADIUS.md, alignItems: 'center', backgroundColor: COLORS.indiaGreen },
  applyBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },

  bannerFilterBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, backgroundColor: 'transparent', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingBottom: 15 },
  bannerFilterBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: COLORS.white, borderRadius: 6, ...SHADOWS.small },
  bannerFilterText: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  bannerQuickSort: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: COLORS.white, borderRadius: 15, borderWidth: 1, borderColor: '#E2E8F0', marginRight: 8, ...SHADOWS.small },
  bannerQuickSortText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  
  harvestCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: 15, marginBottom: 15, ...SHADOWS.small },
  harvestTopBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  pulsingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
  liveStockText: { fontSize: 12, fontWeight: '800', color: '#EF4444' },
  harvestTimeText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  harvestImgWrap: { width: 80, height: 80, borderRadius: RADIUS.md, backgroundColor: '#F1F5F9', overflow: 'hidden', position: 'relative' },
  harvestEmojiOverlay: { position: 'absolute', bottom: -5, right: -5, backgroundColor: 'rgba(255,255,255,0.8)', padding: 4, borderRadius: 10 },
  productName: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary },
  farmerName: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  harvestBadgesRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  freshnessBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  freshnessBadgeText: { color: '#16A34A', fontSize: 10, fontWeight: '700' },
  deliveryBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  deliveryBadgeText: { color: COLORS.textSecondary, fontSize: 10, fontWeight: '600' },
  etaText: { fontSize: 12, color: COLORS.textPrimary, fontWeight: '600', marginTop: 8 },
  harvestDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  harvestBottomBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pricePerKg: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  compareBtn: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  buyNowBtn: { backgroundColor: COLORS.indiaGreen, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  buyNowText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
  cartControlWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.indiaGreen, borderRadius: 8 },
  cartBtn: { padding: 10 },
  cartQtyTextWhite: { width: 30, textAlign: 'center', fontSize: 16, fontWeight: '800', color: COLORS.white },

  organicCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: 18, marginBottom: 20, ...SHADOWS.medium, borderWidth: 1, borderColor: '#DCFCE7' },
  organicHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  farmerAvatarImg: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#DCFCE7' },
  organicFarmerName: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
  certText: { fontSize: 11, color: '#16A34A', fontWeight: '700' },
  followBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0' },
  followBtnText: { fontSize: 12, fontWeight: '700', color: '#15803D' },
  organicProductDetails: { flexDirection: 'row', backgroundColor: '#FAFAF9', padding: 15, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: '#F5F5F4' },
  organicIconWrap: { width: 70, height: 70, backgroundColor: COLORS.white, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center', ...SHADOWS.small },
  organicProductName: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary },
  scoreBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DCFCE7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  scoreText: { fontSize: 10, fontWeight: '800', color: '#15803D', marginLeft: 2 },
  ecoBadgeRow: { flexDirection: 'row', gap: 10, marginTop: 6, flexWrap: 'wrap' },
  ecoBadgeText: { fontSize: 11, color: '#65A30D', fontWeight: '600', backgroundColor: '#ECFCCB', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  farmerStoryText: { fontSize: 12, color: COLORS.textSecondary, fontStyle: 'italic', marginTop: 10, lineHeight: 18 },
  labTestBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#F0FDF4', paddingVertical: 10, borderRadius: RADIUS.md, marginTop: 15, borderStyle: 'dashed', borderWidth: 1, borderColor: '#6EE7B7' },
  labTestText: { fontSize: 13, fontWeight: '700', color: '#047857' },
  organicBottomBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  organicPrice: { fontSize: 22, fontWeight: '800', color: '#15803D' },
  chatBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#D1FAE5', justifyContent: 'center', alignItems: 'center' },
  organicAddBtn: { backgroundColor: '#047857', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 21 },
  organicAddText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
  organicCartControl: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFCCB', borderRadius: 21, borderWidth: 1, borderColor: '#BEF264' },
  organicQtyText: { width: 30, textAlign: 'center', fontSize: 16, fontWeight: '800', color: '#047857' },

  categoryProductCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: 15, marginBottom: 15, ...SHADOWS.small },
  categoryProductHeader: { flexDirection: 'row' },
  categoryProductEmojiWrap: { width: 60, height: 60, backgroundColor: '#F8FAFC', borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  categoryProductName: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary },
  categoryProductFarmer: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  categoryProductDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  categoryProductFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryProductPrice: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  categoryProductDiscount: { fontSize: 11, color: COLORS.error, fontWeight: '700' },
  catAddBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.indiaGreen, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, gap: 4 },
  catAddBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 12 },
  catQtyControl: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', borderRadius: 8, borderWidth: 1, borderColor: '#10B981' },
  catQtyBtn: { padding: 4 },
  catQtyText: { width: 24, textAlign: 'center', fontSize: 14, fontWeight: '700', color: COLORS.indiaGreen },
  ratingBadgeSmall: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF9C3', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 6 },
  ratingTextSmall: { fontSize: 10, fontWeight: '800', color: '#854D0E', marginLeft: 2 },

  prodHero: { padding: 20, alignItems: 'center', backgroundColor: COLORS.white },
  prodHeroImgWrap: { width: 120, height: 120, backgroundColor: '#F8FAFC', borderRadius: 60, justifyContent: 'center', alignItems: 'center', ...SHADOWS.small },
  prodInfoBox: { marginTop: 15, width: '100%' },
  prodDesc: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },
  prodMetaRow: { flexDirection: 'row', justifyContent: 'center', gap: 15, marginTop: 15 },
  prodMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: RADIUS.full },
  prodMetaText: { fontSize: 11, fontWeight: '700', color: COLORS.textPrimary },

  farmerProductCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: 15, marginBottom: 15, ...SHADOWS.small },
  farmerAvatarDetail: { width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#E2E8F0' },
  farmerNameDetail: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
  farmerDistDetail: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  farmerDeliveryDetail: { fontSize: 11, color: COLORS.indiaGreen, fontWeight: '700', marginTop: 2 },
  farmerDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  farmerPriceDetail: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  farmerAddBtn: { backgroundColor: COLORS.indiaGreen, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  farmerAddText: { color: COLORS.white, fontWeight: '700', fontSize: 13 },
  farmerQtyControl: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', borderRadius: 8, borderWidth: 1, borderColor: '#10B981' },
  farmerQtyText: { width: 24, textAlign: 'center', fontSize: 15, fontWeight: '800', color: COLORS.indiaGreen },

  availableSection: { marginTop: 10 },
  availableHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20 },
  availableTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  availableSub: { fontSize: 12, color: COLORS.textSecondary, paddingHorizontal: 20, marginTop: 2 },
  miniOrganicBadge: { position: 'absolute', bottom: -2, right: -2, backgroundColor: '#22C55E', width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.white },
  prodDetailsLine: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  prodDetailsText: { fontSize: 11, color: COLORS.textSecondary },
  prodDetailsDivider: { color: '#CBD5E1', fontSize: 10 },
  tagRowSmall: { flexDirection: 'row', gap: 8, marginTop: 8 },
  deliveryTagSmall: { backgroundColor: '#F1F5F9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  deliveryTagTextSmall: { fontSize: 10, color: COLORS.textSecondary, fontWeight: '600' },
  viewFarmerBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center' },

  emptyCart: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyCartTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, marginTop: 20 },
  emptyCartSub: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: 10 },
  continueBtn: { backgroundColor: COLORS.indiaGreen, paddingHorizontal: 25, paddingVertical: 12, borderRadius: RADIUS.md, marginTop: 25 },
  continueBtnText: { color: COLORS.white, fontWeight: '700' },

  cartItem: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: 15, marginBottom: 15, ...SHADOWS.small },
  cartItemEmojiWrap: { width: 60, height: 60, backgroundColor: '#F8FAFC', borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  cartItemName: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary },
  cartItemFarmer: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  cartItemPrice: { fontSize: 18, fontWeight: '800', color: COLORS.indiaGreen },
  cartItemDelivery: { fontSize: 11, color: COLORS.textSecondary, marginTop: 8 },

  orderSummary: { backgroundColor: '#F8FAFC', borderRadius: RADIUS.lg, padding: 20, marginTop: 20, marginBottom: 20 },
  summaryTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 15 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: COLORS.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  summaryDivider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 10 },
  totalLabel: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary },
  totalValue: { fontSize: 18, fontWeight: '900', color: COLORS.indiaGreen },

  cartFooter: { backgroundColor: COLORS.white, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingBottom: Platform.OS === 'ios' ? 40 : 20 },
  footerTotal: { fontSize: 22, fontWeight: '900', color: COLORS.textPrimary },
  footerLabel: { fontSize: 12, color: COLORS.textSecondary },
  placeOrderBtn: { backgroundColor: COLORS.indiaGreen, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingVertical: 15, borderRadius: RADIUS.md, ...SHADOWS.medium },
  placeOrderText: { color: COLORS.white, fontWeight: '800', fontSize: 15 },

  saveForLaterBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 15, borderStyle: 'dashed', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: RADIUS.lg },
  saveForLaterText: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '600' },

  orderTabs: { flexDirection: 'row', paddingHorizontal: 20, gap: 15, marginBottom: 20 },
  orderTab: { paddingBottom: 8, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  orderTabActive: { borderBottomColor: COLORS.indiaGreen },
  orderTabText: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary },
  orderTabTextActive: { color: COLORS.indiaGreen },

  orderCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: 18, marginBottom: 20, ...SHADOWS.medium },
  orderCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  orderId: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
  orderDate: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  statusBadge: { backgroundColor: '#F0FDF4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: '800', color: COLORS.indiaGreen },

  orderItems: { marginBottom: 20 },
  orderItemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  orderItemEmoji: { fontSize: 24 },
  orderItemName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  orderItemFarmer: { fontSize: 11, color: COLORS.textSecondary },
  orderItemPrice: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary },

  orderTracking: { marginBottom: 20, paddingHorizontal: 5 },
  trackingLine: { flexDirection: 'row', alignItems: 'center' },
  trackingDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E2E8F0' },
  trackingBar: { flex: 1, height: 2 },
  trackingLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  trackingLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600' },
  trackingLabelActive: { fontSize: 10, color: COLORS.indiaGreen, fontWeight: '800' },

  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  orderTotal: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary },
  orderActions: { flexDirection: 'row', gap: 10 },
  orderActionBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 6, backgroundColor: '#F1F5F9' },
  orderActionText: { fontSize: 12, fontWeight: '700', color: COLORS.textPrimary },

  orderExtraActions: { flexDirection: 'row', gap: 20, marginTop: 15, justifyContent: 'center' },
  extraAction: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  extraActionText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },

  emptyOrders: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 100 },
  emptyOrdersTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textMuted, marginTop: 20 },

  successOverlay: { flex: 1, backgroundColor: COLORS.indiaGreen, justifyContent: 'center', alignItems: 'center' },
  successContent: { alignItems: 'center' },
  successIconWrap: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  successTitle: { fontSize: 28, fontWeight: '900', color: COLORS.white },
  successSub: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 10, textAlign: 'center', paddingHorizontal: 40 },

  freshTag: { alignSelf: 'flex-start', backgroundColor: '#DCFCE7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
  freshTagText: { color: '#16A34A', fontSize: 10, fontWeight: '700' },
  storageTag: { alignSelf: 'flex-start', backgroundColor: '#E0F2FE', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
  storageTagText: { color: '#0369A1', fontSize: 10, fontWeight: '700' },
  proteinTag: { alignSelf: 'flex-start', backgroundColor: '#FEE2E2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
  proteinTagText: { color: '#B91C1C', fontSize: 10, fontWeight: '700' },
  sustainabilityTag: { alignSelf: 'flex-start', backgroundColor: '#F0FDF4', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
  sustainabilityTagText: { color: '#15803D', fontSize: 10, fontWeight: '700' },
  germinationTag: { alignSelf: 'flex-start', backgroundColor: '#FEF9C3', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
  germinationTagText: { color: '#854D0E', fontSize: 10, fontWeight: '700' },
  trendTag: { alignSelf: 'flex-start', backgroundColor: '#F5F3FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
  trendTagText: { color: '#6D28D9', fontSize: 10, fontWeight: '700' },

  floatingCartBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.textPrimary, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, paddingBottom: Platform.OS === 'ios' ? 30 : 15 },
  floatingCartItems: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
  floatingCartSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  checkoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: COLORS.indiaGreen, paddingHorizontal: 15, paddingVertical: 10, borderRadius: RADIUS.md },
  checkoutBtnText: { color: COLORS.white, fontSize: 14, fontWeight: '700' },
});
