const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:8080/index.html');
  await page.waitForTimeout(1000); // Wait for carousel to load
  
  // Test 1: Click "VIEW CASES" primary button
  console.log("Testing VIEW_CASES button:");
  await page.click('a[href="cases/cases.html"]');
  console.log("Navigated to:", page.url());
  await page.goto('http://localhost:8080/index.html'); // go back
  await page.waitForTimeout(500);

  // Test 2: Click first carousel item
  console.log("\nTesting Carousel Item Click:");
  const slides = await page.$$('.group');
  if (slides.length > 0) {
     await slides[0].click();
     console.log("Carousel click navigated to:", page.url());
  } else {
     console.log("No carousel slides found.");
  }
  
  await browser.close();
})();
