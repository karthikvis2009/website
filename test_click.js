const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:8080/index.html');
  await page.waitForTimeout(2000); 

  // Make sure to click the first true link slide
  const slides = await page.$$('a.group');
  if (slides.length > 0) {
     console.log("Carousel slides are anchors!");
     await slides[0].click();
     await page.waitForTimeout(1000); 
     console.log("Navigated to:", page.url());
  } else {
     console.log("No anchor slides found.");
  }
  
  await browser.close();
})();
