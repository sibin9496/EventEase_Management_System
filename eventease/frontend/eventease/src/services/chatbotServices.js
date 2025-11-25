// Mock AI service - Replace with actual AI API
export class ChatbotService {
    constructor() {
        this.responses = {
            greetings: [
                "Hello! How can I assist you with EventEase today?",
                "Hi there! Ready to explore amazing events?",
                "Welcome! I'm here to help you with any event-related questions.",
            ],
            events: [
                "We have various events including conferences, workshops, and festivals. What type are you interested in?",
                "You can browse events by category, date, or location. Need help finding something specific?",
                "Our events range from tech conferences to music festivals. What catches your interest?",
            ],
            registration: [
                "To register for an event, simply click the 'Register Now' button on the event page.",
                "Registration is quick and easy! Just select your preferred event and follow the prompts.",
                "You can register for events directly from the event details page. Need help with a specific event?",
            ],
            pricing: [
                "Event prices vary based on type and features. Many events offer early bird discounts!",
                "You'll find pricing details on each event page. Some events are free while others have tiered pricing.",
                "Prices are displayed clearly for each event. Let me know if you have questions about a specific event's pricing.",
            ],
            help: [
                "I can help you with event discovery, registration, pricing, and general questions about EventEase.",
                "Feel free to ask about events, registration process, or any other EventEase features!",
                "How can I assist you? I can help with event search, registration, or platform guidance.",
            ],
            default: [
                "I'm not sure I understand. Could you rephrase that?",
                "I'm still learning! Try asking about events, registration, or how to use EventEase.",
                "Let me connect you with that information. In the meantime, is there anything else I can help with?",
            ]
        };

        this.suggestions = [
            "Show me tech events",
            "How to register?",
            "Upcoming conferences",
            "Event pricing",
            "Help with booking",
        ];
    }

    // Simulate AI processing delay
    async simulateDelay() {
        return new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    }

    // Process user message and generate response
    async processMessage(userMessage) {
        await this.simulateDelay();

        const message = userMessage.toLowerCase().trim();

        // Simple intent detection
        if (this.containsAny(message, ['hello', 'hi', 'hey', 'greetings'])) {
            return this.getRandomResponse('greetings');
        }

        if (this.containsAny(message, ['event', 'events', 'conference', 'workshop', 'festival'])) {
            return this.getRandomResponse('events');
        }

        if (this.containsAny(message, ['register', 'registration', 'sign up', 'book', 'ticket'])) {
            return this.getRandomResponse('registration');
        }

        if (this.containsAny(message, ['price', 'pricing', 'cost', 'fee', 'expensive'])) {
            return this.getRandomResponse('pricing');
        }

        if (this.containsAny(message, ['help', 'support', 'assist', 'how to', 'what can'])) {
            return this.getRandomResponse('help');
        }

        return this.getRandomResponse('default');
    }

    containsAny(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }

    getRandomResponse(type) {
        const responses = this.responses[type] || this.responses.default;
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getSuggestions() {
        return this.suggestions;
    }

    // Advanced AI response with context (mock)
    async getAIResponse(message, conversationHistory = []) {
        try {
            // In a real implementation, you would call an AI API here
            // For example: OpenAI GPT, Dialogflow, or custom NLP service
            
            const response = await this.processMessage(message);
            
            // Add contextual understanding based on conversation history
            const lastUserMessage = conversationHistory
                .filter(msg => msg.sender === 'user')
                .slice(-1)[0];

            if (lastUserMessage && lastUserMessage.text.toLowerCase().includes('tech')) {
                return "For tech events, I recommend checking our Technology category. We have conferences on AI, Web Development, and Cloud Computing coming up!";
            }

            return response;
        } catch (error) {
            console.error('AI Service Error:', error);
            return "I'm having trouble connecting right now. Please try again in a moment.";
        }
    }
}

// Export singleton instance
export const chatbotService = new ChatbotService();