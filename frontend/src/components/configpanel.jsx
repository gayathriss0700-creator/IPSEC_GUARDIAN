import React from 'react';

export default function ConfigPanel({ config, setConfig }) {
  const handleChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const fields = [
    { key: 'ike_version', label: 'IKE Version', options: ['IKEv1', 'IKEv2'] },
    { key: 'encryption', label: 'Encryption', options: ['AES-256-GCM', 'AES-128-CBC', '3DES', 'DES'] },
    { key: 'integrity', label: 'Integrity', options: ['SHA-256', 'SHA-512', 'SHA-1', 'MD5'] },
    { key: 'authentication', label: 'Authentication', options: ['Certificate', 'Pre-Shared Key', 'EAP'] },
    { key: 'dh_group', label: 'DH Group', options: ['Strong group', 'Group 14', 'Group 2', 'None'] },
    { key: 'pfs', label: 'Perfect Forward Secrecy', options: ['Enabled', 'Disabled'] },
    { key: 'ipsec_mode', label: 'IPsec Mode', options: ['Tunnel', 'Transport'] },
    { key: 'esp', label: 'ESP', options: ['Enabled', 'Disabled'] },
    { key: 'nat_t', label: 'NAT-T', options: ['Enabled', 'Disabled'] },
    { key: 'replay_protection', label: 'Replay Protection', options: ['Enabled', 'Disabled'] },
    { key: 'key_lifetime', label: 'Key Lifetime', options: ['Limited', 'Unlimited'] }
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <h3 className="text-xl font-bold mb-4 text-blue-400 border-b border-gray-700 pb-2 flex items-center justify-between">
        <span>IPsec Configuration</span>
        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded font-normal">Active Profile</span>
      </h3>
      <div className="grid gap-3">
        {fields.map(field => (
          <div key={field.key} className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-300 uppercase tracking-wider">{field.label}</label>
            <select
              className="bg-gray-900 border border-gray-700 rounded-md p-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              value={config[field.key] || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
            >
              {field.options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
