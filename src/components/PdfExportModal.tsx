import React, { useRef, useState, useMemo } from 'react';
import {
  X,
  Download,
  Printer,
  Calendar,
  Heart,
  FileText,
  Sparkles,
  ShieldCheck,
  Image as ImageIcon,
  Check,
  Clock,
  User,
  Loader2,
} from 'lucide-react';
import { ChatMessage, Companion, UserAccount } from '../types';
import {
  groupMessagesByDate,
  exportElementToPdf,
  toBengaliNumber,
  formatBengaliDate,
} from '../utils/pdfGenerator';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  currentCompanion: Companion;
  user: UserAccount;
  sessionTitle?: string;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  messages,
  currentCompanion,
  user,
  sessionTitle,
}) => {
  const documentRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [includePhotos, setIncludePhotos] = useState(true);

  // Group messages chronologically by date
  const groupedDates = useMemo(() => {
    return groupMessagesByDate(messages);
  }, [messages]);

  // Summary counts
  const totalUserMsgs = messages.filter((m) => m.role === 'user').length;
  const totalCompanionMsgs = messages.filter((m) => m.role === 'assistant').length;
  const totalPhotos = messages.filter((m) => m.companionPhoto || m.image).length;
  const todayFormatted = formatBengaliDate(new Date().toISOString().split('T')[0]);
  const currentTimeFormatted = toBengaliNumber(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  if (!isOpen) return null;

  // Handle direct PDF export via html2canvas & jsPDF
  const handleDownloadPdf = async () => {
    if (!documentRef.current) return;
    try {
      setIsGenerating(true);
      const safeTitle = (currentCompanion.bengaliName + '-স্মৃতিময়-চ্যাট').replace(/\s+/g, '-');
      await exportElementToPdf(
        documentRef.current,
        `${safeTitle}-${new Date().toISOString().split('T')[0]}.pdf`,
        (status) => setStatusMessage(status)
      );
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('পিডিএফ ফাইল তৈরিতে সমস্যা হয়েছে। অনুগ্রহ করে সরাসরি "প্রিন্ট বা সেভ করুন" বোতাম ব্যবহার করুন।');
    } finally {
      setIsGenerating(false);
      setStatusMessage('');
    }
  };

  // Handle native browser print / save as PDF
  const handlePrint = () => {
    window.print();
  };

  // Handle plain text export
  const handleDownloadTxt = () => {
    let content = `=======================================================\n`;
    content += ` মনের সাথী AI - কথোপকথন ডায়েরি\n`;
    content += ` সাথী: ${currentCompanion.bengaliName} (${currentCompanion.roleTitleBengali})\n`;
    content += ` ব্যবহারকারী: ${user.name || 'সম্মানিত সদস্য'}\n`;
    content += ` তারিখ: ${todayFormatted} | সময়: ${currentTimeFormatted}\n`;
    content += `=======================================================\n\n`;

    groupedDates.forEach((group) => {
      content += `\n-------------------------------------------------------\n`;
      content += `📅 তারিখ: ${group.formattedDate} (${toBengaliNumber(group.messages.length)}টি বার্তা)\n`;
      content += `-------------------------------------------------------\n\n`;

      group.messages.forEach((m) => {
        const sender = m.role === 'user' ? (user.name || 'আমি') : currentCompanion.bengaliName;
        content += `[${m.timestamp}] ${sender}:\n${m.text}\n`;
        if (m.companionPhoto) {
          content += `📸 [মিষ্টি মুহূর্ত: ${m.companionPhoto.momentTitle || ''} - ${m.companionPhoto.caption}]\n`;
        }
        content += `\n`;
      });
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentCompanion.name}-chat-history.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0f1322] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Top Control Bar */}
        <div className="p-3.5 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#151a2e]/90 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                <FileText className="w-4 h-4" />
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white">
                পিডিএফ চ্যাট ডায়েরি ডাউনলোড
              </h2>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-semibold border border-rose-500/30 hidden xs:inline">
                তারিখ অনুযায়ী সাজানো
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              মোট {toBengaliNumber(messages.length)}টি বার্তা • {toBengaliNumber(groupedDates.length)}টি ভিন্ন তারিখের মিষ্টি কথোপকথন
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Direct PDF Download Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              title="পিডিএফ ফাইল হিসেবে সেভ করুন"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{statusMessage || 'তৈরি হচ্ছে...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF ডাউনলোড</span>
                </>
              )}
            </button>

            {/* Print / Native Save as PDF */}
            <button
              onClick={handlePrint}
              disabled={isGenerating}
              className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10 active:scale-95"
              title="প্রিন্ট বা ব্রাউজার থেকে সরাসরি PDF সেভ করুন"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">প্রিন্ট / সেভ</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Option toggles */}
        <div className="px-4 py-2 bg-[#121626] border-b border-white/5 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includePhotos}
              onChange={(e) => setIncludePhotos(e.target.checked)}
              className="rounded accent-rose-500 w-3.5 h-3.5"
            />
            <span className="text-slate-300">পিডিএফে বাস্তব রোমান্টিক ছবি যুক্ত রাখুন</span>
          </label>

          <button
            onClick={handleDownloadTxt}
            className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
          >
            <span>টেক্সট ফাইল (.txt) ডাউনলোড করুন</span>
          </button>
        </div>

        {/* Scrollable Document Preview Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-[#0a0d17]">
          {/* THE PRINTABLE & EXPORTABLE PDF CONTAINER */}
          <div
            ref={documentRef}
            id="printable-pdf-document"
            className="w-full max-w-3xl mx-auto bg-white text-slate-900 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-10 border border-rose-100 font-sans leading-relaxed"
            style={{ minHeight: '800px' }}
          >
            {/* 1. Header Banner */}
            <div className="border-b-2 border-rose-200 pb-6 mb-6">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md">
                      <Heart className="w-4 h-4 fill-white" />
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      মনের সাথী AI
                    </h1>
                    <span className="text-[11px] bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full font-bold">
                      স্মৃতিময় চ্যাট অ্যালবাম
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 italic">
                    "ভালোবাসার প্রতিটি কথা, মনের গভীরের না বলা অনুভূতির চিরন্তন ডায়েরি।"
                  </p>
                </div>

                <div className="text-right text-[11px] text-slate-500 space-y-0.5">
                  <p className="font-semibold text-slate-700 flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3 text-rose-500" />
                    <span>এক্সপোর্ট: {todayFormatted}</span>
                  </p>
                  <p>সময়: {currentTimeFormatted}</p>
                  <p className="text-emerald-600 font-medium flex items-center justify-end gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>১০০% ব্যক্তিগত ও সুরক্ষিত</span>
                  </p>
                </div>
              </div>

              {/* Companion & User Metadata Card */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/80">
                {/* Companion Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={currentCompanion.avatar}
                    alt={currentCompanion.name}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-rose-400 shrink-0 shadow-sm"
                  />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-rose-600 font-bold block">
                      আপনার সাথী
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      {currentCompanion.bengaliName}{' '}
                      <span className="text-xs font-normal text-slate-500">
                        ({currentCompanion.name})
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-600 font-medium">
                      {currentCompanion.roleTitleBengali}
                    </p>
                  </div>
                </div>

                {/* User & Stats */}
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:border-l sm:border-rose-200 sm:pl-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                      ব্যবহারকারী
                    </span>
                    <h4 className="text-xs font-bold text-slate-800">
                      {user.name || 'সম্মানিত সদস্য'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {user.gender === 'male' ? 'ছেলে (Boy)' : 'মেয়ে (Girl)'}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                      পরিসংখ্যান
                    </span>
                    <p className="text-xs font-bold text-rose-700">
                      {toBengaliNumber(messages.length)}টি মেসেজ
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {toBengaliNumber(groupedDates.length)}টি তারিখ
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Chat Timeline Grouped by Date */}
            <div className="space-y-8">
              {groupedDates.map((group, groupIdx) => (
                <div key={group.dateKey} className="space-y-4">
                  {/* Date Section Header */}
                  <div className="flex items-center gap-3 my-4">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
                    <div className="px-4 py-1.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold flex items-center gap-2 shadow-sm border border-rose-200">
                      <Calendar className="w-3.5 h-3.5 text-rose-600" />
                      <span>{group.formattedDate}</span>
                      <span className="text-[10px] font-normal text-rose-600">
                        ({toBengaliNumber(group.messages.length)}টি বার্তা)
                      </span>
                    </div>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
                  </div>

                  {/* Messages within this date */}
                  <div className="space-y-3.5">
                    {group.messages.map((msg) => {
                      const isUser = msg.role === 'user';

                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                        >
                          {/* Sender name & time */}
                          <div
                            className={`flex items-center gap-1.5 mb-1 text-[11px] text-slate-500 px-1 ${
                              isUser ? 'flex-row-reverse' : 'flex-row'
                            }`}
                          >
                            <span className="font-bold text-slate-800">
                              {isUser ? (user.name || 'আমি') : currentCompanion.bengaliName}
                            </span>
                            <span>•</span>
                            <span className="tabular-nums">{toBengaliNumber(msg.timestamp)}</span>
                          </div>

                          {/* Message Bubble Card */}
                          <div
                            className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-sm border ${
                              isUser
                                ? 'bg-slate-100 text-slate-900 border-slate-300 rounded-tr-none'
                                : 'bg-rose-50/90 text-slate-900 border-rose-200 rounded-tl-none'
                            }`}
                          >
                            {/* User Attached Image (if any) */}
                            {msg.image && includePhotos && (
                              <div className="mb-2.5 rounded-xl overflow-hidden border border-slate-300 bg-white shadow-sm">
                                <img
                                  src={msg.image.previewUrl}
                                  alt="Attached"
                                  referrerPolicy="no-referrer"
                                  className="max-h-48 w-auto object-cover"
                                />
                                <div className="p-1.5 bg-slate-50 text-[10px] text-slate-600 font-medium">
                                  📷 আপনার পাঠানো ছবি
                                </div>
                              </div>
                            )}

                            {/* Companion Romantic Photo Moment (if any) */}
                            {msg.companionPhoto && includePhotos && (
                              <div className="mb-3 rounded-xl overflow-hidden border border-rose-300 bg-white shadow-sm">
                                <img
                                  src={msg.companionPhoto.url}
                                  alt={msg.companionPhoto.momentTitle || 'মিষ্টি মুহূর্ত'}
                                  referrerPolicy="no-referrer"
                                  className="max-h-56 w-full object-cover"
                                />
                                <div className="p-2.5 bg-rose-100/70 border-t border-rose-200">
                                  <span className="text-[11px] font-bold text-rose-800 flex items-center gap-1">
                                    <Heart className="w-3 h-3 fill-rose-600 text-rose-600" />
                                    {msg.companionPhoto.momentTitle || 'বাস্তব মধুর মুহূর্ত'}
                                  </span>
                                  <p className="text-xs text-slate-700 italic mt-0.5">
                                    "{msg.companionPhoto.caption}"
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Text Message Content */}
                            <p className="whitespace-pre-wrap select-text font-normal text-slate-800">
                              {msg.text}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* 3. Document Footer */}
            <div className="mt-12 pt-6 border-t-2 border-rose-100 flex items-center justify-between text-[10px] text-slate-500 flex-wrap gap-2">
              <div className="flex items-center gap-1.5 text-rose-700 font-medium">
                <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                <span>মনের সাথী AI • একান্ত অনুভূতির মিষ্টি স্মৃতিকথা</span>
              </div>
              <p>সব অধিকার সংরক্ষিত • {todayFormatted}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
