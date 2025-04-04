import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer-core';

@Injectable()
export class PdfService {
  async generatePdfFromHtml(html: string, css?: string): Promise<Buffer> {
    try {
      // Launch browser
      const browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--window-size=1920x1080',
        ],
      });

      const page = await browser.newPage();

      // Combine HTML and CSS
      const fullHtml = `
        <html>
          <head>
            <style>${css || ''}</style>
          </head>
          <body>
            ${html}
          </body>
        </html>
      `;

      // Set content
      await page.setContent(fullHtml, {
        waitUntil: 'networkidle0',
      });

      // Generate PDF
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px',
        },
      });

      await browser.close();
      return Buffer.from(pdf);
    } catch (error) {
      throw new Error(`Failed to generate PDF from HTML: ${error.message}`);
    }
  }

  async generatePdfFromHtmlWithOptions(
    html: string,
    options: {
      css?: string;
      format?: 'A4' | 'A3' | 'Letter' | 'Legal' | 'Tabloid';
      landscape?: boolean;
      margin?: {
        top?: string;
        right?: string;
        bottom?: string;
        left?: string;
      };
      printBackground?: boolean;
    } = {},
  ): Promise<Buffer> {
    try {
      // Launch browser
      const browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--window-size=1920x1080',
        ],
      });

      const page = await browser.newPage();

      // Combine HTML and CSS
      const fullHtml = `
        <html>
          <head>
            <style>${options.css || ''}</style>
          </head>
          <body>
            ${html}
          </body>
        </html>
      `;

      // Set content
      await page.setContent(fullHtml, {
        waitUntil: 'networkidle0',
      });

      // Generate PDF with options
      const pdf = await page.pdf({
        format: options.format || 'A4',
        landscape: options.landscape || false,
        printBackground: options.printBackground !== false,
        margin: options.margin || {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px',
        },
      });

      await browser.close();
      return Buffer.from(pdf);
    } catch (error) {
      throw new Error(`Failed to generate PDF from HTML: ${error.message}`);
    }
  }
} 