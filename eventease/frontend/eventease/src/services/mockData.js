// Mock data for development when backend is not available
export const mockEvents = [
    {
        _id: '1',
        title: 'Tech Conference 2024',
        description: 'Annual technology conference featuring the latest innovations in software development, AI, and cloud computing.',
        category: 'conference',
        startDate: '2024-03-15T09:00:00Z',
        endDate: '2024-03-16T18:00:00Z',
        venue: {
            name: 'Convention Center',
            address: '123 Main Street',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94105'
        },
        capacity: 1000,
        ticketsSold: 750,
        ticketTypes: [
            {
                name: 'General Admission',
                price: 199,
                quantity: 500,
                sold: 450,
                description: 'Standard conference access'
            },
            {
                name: 'VIP Pass',
                price: 499,
                quantity: 200,
                sold: 150,
                description: 'VIP access with premium benefits'
            }
        ],
        organizer: {
            _id: '1',
            name: 'John Doe',
            email: 'john@techconf.com'
        },
        status: 'published',
        isFeatured: true,
        image: 'default-event.jpg',
        createdAt: '2024-01-15T00:00:00Z'
    },
    {
        _id: '2',
        title: 'Startup Networking Mixer',
        description: 'Connect with fellow entrepreneurs, investors, and tech enthusiasts in this exciting networking event.',
        category: 'networking',
        startDate: '2024-02-20T18:00:00Z',
        endDate: '2024-02-20T21:00:00Z',
        venue: {
            name: 'Innovation Hub',
            address: '456 Startup Ave',
            city: 'New York',
            state: 'NY',
            zipCode: '10001'
        },
        capacity: 200,
        ticketsSold: 150,
        ticketTypes: [
            {
                name: 'Early Bird',
                price: 25,
                quantity: 100,
                sold: 100,
                description: 'Limited early bird tickets'
            },
            {
                name: 'Regular',
                price: 40,
                quantity: 100,
                sold: 50,
                description: 'Regular admission'
            }
        ],
        organizer: {
            _id: '2',
            name: 'Sarah Wilson',
            email: 'sarah@startupmixer.com'
        },
        status: 'published',
        isFeatured: false,
        image: 'default-event.jpg',
        createdAt: '2024-01-10T00:00:00Z'
    }
];

export const mockUser = {
    _id: '1',
    name: 'Demo User',
    email: 'demo@eventease.com',
    role: 'user',
    phone: '+1234567890',
    avatar: 'default-avatar.png',
    isVerified: true,
    createdAt: '2024-01-01T00:00:00Z'
};