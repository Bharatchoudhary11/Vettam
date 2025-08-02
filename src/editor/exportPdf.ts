import { PDFDocument } from 'pdf-lib'
import html2canvas from 'html2canvas'

/**
 * Export a list of page elements to a PDF file.
 * Each page element is converted to an image and embedded in the PDF
 * preserving the pagination from the editor.
 */
export async function exportPdf(pages: HTMLElement[]) {
  const pdfDoc = await PDFDocument.create()

  for (const page of pages) {
    const canvas = await html2canvas(page)
    const pngData = canvas.toDataURL('image/png')
    const pngImage = await pdfDoc.embedPng(pngData)
    const { width, height } = canvas
    const pdfPage = pdfDoc.addPage([width, height])
    pdfPage.drawImage(pngImage, {
      x: 0,
      y: 0,
      width,
      height,
    })
  }

  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'document.pdf'
  link.click()
  URL.revokeObjectURL(url)
}

export default exportPdf
