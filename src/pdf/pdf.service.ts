import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer-core';

@Injectable()
export class PdfService {
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
            /* Syntax highlighting colors */
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
              .excalidraw-button {
                border: 0;
                padding: 0;
                margin: 0;
                background-color: transparent;
              }

              .excalidraw-button.selected {
                outline: 2px solid rgb(60, 132, 244);
                user-select: none;
              }
              .PlaygroundEditorTheme__listItemChecked,
              .PlaygroundEditorTheme__listItemUnchecked {
                position: relative;
                margin-left: 8px;
                margin-right: 8px;
                padding-left: 24px;
                padding-right: 24px;
                list-style-type: none;
                outline: none;
              }
              .PlaygroundEditorTheme__listItemChecked {
                text-decoration: line-through;
              }
              .PlaygroundEditorTheme__listItemUnchecked:before,
              .PlaygroundEditorTheme__listItemChecked:before {
                content: '';
                width: 16px;
                height: 16px;
                top: 2px;
                left: 0;
                cursor: pointer;
                display: block;
                background-size: cover;
                position: absolute;
              }
              .PlaygroundEditorTheme__listItemUnchecked[dir='rtl']:before,
              .PlaygroundEditorTheme__listItemChecked[dir='rtl']:before {
                left: auto;
                right: 0;
              }
              .PlaygroundEditorTheme__listItemUnchecked:focus:before,
              .PlaygroundEditorTheme__listItemChecked:focus:before {
                box-shadow: 0 0 0 2px #a6cdfe;
                border-radius: 2px;
              }
              .PlaygroundEditorTheme__listItemUnchecked:before {
                border: 1px solid #999;
                border-radius: 2px;
              }
              .PlaygroundEditorTheme__listItemChecked:before {
                border: 1px solid rgb(61, 135, 245);
                border-radius: 2px;
                background-color: #3d87f5;
                background-repeat: no-repeat;
              }
              .PlaygroundEditorTheme__listItemChecked:after {
                content: '';
                cursor: pointer;
                border-color: #fff;
                border-style: solid;
                position: absolute;
                display: block;
                top: 6px;
                width: 3px;
                left: 7px;
                right: 7px;
                height: 6px;
                transform: rotate(45deg);
                border-width: 0 2px 2px 0;
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