import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X } from 'lucide-react';

export const CampusTourModal: React.FC = () => {
  const { isTourOpen, closeTourModal, openEnrollModal } = useApp();
  const [activeCameraAngle, setActiveCameraAngle] = useState<string>('airfield');

  if (!isTourOpen) return null;

  const cameraAngles = [
    {
      id: 'airfield',
      label: 'Airfield & Drone Fly Area',
      desc: 'DGCA approved Kinathukadavu flying turf & active flight lines.',
      image: '/images/airfield.png',
      category: 'Outdoor Flight Turf'
    },
    {
      id: 'building',
      label: 'RPTO Headquarters',
      desc: 'Modern multi-storey aviation campus facade and flight administration center.',
      image: '/images/drone-infra-building.webp',
      category: 'RPTO Headquarters'
    },
    {
      id: 'sim',
      label: 'Flight Simulator Zone',
      desc: 'Computer simulator cockpits with PX4 physics and dual flight controls.',
      image: '/images/simulator-zone.png',
      category: 'Digital Simulator Lab'
    },
    {
      id: 'ground',
      label: 'Smart Ground Class',
      desc: 'Aviation theory classroom with interactive audio-visual aerodynamics systems.',
      image: '/images/ground-class.png',
      category: 'Aviation Classroom'
    },
    {
      id: 'station1',
      label: 'Drone Station 1 - Rigging',
      desc: 'Heavy multirotor assembly and propulsion test bench setup for UAVs.',
      image: '/images/drone-station.jpeg',
      category: 'Hardware Rigging Bay'
    },
    {
      id: 'station2',
      label: 'Drone Station 2 - Avionics',
      desc: 'Hardware diagnostics bay, RF spectrum analyzer, and LiPo balance charging.',
      image: '/images/drone-station-2.jpeg',
      category: 'Avionics Diagnostics'
    },
    {
      id: 'briefing',
      label: 'Crew Discussion Room',
      desc: 'Pre-flight briefing and post-mission debriefing suite for pilots and instructors.',
      image: '/images/discussion-room.png',
      category: 'Briefing Suite'
    },
    {
      id: 'library',
      label: 'Drone Tech Library',
      desc: 'Component research archive and comprehensive UAV airframe collection.',
      image: '/images/drone-library.jpeg',
      category: 'Research Archive'
    }
  ];

  const currentView = cameraAngles.find((c) => c.id === activeCameraAngle) || cameraAngles[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#071D4A] text-white rounded-2xl shadow-2xl border border-white/20 w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-5 py-3.5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <span>Virtual Campus & Airfield Tour</span>
              <span className="text-[10px] text-[#FFB800] font-normal">| Live Facilities Showcase</span>
            </h3>
          </div>
          <button
            onClick={closeTourModal}
            className="cursor-pointer text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Screen Simulation */}
        <div className="p-4 space-y-3 overflow-y-auto">
          <div className="relative h-64 sm:h-80 md:h-96 w-full rounded-2xl overflow-hidden bg-black border border-white/10 flex items-center justify-center">
            <img
              src={currentView.image}
              alt={currentView.label}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (!target.dataset.triedFallback) {
                  target.dataset.triedFallback = '1';
                  target.src = '/images/airfield.png';
                } else if (target.dataset.triedFallback === '1') {
                  target.dataset.triedFallback = '2';
                  target.src = '/images/drone-infra-building.webp';
                }
              }}
            />

            {/* Bottom Caption Banner */}
            <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-white/20 flex items-center justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  {currentView.label}
                </h4>
                <p className="text-[10px] sm:text-xs text-slate-300">
                  {currentView.desc}
                </p>
              </div>
            </div>
          </div>

          {/* Camera View Selectors - 8 Real Facility Feeds */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {cameraAngles.map((cam) => (
              <button
                key={cam.id}
                onClick={() => setActiveCameraAngle(cam.id)}
                className={`cursor-pointer p-2 rounded-xl text-left border transition-all ${
                  activeCameraAngle === cam.id
                    ? 'bg-[#FFB800] text-[#08245F] border-[#FFB800] font-bold shadow-sm'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-[9px] uppercase tracking-wider block opacity-75 font-semibold">
                  {cam.category}
                </span>
                <p className="text-xs font-bold truncate">
                  {cam.label}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#08245F] border-t border-white/10 flex items-center justify-between">
          <p className="text-xs text-slate-300">
            Sri Eshwar Drone Tech Pvt Ltd · Kinathukadavu, Coimbatore
          </p>
          <button
            onClick={() => {
              closeTourModal();
              openEnrollModal();
            }}
            className="cursor-pointer text-xs font-black text-[#08245F] bg-[#FFB800] hover:bg-[#E5A600] px-4 py-2 rounded-xl shadow-xs transition-colors uppercase tracking-wide"
          >
            Apply for Airfield Batch
          </button>
        </div>
      </div>
    </div>
  );
};
