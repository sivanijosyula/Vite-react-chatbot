import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173/');
});

test('Display component', async ({ page }) => {
  const responseLocator = page.locator('text=Response will be displayed here');
  await expect(responseLocator).toBeVisible();
});

test('chatbot component', async ({ page }) => {
  const responseLocator = page.locator("text=Hello, I'm ChatGPT! Ask me anything!");
  await expect(responseLocator).toBeVisible();
});

test('sends a message to chatbot, gets response in the box', async ({ page }) => {
  //page.on('request', request => console.log('>>', request.method(), request.url()));
  //page.on('response', response => console.log('<<', response.status(), response.url()));

  const inputContainer = page.getByTestId('message-input');
  const input = inputContainer.locator('[contenteditable="true"]'); 

  // Type the message directly into the contenteditable element
  await input.click();
  await input.fill("respond with 'This is a response from ChatGPT' and nothing else"); 
  await input.press('Enter');

  const response = page.locator('text=This is a response from ChatGPT');
  await expect(response).toHaveCount(3);
  });

test('renders YouTube video with the same id as in the response', async ({ page }) => {
  const inputContainer = page.getByTestId('message-input');
  const input = inputContainer.locator('[contenteditable="true"]'); 

  await input.click();
  await input.fill("What is ML. Give a 3 video references for it."); 
  await input.press('Enter'); 

  await page.waitForSelector('#videoContainer');



  const result = await page.evaluate(() => {

    const response = document.getElementById('displaybox').textContent;
    const videoRegex = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_\-]+)/g;
    let match;
    const displayLinks = [];

    while ((match = videoRegex.exec(response)) !== null) {
      displayLinks.push(match[0]);
    }

    const container = document.getElementById('videoContainer');
    let videoboxlinks = Array.from(container.children).map((child) =>  child.src);
    
    //console.log(videoboxlinks, 'videoboxlinks');
    //console.log(displayLinks, 'displayLinks');

    regexids = /(\/embed\/|watch\?v=)([\w-]+)/;
    displayvideo_ids = displayLinks.map(link => {
      return link.match(regexids)?.[2] || ""
    });
    videobox_ids = videoboxlinks.map(link => {
      return link.match(regexids)?.[2] || ""
    });
    let results = [];
    if(displayvideo_ids.sort().join(",") === videobox_ids.sort().join(",")) {
      results[0] = true;
    }
    const length = container.children.length;
    if(length > 0) {
      results[1] = true;
    }
    return results;
  });
  //console.log(result);
  expect(result).toEqual([true, true]);

  });

