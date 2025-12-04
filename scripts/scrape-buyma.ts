import puppeteer from 'puppeteer'
import * as fs from 'fs'

interface Product {
  name: string
  brand: string
  price: string
  url: string
  imageUrl: string
}

async function scrapeBuyma(url: string): Promise<Product[]> {
  console.log(`Fetching: ${url}`)

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()

  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })

  // ページ読み込み待機
  await new Promise(resolve => setTimeout(resolve, 3000))

  // スクロールして遅延読み込みをトリガー
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0
      const distance = 500
      const timer = setInterval(() => {
        window.scrollBy(0, distance)
        totalHeight += distance
        if (totalHeight >= document.body.scrollHeight || totalHeight > 5000) {
          clearInterval(timer)
          resolve()
        }
      }, 200)
    })
  })

  await new Promise(resolve => setTimeout(resolve, 2000))

  // 商品ごとの詳細ページからブランドと価格を取得するため、
  // まずリンクと基本情報を取得
  const basicProducts = await page.evaluate(() => {
    const items: { name: string; url: string; imageUrl: string }[] = []
    const processedUrls = new Set<string>()

    const productLinks = document.querySelectorAll('a[href*="/item/"]')

    productLinks.forEach((link) => {
      const href = link.getAttribute('href') || ''
      if (processedUrls.has(href) || !href.includes('/item/')) return
      processedUrls.add(href)

      const imgEl = link.querySelector('img')
      const imageUrl = imgEl?.getAttribute('src') || imgEl?.getAttribute('data-src') || ''
      const name = imgEl?.getAttribute('alt') || ''

      const productUrl = href.startsWith('http') ? href : `https://www.buyma.com${href}`

      if (imageUrl || name) {
        items.push({
          name: name || 'N/A',
          url: productUrl,
          imageUrl
        })
      }
    })

    return items
  })

  console.log(`${basicProducts.length}件の商品リンクを検出`)
  console.log('各商品の詳細を取得中...')

  // 各商品の詳細ページから情報を取得（最初の30件に制限）
  const products: Product[] = []
  const limit = Math.min(basicProducts.length, 30)

  for (let i = 0; i < limit; i++) {
    const item = basicProducts[i]
    process.stdout.write(`\r${i + 1}/${limit}件処理中...`)

    try {
      await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 15000 })
      await new Promise(resolve => setTimeout(resolve, 1000))

      const details = await page.evaluate(() => {
        // ブランド名
        const brandEl = document.querySelector('[class*="brand"] a, [class*="Brand"] a, .product_Brand a')
        const brand = brandEl?.textContent?.trim() || ''

        // 価格
        const priceEl = document.querySelector('[class*="price"], .product_price, [class*="Price"]')
        let price = priceEl?.textContent?.trim() || ''
        // 価格部分だけ抽出
        const priceMatch = price.match(/¥[\d,]+/)
        price = priceMatch ? priceMatch[0] : price

        return { brand, price }
      })

      products.push({
        name: item.name,
        brand: details.brand || 'N/A',
        price: details.price || 'N/A',
        url: item.url,
        imageUrl: item.imageUrl
      })
    } catch (error) {
      // エラー時はスキップ
      products.push({
        name: item.name,
        brand: 'N/A',
        price: 'N/A',
        url: item.url,
        imageUrl: item.imageUrl
      })
    }
  }

  console.log('\n')
  await browser.close()
  return products
}

function convertToCSV(products: Product[]): string {
  const headers = ['商品名', 'ブランド', '価格', 'URL', '画像URL']
  const rows = products.map(p => [
    `"${p.name.replace(/"/g, '""')}"`,
    `"${p.brand.replace(/"/g, '""')}"`,
    `"${p.price.replace(/"/g, '""')}"`,
    `"${p.url}"`,
    `"${p.imageUrl}"`
  ].join(','))

  return [headers.join(','), ...rows].join('\n')
}

async function main() {
  const url = process.argv[2] || 'https://www.buyma.com/r/-C3260/'

  try {
    console.log('BUYMAスクレイピング開始...')
    console.log('ブラウザを起動中...\n')

    const products = await scrapeBuyma(url)

    if (products.length === 0) {
      console.log('商品が見つかりませんでした。')
      return
    }

    console.log(`${products.length}件の商品を取得しました`)

    const csv = convertToCSV(products)
    const filename = `buyma_products_${new Date().toISOString().slice(0, 10)}.csv`

    fs.writeFileSync(filename, '\uFEFF' + csv, 'utf-8')
    console.log(`CSVファイルを出力しました: ${filename}`)

    // 最初の5件を表示
    console.log('\n--- 取得した商品（最初の5件）---')
    products.slice(0, 5).forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`)
      console.log(`   ブランド: ${p.brand}`)
      console.log(`   価格: ${p.price}`)
      console.log(`   URL: ${p.url}`)
      console.log('')
    })

  } catch (error) {
    console.error('エラーが発生しました:', error)
  }
}

main()
