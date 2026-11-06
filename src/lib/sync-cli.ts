import { createClient } from '@supabase/supabase-js';
import { syncStaticDataToDB } from './sync';
import fs from 'fs';
import path from 'path';

function loadEnvFile() {
  const possiblePaths = [
    path.join(process.cwd(), '.env.local'),
    path.join(process.cwd(), '.env')
  ];

  for (const envPath of possiblePaths) {
    if (fs.existsSync(envPath)) {
      console.log(`Env fayl yuklanmoqda: ${envPath}`);
      const content = fs.readFileSync(envPath, 'utf-8');
      content.split('\n').forEach(line => {
        line = line.trim();
        if (line && !line.startsWith('#')) {
          const eqIdx = line.indexOf('=');
          if (eqIdx > 0) {
            const key = line.slice(0, eqIdx).trim();
            const val = line.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
            process.env[key] = val;
          }
        }
      });
      break;
    }
  }
}

async function runCliSync() {
  loadEnvFile();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error('Xatolik: Supabase URL yoki API KEY topilmadi. .env.local yoki atrof-muhit o\'zgaruvchilarini tekshiring.');
    process.exit(1);
  }

  console.log(`Supabase-ga ulanish: ${url}`);
  const supabaseClient = createClient(url, key, {
    auth: {
      persistSession: false
    }
  });

  console.log('Sinxronizatsiya boshlanmoqda...');
  const result = await syncStaticDataToDB(supabaseClient);
  
  if (result.success) {
    console.log(`✅ Muvaffaqiyatli: ${result.message}`);
    process.exit(0);
  } else {
    console.error(`❌ Xatolik yuz berdi: ${result.message}`);
    if (result.details) {
      console.error(`Tafsilotlar: ${result.details}`);
    }
    process.exit(1);
  }
}

runCliSync();
