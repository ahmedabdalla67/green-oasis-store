import dotenv from 'dotenv';
dotenv.config();

import app from './app';

console.log('Starting server...');
console.log('DATABASE_URL present:', !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
    console.log('DATABASE_URL starts with:', process.env.DATABASE_URL.substring(0, 10) + '...');
} else {
    console.error('DATABASE_URL is missing!');
}

const PORT = parseInt(process.env.PORT || '3000', 10);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access via: http://localhost:${PORT} or http://192.168.10.100:${PORT}`);
});
