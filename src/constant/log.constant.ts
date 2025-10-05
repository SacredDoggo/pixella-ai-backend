export const LogConstants = {

    LEVELS: {
        ERROR: "[ERROR]",
        WARN: "[WARN]",
        INFO: "[INFO]",
        DEBUG: "[DEBUG]",
        VERBOSE: "[VERBOSE]",
        SILLY: "[SILLY]",
        HTTP: "[HTTP]",
    } as const,

    // === FUNCTION FLOW ===
    FLOW: {
        ENTERING: "[ENTERING]",
        EXITING: "[EXITING]",
        EXECUTING: "[EXECUTING]",
        COMPLETED: "[COMPLETED]",
    } as const,

    // === OPERATION STATUS ===
    STATUS: {
        SUCCESS: "[SUCCESS]",
        FAILED: "[FAILED]",
        PENDING: "[PENDING]",
        RETRYING: "[RETRYING]",
        TIMEOUT: "[TIMEOUT]",
        CANCELLED: "[CANCELLED]",
    } as const,

    // === DATABASE OPERATIONS ===
    DATABASE: {
        CONNECT: "[DB_CONNECT]",
        QUERY: "[DB_QUERY]",
        TRANSACTION: "[DB_TX]",
        MIGRATION: "[DB_MIGRATE]",
        DISCONNECT: "[DB_DISCONNECT]",
        ERROR: "[DB_ERROR]",
    } as const,

    // === HTTP OPERATIONS ===
    HTTP: {
        REQUEST: "[HTTP_REQUEST]",
        RESPONSE: "[HTTP_RESPONSE]",
        REDIRECT: "[HTTP_REDIRECT]",
        ERROR: "[HTTP_ERROR]",
        VALIDATION: "[HTTP_VALIDATION]",
        RATE_LIMIT: "[HTTP_RATE_LIMIT]",
    } as const,

    // === AUTHENTICATION & SECURITY ===
    AUTH: {
        LOGIN: "[AUTH_LOGIN]",
        LOGOUT: "[AUTH_LOGOUT]",
        REGISTER: "[AUTH_REGISTER]",
        TOKEN_REFRESH: "[AUTH_TOKEN_REFRESH]",
        UNAUTHORIZED: "[AUTH_UNAUTHORIZED]",
        FORBIDDEN: "[AUTH_FORBIDDEN]",
        PASSWORD_RESET: "[AUTH_PASSWORD_RESET]",
    } as const,

    // === BUSINESS OPERATIONS ===
    BUSINESS: {
        CREATE: "[CREATE]",
        READ: "[READ]",
        UPDATE: "[UPDATE]",
        DELETE: "[DELETE]",
        SEARCH: "[SEARCH]",
        VALIDATE: "[VALIDATE]",
        PROCESS: "[PROCESS]",
    } as const,

    // === PERFORMANCE & METRICS ===
    PERFORMANCE: {
        START: "[PERF_START]",
        END: "[PERF_END]",
        SLOW: "[PERF_SLOW]",
        TIMING: "[PERF_TIMING]",
        MEMORY: "[PERF_MEMORY]",
    } as const,

    // === EXTERNAL SERVICES ===
    EXTERNAL: {
        API_CALL: "[EXT_API]",
        WEBHOOK: "[WEBHOOK]",
        EMAIL: "[EMAIL]",
        SMS: "[SMS]",
        NOTIFICATION: "[NOTIFICATION]",
        PAYMENT: "[PAYMENT]",
    } as const,

    // === SYSTEM OPERATIONS ===
    SYSTEM: {
        STARTUP: "[SYSTEM_STARTUP]",
        SHUTDOWN: "[SYSTEM_SHUTDOWN]",
        HEALTH_CHECK: "[HEALTH_CHECK]",
        CONFIG_LOAD: "[CONFIG_LOAD]",
        CLEANUP: "[CLEANUP]",
        BACKUP: "[BACKUP]",
    } as const,

    // === ERROR CATEGORIES ===
    ERROR_TYPES: {
        VALIDATION: "[ERROR_VALIDATION]",
        NETWORK: "[ERROR_NETWORK]",
        DATABASE: "[ERROR_DATABASE]",
        EXTERNAL: "[ERROR_EXTERNAL]",
        INTERNAL: "[ERROR_INTERNAL]",
        SECURITY: "[ERROR_SECURITY]",
        TIMEOUT: "[ERROR_TIMEOUT]",
    } as const
    
} as const;