import assert from 'node:assert/strict'
import test from 'node:test'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { BLOG_TYPES } from '../docs/.vitepress/theme/utils/blogFilters.ts'

// 文章本身的完整性。posts.data.mts 的 excerptFn 取 split('<!-- DESC SEP -->')[1]，
// 所以摘要必须由**一对**标记夹住：只写一个标记时，[1] 会变成整篇正文，
// 于是 /blog 与 /benchmark 的列表会把全文吐出来。

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const postsDirs = ['docs/posts', 'docs/en/posts'].map(dir => path.join(repoRoot, dir))

const SEP = '<!-- DESC SEP -->'

function walk(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else if (name.endsWith('.md')) out.push(full)
  }
  return out
}

function allPosts() {
  return postsDirs.filter(existsSync).flatMap(walk)
}

test('every post wraps its excerpt in exactly one pair of DESC SEP markers', () => {
  const files = allPosts()
  assert.ok(files.length > 0, 'expected to find posts on disk')
  for (const file of files) {
    const count = readFileSync(file, 'utf8').split(SEP).length - 1
    assert.equal(count, 2, `${path.relative(repoRoot, file)} has ${count} "${SEP}" markers, expected 2`)
  }
})

// 拼错的 type 会让文章在 /benchmark 上静默消失——这类错必须被测试挡住。
test('every explicit frontmatter type is a registered blog type', () => {
  const registered = new Set(BLOG_TYPES.map(item => item.value))
  for (const file of allPosts()) {
    const frontmatter = readFileSync(file, 'utf8').split(/^---\s*$/m)[1]
    const match = frontmatter?.match(/^type:\s*(\S+)\s*$/m)
    if (!match) continue
    const value = match[1].replace(/^['"]|['"]$/g, '')
    assert.ok(registered.has(value), `unknown blog type "${value}" in ${path.relative(repoRoot, file)}`)
  }
})
