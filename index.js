const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.canadacomputers.com/index.php?cPath=43_557&sf=:3_4,3_5&mfr=&pr=", { waitUntil: "domcontentloaded" });
  await page.screenshot({ path: "notablog.png" });

  await page.click("#privacy-btn");

  await page.evaluate(async () => {
    let scrollPosition = 0;
    let documentHeight = document.body.scrollHeight;

    while (documentHeight > scrollPosition) {
      window.scrollBy(0, documentHeight);
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      scrollPosition = documentHeight;
      documentHeight = document.body.scrollHeight;
    }
    let products = document.querySelectorAll(".toggleBox .productTemplate .row.mx-0");

    products.forEach((product) => {
      const basicInfo = product.querySelector(".productInfoSearch");

      const urlAndName = basicInfo.querySelector(".productTemplate_title a");
      const url = urlAndName.getAttribute("href");
      const name = urlAndName.innerText;
      const price = basicInfo.querySelector(".pq-hdr-product_price").innerText;
      const originalPrice = basicInfo.querySelector(".line-height s small")?.innerText;
      const inStock = product.querySelector(".allInfoSearch .addCartSearch .stock-popup i.fa-check");
      let stock = false;
      if (inStock) {
        stock = true;
      }
      console.log(url, name, price, originalPrice, stock);
    });
  });
  //TODO evaluate pages and output all products and status to csv
  //TODO make an api request with the product info to a server
  //schedule this script to run every 1 minute
})();
