import { PDFDocument } from 'pdf-lib'
import html2canvas from 'html2canvas'

/**
 * Export a list of page elements to a high-quality PDF file.
 * - Scales pages for better resolution
 * - Preserves editor pagination
 * - Produces print-ready PDFs
 */
export async function exportPdf(pages: HTMLElement[]) {
  const pdfDoc = await PDFDocument.create()
  const scaleFactor = 2 // Increase for sharper images (2x resolution)

  for (const page of pages) {
    // Capture page as high-res canvas
    const canvas = await html2canvas(page, {
      scale: scaleFactor,
      backgroundColor: '#ffffff',
      useCORS: true,
    })

    // Convert canvas to PNG data
    const pngData = canvas.toDataURL('image/png')
    const pngImage = await pdfDoc.embedPng(pngData)

    // Scale PDF page size based on canvas
    const { width, height } = canvas
    const pdfPage = pdfDoc.addPage([width, height])

    // Draw the image at full size
    pdfPage.drawImage(pngImage, {
      x: 0,
      y: 0,
      width,
      height,
    })
  }

  // Save as Blob
  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)

  // Download PDF
  const link = document.createElement('a')
  link.href = url
  link.download = 'document.pdf'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default exportPdf
