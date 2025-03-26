// Import polyfills first
import './polyfills';

// Import Supabase client
import { createClient } from '@supabase/supabase-js';

// Global logger
const LOG_TAG = "📱 Supabase";
const logDebug = (...args) => console.log(LOG_TAG, new Date().toISOString(), ...args);
const logError = (...args) => console.error(LOG_TAG, "ERROR", new Date().toISOString(), ...args);

// Debug logging
logDebug('Initializing Supabase client');

// Use the same approach as the successful test
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://ksxaqwkfdmpwgjsyrzjq.supabase.co";
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzeGFxd2tmZG1wd2dqc3lyempxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1MzI4OTYsImV4cCI6MjA1NzEwODg5Nn0.pWOr0WglUWCw66KBV-5-pCfctfZpTIJPXV6xZJWxG2o";

logDebug('Using Supabase URL:', supabaseUrl);
logDebug('Key length:', supabaseKey.length);

// Create the client with bare minimum options that are known to work
const supabase = createClient(supabaseUrl, supabaseKey);

logDebug('Supabase client initialized using known working approach');

// Test write function that bypasses the normal table structure
export async function testWrite(userId, data) {
  if (!userId) {
    logError("Cannot write without a userId");
    return { success: false, error: "No userId provided" };
  }
  
  try {
    logDebug("Attempting test write with userId:", userId);
    
    // First try test_habits
    try {
      const { data: testData, error: testError } = await supabase
        .from('test_habits')
        .insert({
          user_id: userId,
          data: JSON.stringify(data),
          created_at: new Date().toISOString()
        })
        .select();
      
      if (testError) {
        logError("test_habits insertion failed:", testError);
      } else {
        logDebug("test_habits insertion succeeded:", testData);
        return { success: true, data: testData, method: "test_habits" };
      }
    } catch (testError) {
      logError("Exception during test_habits insertion:", testError);
    }
    
    // If that failed, try a raw request
    try {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/test_habits`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({
            user_id: userId,
            data: JSON.stringify(data),
            created_at: new Date().toISOString()
          })
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        logError("Raw fetch request failed:", response.status, errorText);
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }
      
      const responseData = await response.json();
      logDebug("Raw fetch request succeeded:", responseData);
      return { success: true, data: responseData, method: "fetch" };
    } catch (fetchError) {
      logError("Exception during raw fetch request:", fetchError);
      throw fetchError;
    }
  } catch (error) {
    logError("All test write methods failed:", error);
    return { success: false, error: error.message };
  }
}

// More code omitted for brevity...

// Run connection test immediately
testSupabaseConnection()
  .then(result => {
    if (result.success) {
      logDebug("✅ Supabase connection test completed");
    } else {
      logError("❌ Supabase connection test failed:", result.error);
    }
  })
  .catch(err => {
    logError("❌ Unexpected error in Supabase connection test:", err);
  });

export default supabase;