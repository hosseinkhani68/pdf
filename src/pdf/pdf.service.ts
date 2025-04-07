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
           <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              padding: 20px;
            }
            /* Code block styles */
            pre {
              background-color: #f5f5f5;
              border-radius: 4px;
              padding: 16px;
              overflow-x: auto;
              margin: 16px 0;
              font-family: 'Courier New', Courier, monospace;
              font-size: 14px;
              line-height: 1.5;
              white-space: pre;
            }
            code {
              font-family: 'Courier New', Courier, monospace;
              background-color: #f5f5f5;
              padding: 2px 4px;
              border-radius: 3px;
              font-size: 14px;
            }
            /* Syntax highlighting colors */
            .token.comment,
            .token.prolog,
            .token.doctype,
            .token.cdata {
              color: #6a9955;
            }
            .token.punctuation {
              color: #d4d4d4;
            }
            .token.property,
            .token.tag,
            .token.boolean,
            .token.number,
            .token.constant,
            .token.symbol,
            .token.deleted {
              color: #b5cea8;
            }
            .token.selector,
            .token.attr-name,
            .token.string,
            .token.char,
            .token.builtin,
            .token.inserted {
              color: #ce9178;
            }
            .token.operator,
            .token.entity,
            .token.url,
            .language-css .token.string,
            .style .token.string {
              color: #d4d4d4;
            }
            .token.atrule,
            .token.attr-value,
            .token.keyword {
              color: #569cd6;
            }
            .token.function,
            .token.class-name {
              color: #dcdcaa;
            }
            .token.regex,
            .token.important,
            .token.variable {
              color: #d16969;
            }
          </style>
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