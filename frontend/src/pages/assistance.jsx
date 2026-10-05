import React, { useState } from 'react';
import Chat from '../components/chat';
import ConfigPanel from '../components/configpanel';
import EvidenceCard from '../components/evidencecard';
import RiskCard from '../components/riskcard';

export default function Assistance() {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Hello! I am IPsec Guardian, an evidence-grounded cybersecurity assistant. Select or adjust your IPsec parameters, enter your network traffic, and ask any security question.' 
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    ike_version: 'IKEv2',
    encryption: 'AES-256-GCM',
    integrity: 'SHA-256',
    authentication: 'Certificate',
    dh_group: 'Strong group',
    pfs: 'Enabled',
    ipsec_mode: 'Tunnel',
    esp: 'Enabled',
    nat_t: 'Enabled',
    replay_protection: 'Enabled',
    key_lifetime: 'Limited'
  });
  
  const [currentEvidence, setCurrentEvidence] = useState([]);
  const [currentAssessment, setCurrentAssessment] = useState(null);

  const handleSendMessage = async (text) => {
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const response = await fetch('/api/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text,
          traffic: {
            source_port: 50000,
            destination_port: 443,
            protocol: 6,
            duration: 2,
            packet_count: 50,
            bytes_sent: 5000,
            bytes_received: 7000,
            bytes_per_packet: 150
          },
          configuration: config
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.final_response || data.assessment?.assessment || 'Security assessment completed.',
        assessment: data.assessment
      }]);
      
      if (data.rag?.evidence) {
        setCurrentEvidence(data.rag.evidence);
      }
      
      if (data.assessment) {
        setCurrentAssessment(data.assessment);
      }
      
    } catch (error) {
      console.error("Failed to fetch assessment:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: Unable to connect to IPsec Guardian API (${error.message}). Please ensure backend is running on http://localhost:8000.` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      <div className="lg:col-span-2 flex flex-col h-full">
        <Chat messages={messages} onSendMessage={handleSendMessage} loading={loading} />
      </div>
      <div className="flex flex-col gap-6 h-full overflow-y-auto pr-2">
        <ConfigPanel config={config} setConfig={setConfig} />
        <RiskCard assessment={currentAssessment} />
        <div className="flex-1 min-h-[300px]">
          <EvidenceCard evidence={currentEvidence} />
        </div>
      </div>
    </div>
  );
}
