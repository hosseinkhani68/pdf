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
            .PlaygroundEditorTheme__code {
              background-color: rgb(240, 242, 245);
              font-family: Menlo, Consolas, Monaco, monospace;
              display: block;
              padding: 8px 8px 8px 52px;
              line-height: 1.53;
              font-size: 13px;
              margin: 0;
              margin-top: 8px;
              margin-bottom: 8px;
              overflow-x: auto;
              position: relative;
              tab-size: 2;
            }
            .PlaygroundEditorTheme__code:before {
              content: attr(data-gutter);
              position: absolute;
              background-color: #eee;
              left: 0;
              top: 0;
              border-right: 1px solid #ccc;
              padding: 8px;
              color: #777;
              white-space: pre-wrap;
              text-align: right;
              min-width: 25px;
            }
            .sticky-note {
              background-color: #fff8dc;
              border: 1px solid #e6d8b5;
              border-radius: 4px;
              padding: 12px;
              margin: 8px 0;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              position: relative;
              min-height: 100px;
            }
            .sticky-note::before {
              content: '';
              position: absolute;
              top: 0;
              right: 0;
              width: 0;
              height: 0;
              border-style: solid;
              border-width: 0 20px 20px 0;
              border-color: transparent #f5e6b3 transparent transparent;
            }
            .sticky-note-content {
              font-family: 'Comic Sans MS', cursive, sans-serif;
              font-size: 14px;
              line-height: 1.4;
              color: #333;
            }
            .PlaygroundEditorTheme__tokenComment {
              color: slategray;
            }
            .PlaygroundEditorTheme__tokenPunctuation {
              color: #999;
            }
            .PlaygroundEditorTheme__tokenProperty {
              color: #905;
            }
            .PlaygroundEditorTheme__tokenSelector {
              color: #690;
            }
            .PlaygroundEditorTheme__tokenOperator {
              color: #9a6e3a;
            }
            .PlaygroundEditorTheme__tokenAttr {
              color: #07a;
            }
            .PlaygroundEditorTheme__tokenVariable {
              color: #e90;
            }
            .PlaygroundEditorTheme__tokenFunction {
              color: #dd4a68;
            }
            /* Other editor styles */
            .PlaygroundEditorTheme__paragraph {
              margin: 0;
              position: relative;
            }
            .PlaygroundEditorTheme__h1 {
              font-size: 24px;
              color: rgb(5, 5, 5);
              font-weight: 400;
              margin: 0;
            }
            .PlaygroundEditorTheme__h2 {
              font-size: 15px;
              color: rgb(101, 103, 107);
              font-weight: 700;
              margin: 0;
              text-transform: uppercase;
            }
            .PlaygroundEditorTheme__h3 {
              font-size: 12px;
              margin: 0;
              text-transform: uppercase;
            }
            .PlaygroundEditorTheme__textBold {
              font-weight: bold;
            }
            .PlaygroundEditorTheme__textItalic {
              font-style: italic;
            }
            .PlaygroundEditorTheme__textUnderline {
              text-decoration: underline;
            }
            .PlaygroundEditorTheme__textStrikethrough {
              text-decoration: line-through;
            }
            .PlaygroundEditorTheme__textCode {
              background-color: rgb(240, 242, 245);
              padding: 1px 0.25rem;
              font-family: Menlo, Consolas, Monaco, monospace;
              font-size: 94%;
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