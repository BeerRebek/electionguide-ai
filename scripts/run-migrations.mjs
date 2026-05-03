#!/usr/bin/env node
/**
 * ElectionGuide AI — Migration Runner
 * 
 * Runs SQL migrations against your Supabase project.
 * 
 * Usage:
 *   node scripts/run-migrations.mjs
 * 
 * Requires DATABASE_URL in .env.local or passed as env var.
 * Get your DATABASE_URL from: Supabase Dashboard → Settings → Database → Connection string (URI)
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, '..', 'supabase', 'migrations');

// ─── Get Database URL ─────────────────────────────────────────
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error(`
╔══════════════════════════════════════════════════════════════╗
║  DATABASE_URL not found!                                     ║
║                                                              ║
║  Option 1: Set it in .env.local:                            ║
║    DATABASE_URL=postgresql://postgres.[ref]:[pass]@...       ║
║                                                              ║
║  Option 2: Get it from Supabase Dashboard:                  ║
║    Settings → Database → Connection string (URI)            ║
║                                                              ║
║  Option 3: Run SQL manually in Supabase SQL Editor          ║
║    Copy contents of supabase/migrations/*.sql               ║
╚══════════════════════════════════════════════════════════════╝
`);
  process.exit(1);
}

// ─── Dynamic import of pg ─────────────────────────────────────
async function main() {
  let pg;
  try {
    pg = await import('pg');
  } catch {
    console.log('Installing pg driver...');
    const { execSync } = await import('child_process');
    execSync('npm install pg --no-save', { stdio: 'inherit' });
    pg = await import('pg');
  }

  const client = new pg.default.Client({ connectionString: DATABASE_URL });

  try {
    console.log('\n🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected!\n');

    // Get migration files in order
    const files = readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const filePath = join(MIGRATIONS_DIR, file);
      const sql = readFileSync(filePath, 'utf-8');

      console.log(`📄 Running: ${file}`);
      const startTime = Date.now();

      try {
        await client.query(sql);
        const elapsed = Date.now() - startTime;
        console.log(`   ✅ Success (${elapsed}ms)\n`);
      } catch (err) {
        // Handle "already exists" errors gracefully
        if (err.message.includes('already exists') || err.message.includes('duplicate key')) {
          console.log(`   ⚠️  Skipped (already applied)\n`);
        } else {
          console.error(`   ❌ Error: ${err.message}\n`);
          throw err;
        }
      }
    }

    console.log('══════════════════════════════════════════');
    console.log('🎉 All migrations completed successfully!');
    console.log('══════════════════════════════════════════\n');

  } catch (err) {
    console.error('\n💥 Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
