import React from 'react';
import { Plus, Trash2, Award, Calendar, ExternalLink } from 'lucide-react';

export default function CertificationForm({ certifications = [], onChange }) {
    const addCertification = () => {
        onChange([
            ...certifications,
            {
                id: Date.now().toString(),
                name: '',
                issuer: '',
                issueDate: '',
                expiryDate: '',
                credentialId: '',
                credentialUrl: '',
            }
        ]);
    };

    const updateCertification = (id, field, value) => {
        onChange(certifications.map(cert =>
            cert.id === id ? { ...cert, [field]: value } : cert
        ));
    };

    const removeCertification = (id) => {
        onChange(certifications.filter(cert => cert.id !== id));
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Certifications</h2>
                    <p className="text-gray-500">Add your professional certifications and licenses</p>
                </div>
                <button
                    onClick={addCertification}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                >
                    <Plus className="w-4 h-4" /> Add Certification
                </button>
            </div>

            {certifications.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                    <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No certifications added yet</p>
                    <button
                        onClick={addCertification}
                        className="mt-4 text-blue-600 font-medium hover:text-blue-700"
                    >
                        Add your first certification
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {certifications.map((cert, index) => (
                        <div key={cert.id} className="relative bg-gray-50 rounded-2xl p-6 border border-gray-100 group">
                            <div className="absolute top-4 right-4 flex items-center gap-2">
                                <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-full">
                                    #{index + 1}
                                </span>
                                <button
                                    onClick={() => removeCertification(cert.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Certification Name */}
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Certification Name *</label>
                                    <input
                                        type="text"
                                        value={cert.name}
                                        onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                                        placeholder="e.g., AWS Solutions Architect - Professional"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    />
                                </div>

                                {/* Issuing Organization */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Issuing Organization *</label>
                                    <input
                                        type="text"
                                        value={cert.issuer}
                                        onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                                        placeholder="e.g., Amazon Web Services"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    />
                                </div>

                                {/* Credential ID */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Credential ID</label>
                                    <input
                                        type="text"
                                        value={cert.credentialId || ''}
                                        onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                                        placeholder="e.g., ABC123XYZ"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    />
                                </div>

                                {/* Issue Date */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Issue Date</label>
                                    <input
                                        type="month"
                                        value={cert.issueDate || ''}
                                        onChange={(e) => updateCertification(cert.id, 'issueDate', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    />
                                </div>

                                {/* Expiry Date */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Expiry Date (if applicable)</label>
                                    <input
                                        type="month"
                                        value={cert.expiryDate || ''}
                                        onChange={(e) => updateCertification(cert.id, 'expiryDate', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    />
                                </div>

                                {/* Credential URL */}
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Credential URL</label>
                                    <div className="relative">
                                        <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="url"
                                            value={cert.credentialUrl || ''}
                                            onChange={(e) => updateCertification(cert.id, 'credentialUrl', e.target.value)}
                                            placeholder="https://..."
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
