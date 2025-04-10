import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}
  
  @Post('generate-from-html-with-options')
  async generatePdfFromHtmlWithOptions(
    @Body() body: {
      html: string;
      options?: {
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
      };
    },
    @Res() res: Response,
  ) {
    try {
      const pdfBuffer = await this.pdfService.generatePdfFromHtmlWithOptions(
        body.html,
        body.options,
      );
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=generated.pdf');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      
      return res.status(HttpStatus.OK).send(pdfBuffer);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error generating PDF from HTML',
        error: error.message,
      });
    }
  }
} 