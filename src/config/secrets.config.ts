class SecretConfig {
    // Database configuration
    static dbUrl = process.env.DATABASE_URL!;

    // JWT configuration
    static jwtSecret = process.env.JWT_SECRET!;
    static jwtExpiresIn = process.env.JWT_EXPIRES_IN || "14d"; // Default to 14 days

    // Gemini configuration
    static geminiApiKey = process.env.GEMINI_API_KEY!;
    static geminiModel = process.env.GEMINI_MODEL!;

    // Cookie settings
    static cookieMaxAge = parseInt(process.env.COOKIE_MAX_AGE || "1209600000"); // Default to 14 days in milliseconds

    static validateConfig() {
        const missingVars = [];
        
        if (!this.dbUrl) missingVars.push('DATABASE_URL');
        if (!this.jwtSecret) missingVars.push('JWT_SECRET');
        if (!this.jwtExpiresIn) missingVars.push('JWT_EXPIRES_IN');
        if (!this.geminiApiKey) missingVars.push('GEMINI_API_KEY');
        if (!this.geminiModel) missingVars.push('GEMINI_MODEL');
        
        if (missingVars.length) {
            throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
        }
    }        
};

export default SecretConfig;