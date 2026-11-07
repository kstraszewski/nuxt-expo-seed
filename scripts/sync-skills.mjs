import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sourcesPath = resolve(root, 'docs/skills-sources.json')
const lockPath = resolve(root, 'docs/skills-upstream-lock.json')
const hash = (content) => createHash('sha256').update(content).digest('hex')
const action =
  process.argv.find((arg) => ['--check', '--install', '--refresh'].includes(arg)) || '--check'
const force = process.argv.includes('--force')
const maxBytes = 12 * 1024 * 1024

function normalizeSkill(content, sourceURL, license) {
  const text = content.toString('utf8')
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/)
  if (!match) throw new Error(`Brak frontmatter: ${sourceURL}`)
  const field = (name) => {
    const value = match[1].match(
      new RegExp(`^${name}:([^\\n]*)(?:\\n((?:[ \\t]+[^\\n]*(?:\\n|$))*))?`, 'm'),
    )
    if (!value) return ''
    let result = value[1].trim()
    if (/^[>|][-+]?\s*$/.test(result))
      result = (value[2] || '')
        .split('\n')
        .map((line) => line.trim())
        .join(' ')
        .trim()
    if (result.startsWith('"') && result.endsWith('"')) {
      try {
        result = JSON.parse(result)
      } catch {
        result = result.slice(1, -1)
      }
    } else if (result.startsWith("'") && result.endsWith("'"))
      result = result.slice(1, -1).replaceAll("''", "'")
    return result
  }
  const name = field('name')
  const description = field('description').replace(/[<>]/g, '')
  if (!/^[a-z0-9-]{1,64}$/.test(name) || !description || description.length > 1024)
    throw new Error(`Niepoprawne metadane skilla: ${sourceURL}`)
  const frontmatter = [
    '---',
    `name: ${name}`,
    `description: ${JSON.stringify(description)}`,
    `license: ${license}`,
    'metadata:',
    `  source: ${JSON.stringify(sourceURL)}`,
    '  adapter: codex-frontmatter-v1',
    '---',
  ].join('\n')
  return Buffer.from(`${frontmatter}\n${match[2]}`)
}

