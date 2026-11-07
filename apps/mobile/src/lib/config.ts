export const apiURL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '')
export const backendConfigured = apiURL.length > 0
