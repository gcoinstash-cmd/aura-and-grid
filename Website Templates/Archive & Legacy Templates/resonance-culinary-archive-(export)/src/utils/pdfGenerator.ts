import { jsPDF } from 'jspdf';
import { CulinaryTemplate } from '../types';

export function generateLookbookPDF(template: CulinaryTemplate) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // PAGE 1: Bespoke Cover Decor
  // Background: Sand #F7F3EE (RGB 247, 243, 238)
  doc.setFillColor(247, 243, 238);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Double Border
  doc.setDrawColor(172, 93, 63); // clay #AC5D3F
  doc.setLineWidth(0.4);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24, 'D');
  doc.rect(13.5, 13.5, pageWidth - 27, pageHeight - 27, 'D');

  // Editorial Accent Lines
  doc.setDrawColor(222, 196, 157); // gold #DEC49D
  doc.setLineWidth(0.2);
  doc.line(20, 30, pageWidth - 20, 30);
  doc.line(20, pageHeight - 30, pageWidth - 20, pageHeight - 30);

  // Logo Brand Block
  doc.setFont('times', 'normal');
  doc.setTextColor(26, 24, 23); // charcoal
  doc.setFontSize(32);
  doc.text('R E S O N A N C E', pageWidth / 2, 70, { align: 'center' });

  // Subheading
  doc.setFont('times', 'italic');
  doc.setFontSize(12);
  doc.setTextColor(172, 93, 63); // clay
  doc.text('An Archival Journal of Culinary Art & Heritage Lineage', pageWidth / 2, 82, { align: 'center' });

  // Mid Divider
  doc.setDrawColor(172, 93, 63);
  doc.setLineWidth(0.8);
  doc.line(pageWidth / 2 - 15, 96, pageWidth / 2 + 15, 96);

  // Featured Archive Heading
  doc.setFont('times', 'normal');
  doc.setFontSize(16);
  doc.setTextColor(26, 24, 23);
  doc.text('Volume III • The Lookbook Archive', pageWidth / 2, 114, { align: 'center' });

  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(172, 93, 63); // clay
  // Capitalize chapter name
  doc.text(template.title.toUpperCase(), pageWidth / 2, 125, { align: 'center' });

  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(120, 110, 100);
  doc.text(template.tagline, pageWidth / 2, 133, { align: 'center' });

  // Descriptive Narrative Block
  doc.setFont('times', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(40, 38, 36);
  const narrativeLines = doc.splitTextToSize(template.narrative, pageWidth - 56);
  
  // Render central narrative lines nicely with margin
  let narrativeY = 152;
  narrativeLines.forEach((line: string) => {
    doc.text(line, pageWidth / 2, narrativeY, { align: 'center' });
    narrativeY += 5.5;
  });

  // Gilded Quote Box
  const quoteY = pageHeight - 75;
  doc.setFillColor(252, 250, 247);
  doc.rect(20, quoteY, pageWidth - 40, 26, 'F');
  
  // Quote line borders
  doc.setDrawColor(222, 196, 157); // gold
  doc.setLineWidth(0.3);
  doc.line(20, quoteY, pageWidth - 20, quoteY);
  doc.line(20, quoteY + 26, pageWidth - 20, quoteY + 26);

  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(26, 24, 23);
  const quoteText = `"${template.curatorQuote}"`;
  const quoteLines = doc.splitTextToSize(quoteText, pageWidth - 50);
  let qY = quoteY + 7;
  quoteLines.forEach((line: string) => {
    doc.text(line, pageWidth / 2, qY, { align: 'center' });
    qY += 5;
  });

  doc.setFont('times', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(172, 93, 63); // clay
  doc.text(`— ${template.curatorName}`, pageWidth / 2, quoteY + 21, { align: 'center' });

  // Base Registry info
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('EST. BEAUFORT COAST • HARLEM HIGHLANDS • ALL SOULS PRESERVED', pageWidth / 2, pageHeight - 18, { align: 'center' });


  // PAGE 2: The Culinary Liturgy
  doc.addPage();
  doc.setFillColor(247, 243, 238);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Page 2 Border
  doc.setDrawColor(172, 93, 63);
  doc.setLineWidth(0.4);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24, 'D');

  // Liturgy Banner
  doc.setFont('times', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(172, 93, 63);
  doc.text('THE CULINARY LITURGY', pageWidth / 2, 24, { align: 'center' });
  doc.setDrawColor(222, 196, 157);
  doc.setLineWidth(0.4);
  doc.line(30, 27, pageWidth - 30, 27);

  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(26, 24, 23);
  doc.text(template.title.toUpperCase(), pageWidth / 2, 38, { align: 'center' });

  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(110, 100, 90);
  doc.text('A Trilogy of Sensory Remembrance', pageWidth / 2, 44, { align: 'center' });

  // Render course rows
  let startY = 58;

  template.menu.forEach((item, index) => {
    // Divider before items 1 and 2
    if (index > 0) {
      doc.setDrawColor(172, 93, 63, 100); // clay with light representation
      doc.setDrawColor(222, 196, 157); // gold
      doc.setLineWidth(0.15);
      doc.line(20, startY - 6, pageWidth - 20, startY - 6);
    }

    // Index & course name
    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(172, 93, 63); // clay
    doc.text(`0${index + 1}  /  ${item.course.toUpperCase()}`, 20, startY);

    // Title
    doc.setFont('times', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(26, 24, 23);
    doc.text(item.title, 20, startY + 5.5);

    // Sensory Description
    doc.setFont('times', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(70, 68, 66);
    const descLines = doc.splitTextToSize(item.sensoryDescription, pageWidth - 40);
    let descY = startY + 11;
    descLines.forEach((line: string) => {
      doc.text(line, 20, descY);
      descY += 4.5;
    });

    // Provenance Notes box
    const notesY = descY + 2.5;
    const notesText = `The Provenance: ${item.heritageNotes}`;
    const notesLines = doc.splitTextToSize(notesText, pageWidth - 48);

    // Render sand backdrop for notes
    doc.setFillColor(252, 250, 247);
    const boxHeight = notesLines.length * 4.5 + 4;
    doc.rect(20, notesY - 3, pageWidth - 40, boxHeight, 'F');

    // Left accent bar
    doc.setDrawColor(172, 93, 63); // clay
    doc.setLineWidth(0.4);
    doc.line(20, notesY - 3, 20, notesY - 3 + boxHeight);

    // Text inside box
    doc.setFont('times', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(120, 95, 80);
    
    let noteTextY = notesY + 1;
    notesLines.forEach((line: string) => {
      doc.text(line, 23, noteTextY);
      noteTextY += 4.5;
    });

    // set next position
    startY = noteTextY + 9;
  });

  // Footer page 2
  doc.setFont('times', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('Printed from the digital archives of Resonance Journal.', pageWidth / 2, pageHeight - 18, { align: 'center' });

  // Save lookbook file
  doc.save(`resonance-lookbook-${template.id}.pdf`);
}
