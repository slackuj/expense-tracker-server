export const httpCodes = {
    RESOURCE_CREATED: {
        statusCode: 201,
        message: "Resource created successfully"
    },
    INTERNAL_SERVER_ERROR: {
        statusCode: 500,
        message: "Internal server error"
    },
    RESOURCE_DELETED: {
        statusCode: 204,
        message: null
    },
    UNAUTHORIZED: {
        statusCode: 401,
        message: "Unauthorized access"
    },
    FORBIDDEN: {
        statusCode: 403,
        message: "Permission denied"
    },
}