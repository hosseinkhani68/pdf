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


.sticky-note-container {
  position: absolute;
  z-index: 9;
  width: 120px;
  display: inline-block;
}

.sticky-note {
  line-height: 1;
  text-align: left;
  width: 120px;
  margin: 25px;
  padding: 20px 10px;
  position: relative;
  border: 1px solid #e8e8e8;
  font-family: 'Reenie Beanie';
  font-size: 24px;
  border-bottom-right-radius: 60px 5px;
  display: block;
  cursor: move;
}

.sticky-note:after {
  content: '';
  position: absolute;
  z-index: -1;
  right: -0px;
  bottom: 20px;
  width: 120px;
  height: 25px;
  background: rgba(0, 0, 0, 0.2);
  box-shadow: 2px 15px 5px rgba(0, 0, 0, 0.4);
  transform: matrix(-1, -0.1, 0, 1, 0, 0);
}

.sticky-note.yellow {
  border-top: 1px solid #fdfd86;
  background: linear-gradient(
    135deg,
    #ffff88 81%,
    #ffff88 82%,
    #ffff88 82%,
    #ffffc6 100%
  );
}

.sticky-note.pink {
  border-top: 1px solid #e7d1e4;
  background: linear-gradient(
    135deg,
    #f7cbe8 81%,
    #f7cbe8 82%,
    #f7cbe8 82%,
    #e7bfe1 100%
  );
}

.sticky-note-container.dragging {
  transition: none !important;
}

.sticky-note div {
  cursor: text;
}

.sticky-note .delete {
  border: 0;
  background: none;
  position: absolute;
  top: 8px;
  right: 10px;
  font-size: 10px;
  cursor: pointer;
  opacity: 0.5;
}

.sticky-note .delete:hover {
  font-weight: bold;
  opacity: 1;
}

.sticky-note .color {
  border: 0;
  background: none;
  position: absolute;
  top: 8px;
  right: 25px;
  cursor: pointer;
  opacity: 0.5;
}

.sticky-note .color:hover {
  opacity: 1;
}

.sticky-note .color i {
  display: block;
  width: 12px;
  height: 12px;
  background-size: contain;
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