async function download(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'nuxt-expo-seed-skills', Accept: 'application/vnd.github+json' },
    signal: AbortSignal.timeout(45_000),
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`)
  const content = Buffer.from(await response.arrayBuffer())
  if (content.length > maxBytes) throw new Error(`Plik przekracza limit rozmiaru: ${url}`)
  return content
}

async function concurrent(items, task, limit = 8) {
  const results = new Array(items.length)
  let next = 0
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const index = next++
        results[index] = await task(items[index], index)
      }
    }),
  )
  return results
}

function targetPath(relativePath) {
  if (!relativePath.startsWith('.agents/skills/') || relativePath.split('/').includes('..')) {
    throw new Error(`Niedozwolony katalog docelowy: ${relativePath}`)
  }
  const target = resolve(root, relativePath)
  if (!target.startsWith(`${resolve(root, '.agents/skills')}${sep}`))
    throw new Error('Ścieżka poza katalogiem skillsów.')
  return target
}

function inspectFiles(lock) {
  const issues = []
  for (const file of lock.files) {
    const target = targetPath(file.path)
    if (!existsSync(target)) issues.push(`Brak ${file.path}`)
    else if (hash(readFileSync(target)) !== file.sha256) issues.push(`Zmieniony ${file.path}`)
  }
  return issues
}

function assertNotEdited(file, previousFiles) {
  const target = targetPath(file.path)
  if (!existsSync(target) || force) return
  const actual = hash(readFileSync(target))
  const previous = previousFiles.get(file.path)
  if (actual !== file.sha256 && actual !== previous?.sha256) {
    throw new Error(
      `Lokalna zmiana w ${file.path}. Zachowaj ją przed ponownym importem. --force nadpisuje plik.`,
    )
  }
}

function writeFiles(lock, contents, previousLock) {
  const previousFiles = new Map((previousLock?.files || []).map((file) => [file.path, file]))
  for (const file of lock.files) assertNotEdited(file, previousFiles)
  for (const file of lock.files) {
    const target = targetPath(file.path)
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, contents.get(file.path))
  }
}

async function buildLock(sources, { refresh }) {
  const lockedSources = []
  const selected = []
  for (const source of sources) {
    if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(source.repository))
      throw new Error('Niepoprawna nazwa repozytorium źródłowego.')
    const ref = refresh ? source.ref : source.commit
    const tree = JSON.parse(
      (
        await download(
          `https://api.github.com/repos/${source.repository}/git/trees/${encodeURIComponent(ref)}?recursive=1`,
        )
      ).toString(),
    )
    if (tree.truncated) throw new Error(`Niepełna lista plików ${source.repository}.`)
    const commit = tree.sha
    if (!/^[a-f0-9]{40}$/.test(commit)) throw new Error('Niepoprawny commit źródła.')
    const locked = { ...source, commit }
    lockedSources.push(locked)
    const licenseURL = `https://raw.githubusercontent.com/${source.repository}/${commit}/${source.licensePath}`
    const licenseContent = await download(licenseURL)
    if (!licenseContent.length) throw new Error(`Brak licencji ${source.repository}.`)
    for (const skillPath of source.skills) {
      if (!/^[A-Za-z0-9_./-]+$/.test(skillPath) || skillPath.split('/').includes('..'))
        throw new Error('Niepoprawna ścieżka skilla.')
      const name = skillPath.split('/').at(-1)
      const files = tree.tree.filter(
        (entry) => entry.type === 'blob' && entry.path.startsWith(`${skillPath}/`),
      )
      if (!files.some((entry) => entry.path === `${skillPath}/SKILL.md`))
        throw new Error(`Brak SKILL.md: ${skillPath}`)
      for (const file of files) {
        const relative = file.path.slice(skillPath.length + 1)
        if (relative.split('/').some((part) => part.startsWith('.'))) continue
        const url = `https://raw.githubusercontent.com/${source.repository}/${commit}/${file.path}`
        selected.push({
          path: `.agents/skills/${name}/${relative}`,
          url,
          expectedSize: file.size,
          ...(relative === 'SKILL.md'
            ? { transformation: 'codex-frontmatter-v1', license: source.license }
            : {}),
        })
        if (relative === 'SKILL.md')
          selected.push({
            path: `.agents/skills/${name}/UPSTREAM-SKILL.md`,
            url,
            expectedSize: file.size,
          })
      }
      selected.push({
        path: `.agents/skills/${name}/UPSTREAM-LICENSE`,
        url: licenseURL,
        content: licenseContent,
      })
      if (source.license === 'Apache-2.0' && !licenseContent.includes('TERMS AND CONDITIONS')) {
        selected.push({
          path: `.agents/skills/${name}/APACHE-2.0.txt`,
          url: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
        })
      }
      const provenance = {
        repository: source.repository,
        commit,
        sourcePath: skillPath,
        license: source.license,
        licensePath: source.licensePath,
        modified: true,
        modification:
          'Entrypoint frontmatter adapted to Codex-supported fields. Original body unchanged. Full original preserved in UPSTREAM-SKILL.md.',
      }
      selected.push({
        path: `.agents/skills/${name}/SOURCE.json`,
        content: Buffer.from(`${JSON.stringify(provenance, null, 2)}\n`),
      })
    }
  }
  if (
    selected.length > 1200 ||
    selected.reduce((sum, file) => sum + (file.expectedSize || file.content?.length || 0), 0) >
      maxBytes
  ) {
    throw new Error('Wybrany zestaw przekracza limit 1200 plików lub 12 MB. Zawęź źródła.')
  }
  const unique = new Set(selected.map((file) => file.path))
  if (unique.size !== selected.length) throw new Error('Kolizja nazw między źródłami skillsów.')
  const contents = new Map()
  const files = await concurrent(selected, async (file) => {
    const original = file.content || (await download(file.url))
    const content = file.transformation
      ? normalizeSkill(original, file.url, file.license)
      : original
    contents.set(file.path, content)
    return {
      path: file.path,
      ...(file.url ? { url: file.url } : { generated: JSON.parse(content.toString()) }),
      ...(file.transformation
        ? {
            transformation: file.transformation,
            license: file.license,
            sourceSha256: hash(original),
          }
        : {}),
      sha256: hash(content),
      bytes: content.length,
    }
  })
  files.sort((a, b) => a.path.localeCompare(b.path))
  return {
    lock: {
      version: 1,
      sources: lockedSources,
      skillCount: lockedSources.reduce((sum, source) => sum + source.skills.length, 0),
      files,
    },
    contents,
  }
}

async function main() {
  const previousLock = existsSync(lockPath) ? JSON.parse(readFileSync(lockPath, 'utf8')) : undefined
  if (action === '--check') {
    if (!previousLock) throw new Error('Brak lockfile skillsów. Uruchom --install.')
    const issues = inspectFiles(previousLock)
    if (issues.length) throw new Error(issues.join('\n'))
    console.log(
      `Skillsy upstream: ${previousLock.skillCount}, pliki: ${previousLock.files.length}. Sumy SHA-256 zgodne. Sprawdzenie offline.`,
    )
    return
  }
  if (action === '--install' && previousLock) {
    const contents = new Map()
    await concurrent(previousLock.files, async (file) => {
      const original = file.url
        ? await download(file.url)
        : Buffer.from(`${JSON.stringify(file.generated, null, 2)}\n`)
      if (file.sourceSha256 && hash(original) !== file.sourceSha256)
        throw new Error(`Niezgodna źródłowa suma SHA-256: ${file.path}`)
      const content = file.transformation
        ? normalizeSkill(original, file.url, file.license)
        : original
      if (hash(content) !== file.sha256) throw new Error(`Niezgodna suma SHA-256: ${file.path}`)
      contents.set(file.path, content)
    })
    writeFiles(previousLock, contents, previousLock)
    console.log(
      `Zainstalowano ${previousLock.skillCount} skillsów z przypiętych commitów. Brak zmian globalnych.`,
    )
    return
  }
  const sources = JSON.parse(readFileSync(sourcesPath, 'utf8'))
  const { lock, contents } = await buildLock(sources, { refresh: action === '--refresh' })
  writeFiles(lock, contents, previousLock)
  writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`)
  console.log(
    `Zapisano ${lock.skillCount} skillsów i ${lock.files.length} plików. Sprawdź diff instrukcji, licencji i lockfile przed commitem.`,
  )
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
