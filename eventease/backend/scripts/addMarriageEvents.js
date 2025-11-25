import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from '../models/Event.js';
import User from '../models/User.js';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventease', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

// Comprehensive marriage events
const marriageEvents = [
    // WEDDING Events (10+)
    {
        title: 'Grand Wedding Reception at The Taj Palace',
        description: 'Luxurious wedding reception venue with elegant decor, gourmet dining, and spectacular views. Perfect for celebrating your big day with family and friends. Includes venue, catering, decoration, and event management.',
        category: 'Marriage',
        type: 'Wedding',
        date: new Date(2025, 11, 6),
        time: '06:00 PM',
        location: 'Delhi',
        image: 'https://weddingsutra.com/images/the-taj-mahal-palace-img4.jpg',
        price: 500000,
        capacity: 500,
        tags: ['Wedding', 'Reception', 'Luxury', 'Celebration']
    },
    {
        title: 'Destination Wedding in Goa - Beachside Venue',
        description: 'Stunning beachside wedding venue in Goa with golden sands, sea breeze, and breathtaking sunsets. Complete wedding planning, decorations, catering, and accommodations for guests included.',
        category: 'Marriage',
        type: 'Wedding',
        date: new Date(2025, 11, 10),
        time: '05:00 PM',
        location: 'Goa',
        image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=400&fit=crop',
        price: 750000,
        capacity: 300,
        tags: ['Beach Wedding', 'Destination', 'Romantic', 'Celebration']
    },
    {
        title: 'Traditional Indian Wedding Ceremony',
        description: 'Complete traditional Indian wedding with all rituals including Mehndi, Sangeet, Haldi, and main wedding ceremony. Professional priests, decorators, and event coordinators to manage every detail.',
        category: 'Marriage',
        type: 'Wedding',
        date: new Date(2025, 11, 13),
        time: '07:00 PM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop',
        price: 600000,
        capacity: 400,
        tags: ['Traditional', 'Indian Wedding', 'Ceremony', 'Cultural']
    },
    {
        title: 'Modern Wedding Celebration - Minimalist Design',
        description: 'Contemporary and stylish wedding with minimalist design, modern aesthetics, and elegant ambiance. Perfect for modern couples looking for a sophisticated celebration without excessive decorations.',
        category: 'Marriage',
        type: 'Wedding',
        date: new Date(2025, 11, 16),
        time: '06:30 PM',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 400000,
        capacity: 250,
        tags: ['Modern Wedding', 'Contemporary', 'Elegant', 'Celebration']
    },
    {
        title: 'Luxury 5-Star Wedding Package',
        description: 'Ultimate luxury wedding experience with premium 5-star venue, world-class catering, professional photography/videography, lavish decorations, and complete wedding planning services.',
        category: 'Marriage',
        type: 'Wedding',
        date: new Date(2025, 11, 19),
        time: '07:30 PM',
        location: 'Pune',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
        price: 1000000,
        capacity: 600,
        tags: ['Luxury', 'Premium', '5-Star', 'Wedding']
    },
    {
        title: 'Garden Wedding - Natural Elegance',
        description: 'Beautiful outdoor garden wedding with natural flowers, green spaces, and romantic ambiance. Includes garden setup, seating arrangements, lighting, catering, and weather contingency plan.',
        category: 'Marriage',
        type: 'Wedding',
        date: new Date(2025, 11, 22),
        time: '05:30 PM',
        location: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 350000,
        capacity: 300,
        tags: ['Garden Wedding', 'Outdoor', 'Natural', 'Romantic']
    },
    {
        title: 'Grand Palace Wedding - Royal Experience',
        description: 'Royal palace wedding venue with majestic architecture, grand halls, and luxurious settings. Perfect for creating unforgettable memories with magnificent backdrops and premium amenities.',
        category: 'Marriage',
        type: 'Wedding',
        date: new Date(2025, 11, 25),
        time: '06:00 PM',
        location: 'Jaipur',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
        price: 800000,
        capacity: 700,
        tags: ['Palace Wedding', 'Royal', 'Grand', 'Luxury']
    },
    {
        title: 'Intimate Wedding - Small Gathering',
        description: 'Perfect for couples preferring intimate celebrations with close family and friends. Cozy venue, personalized service, exclusive catering, and all wedding arrangements in a warm setting.',
        category: 'Marriage',
        type: 'Wedding',
        date: new Date(2025, 11, 28),
        time: '06:30 PM',
        location: 'Kolkata',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 200000,
        capacity: 100,
        tags: ['Intimate', 'Small Wedding', 'Personal', 'Cozy']
    },
    {
        title: 'Heritage Hotel Wedding - Historical Charm',
        description: 'Wedding at a heritage hotel combining historical charm with modern amenities. Stunning architecture, elegant halls, and complete event management for a memorable celebration.',
        category: 'Marriage',
        type: 'Wedding',
        date: new Date(2025, 12, 1),
        time: '07:00 PM',
        location: 'Chennai',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
        price: 550000,
        capacity: 350,
        tags: ['Heritage', 'Hotel Wedding', 'Historical', 'Elegant']
    },
    {
        title: 'Farm Wedding - Rustic Charm',
        description: 'Charming farm wedding with rustic aesthetics, natural beauty, and countryside ambiance. Perfect for outdoor lovers with hay bales, lanterns, and nature-inspired decorations.',
        category: 'Marriage',
        type: 'Wedding',
        date: new Date(2025, 12, 4),
        time: '05:00 PM',
        location: 'Ahmedabad',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 300000,
        capacity: 200,
        tags: ['Farm Wedding', 'Rustic', 'Countryside', 'Outdoor']
    },
    {
        title: 'Multi-Day Wedding Celebration Package',
        description: 'Complete multi-day wedding package including pre-wedding events, main wedding ceremony, and post-wedding celebration. All-inclusive venue, catering, decorations, and coordination.',
        category: 'Marriage',
        type: 'Wedding',
        date: new Date(2025, 12, 7),
        time: '06:00 PM',
        location: 'Udaipur',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
        price: 1200000,
        capacity: 800,
        tags: ['Multi-Day', 'Wedding', 'Grand Celebration', 'Premium']
    },

    // ENGAGEMENT Events (10+)
    {
        title: 'Elegant Engagement Ceremony',
        description: 'Beautiful engagement ceremony with elegant venue, decorations, catering, and entertainment. Includes photo/video coverage and complete event coordination for a memorable engagement celebration.',
        category: 'Marriage',
        type: 'Engagement',
        date: new Date(2025, 11, 7),
        time: '05:00 PM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1520763185298-1b434c919abe?w=600&h=400&fit=crop',
        price: 150000,
        capacity: 150,
        tags: ['Engagement', 'Ceremony', 'Celebration', 'Memorable']
    },
    {
        title: 'Formal Engagement Party',
        description: 'Professional engagement party with sophisticated decor, premium catering, entertainment, and photo opportunities. Perfect venue with all amenities for a formal celebration.',
        category: 'Marriage',
        type: 'Engagement',
        date: new Date(2025, 11, 11),
        time: '06:00 PM',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
        price: 200000,
        capacity: 250,
        tags: ['Formal Engagement', 'Party', 'Celebration', 'Professional']
    },
    {
        title: 'Casual Engagement Gathering',
        description: 'Relaxed and fun engagement celebration with casual setup, good food, music, and games. Perfect for couples wanting a stress-free, enjoyable engagement party atmosphere.',
        category: 'Marriage',
        type: 'Engagement',
        date: new Date(2025, 11, 14),
        time: '05:30 PM',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 100000,
        capacity: 100,
        tags: ['Casual Engagement', 'Fun', 'Relaxed', 'Gathering']
    },
    {
        title: 'Lavish Engagement Celebration',
        description: 'Luxurious engagement event with high-end venue, premium decorations, gourmet catering, live entertainment, and professional coordination for an unforgettable celebration.',
        category: 'Marriage',
        type: 'Engagement',
        date: new Date(2025, 11, 17),
        time: '06:30 PM',
        location: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
        price: 350000,
        capacity: 400,
        tags: ['Lavish', 'Luxury', 'Engagement', 'Premium']
    },
    {
        title: 'Themed Engagement Party',
        description: 'Creative themed engagement party with unique decorations, concept-based setup, entertainment matching the theme, and memorable experiences for all guests.',
        category: 'Marriage',
        type: 'Engagement',
        date: new Date(2025, 11, 20),
        time: '07:00 PM',
        location: 'Pune',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 180000,
        capacity: 200,
        tags: ['Themed', 'Creative', 'Engagement', 'Unique']
    },
    {
        title: 'Garden Engagement Party',
        description: 'Romantic garden engagement celebration with natural beauty, floral decorations, outdoor seating, and ambient lighting creating a magical atmosphere for the couple.',
        category: 'Marriage',
        type: 'Engagement',
        date: new Date(2025, 11, 23),
        time: '05:30 PM',
        location: 'Goa',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 130000,
        capacity: 120,
        tags: ['Garden Party', 'Romantic', 'Engagement', 'Outdoor']
    },
    {
        title: 'Rooftop Engagement Celebration',
        description: 'Modern rooftop engagement party with city views, contemporary setup, DJ services, catering, and stunning ambiance perfect for celebrating under the stars.',
        category: 'Marriage',
        type: 'Engagement',
        date: new Date(2025, 11, 26),
        time: '06:00 PM',
        location: 'Kolkata',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 160000,
        capacity: 180,
        tags: ['Rooftop', 'Modern', 'Engagement', 'City Views']
    },
    {
        title: 'Beachside Engagement Party',
        description: 'Romantic beachside engagement celebration with sunset views, beach setup, fresh seafood catering, and live music creating magical moments for the engaged couple.',
        category: 'Marriage',
        type: 'Engagement',
        date: new Date(2025, 11, 29),
        time: '05:00 PM',
        location: 'Chennai',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 140000,
        capacity: 140,
        tags: ['Beachside', 'Romantic', 'Sunset', 'Engagement']
    },
    {
        title: 'Luxury Dinner Engagement',
        description: 'Sophisticated dinner engagement party at a 5-star restaurant with multi-course gourmet meal, wine selection, elegant ambiance, and personalized service.',
        category: 'Marriage',
        type: 'Engagement',
        date: new Date(2025, 12, 2),
        time: '07:30 PM',
        location: 'Ahmedabad',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
        price: 250000,
        capacity: 80,
        tags: ['Luxury Dinner', '5-Star', 'Gourmet', 'Engagement']
    },
    {
        title: 'Adventure Engagement Celebration',
        description: 'Unique engagement celebration combining adventure activities with party elements. Includes outdoor adventures, team activities, catering, and celebration moments.',
        category: 'Marriage',
        type: 'Engagement',
        date: new Date(2025, 12, 5),
        time: '06:00 AM',
        location: 'Manali',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 220000,
        capacity: 100,
        tags: ['Adventure', 'Engagement', 'Outdoor', 'Unique']
    },

    // BRIDAL SHOWER Events (10+)
    {
        title: 'Elegant Bridal Shower Party',
        description: 'Sophisticated bridal shower with elegant decorations, games, refreshments, and memorable moments for the bride. Includes party favors and professional coordination.',
        category: 'Marriage',
        type: 'Bridal Shower',
        date: new Date(2025, 11, 8),
        time: '03:00 PM',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
        price: 80000,
        capacity: 100,
        tags: ['Bridal Shower', 'Elegant', 'Celebration', 'Bride']
    },
    {
        title: 'Fun Bridal Shower & Games Night',
        description: 'Lively bridal shower with fun games, entertainment, delicious food, drinks, and lots of laughter. Perfect for creating memorable moments before the wedding.',
        category: 'Marriage',
        type: 'Bridal Shower',
        date: new Date(2025, 11, 12),
        time: '04:00 PM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 70000,
        capacity: 80,
        tags: ['Bridal Shower', 'Fun', 'Games', 'Entertainment']
    },
    {
        title: 'Luxurious Spa Bridal Shower',
        description: 'Pampered bridal shower experience with spa treatments, massage, facials, followed by elegant party, refreshments, and celebrations for the bride and friends.',
        category: 'Marriage',
        type: 'Bridal Shower',
        date: new Date(2025, 11, 15),
        time: '02:00 PM',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 120000,
        capacity: 50,
        tags: ['Spa Shower', 'Pampering', 'Relaxation', 'Bridal']
    },
    {
        title: 'Themed Bridal Shower Party',
        description: 'Creative themed bridal shower with concept-based decorations, costume elements, themed games, food, and unforgettable fun for the bride and attendees.',
        category: 'Marriage',
        type: 'Bridal Shower',
        date: new Date(2025, 11, 18),
        time: '03:30 PM',
        location: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 90000,
        capacity: 120,
        tags: ['Themed', 'Bridal Shower', 'Creative', 'Fun']
    },
    {
        title: 'Bachelorette Party - Girls Night Out',
        description: 'Exciting girls night out bridal shower with dancing, entertainment, cocktails, fun activities, and celebration for the bride-to-be with her closest friends.',
        category: 'Marriage',
        type: 'Bridal Shower',
        date: new Date(2025, 11, 21),
        time: '06:00 PM',
        location: 'Pune',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 100000,
        capacity: 60,
        tags: ['Bachelorette', 'Girls Night', 'Party', 'Celebration']
    },
    {
        title: 'Garden Bridal Shower Tea Party',
        description: 'Romantic garden bridal shower with afternoon tea, finger foods, elegant decorations, and relaxed atmosphere perfect for celebrating the bride in nature.',
        category: 'Marriage',
        type: 'Bridal Shower',
        date: new Date(2025, 11, 24),
        time: '02:30 PM',
        location: 'Goa',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 75000,
        capacity: 70,
        tags: ['Garden Shower', 'Tea Party', 'Elegant', 'Romantic']
    },
    {
        title: 'Destination Bridal Shower - Resort Package',
        description: 'Exclusive destination bridal shower at a luxury resort with spa facilities, pool party, romantic dinner, and complete pampering for the bride and friends.',
        category: 'Marriage',
        type: 'Bridal Shower',
        date: new Date(2025, 11, 27),
        time: '05:00 PM',
        location: 'Rishikesh',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 200000,
        capacity: 40,
        tags: ['Destination', 'Resort', 'Bridal Shower', 'Luxury']
    },
    {
        title: 'Modern Bridal Shower - Cocktail Party',
        description: 'Contemporary bridal shower with craft cocktails, appetizers, modern decor, and trendy entertainment perfect for modern brides and their stylish friends.',
        category: 'Marriage',
        type: 'Bridal Shower',
        date: new Date(2025, 11, 30),
        time: '06:00 PM',
        location: 'Kolkata',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 110000,
        capacity: 90,
        tags: ['Cocktail Party', 'Modern', 'Bridal Shower', 'Trendy']
    },
    {
        title: 'Outdoor Adventure Bridal Shower',
        description: 'Fun outdoor bridal shower combining adventure activities like hiking, zip-lining, with picnic lunch, games, and celebration moments for active brides.',
        category: 'Marriage',
        type: 'Bridal Shower',
        date: new Date(2025, 12, 3),
        time: '07:00 AM',
        location: 'Ooty',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 140000,
        capacity: 50,
        tags: ['Adventure', 'Outdoor', 'Bridal Shower', 'Active']
    },
    {
        title: 'Luxury Bridal Shower - 5-Star Experience',
        description: 'Luxurious bridal shower at 5-star venue with gourmet catering, spa treatments, entertainment, exclusive service, and unforgettable pampering for the bride.',
        category: 'Marriage',
        type: 'Bridal Shower',
        date: new Date(2025, 12, 6),
        time: '03:00 PM',
        location: 'Jaipur',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
        price: 180000,
        capacity: 80,
        tags: ['Luxury', '5-Star', 'Bridal Shower', 'Premium']
    },

    // BACHELOR PARTY Events (10+)
    {
        title: 'Grand Bachelor Party Celebration',
        description: 'Epic bachelor party with entertainment, food, drinks, games, and unforgettable fun for the groom and friends. Complete event coordination and all amenities included.',
        category: 'Marriage',
        type: 'Bachelor Party',
        date: new Date(2025, 11, 9),
        time: '08:00 PM',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 120000,
        capacity: 150,
        tags: ['Bachelor Party', 'Celebration', 'Fun', 'Groom']
    },
    {
        title: 'Adventure Bachelor Party Weekend',
        description: 'Weekend adventure bachelor party with extreme sports, outdoor activities, camping, bonfire, games, and celebration for the groom and his friends.',
        category: 'Marriage',
        type: 'Bachelor Party',
        date: new Date(2025, 11, 13),
        time: '06:00 AM',
        location: 'Manali',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 250000,
        capacity: 50,
        tags: ['Adventure', 'Bachelor Party', 'Outdoor', 'Weekend']
    },
    {
        title: 'Vegas-Style Bachelor Party Night',
        description: 'Exciting Vegas-style bachelor party with casino setup, entertainment, bartenders, DJ, dancing, and all-night celebration for the groom and friends.',
        category: 'Marriage',
        type: 'Bachelor Party',
        date: new Date(2025, 11, 16),
        time: '09:00 PM',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 200000,
        capacity: 100,
        tags: ['Vegas Style', 'Entertainment', 'Bachelor Party', 'Night Out']
    },
    {
        title: 'Beach Bachelor Party Celebration',
        description: 'Relaxed beach bachelor party with water sports, sunset celebration, BBQ, bonfire, and beach games creating unforgettable beach memories.',
        category: 'Marriage',
        type: 'Bachelor Party',
        date: new Date(2025, 11, 19),
        time: '02:00 PM',
        location: 'Goa',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 150000,
        capacity: 80,
        tags: ['Beach Party', 'Relaxation', 'Bachelor Party', 'Celebration']
    },
    {
        title: 'Luxury Club Bachelor Party',
        description: 'Upscale bachelor party at premium nightclub with VIP lounge, bottle service, DJ, dancers, and exclusive treatment for an unforgettable celebration.',
        category: 'Marriage',
        type: 'Bachelor Party',
        date: new Date(2025, 11, 22),
        time: '10:00 PM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 180000,
        capacity: 60,
        tags: ['Luxury Club', 'VIP', 'Bachelor Party', 'Premium']
    },
    {
        title: 'Sports-Themed Bachelor Party',
        description: 'Sports-focused bachelor party with live sports viewing, sports activities, friendly competitions, BBQ, and sports-themed entertainment and decorations.',
        category: 'Marriage',
        type: 'Bachelor Party',
        date: new Date(2025, 11, 25),
        time: '04:00 PM',
        location: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 100000,
        capacity: 120,
        tags: ['Sports', 'Bachelor Party', 'Themed', 'Activity']
    },
    {
        title: 'Luxury Resort Bachelor Party Getaway',
        description: 'All-inclusive bachelor party getaway at luxury resort with accommodations, meals, activities, spa services, and celebration facilities for the groom and friends.',
        category: 'Marriage',
        type: 'Bachelor Party',
        date: new Date(2025, 11, 28),
        time: '03:00 PM',
        location: 'Rishikesh',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 300000,
        capacity: 45,
        tags: ['Resort Getaway', 'Luxury', 'Bachelor Party', 'All-Inclusive']
    },
    {
        title: 'Music & Concert Bachelor Party',
        description: 'Bachelor party featuring live band, DJ, concert atmosphere, dancing, singalong moments, and celebration of the groom with live music entertainment.',
        category: 'Marriage',
        type: 'Bachelor Party',
        date: new Date(2025, 12, 1),
        time: '07:00 PM',
        location: 'Pune',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 140000,
        capacity: 100,
        tags: ['Music', 'Concert', 'Bachelor Party', 'Entertainment']
    },
    {
        title: 'Themed Bachelor Party Costume Night',
        description: 'Creative themed bachelor party with costume requirement, themed decorations, themed games, and hilarious moments with groom and friends.',
        category: 'Marriage',
        type: 'Bachelor Party',
        date: new Date(2025, 12, 4),
        time: '08:00 PM',
        location: 'Kolkata',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 110000,
        capacity: 90,
        tags: ['Themed', 'Costume', 'Bachelor Party', 'Creative']
    },
    {
        title: 'Destination Bachelor Party - International Getaway',
        description: 'International destination bachelor party with travel, luxury accommodations, activities, entertainment, and unforgettable memories abroad for the groom and friends.',
        category: 'Marriage',
        type: 'Bachelor Party',
        date: new Date(2025, 12, 7),
        time: '06:00 AM',
        location: 'Thailand (Arranged)',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 500000,
        capacity: 20,
        tags: ['International', 'Destination', 'Bachelor Party', 'Getaway']
    },

    // MEHENDI Events (10+)
    {
        title: 'Traditional Mehendi Celebration',
        description: 'Traditional mehendi ceremony with professional henna artists, music, singing, dancing, delicious food, and festive celebrations for the bride and friends.',
        category: 'Marriage',
        type: 'Mehendi',
        date: new Date(2025, 11, 9),
        time: '04:00 PM',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 100000,
        capacity: 200,
        tags: ['Mehendi', 'Traditional', 'Henna', 'Celebration']
    },
    {
        title: 'Luxury Mehendi Ceremony',
        description: 'Upscale mehendi event with premium venue, professional henna artists, live music band, DJ, dancers, premium catering, and lavish decorations.',
        category: 'Marriage',
        type: 'Mehendi',
        date: new Date(2025, 11, 12),
        time: '05:00 PM',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
        price: 250000,
        capacity: 300,
        tags: ['Luxury Mehendi', 'Premium', 'Celebration', 'Ceremony']
    },
    {
        title: 'Garden Mehendi Party',
        description: 'Beautiful garden mehendi celebration with natural backdrop, henna artists, traditional music, folk performances, garden food, and decorative lighting.',
        category: 'Marriage',
        type: 'Mehendi',
        date: new Date(2025, 11, 15),
        time: '03:30 PM',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 120000,
        capacity: 150,
        tags: ['Garden Mehendi', 'Outdoor', 'Celebration', 'Traditional']
    },
    {
        title: 'Themed Mehendi - Retro Bollywood',
        description: 'Creative Bollywood-themed mehendi with retro decorations, Bollywood music, dance performances, vintage costumes, and fun retro games for guests.',
        category: 'Marriage',
        type: 'Mehendi',
        date: new Date(2025, 11, 18),
        time: '04:00 PM',
        location: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 130000,
        capacity: 180,
        tags: ['Themed Mehendi', 'Bollywood', 'Retro', 'Creative']
    },
    {
        title: 'Modern Contemporary Mehendi',
        description: 'Modern mehendi with contemporary design, minimal decorations, modern music mix, professional henna artists, and chic ambiance for contemporary brides.',
        category: 'Marriage',
        type: 'Mehendi',
        date: new Date(2025, 11, 21),
        time: '05:00 PM',
        location: 'Pune',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 110000,
        capacity: 120,
        tags: ['Modern Mehendi', 'Contemporary', 'Minimalist', 'Chic']
    },
    {
        title: 'Beachside Mehendi Celebration',
        description: 'Scenic beachside mehendi with sunset views, henna artists under beach umbrellas, beach food, live acoustic music, and romantic beach atmosphere.',
        category: 'Marriage',
        type: 'Mehendi',
        date: new Date(2025, 11, 24),
        time: '04:30 PM',
        location: 'Goa',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 140000,
        capacity: 100,
        tags: ['Beachside Mehendi', 'Scenic', 'Romantic', 'Celebration']
    },
    {
        title: 'Heritage Palace Mehendi Ceremony',
        description: 'Grand mehendi ceremony at heritage palace with traditional setup, professional henna artists, classical music performances, traditional dance, and royal ambiance.',
        category: 'Marriage',
        type: 'Mehendi',
        date: new Date(2025, 11, 27),
        time: '05:00 PM',
        location: 'Jaipur',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 200000,
        capacity: 250,
        tags: ['Palace Mehendi', 'Heritage', 'Traditional', 'Grand']
    },
    {
        title: 'Fusion Mehendi - East Meets West',
        description: 'Unique fusion mehendi combining Indian traditions with Western elements, fusion music, cultural performances, mixed cuisines, and international dance.',
        category: 'Marriage',
        type: 'Mehendi',
        date: new Date(2025, 11, 30),
        time: '04:00 PM',
        location: 'Kolkata',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 160000,
        capacity: 170,
        tags: ['Fusion Mehendi', 'East-West', 'Cultural', 'Unique']
    },
    {
        title: 'Budget-Friendly Mehendi Party',
        description: 'Affordable mehendi celebration with local henna artists, traditional setup, home-style food, folk music, and intimate gathering for budget-conscious families.',
        category: 'Marriage',
        type: 'Mehendi',
        date: new Date(2025, 12, 2),
        time: '04:00 PM',
        location: 'Ahmedabad',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 60000,
        capacity: 80,
        tags: ['Budget Mehendi', 'Affordable', 'Traditional', 'Family']
    },
    {
        title: 'Destination Mehendi Retreat',
        description: 'Exclusive mehendi at destination resort with accommodations, professional henna artists, resort amenities, spa services, and multi-day celebration.',
        category: 'Marriage',
        type: 'Mehendi',
        date: new Date(2025, 12, 5),
        time: '03:00 PM',
        location: 'Ooty',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
        price: 280000,
        capacity: 100,
        tags: ['Destination Mehendi', 'Resort', 'Retreat', 'Premium']
    }
];

