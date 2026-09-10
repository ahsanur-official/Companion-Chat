import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ChatMessage, Companion, UserAccount } from '../types';

export interface DateGroupedMessages {
  dateKey: string; // YYYY-MM-DD
  formattedDate: string; // e.g. "৯ সেপ্টেম্বর, ২০২৬"
  messages: ChatMessage[];
}

/**
 * Convert any standard digits in a string to Bengali numerals
 */
export function toBengaliNumber(str: string | number): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(str).replace(/\d/g, (d) => bengaliDigits[parseInt(d, 10)]);
}

/**
 * Format YYYY-MM-DD to Bengali verbal date (e.g. "৯ সেপ্টেম্বর, ২০২৬")
 */
export function formatBengaliDate(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;

    const year = parts[0];
    const monthIdx = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    const bengaliMonths = [
      'জানুয়ারি',
      'ফেব্রুয়ারি',
      'মার্চ',
      'এপ্রিল',
      'মে',
      'জুন',
      'জুলাই',
      'আগস্ট',
      'সেপ্টেম্বর',
      'অক্টোবর',
      'নভেম্বর',
      'ডিসেম্বর',
    ];

    const monthName = bengaliMonths[monthIdx] || parts[1];
    return `${toBengaliNumber(day)} ${monthName}, ${toBengaliNumber(year)}`;
  } catch {
    return dateStr;
  }
}

/**
 * Group messages chronologically by Date
 */
export function groupMessagesByDate(
  messages: ChatMessage[],
  sessionUpdatedAt?: string
): DateGroupedMessages[] {
  const today = new Date().toISOString().split('T')[0];
  const groupsMap = new Map<string, ChatMessage[]>();

  for (const msg of messages) {
    // Determine date for message
    let dateKey = msg.date;
    if (!dateKey && msg.createdAt) {
      dateKey = new Date(msg.createdAt).toISOString().split('T')[0];
    }
    if (!dateKey) {
      dateKey = today;
    }

    if (!groupsMap.has(dateKey)) {
      groupsMap.set(dateKey, []);
    }
    groupsMap.get(dateKey)!.push(msg);
  }

  // Sort groups chronologically
  const sortedDateKeys = Array.from(groupsMap.keys()).sort();
  return sortedDateKeys.map((key) => ({
    dateKey: key,
    formattedDate: formatBengaliDate(key),
    messages: groupsMap.get(key)!,
  }));
}

/**
 * High-resolution multi-page PDF generation
 */
export async function exportElementToPdf(
  element: HTMLElement,
  filename: string = 'moner-sathi-chat-history.pdf',
  onProgress?: (status: string) => void
): Promise<void> {
  onProgress?.('পিডিএফ তৈরি হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...');

  // Render element to high-res canvas (scale 2 ensures crystal-clear text)
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: 1000,
  });

  onProgress?.('পৃষ্ঠা বিন্যাস করা হচ্ছে...');

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210; // A4 standard width in mm
  const pageHeight = 297; // A4 standard height in mm
  const imgHeight = (canvas.height * pageWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  // Add first page
  pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, imgHeight, undefined, 'FAST');
  heightLeft -= pageHeight;

  // Add subsequent pages if content overflows A4 height
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;
  }

  onProgress?.('ডাউনলোড সম্পন্ন হচ্ছে...');
  pdf.save(filename);
}
