"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconActivity, IconLungs, IconThermometer, IconDroplet, IconAlertTriangle, IconCheck, IconInfoCircle } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

// Types
type VitalStatus = "normal" | "warning" | "critical";

interface VitalData {
  value: string | number;
  unit: string;
  status: VitalStatus;
  range: string;
  label: string;
  icon: React.ReactNode;
}

const mockVitals: Record<string, VitalData> = {
  heartRate: {
    label: "Heart Rate",
    value: 110,
    unit: "bpm",
    status: "critical",
    range: "60-100 bpm",
    icon: <IconActivity className="w-6 h-6" />,
  },
  bloodPressure: {
    label: "Blood Pressure",
    value: "160/95",
    unit: "mmHg",
    status: "critical",
    range: "90/60 - 120/80 mmHg",
    icon: <IconDroplet className="w-6 h-6" />,
  },
  spO2: {
    label: "SpO₂",
    value: 92,
    unit: "%",
    status: "warning",
    range: "> 95%",
    icon: <IconLungs className="w-6 h-6" />,
  },
  temperature: {
    label: "Body Temp",
    value: 38.2,
    unit: "°C",
    status: "warning",
    range: "36.5 - 37.5 °C",
    icon: <IconThermometer className="w-6 h-6" />,
  },
  respiratoryRate: {
    label: "Resp. Rate",
    value: 26,
    unit: "/min",
    status: "critical",
    range: "12 - 20 /min",
    icon: <IconLungs className="w-6 h-6" />,
  },
};

