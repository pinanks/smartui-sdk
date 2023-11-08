import { Env } from '../types.js';

export default (): Env => {
    const {
        PROJECT_TOKEN = '',
        SMARTUI_CLIENT_API_URL = 'https://api.lambdatest.com'
    } = process.env
        
    return {
        PROJECT_TOKEN,
        SMARTUI_CLIENT_API_URL
    }
}