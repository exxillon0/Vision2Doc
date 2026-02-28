import {Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType} from 'docx';
import {saveAs} from 'file-saver';

export async function exportToDocx(text: string, filename: string = 'extracted-text.docx') {
  const lines = text.split('\n');
  const children: Paragraph[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    let heading: any = undefined;
    let bullet: any = undefined;
    let content = trimmedLine;

    // Handle Headings
    if (trimmedLine.startsWith('# ')) {
      heading = HeadingLevel.HEADING_1;
      content = trimmedLine.substring(2);
    } else if (trimmedLine.startsWith('## ')) {
      heading = HeadingLevel.HEADING_2;
      content = trimmedLine.substring(3);
    } else if (trimmedLine.startsWith('### ')) {
      heading = HeadingLevel.HEADING_3;
      content = trimmedLine.substring(4);
    }
    // Handle Bullet Lists
    else if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
      bullet = {level: 0};
      content = trimmedLine.substring(2);
    }
    // Handle Numbered Lists
    else if (/^\d+\.\s/.test(trimmedLine)) {
      const match = trimmedLine.match(/^(\d+)\.\s/);
      if (match) {
        // docx doesn't have a simple "numbered" property like bullet, 
        // but we can simulate it or just keep the number in the text
        // For simplicity, we'll keep the number in the text but maybe add some indentation
      }
    }

    // Parse Bold Text (**text**)
    const parts = content.split(/(\*\*.*?\*\*)/g);
    const textRuns = parts.map((part) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return new TextRun({
          text: part.slice(2, -2),
          bold: true,
        });
      }
      return new TextRun({
        text: part,
      });
    });

    children.push(
      new Paragraph({
        children: textRuns,
        heading: heading,
        bullet: bullet,
        spacing: {
          before: heading ? 400 : 200,
          after: 200,
        },
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}
