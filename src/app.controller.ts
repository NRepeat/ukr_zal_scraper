import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import puppeteer, { Browser, Page } from 'puppeteer-core';
import { json } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('test')
  async homePage() {
    try {
      const executablePath =
        '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary';
      const browser = await puppeteer.launch({
        args: ['--incognito'],

        executablePath,
      });
      const page = await browser.newPage();
      await page.goto('https://booking.uz.gov.ua/en');

      // Set screen size.
      await page.setViewport({ width: 1080, height: 1024 });
      const isSelectorCreated = await page.waitForSelector(
        '#headlessui-combobox-input-4',
      );

      const isSelector2Created = await page.waitForSelector(
        '#headlessui-combobox-input-7',
      );
      const isSelectorDateCreated = await page.waitForSelector('#startDate');
      await page.waitForSelector('button.Button--primary[type="submit"]', {
        visible: true,
        timeout: 60000,
      });
      const buttonElement = await page.$(
        'button.Button--primary[type="submit"]',
      );

      if (isSelectorCreated) {
        const element = await page.$('#headlessui-combobox-input-4');
        await element.type('Zaporizhzhia 1');
      }
      if (isSelector2Created) {
        const element = await page.$('#headlessui-combobox-input-7');
        await element.type('Lviv');
      }
      if (isSelectorDateCreated) {
        const element = await page.$('#startDate');
        await element.click();
        const isSelectorCreated = await page.waitForSelector('#2024-09-30');
        if (isSelectorCreated) {
          const date = await page.$('#2024-09-30');
          date.click();
        }
      }
      if (buttonElement) {
        await buttonElement.click();
      } else {
        console.log('Search button not found');
      }
      // await page
      //   .locator('#headlessui-combobox-input-313')
      //   .fill('Zaporizhzhia 1');
      // await page.locator('#headlessui-combobox-input-317').fill('Lviv');
      // await page.locator('#startDate').click();
      // await page.locator('#2024-09-30').click();
      // await page.locator('button:has-text("Search")').click();
      // await page.waitForSelector('ul.grid');
      // const data = (await page.evaluate(() => {
      //   const listItems = document.querySelectorAll('ul.grid li');
      //   const results = [];
      //   console.log('🚀 ~ AppController ~ data ~ results:', results);

      //   // Loop through each 'li' and extract desired data
      //   listItems.forEach((item) => {
      //     const trainNumber = item.querySelector(
      //       '.BadgeTrainLabels div div',
      //     ).innerHTML;
      //     const departureTime = item.querySelector(
      //       '.TripUnitInfo h3:nth-child(1)',
      //     ).innerHTML;
      //     const arrivalTime = item.querySelector(
      //       '.TripUnitInfo h3:nth-child(3)',
      //     ).innerHTML;
      //     const departureStation = item.querySelector(
      //       '.TripUnitInfo h4:nth-child(5)',
      //     ).innerHTML;
      //     const arrivalStation = item.querySelector(
      //       '.TripUnitInfo h4:nth-child(6)',
      //     ).innerHTML;
      //     const duration = item.querySelector(
      //       '.TripDuration div:nth-child(3)',
      //     ).innerHTML;
      //     const priceBerth = item.querySelector('.TripUnitWagon h3').innerHTML;

      //     results.push({
      //       trainNumber,
      //       departureTime,
      //       arrivalTime,
      //       departureStation,
      //       arrivalStation,
      //       duration,
      //       priceBerth,
      //     });
      //   });
      // })) as any;
      return { data: 'data' };
    } catch (err) {
      throw new HttpException(
        'homePage: ' + err.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
