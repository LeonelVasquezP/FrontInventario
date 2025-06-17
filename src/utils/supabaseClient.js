// Asegúrate de instalar antes: npm install @supabase/supabase-js
const { createClient } = require("@supabase/supabase-js");

// URL y clave pública (anon)
const supabaseUrl = "https://tshcxnarggqzcqesfgng.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzaGN4bmFyZ2dxemNxZXNmZ25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MjA5OTEsImV4cCI6MjA2NDI5Njk5MX0.NUeFJhrEpzZyFB4XxaIUUk8DLS2aqQZ773kBynybjTw";

// Cliente sin tipos
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