export default function Agent2Dashboard() {
  const [isDoctorView, setIsDoctorView] = useState(true);
  const [selectedVital, setSelectedVital] = useState<string | null>(null);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const getStatusColor = (status: VitalStatus) => {
    switch (status) {
      case "normal":
        return "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400";
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-400";
      case "critical":
        return "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400";
      default:
        return "bg-slate-100 border-slate-200";
    }
  };

  const getStatusIndicator = (status: VitalStatus) => {
    switch (status) {
        case "normal": return "bg-green-500";
        case "warning": return "bg-yellow-500";
        case "critical": return "bg-red-500 animate-pulse";
    }
  }

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-neutral-50 dark:bg-neutral-900 p-6 space-y-8">
      
      {/* HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-start"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-neutral-900 dark:text-neutral-100">
            <span className="text-4xl">🫀</span> Agent 2 — Patient Vitals & Clinical Analysis
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-2">
            <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">CDS AI</span>
            🚑 Medical-grade Clinical Decision Support (Non-Diagnostic)
          </p>
        </div>
        
        <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Simplified</label>
            <button 
                onClick={() => setIsDoctorView(!isDoctorView)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDoctorView ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDoctorView ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <label className="text-sm font-medium text-neutral-900 dark:text-neutral-200">Doctor View</label>
        </div>
      </motion.div>

      {/* VITALS GRID */}
      <AnimatePresence mode="wait">
      <motion.div 
        key={isDoctorView ? "doctor-vitals" : "simple-vitals"}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        exit={{ opacity: 0, scale: 0.95 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        {Object.entries(mockVitals).map(([key, vital]) => {
           // Skip non-critical vitals in simplified mode
           if (!isDoctorView && key !== 'heartRate' && key !== 'bloodPressure' && key !== 'spO2') return null;

           return (
            <motion.div
                key={key}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedVital(key)}
                className={cn(
                "relative p-4 rounded-xl border-2 cursor-pointer transition-shadow hover:shadow-lg",
                getStatusColor(vital.status),
                !isDoctorView && "col-span-1 md:col-span-1 lg:col-span-1" // Adjust sizing if needed
                )}
            >
                <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-white/50 dark:bg-black/20 rounded-full">
                        {vital.icon}
                    </div>
                    {vital.status !== "normal" && (
                        <motion.div 
                            animate={vital.status === "critical" ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className={`w-3 h-3 rounded-full ${getStatusIndicator(vital.status)}`}
                        />
                    )}
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-semibold opacity-70 uppercase tracking-wide">{vital.label}</p>
                    <p className="text-2xl font-bold tracking-tight">{vital.value} <span className="text-sm font-normal opacity-70">{vital.unit}</span></p>
                </div>
            </motion.div>
          );
        })}
      </motion.div>
      </AnimatePresence>

      {/* RISK STRIP - Always Visible */}
      <motion.div
        layout
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="rounded-lg overflow-hidden border border-red-200 dark:border-red-900"
      >
        <div className="bg-red-50 dark:bg-red-900/20 p-4 border-l-4 border-red-600 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 dark:bg-red-800 rounded-full">
                    <IconAlertTriangle className="w-8 h-8 text-red-600 dark:text-red-100 animate-pulse" />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-red-700 dark:text-red-300">HIGH CLINICAL RISK DETECTED</h3>
                   <p className="text-red-600/80 dark:text-red-400 text-sm">Patient stability is compromised. Immediate intervention may be required.</p>
                </div>
            </div>
            <div className="text-right hidden md:block">
                <div className="text-xs font-bold text-red-500 uppercase">Confidence Score</div>
                <div className="text-2xl font-black text-red-700 dark:text-red-300">94%</div>
            </div>
        </div>
      </motion.div>

      {/* CLINICAL INTERPRETATION & DOCTOR PREP - Doctor View Only */}
      <AnimatePresence>
      {isDoctorView && (
        <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden"
        >
        
        {/* LEFT: Physiological Observations */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700"
        >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                🧠 Physiological Observations
            </h3>
            <div className="space-y-4">
                <div className="p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg flex gap-3">
                    <span className="text-2xl">🩸</span>
                    <div>
                        <p className="font-semibold text-neutral-800 dark:text-neutral-200">Hypertensive Crisis Indicated</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">BP 160/95 suggests acute cardiovascular stress or pain response.</p>
                    </div>
                </div>
                 <div className="p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg flex gap-3">
                    <span className="text-2xl">💓</span>
                    <div>
                        <p className="font-semibold text-neutral-800 dark:text-neutral-200">Tachycardia (110 bpm)</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Compensatory mechanism for hypoxia (SpO₂ 92%) or fever (38.2°C).</p>
                    </div>
                </div>
                <div className="p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg flex gap-3">
                    <span className="text-2xl">🌡️</span>
                    <div>
                        <p className="font-semibold text-neutral-800 dark:text-neutral-200">Pyrexia Observed</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Temp 38.2°C indicates potential infection or inflammatory process.</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t dark:border-neutral-700">
                <h4 className="text-sm font-semibold text-neutral-500 mb-2 uppercase">Correlation with History</h4>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 italic">
                    "Patient history of Type 2 Diabetes amplifies risk of silent ischemia. Hypertension + Tachycardia requires ECG to rule out ACS."
                </p>
            </div>
        </motion.div>

        {/* RIGHT: Doctor Preparation */}
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-6 shadow-sm border border-blue-100 dark:border-blue-800"
        >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-800 dark:text-blue-300">
                👨‍⚕️ Doctor Preparation Checklist
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                 <div className="bg-white dark:bg-neutral-800 p-3 rounded-lg shadow-sm flex items-center gap-3">
                    <IconCheck className="text-green-500 w-5 h-5" />
                    <span className="text-sm font-medium">12-Lead ECG</span>
                 </div>
                 <div className="bg-white dark:bg-neutral-800 p-3 rounded-lg shadow-sm flex items-center gap-3">
                    <IconCheck className="text-green-500 w-5 h-5" />
                    <span className="text-sm font-medium">IV Access (Large Bore)</span>
                 </div>
                 <div className="bg-white dark:bg-neutral-800 p-3 rounded-lg shadow-sm flex items-center gap-3">
                    <IconCheck className="text-green-500 w-5 h-5" />
                    <span className="text-sm font-medium">Oxygen (Nasal Cannula)</span>
                 </div>
                 <div className="bg-white dark:bg-neutral-800 p-3 rounded-lg shadow-sm flex items-center gap-3">
                    <IconCheck className="text-green-500 w-5 h-5" />
                    <span className="text-sm font-medium">Antipyretics</span>
                 </div>
            </div>

            <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2 uppercase">Likely Departments</h4>
            <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-sm rounded-full font-medium">Emergency Medicine</span>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-sm rounded-full font-medium">Internal Medicine</span>
                <span className="px-3 py-1 bg-transparent border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-300 text-sm rounded-full">Cardiology Consult</span>
            </div>

            <div className="mt-8 flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                <IconInfoCircle className="text-yellow-600 w-5 h-5 shrink-0 mt-0.5" />
                <div>
                    <h5 className="text-sm font-bold text-yellow-800 dark:text-yellow-400">Golden Window Alert</h5>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">Tachycardia + Desaturation suggests early sepsis or PE. Immediate workup required to prevent decompensation.</p>
                </div>
            </div>
        </motion.div>
      </motion.div>
      )}
      </AnimatePresence>
      
      {/* SIMPLIFIED AI SUMMARY - Simple View Only */}
      <AnimatePresence>
        {!isDoctorView && (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-white dark:bg-neutral-800 p-6 rounded-xl border shadow-sm"
            >
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">🧠 AI Clinical Summary</h3>
                <p className="text-lg text-neutral-700 dark:text-neutral-300">
                    Patient exhibiting signs of cardiovascular stress with hypoxia and fever. <span className="font-bold text-red-600">Immediate attention advised.</span>
                </p>
            </motion.div>
        )}
      </AnimatePresence>

      {/* META FOOTER */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 pt-6 border-t dark:border-neutral-800 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-400"
      >
        <div className="flex items-center gap-4">
            <span>🕒 Updated: Just now</span>
            <span>📊 Confidence: High (94%)</span>
        </div>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
            <IconAlertTriangle className="w-4 h-4" />
            <p>This AI supports clinical decisions and does not replace medical judgment.</p>
        </div>
      </motion.div>

      {/* VITAL DETAILS MODAL (Simple implementation) */}
      <AnimatePresence>
        {selectedVital && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedVital(null)}
            >
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl max-w-sm w-full shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold">{mockVitals[selectedVital].label}</h3>
                        <button onClick={() => setSelectedVital(null)} className="text-2xl">&times;</button>
                    </div>
                    <div className="py-4 border-t border-b dark:border-neutral-700 space-y-3">
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Current Value</span>
                            <span className="font-bold text-xl">{mockVitals[selectedVital].value} {mockVitals[selectedVital].unit}</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Normal Range</span>
                            <span className="font-medium text-green-600">{mockVitals[selectedVital].range}</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <span className={`font-bold px-2 rounded ${
                                mockVitals[selectedVital].status === 'critical' ? 'bg-red-100 text-red-700' :
                                mockVitals[selectedVital].status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                            }`}>{mockVitals[selectedVital].status.toUpperCase()}</span>
                         </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Detailed trend analysis and historical correlation would appear here in a production environment.
                    </p>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
