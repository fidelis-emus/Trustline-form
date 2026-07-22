import React, { useState } from 'react';
import { useKYC } from '../../context/KYCContext';
import { FieldType, FormField, FormSection } from '../../types/kyc';
import { 
  Sliders, 
  Plus, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff, 
  CheckSquare, 
  MoveUp, 
  MoveDown, 
  Edit, 
  Sparkles, 
  Type, 
  Hash, 
  FileText, 
  Calendar, 
  Check, 
  Settings,
  Layers
} from 'lucide-react';

export const CMSFormBuilder: React.FC = () => {
  const { 
    sections, 
    fields, 
    addSection, 
    updateSection, 
    deleteSection, 
    addField, 
    updateField, 
    deleteField, 
    duplicateField, 
    themeMode 
  } = useKYC();

  const isDark = themeMode === 'dark';

  // State for Add/Edit Section Modal
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [newSecTitle, setNewSecTitle] = useState('');
  const [newSecDesc, setNewSecDesc] = useState('');

  // State for Add/Edit Field Modal
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [targetSectionId, setTargetSectionId] = useState<string>(sections[0]?.id || '');
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldType, setFieldType] = useState<FieldType>('Text');
  const [fieldPlaceholder, setFieldPlaceholder] = useState('');
  const [fieldHelpText, setFieldHelpText] = useState('');
  const [fieldMandatory, setFieldMandatory] = useState(true);
  const [fieldOptions, setFieldOptions] = useState('Option 1, Option 2, Option 3');

  const supportedTypes: FieldType[] = [
    'Text',
    'Textarea',
    'Number',
    'Currency',
    'Email',
    'Phone',
    'Date',
    'Dropdown',
    'Radio Button',
    'Checkbox',
    'Multi Select',
    'Upload',
    'Signature',
    'Passport Upload',
    'File Upload',
    'Image Upload',
    'Yes/No',
    'Country',
    'State',
    'City',
    'Address',
    'Relationship',
    'Bank',
    'Custom Lookup',
    'Auto Complete'
  ];

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSecTitle.trim()) return;
    addSection({
      title: newSecTitle,
      description: newSecDesc,
      order: sections.length + 1
    });
    setNewSecTitle('');
    setNewSecDesc('');
    setShowSectionModal(false);
  };

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldLabel.trim()) return;

    const opts = fieldOptions.split(',').map(s => s.trim()).filter(Boolean);

    addField({
      sectionId: targetSectionId,
      label: fieldLabel,
      type: fieldType,
      placeholder: fieldPlaceholder,
      helpText: fieldHelpText,
      mandatory: fieldMandatory,
      hidden: false,
      options: opts.length > 0 ? opts : undefined,
      order: fields.filter(f => f.sectionId === targetSectionId).length + 1
    });

    setFieldLabel('');
    setFieldPlaceholder('');
    setFieldHelpText('');
    setShowFieldModal(false);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Banner */}
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4" />
            <span>100% Configurable CMS Engine</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            Dynamic KYC Form Builder & Schema Manager
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Admins can add, edit, reorder, duplicate, or hide fields and sections without touching code. All changes update public forms instantly.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowSectionModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center space-x-1.5"
          >
            <Layers className="w-4 h-4" />
            <span>Add Section</span>
          </button>
          <button
            onClick={() => {
              setTargetSectionId(sections[0]?.id || '');
              setShowFieldModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-md shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Field</span>
          </button>
        </div>
      </div>

      {/* Sections and Fields List */}
      <div className="space-y-6">
        {sections.sort((a,b) => a.order - b.order).map(sec => {
          const secFields = fields.filter(f => f.sectionId === sec.id).sort((a,b) => a.order - b.order);

          return (
            <div 
              key={sec.id} 
              className={`p-6 rounded-2xl border space-y-4 shadow-md ${
                isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              {/* Section Header */}
              <div className="flex items-center justify-between border-b pb-3 border-slate-800/80">
                <div>
                  <h2 className="text-base font-bold text-emerald-400">
                    {sec.title}
                  </h2>
                  {sec.description && (
                    <p className="text-xs text-slate-400">{sec.description}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setTargetSectionId(sec.id);
                      setShowFieldModal(true);
                    }}
                    className="px-3 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 text-xs font-semibold transition-colors flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Field Here</span>
                  </button>
                  <button
                    onClick={() => deleteSection(sec.id)}
                    className="p-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                    title="Delete Section"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Fields List inside Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {secFields.map(field => (
                  <div 
                    key={field.id} 
                    className={`p-3.5 rounded-xl border space-y-2 relative transition-all ${
                      field.hidden
                        ? 'opacity-50 border-dashed border-slate-700 bg-slate-950/20'
                        : isDark
                          ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-xs text-slate-200 flex items-center space-x-1.5">
                          <span>{field.label}</span>
                          {field.mandatory && <span className="text-red-400 font-bold">*</span>}
                        </div>
                        <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 inline-block mt-1">
                          Type: {field.type}
                        </span>
                      </div>

                      {/* Field Action Buttons */}
                      <div className="flex items-center space-x-1">
                        
                        {/* Hide / Show Toggle */}
                        <button
                          onClick={() => updateField(field.id, { hidden: !field.hidden })}
                          className={`p-1 rounded ${
                            field.hidden ? 'text-amber-400 hover:bg-amber-500/20' : 'text-slate-400 hover:text-slate-200'
                          }`}
                          title={field.hidden ? 'Unhide Field' : 'Hide Field'}
                        >
                          {field.hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>

                        {/* Mandatory Toggle */}
                        <button
                          onClick={() => updateField(field.id, { mandatory: !field.mandatory })}
                          className={`p-1 rounded ${
                            field.mandatory ? 'text-emerald-400' : 'text-slate-600 hover:text-slate-400'
                          }`}
                          title={field.mandatory ? 'Mark Optional' : 'Mark Mandatory'}
                        >
                          <CheckSquare className="w-3.5 h-3.5" />
                        </button>

                        {/* Duplicate */}
                        <button
                          onClick={() => duplicateField(field.id)}
                          className="p-1 text-slate-400 hover:text-slate-200 rounded"
                          title="Duplicate Field"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => deleteField(field.id)}
                          className="p-1 text-red-400 hover:text-red-300 rounded"
                          title="Delete Field"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </div>

                    {field.helpText && (
                      <p className="text-[10px] text-slate-500 leading-tight">{field.helpText}</p>
                    )}
                  </div>
                ))}

                {secFields.length === 0 && (
                  <div className="col-span-full py-4 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                    No fields in this section yet. Click "Add Field Here" above to add input controls.
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Section Modal */}
      {showSectionModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl border space-y-4 shadow-2xl ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <h3 className="font-bold text-base text-emerald-400">Create New Form Section</h3>
            <form onSubmit={handleAddSection} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Section Title</label>
                <input
                  type="text"
                  required
                  value={newSecTitle}
                  onChange={(e) => setNewSecTitle(e.target.value)}
                  placeholder="e.g. 9. Corporate Tax Residency Declarations"
                  className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={newSecDesc}
                  onChange={(e) => setNewSecDesc(e.target.value)}
                  placeholder="Short explanatory tagline..."
                  className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSectionModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                >
                  Save Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Field Modal */}
      {showFieldModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-2xl border space-y-4 shadow-2xl ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <h3 className="font-bold text-base text-emerald-400">Add Field to Form Schema</h3>
            <form onSubmit={handleAddField} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-300 mb-1">Target Section</label>
                <select
                  value={targetSectionId}
                  onChange={(e) => setTargetSectionId(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                  }`}
                >
                  {sections.map(s => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Field Label</label>
                  <input
                    type="text"
                    required
                    value={fieldLabel}
                    onChange={(e) => setFieldLabel(e.target.value)}
                    placeholder="e.g. Tax Residency Country"
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Supported Field Type</label>
                  <select
                    value={fieldType}
                    onChange={(e) => setFieldType(e.target.value as FieldType)}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    {supportedTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {(fieldType === 'Dropdown' || fieldType === 'Radio Button' || fieldType === 'Checkbox' || fieldType === 'Multi Select') && (
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Comma-Separated Options</label>
                  <input
                    type="text"
                    value={fieldOptions}
                    onChange={(e) => setFieldOptions(e.target.value)}
                    placeholder="Option A, Option B, Option C"
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-300 mb-1">Placeholder & Help Text</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={fieldPlaceholder}
                    onChange={(e) => setFieldPlaceholder(e.target.value)}
                    placeholder="Input placeholder..."
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                  <input
                    type="text"
                    value={fieldHelpText}
                    onChange={(e) => setFieldHelpText(e.target.value)}
                    placeholder="Sub-label help tip..."
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="mandatory-chk"
                  checked={fieldMandatory}
                  onChange={(e) => setFieldMandatory(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="mandatory-chk" className="font-bold text-slate-200 cursor-pointer">
                  Make this Field Mandatory (Required)
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowFieldModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                >
                  Save Field
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