const addMarriageEvents = async () => {
    try {
        await connectDB();

        // Find or create admin user
        let adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            adminUser = await User.create({
                name: 'Admin User',
                email: 'admin@eventease.com',
                password: 'admin123',
                role: 'admin'
            });
            console.log('✅ Admin user created');
        }

        // Add new marriage events (don't delete existing ones, add to them)
        const eventPromises = marriageEvents.map(event =>
            Event.create({
                ...event,
                organizer: adminUser._id
            })
        );

        const createdEvents = await Promise.all(eventPromises);
        console.log(`\n✅ Successfully added ${createdEvents.length} marriage events\n`);

        // Get total count
        const totalEvents = await Event.countDocuments();
        console.log(`📊 Total events in database: ${totalEvents}\n`);

        // Display summary by marriage type
        const eventsByType = {};
        createdEvents.forEach(event => {
            if (!eventsByType[event.type]) {
                eventsByType[event.type] = [];
            }
            eventsByType[event.type].push(event);
        });

        console.log('🎊 MARRIAGE EVENTS ADDED:');
        console.log('='.repeat(70));
        Object.entries(eventsByType).forEach(([type, events]) => {
            console.log(`\n${type.toUpperCase()}: ${events.length} events`);
            console.log('-'.repeat(70));
            events.forEach((event, index) => {
                console.log(`${index + 1}. ${event.title}`);
                console.log(`   📅 ${event.date.toLocaleDateString()} at ${event.time}`);
                console.log(`   🏙️  ${event.location} | 💰 ₹${event.price.toLocaleString()}`);
            });
        });

        console.log('\n\n✨ All marriage events added successfully!');
        console.log(`🎉 Total database events: ${totalEvents}`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding marriage events:', error.message);
        process.exit(1);
    }
};

addMarriageEvents();
