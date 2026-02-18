import { promises as fs } from 'fs';
import path from 'path';
import { UXKnowledgeEntry, UXKnowledgeFile } from './types';
import { UX_PATTERNS } from './seed-knowledge/patterns';
import { ACCESSIBILITY_RULES } from './seed-knowledge/accessibility-rules';
import { WEATHER_APP_RULES } from './seed-knowledge/weather-app-specific';

const KNOWLEDGE_DIR = path.join(process.cwd(), '.context', 'ux-knowledge');

const ALL_SEED_ENTRIES: UXKnowledgeEntry[] = [
  ...UX_PATTERNS,
  ...ACCESSIBILITY_RULES,
  ...WEATHER_APP_RULES,
];

async function ensureDir(): Promise<void> {
  await fs.mkdir(KNOWLEDGE_DIR, { recursive: true });
}

function createEmptyFile(): UXKnowledgeFile {
  return {
    version: 1,
    lastUpdated: new Date().toISOString(),
    entries: [],
  };
}

async function readKnowledgeFile(
  filename: string,
): Promise<UXKnowledgeFile> {
  const filePath = path.join(KNOWLEDGE_DIR, filename);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as UXKnowledgeFile;
  } catch {
    return createEmptyFile();
  }
}

async function writeKnowledgeFile(
  filename: string,
  file: UXKnowledgeFile,
): Promise<void> {
  await ensureDir();
  const filePath = path.join(KNOWLEDGE_DIR, filename);
  file.lastUpdated = new Date().toISOString();
  await fs.writeFile(filePath, JSON.stringify(file, null, 2), 'utf-8');
}

/**
 * Seed the knowledge base with built-in entries if they don't exist yet.
 */
export async function seedKnowledgeBase(): Promise<void> {
  await ensureDir();
  const existing = await readKnowledgeFile('knowledge.json');

  if (existing.entries.length === 0) {
    existing.entries = ALL_SEED_ENTRIES;
    await writeKnowledgeFile('knowledge.json', existing);
    return;
  }

  // Merge any new seed entries that don't exist yet
  const existingIds = new Set(existing.entries.map((e) => e.id));
  const newEntries = ALL_SEED_ENTRIES.filter((e) => !existingIds.has(e.id));
  if (newEntries.length > 0) {
    existing.entries.push(...newEntries);
    await writeKnowledgeFile('knowledge.json', existing);
  }
}

/**
 * Get all knowledge entries, optionally filtered by category.
 */
export async function getKnowledge(
  category?: string,
): Promise<UXKnowledgeEntry[]> {
  await seedKnowledgeBase();
  const file = await readKnowledgeFile('knowledge.json');

  if (category && category !== 'all') {
    return file.entries.filter((e) => e.category === category);
  }
  return file.entries;
}

/**
 * Add a new knowledge entry, deduplicating by id.
 */
export async function addKnowledgeEntry(
  entry: UXKnowledgeEntry,
): Promise<void> {
  await ensureDir();
  const file = await readKnowledgeFile('knowledge.json');

  // Deduplicate by id
  const existingIndex = file.entries.findIndex((e) => e.id === entry.id);
  if (existingIndex >= 0) {
    file.entries[existingIndex] = entry;
  } else {
    file.entries.push(entry);
  }

  await writeKnowledgeFile('knowledge.json', file);
}

/**
 * Add multiple knowledge entries at once, deduplicating.
 */
export async function addKnowledgeEntries(
  entries: UXKnowledgeEntry[],
): Promise<number> {
  await ensureDir();
  const file = await readKnowledgeFile('knowledge.json');
  const existingIds = new Set(file.entries.map((e) => e.id));

  let added = 0;
  for (const entry of entries) {
    if (!existingIds.has(entry.id)) {
      file.entries.push(entry);
      existingIds.add(entry.id);
      added++;
    }
  }

  if (added > 0) {
    await writeKnowledgeFile('knowledge.json', file);
  }
  return added;
}

/**
 * Delete a knowledge entry by id.
 */
export async function deleteKnowledgeEntry(id: string): Promise<boolean> {
  const file = await readKnowledgeFile('knowledge.json');
  const before = file.entries.length;
  file.entries = file.entries.filter((e) => e.id !== id);

  if (file.entries.length < before) {
    await writeKnowledgeFile('knowledge.json', file);
    return true;
  }
  return false;
}

/**
 * Log a web research result.
 */
export async function logResearch(
  source: string,
  status: 'success' | 'failed',
  insightCount: number,
): Promise<void> {
  await ensureDir();
  const filePath = path.join(KNOWLEDGE_DIR, 'research-log.json');

  let log: Array<{
    source: string;
    status: string;
    insightCount: number;
    timestamp: string;
  }> = [];

  try {
    const data = await fs.readFile(filePath, 'utf-8');
    log = JSON.parse(data);
  } catch {
    // Start fresh
  }

  log.push({
    source,
    status,
    insightCount,
    timestamp: new Date().toISOString(),
  });

  // Keep only last 100 entries
  if (log.length > 100) {
    log = log.slice(-100);
  }

  await fs.writeFile(filePath, JSON.stringify(log, null, 2), 'utf-8');
}
