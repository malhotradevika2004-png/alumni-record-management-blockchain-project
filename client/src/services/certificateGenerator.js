import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Downloads a high-resolution PDF certificate from an HTML element
 * @param {string} elementId - DOM id of the certificate container
 * @param {string} certificateId - Unique Certificate ID
 * @param {string} studentName - Student's name for filename
 */
export const exportCertificatePDF = async (elementId, certificateId, studentName = 'Alumnus') => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Certificate element #${elementId} not found`);
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution (retina crispness)
      useCORS: true,
      logging: false,
      backgroundColor: '#0f172a',
    });

    const imgData = canvas.toDataURL('image/png');
    // Landscape A4 dimensions: 297mm x 210mm
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    const cleanName = studentName.replace(/\s+/g, '_');
    pdf.save(`${certificateId}_${cleanName}_Certificate.pdf`);
    return true;
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    throw error;
  }
};

