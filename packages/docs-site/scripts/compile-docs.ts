import * as hp from 'helper-js'
import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'
import * as chokidar from 'chokidar'
import * as crypto from 'crypto'
import * as cheerio from 'cheerio'
const marked = require('marked')
import { DocsSubmenu } from '../src/docsSubmenu'
import baseConfig from '../src/baseConfig'
import { docsDir, getLocales } from './utils'

const compiledDir = 'src/compiled-docs'

const start = () => {
  if (fs.existsSync(compiledDir)) {
    execSync(`rm ${compiledDir} -rf`)
  }
  fs.mkdirSync(compiledDir)

  const watcher = chokidar.watch(docsDir)
  const data = {
    versions: {},
    routes: {},
  } as {
    versions: {
      [version: string]: {
        [locale: string]: []
      }
    }
    routes: {
      [md5Name: string]: {
        name: string | null
        md5Name: string
        componentPath: string
        path: string
        meta: Object
      }
    }
  }
  const updateRoutes = hp.debounceTrailing(() => {
    //
    let t2 = []
    for (const info of Object.values(data.routes)) {
      t2.push({
        name: info.md5Name,
        path: info.path,
        meta: info.meta,
        component: `import('./${info.md5Name}.vue')`,
      })
    }
    let routesContent = JSON.stringify(t2)
    routesContent = routesContent.replace(/"(import\(.*?\))"/g, '() => $1')
    routesContent = 'export default ' + routesContent
    fs.writeFileSync(path.join(compiledDir, 'routes.ts'), routesContent)
  }, 100).action

  console.log('start watching doc files')
  let first = true
  const firstDone = hp.debounceTrailing(async () => {
    first = false
    if (!process.argv.includes('--watch')) {
      // stop
      await watcher.close()
      console.log('stop watching')
    }
  }, 110).action
  watcher.on('all', (event, filepath) => {
    if (!['add', 'unlink', 'change'].includes(event)) {
      return
    }
    console.log(event, filepath)
    const md5Name = md5(filepath)
    if (event === 'unlink') {
      delete data.routes[md5Name]
    } else {
      const locales = getLocales()
      let t = filepath.split(path.sep)
      const locale = t[1]
      const pathWithoutLocale = t.slice(2).join('/')
      const fileContent = fs.readFileSync(filepath).toString()
      const filename = hp.arrayLast(t)
      const componentPath = path.join(compiledDir, md5Name + '.vue')
      const html = marked(fileContent)
      const vueTemplate = handleHtmlForVue(html)
      const structure = resolveMdStructure(html)
      const tpl = fs.readFileSync('scripts/tpl/doc-template.vue').toString()
      const componentContent = tpl
        .replace('<!-- :template -->', vueTemplate)
        .replace("':data'", JSON.stringify(structure))
      fs.writeFileSync(componentPath, componentContent)
      const urlPath = genUrl(locale, pathWithoutLocale)
      const alternate: any = {}
      for (const locale2 of locales) {
        const alternateFile = path.join(docsDir, locale2, pathWithoutLocale)
        if (fs.existsSync(alternateFile)) {
          alternate[locale2] = genUrl(locale2, pathWithoutLocale)
        }
      }
      const routeMeta = { locale, alternate, fromMarkdown: true }
      data.routes[md5Name] = {
        name: null,
        md5Name,
        componentPath,
        path: urlPath,
        meta: routeMeta,
      }
    }
    //
    updateRoutes()
    //
    if (first) {
      firstDone()
    }
  })
}

start()

function genUrl(locale: string, pathWithoutLocale: string) {
  let t = `/${pathWithoutLocale.replace('.md', '')}`
  if (locale !== baseConfig.LOCALE) {
    t = `/${locale}` + t
  }
  return t
}
function md5(str: string) {
  var md5 = crypto.createHash('md5')
  return md5.update(str).digest('hex')
}

function handleHtmlForVue(html: string) {
  html = html.replace(/<code/g, '<code v-pre') // for vue show '{{' and '}}'
  // replace heading to component
  for (let i = 1; i <= 6; i++) {
    html = html.replace(new RegExp(`<h${i}`, 'g'), `<vheading :level="${i}"`)
    html = html.replace(new RegExp(`</h${i}>`, 'g'), `</vheading>`)
  }
  // replace link to component
  const reg = /<a(.*?)href="(.*?)"(.*?)>(.*?)<\/a>/g
  const m = html.match(reg)
  if (m) {
    for (const item of m) {
      const reg2 = new RegExp(reg.source)
      const m2 = item.match(reg2)!
      const replacedItem = item.replace(
        reg2,
        `<Anchor$1:to="resolveHref('$2')"$3>$4</Anchor>`
      )
      html = html.replace(item, replacedItem)
    }
  }
  return html
}

function resolveMdStructure(html: string) {
  const $ = cheerio.load(`<div class="md-root">${html}</div>`)
  const data: { children: DocsSubmenu[] } = {
    children: [],
  }
  function* findParent() {
    let current = data
    while (current) {
      yield current
      current = hp.arrayLast(current.children)
    }
  }
  $('.md-root')
    .children()
    .each((i, el) => {
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(el.tagName)) {
        let $el = $(el)
        let level = parseInt(el.tagName.slice(1))
        let node = { name: $el.text(), id: $el.attr('id'), children: [] }
        let parent
        let parentLevel = 0
        for (const t of findParent()) {
          if (level - parentLevel === 1) {
            parent = t
            break
          }
          parentLevel++
        }
        if (!parent) {
          throw new Error('Wrong structure')
        }
        // @ts-ignore
        parent.children.push(node)
      }
    })
  return data.children[0]
}
