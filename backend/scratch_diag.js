import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is not defined in backend/.env!");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testConnection() {
    console.log("🔍 Testing Gemini API connection with key: ", apiKey.substring(0, 8) + "...");
    
    // Test 1: gemini-1.5-flash with v1 override
    try {
        console.log("\n🚀 Testing 'gemini-1.5-flash' with apiVersion: 'v1'...");
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }, { apiVersion: 'v1' });
        const result = await model.generateContent("Say hello!");
        console.log("✅ Success! Response: ", result.response.text().trim());
    } catch (error) {
        console.error("❌ Error with 'gemini-1.5-flash' (v1):", error.message);
    }

    // Test 2: gemini-1.5-flash with default (v1beta)
    try {
        console.log("\n🚀 Testing 'gemini-1.5-flash' with default apiVersion...");
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent("Say hello!");
        console.log("✅ Success! Response: ", result.response.text().trim());
    } catch (error) {
        console.error("❌ Error with 'gemini-1.5-flash' (default):", error.message);
    }

    // Test 3: gemini-2.5-flash with apiVersion: 'v1' (just in case)
    try {
        console.log("\n🚀 Testing 'gemini-2.5-flash' with apiVersion: 'v1'...");
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }, { apiVersion: 'v1' });
        const result = await model.generateContent("Say hello!");
        console.log("✅ Success! Response: ", result.response.text().trim());
    } catch (error) {
        console.error("❌ Error with 'gemini-2.5-flash' (v1):", error.message);
    }
}

testConnection();
