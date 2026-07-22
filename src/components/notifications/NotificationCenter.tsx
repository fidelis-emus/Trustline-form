import React from 'react';
import { useKYC } from '../../context/KYCContext';
import { Mail, CheckCircle2, Send, AlertTriangle } from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const { clients, themeMode } = useKYC();
  const isDark = themeMode === 'dark';

  // Generate notification logs based on workflow history
  const notificationLogs = clients.flatMap(c => 
    c.workflowHistory.map(h => ({
      id: `${c.id}-${h.id}`,
      recipient: c.email,
      clientName: `${c.firstName} ${c.lastName}`,
      clientNumber: c.clientNumber,
      subject: `Power Automate: KYC Application Status Update - ${h.toStatus}`,
      body: `Dear ${c.firstName}, your KYC enrollment status (Ref: ${c.clientNumber}) has been updated to "${h.toStatus}". Comment: "${h.comments}".`,
      timestamp: h.timestamp,
      status: 'DELIVERED',
      channel: 'Microsoft Exchange Online / Outlook'
    }))
  );

  return (
    <div className="space-y-6 pb-16">
      
      {/* Banner */}
      <div className={`p-6 rounded-2xl border flex items-center justify-between gap-4 shadow-lg ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Mail className="w-4 h-4" />
            <span>Power Automate & Exchange Online Messaging Engine</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            Automated Customer Notification & Email Outbox
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated emails sent to clients and account officers upon workflow status transitions, document requests, and final approvals.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          Exchange Online Sync Active
        </span>
      </div>

      <div className="space-y-4">
        {notificationLogs.map(log => (
          <div key={log.id} className={`p-5 rounded-2xl border space-y-2 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between border-b pb-2 border-slate-800 text-xs">
              <div className="flex items-center space-x-2">
                <Send className="w-4 h-4 text-emerald-400" />
                <strong className="text-slate-200">{log.subject}</strong>
              </div>
              <span className="font-mono text-slate-500">{log.timestamp}</span>
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <p><span className="text-slate-500">Recipient:</span> <strong className="text-emerald-400">{log.clientName}</strong> ({log.recipient})</p>
              <p className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300 italic">
                "{log.body}"
              </p>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
              <span>Channel: {log.channel}</span>
              <span className="text-emerald-400 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Delivered via Power Automate</span>
              </span>
            </div>
          </div>
        ))}

        {notificationLogs.length === 0 && (
          <div className="p-12 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-2xl">
            No notification logs dispatched yet.
          </div>
        )}
      </div>

    </div>
  );
};
