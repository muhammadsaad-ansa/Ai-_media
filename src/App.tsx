/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Employee {
  id: string;
  name: string;
  role: string;
  shortRole: string;
  emoji: string;
  color: string;
  hex: number;
  deskIndex: number;
  activity: 'work' | 'meeting' | 'coffee' | 'sleep' | 'garden';
  statusText: string;
  customBubble: string;
  tone: string;
  temp: number;
  prompt: string;
  pdfs: { name: string; size: string; summary: string }[];
  tasksCompleted: number;
}

interface SocialAccount {
  id: string;
  name: string;
  icon: string;
  handle: string;
  connected: boolean;
  uploadedToday: number;
  dailyTarget: number;
  color: string;
}

interface ActivityLog {
  time: string;
  actor: string;
  text: string;
}

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'ilham',
    name: 'Ilham',
    role: 'Editor Video & Visual',
    shortRole: 'Editor',
    emoji: '🎬',
    color: '#6366f1',
    hex: 0x6366f1,
    deskIndex: 0,
    activity: 'work',
    statusText: '🎬 Cut 2.5s, Hook Keren & Dinamis!',
    customBubble: '',
    tone: 'Profesional, Cepat & Berorientasi Viral',
    temp: 0.7,
    prompt: 'Kamu adalah Ilham, Editor Video senior. Tugasmu menggabungkan animasi 30 detik dari Ilyas dengan teks hook, subtitle dinamis, color grading tajam, dan musik trending agar siap diupload Abbas.',
    pdfs: [
      { name: 'SOP_Editing_Reels_Viral_2026.pdf', size: '1.4 MB', summary: 'Aturan cut tiap 2.5 detik, font tebal kuning-putih, rasio 9:16.' }
    ],
    tasksCompleted: 14
  },
  {
    id: 'saad',
    name: 'Saad',
    role: 'HRD & Koordinator Tim AI',
    shortRole: 'HRD',
    emoji: '👔',
    color: '#0ea5e9',
    hex: 0x0ea5e9,
    deskIndex: 1,
    activity: 'meeting',
    statusText: '📋 Evaluasi KPI & Shift AI 24/7',
    customBubble: '',
    tone: 'Analitis, Berbasis Data & Tren Terkini',
    temp: 0.5,
    prompt: 'Kamu adalah Saad, HRD dan Manajer Operasional Kantor AI. Kamu memastikan seluruh 7 karyawan AI bekerja sinkron, mengatur waktu istirahat, dan menjaga target 5 upload Reel per hari terpenuhi.',
    pdfs: [
      { name: 'KPI_Standar_Kantor_AI.pdf', size: '890 KB', summary: 'Target 5 konten/hari/platform, respon DM < 10 detik.' }
    ],
    tasksCompleted: 9
  },
  {
    id: 'ilyas',
    name: 'Ilyas',
    role: 'Pembuat Animasi 30 Detik',
    shortRole: 'Animator 30s',
    emoji: '✨',
    color: '#a855f7',
    hex: 0xa855f7,
    deskIndex: 2,
    activity: 'work',
    statusText: '✨ Render Motion 3D 60FPS!',
    customBubble: '',
    tone: 'Santai, Gen-Z & Penuh Hook Menarik',
    temp: 0.9,
    prompt: 'Kamu adalah Ilyas, spesialis Motion Graphic & Animasi 30 Detik. Kamu mengubah naskah dari Abd Aziz menjadi visual animasi 30 detik yang memanjakan mata di 3 detik pertama.',
    pdfs: [
      { name: 'Preset_Motion_30Detik.pdf', size: '2.1 MB', summary: 'Keyframe bounce, transisi zoom cepat, aset karakter 3D.' }
    ],
    tasksCompleted: 11
  },
  {
    id: 'hamza',
    name: 'Hamza',
    role: 'Riset Tayangan Sosial Media',
    shortRole: 'Riset Tren',
    emoji: '📈',
    color: '#ec4899',
    hex: 0xec4899,
    deskIndex: 3,
    activity: 'work',
    statusText: '📈 FYP Trending Audio +340%!',
    customBubble: '',
    tone: 'Analitis, Berbasis Data & Tren Terkini',
    temp: 0.6,
    prompt: 'Kamu adalah Hamza, Spesialis Riset Tayangan Sosial Media. Kamu memantau FYP TikTok, IG Reels, dan YouTube Shorts untuk menemukan topik dengan retensi tinggi dan jam posting terbaik.',
    pdfs: [
      { name: 'Laporan_Algoritma_Sosmed.pdf', size: '1.7 MB', summary: 'Jam prime time: 11:30, 15:00, 18:30, 20:00, 21:30 WIB.' }
    ],
    tasksCompleted: 19
  },
  {
    id: 'abdaziz',
    name: 'Abd Aziz',
    role: 'Pembuat Materi Konten',
    shortRole: 'Konten Kreator',
    emoji: '✍️',
    color: '#f59e0b',
    hex: 0xf59e0b,
    deskIndex: 4,
    activity: 'coffee',
    statusText: '☕ Formula Hook AIDA Power!',
    customBubble: '',
    tone: 'Santai, Gen-Z & Penuh Hook Menarik',
    temp: 0.85,
    prompt: 'Kamu adalah Abd Aziz, Pembuat Materi & Copywriter Konten. Berdasarkan hasil riset Hamza, kamu menulis skrip video 30 detik yang kuat, edukatif, dan memicu komentar serta share.',
    pdfs: [
      { name: '100_Formula_Hook_Viral.pdf', size: '1.1 MB', summary: 'Pola AIDA, storytelling singkat, dan Call-to-Action halus.' }
    ],
    tasksCompleted: 16
  },
  {
    id: 'abbas',
    name: 'Abbas',
    role: 'Pengupload di Media Sosial',
    shortRole: 'Uploader Sosmed',
    emoji: '🚀',
    color: '#10b981',
    hex: 0x10b981,
    deskIndex: 5,
    activity: 'work',
    statusText: '🚀 Auto-Upload 5 Reel Terjadwal!',
    customBubble: '',
    tone: 'Profesional, Cepat & Berorientasi Viral',
    temp: 0.4,
    prompt: 'Kamu adalah Abbas, Spesialis Distribusi & Upload Sosial Media. Kamu memastikan tepat 5 video Reel terupload setiap hari pada setiap akun sosial media yang terhubung dengan caption SEO & hashtag optimal.',
    pdfs: [
      { name: 'Jadwal_5_Upload_Harian.pdf', size: '640 KB', summary: 'Distribusi otomatis ke IG Reels, TikTok, Shorts & FB Reels.' }
    ],
    tasksCompleted: 15
  },
  {
    id: 'zubair',
    name: 'Zubair',
    role: 'Pembalas Pesan Customer',
    shortRole: 'CS & DM',
    emoji: '💬',
    color: '#14b8a6',
    hex: 0x14b8a6,
    deskIndex: 6,
    activity: 'work',
    statusText: '💬 Balas DM & Closing 4 Detik!',
    customBubble: '',
    tone: 'Ramah, Empatik & Persuasif (Soft Selling)',
    temp: 0.6,
    prompt: 'Kamu adalah Zubair, Customer Service AI. Kamu membalas semua DM, komentar Reels, dan pertanyaan pelanggan dengan ramah, cepat, solutif, serta mengarahkan ke closing penjualan.',
    pdfs: [
      { name: 'FAQ_Produk_dan_Promo.pdf', size: '1.9 MB', summary: 'Daftar harga, cara pemesanan, garansi, dan promo bundling.' }
    ],
    tasksCompleted: 142
  }
];

const INITIAL_SOCIAL_ACCOUNTS: SocialAccount[] = [
  { id: 'instagram', name: 'Instagram Reels', icon: '📸', handle: '@kantor.ai.official', connected: true, uploadedToday: 3, dailyTarget: 5, color: 'from-pink-500 to-amber-500' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', handle: '@kantorai_id', connected: true, uploadedToday: 3, dailyTarget: 5, color: 'from-cyan-400 to-rose-500' },
  { id: 'youtube', name: 'YouTube Shorts', icon: '▶️', handle: 'Kantor AI Indonesia', connected: false, uploadedToday: 0, dailyTarget: 5, color: 'from-red-600 to-red-500' },
  { id: 'facebook', name: 'Facebook Reels', icon: '📘', handle: 'Kantor AI Studio', connected: false, uploadedToday: 0, dailyTarget: 5, color: 'from-blue-600 to-indigo-500' }
];

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelsLayerRef = useRef<HTMLDivElement>(null);

  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>(INITIAL_SOCIAL_ACCOUNTS);
  const [selectedEmpId, setSelectedEmpId] = useState<string>('ilham');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<'dashboard' | 'social' | 'clock' | null>(null);
  const [autoMode, setAutoMode] = useState<boolean>(true);
  const [isLandscapeMode, setIsLandscapeMode] = useState<boolean>(false);
  const [dmCounter, setDmCounter] = useState<number>(142);
  const [animCounter, setAnimCounter] = useState<number>(8);
  const [toasts, setToasts] = useState<{ id: number; text: string }[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    { time: 'Baru saja', actor: 'Abbas', text: 'Mengupload Reel #3 ke Instagram & TikTok (Target 5/hari).' },
    { time: '2 mnt lalu', actor: 'Ilham', text: 'Selesai editing final video animasi 30 detik #4.' },
    { time: '5 mnt lalu', actor: 'Ilyas', text: 'Render animasi 30 detik selesai untuk topik "AI Bisnis".' },
    { time: '8 mnt lalu', actor: 'Abd Aziz', text: 'Menulis 5 skrip konten harian dari riset Hamza.' },
    { time: '11 mnt lalu', actor: 'Zubair', text: 'Membalas 18 DM Instagram & 24 komentar TikTok.' },
    { time: '15 mnt lalu', actor: 'Hamza', text: 'Menemukan audio trending baru (+340% kenaikan tayangan).' }
  ]);

  const [clockStr, setClockStr] = useState<string>('00:00:00 WIB');
  const [dateStr, setDateStr] = useState<string>('Memuat tanggal...');
  const [currentTimeObj, setCurrentTimeObj] = useState<Date>(new Date());

  // Three.js references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const employeeMeshesRef = useRef<{ [key: string]: { group: THREE.Group; torso: THREE.Mesh; head: THREE.Mesh; leftArm: THREE.Mesh; rightArm: THREE.Mesh; ring: THREE.Mesh; targetPos: THREE.Vector3; targetRotY: number; lying: boolean } }>({});
  
  // Camera tweening interpolation refs
  const camTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(-1, 0, 0));
  const camSphericalRef = useRef<{ radius: number; theta: number; phi: number }>({ radius: 34, theta: 0.25, phi: 0.92 });
  const camDestTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(-1, 0, 0));
  const camDestSphericalRef = useRef<{ radius: number; theta: number; phi: number }>({ radius: 34, theta: 0.25, phi: 0.92 });

  const selectedEmp = employees.find(e => e.id === selectedEmpId) || employees[0];

  const showToast = (text: string) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  const addLog = (actor: string, text: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setActivityLogs(prev => [{ time: timeStr, actor, text }, ...prev.slice(0, 25)]);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTimeObj(now);
      setClockStr(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB');
      setDateStr(now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0b1120);
    scene.fog = new THREE.FogExp2(0x0b1120, 0.014);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
    cameraRef.current = camera;
    updateCameraPosition();

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xcbd5e1, 0.65);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.85);
    dirLight.position.set(18, 32, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 2;
    dirLight.shadow.camera.far = 85;
    const d = 26;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    scene.add(dirLight);

    const coffeeLight = new THREE.PointLight(0xf59e0b, 0.9, 14);
    coffeeLight.position.set(12, 4, -8);
    scene.add(coffeeLight);

    const workLight = new THREE.PointLight(0x6366f1, 0.8, 22);
    workLight.position.set(-6, 5, 2);
    scene.add(workLight);

    const createBox = (w: number, h: number, depth: number, color: number, x: number, y: number, z: number, castShadow = true, receiveShadow = true) => {
      const geo = new THREE.BoxGeometry(w, h, depth);
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.65, metalness: 0.1 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = receiveShadow;
      scene.add(mesh);
      return mesh;
    };

    // Floors & Architecture
    createBox(28, 0.4, 28, 0x1e293b, -4, -0.2, 0, false, true);
    const gridHelper = new THREE.GridHelper(28, 28, 0x334155, 0x263244);
    gridHelper.position.set(-4, 0.01, 0);
    scene.add(gridHelper);

    createBox(12, 0.4, 28, 0x15803d, 16, -0.2, 0, false, true);
    createBox(2.2, 0.44, 20, 0x94a3b8, 13.5, -0.18, 0, false, true);

    const wallColor = 0x334155;
    createBox(28, 2.4, 0.3, wallColor, -4, 1.2, -14);
    createBox(0.3, 2.4, 28, wallColor, -18, 1.2, 0);
    createBox(28, 1.0, 0.3, wallColor, -4, 0.5, 14);

    const glassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.22, roughness: 0.1 });
    const glassWall1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.4, 10), glassMat);
    glassWall1.position.set(10, 1.2, -9);
    scene.add(glassWall1);
    const glassWall2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.4, 10), glassMat);
    glassWall2.position.set(10, 1.2, 9);
    scene.add(glassWall2);

    createBox(0.25, 2.0, 10, wallColor, -3, 1.0, -9);
    createBox(12, 2.0, 0.25, wallColor, 4, 1.0, -4);
    createBox(11, 2.0, 0.25, wallColor, -12.5, 1.0, 6);

    // Workstations (7)
    const deskPositions = [
      { x: -14, z: -2.5 },
      { x: -9.5, z: -2.5 },
      { x: -5, z: -2.5 },
      { x: -14, z: 2.2 },
      { x: -9.5, z: 2.2 },
      { x: -5, z: 2.2 },
      { x: 0.5, z: 1.5 }
    ];

    const deskChairTargets: { x: number; z: number; rotY: number }[] = [];

    deskPositions.forEach((pos, idx) => {
      const emp = INITIAL_EMPLOYEES[idx];
      createBox(2.8, 0.14, 1.4, 0x475569, pos.x, 1.0, pos.z);
      createBox(0.12, 1.0, 1.2, 0x1e293b, pos.x - 1.25, 0.5, pos.z);
      createBox(0.12, 1.0, 1.2, 0x1e293b, pos.x + 1.25, 0.5, pos.z);

      createBox(0.95, 0.58, 0.08, 0x0f172a, pos.x - 0.45, 1.48, pos.z - 0.35);
      createBox(0.95, 0.58, 0.08, 0x0f172a, pos.x + 0.52, 1.48, pos.z - 0.32);

      const scrMat = new THREE.MeshBasicMaterial({ color: emp.hex });
      const scr1 = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 0.48), scrMat);
      scr1.position.set(pos.x - 0.45, 1.48, pos.z - 0.30);
      scene.add(scr1);
      const scr2 = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 0.48), scrMat);
      scr2.position.set(pos.x + 0.52, 1.48, pos.z - 0.27);
      scene.add(scr2);

      createBox(0.38, 0.72, 0.7, 0x0f172a, pos.x + 1.15, 0.36, pos.z - 0.2);
      createBox(0.7, 0.05, 0.28, 0x94a3b8, pos.x, 1.09, pos.z + 0.15);

      createBox(0.75, 0.12, 0.75, 0x334155, pos.x, 0.58, pos.z + 0.85);
      createBox(0.7, 0.75, 0.12, 0x334155, pos.x, 0.98, pos.z + 1.18);
      createBox(0.12, 0.55, 0.12, 0x0f172a, pos.x, 0.28, pos.z + 0.85);

      deskChairTargets.push({ x: pos.x, z: pos.z + 0.82, rotY: Math.PI });
    });

    // Meeting Room
    createBox(10, 0.04, 6.5, 0x1e1b4b, -10.5, 0.02, -9.5, false, true);
    createBox(5.6, 0.16, 2.2, 0x78350f, -10.5, 1.0, -9.5);
    createBox(4.4, 0.95, 1.2, 0x451a03, -10.5, 0.48, -9.5);
    createBox(4.2, 1.8, 0.15, 0x0f172a, -10.5, 1.7, -13.75);
    const boardScreen = new THREE.Mesh(new THREE.PlaneGeometry(3.9, 1.55), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    boardScreen.position.set(-10.5, 1.7, -13.66);
    scene.add(boardScreen);

    const meetingSpots: { x: number; z: number; rotY: number }[] = [
      { x: -12.2, z: -7.8, rotY: Math.PI },
      { x: -10.5, z: -7.8, rotY: Math.PI },
      { x: -8.8, z: -7.8, rotY: Math.PI },
      { x: -12.2, z: -11.2, rotY: 0 },
      { x: -10.5, z: -11.2, rotY: 0 },
      { x: -8.8, z: -11.2, rotY: 0 },
      { x: -7.1, z: -9.5, rotY: -Math.PI / 2 }
    ];
    meetingSpots.forEach(s => createBox(0.65, 0.1, 0.65, 0x4f46e5, s.x, 0.55, s.z));

    // Coffee Lounge
    createBox(11.5, 0.04, 8.5, 0x422006, 3.5, 0.02, -9.2, false, true);
    createBox(4.5, 1.15, 1.1, 0x92400e, 2.5, 0.58, -12.5);
    createBox(0.9, 0.75, 0.65, 0xe2e8f0, 1.5, 1.52, -12.5);
    createBox(0.3, 0.4, 0.3, 0xef4444, 2.6, 1.35, -12.5);
    createBox(3.4, 0.55, 1.1, 0xb45309, 4.5, 0.3, -7.2);
    createBox(3.4, 0.85, 0.3, 0x92400e, 4.5, 0.65, -6.8);
    createBox(1.8, 0.45, 0.9, 0xd97706, 4.5, 0.25, -8.8);

    const coffeeSpots: { x: number; z: number; rotY: number }[] = [
      { x: 1.5, z: -11.2, rotY: Math.PI },
      { x: 3.2, z: -11.2, rotY: Math.PI },
      { x: 3.6, z: -7.5, rotY: Math.PI },
      { x: 5.2, z: -7.5, rotY: Math.PI },
      { x: 6.5, z: -9.0, rotY: -Math.PI / 2 },
      { x: 2.2, z: -9.0, rotY: Math.PI / 2 },
      { x: 4.5, z: -10.2, rotY: 0 }
    ];

    // Rest/Bedroom Area
    createBox(10.5, 0.04, 7.2, 0x1e1b4b, -12.5, 0.02, 10, false, true);
    const bedCoords = [
      { x: -15.5, z: 8.2 },
      { x: -15.5, z: 11.6 },
      { x: -10.2, z: 8.2 },
      { x: -10.2, z: 11.6 }
    ];
    bedCoords.forEach((b, i) => {
      createBox(3.2, 0.45, 1.65, 0x475569, b.x, 0.25, b.z);
      createBox(3.0, 0.25, 1.5, 0xe2e8f0, b.x, 0.56, b.z);
      createBox(2.0, 0.28, 1.52, i % 2 === 0 ? 0x6366f1 : 0x0ea5e9, b.x + 0.45, 0.58, b.z);
      createBox(0.6, 0.18, 1.1, 0xffffff, b.x - 1.1, 0.72, b.z);
    });

    const sleepSpots: { x: number; z: number; rotY: number; lying: boolean }[] = [
      { x: -15.2, z: 8.2, rotY: Math.PI / 2, lying: true },
      { x: -15.2, z: 11.6, rotY: Math.PI / 2, lying: true },
      { x: -9.9, z: 8.2, rotY: Math.PI / 2, lying: true },
      { x: -9.9, z: 11.6, rotY: Math.PI / 2, lying: true },
      { x: -12.8, z: 9.8, rotY: 0, lying: false },
      { x: -12.8, z: 11.5, rotY: Math.PI, lying: false },
      { x: -8.0, z: 10.0, rotY: -Math.PI / 2, lying: false }
    ];

    // Garden & Trees
    const createTree = (x: number, z: number, scale = 1) => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25 * scale, 0.35 * scale, 2.0 * scale, 8), new THREE.MeshStandardMaterial({ color: 0x78350f }));
      trunk.position.set(x, 1.0 * scale, z);
      trunk.castShadow = true;
      scene.add(trunk);

      const f1 = new THREE.Mesh(new THREE.ConeGeometry(1.5 * scale, 2.4 * scale, 8), new THREE.MeshStandardMaterial({ color: 0x22c55e }));
      f1.position.set(x, 2.6 * scale, z);
      f1.castShadow = true;
      scene.add(f1);

      const f2 = new THREE.Mesh(new THREE.ConeGeometry(1.1 * scale, 2.0 * scale, 8), new THREE.MeshStandardMaterial({ color: 0x4ade80 }));
      f2.position.set(x, 3.8 * scale, z);
      f2.castShadow = true;
      scene.add(f2);
    };

    createTree(18.5, -10, 1.1);
    createTree(19.2, -2, 1.25);
    createTree(18.2, 6, 1.0);
    createTree(12.2, -11, 0.95);
    createTree(12.2, 10.5, 1.05);

    createBox(0.9, 0.5, 2.4, 0xd97706, 15.8, 0.3, -5);
    createBox(0.9, 0.5, 2.4, 0xd97706, 15.8, 0.3, 5);

    const fountainBase = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 0.5, 16), new THREE.MeshStandardMaterial({ color: 0x64748b }));
    fountainBase.position.set(16.2, 0.25, 0);
    scene.add(fountainBase);
    const waterPool = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.55, 16), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    waterPool.position.set(16.2, 0.26, 0);
    scene.add(waterPool);

    const gardenSpots: { x: number; z: number; rotY: number }[] = [
      { x: 14.5, z: -5, rotY: Math.PI / 2 },
      { x: 14.5, z: 5, rotY: Math.PI / 2 },
      { x: 13.8, z: 0, rotY: Math.PI / 2 },
      { x: 16.5, z: -8, rotY: 0 },
      { x: 16.5, z: 8, rotY: Math.PI },
      { x: 13.5, z: -3, rotY: 0 },
      { x: 13.5, z: 3, rotY: Math.PI }
    ];

    // Create Employee 3D Avatars
    const newMeshes: { [key: string]: any } = {};
    const clickableObjects: THREE.Mesh[] = [];

    INITIAL_EMPLOYEES.forEach((emp, idx) => {
      const group = new THREE.Group();
      const startPos = deskChairTargets[idx];
      group.position.set(startPos.x, 0, startPos.z);

      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.95, 12), new THREE.MeshStandardMaterial({ color: emp.hex, roughness: 0.4 }));
      torso.position.y = 0.95;
      torso.castShadow = true;
      group.add(torso);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.5 }));
      head.position.y = 1.68;
      head.castShadow = true;
      group.add(head);

      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.12, 0.25), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
      visor.position.set(0, 1.70, 0.22);
      group.add(visor);

      const armGeo = new THREE.BoxGeometry(0.16, 0.65, 0.16);
      const armMat = new THREE.MeshStandardMaterial({ color: emp.hex });
      const leftArm = new THREE.Mesh(armGeo, armMat);
      leftArm.position.set(-0.42, 1.0, 0.15);
      group.add(leftArm);

      const rightArm = new THREE.Mesh(armGeo, armMat);
      rightArm.position.set(0.42, 1.0, 0.15);
      group.add(rightArm);

      const ring = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.72, 24), new THREE.MeshBasicMaterial({ color: emp.hex, side: THREE.DoubleSide }));
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.04;
      group.add(ring);

      const hitbox = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 2.2, 8), new THREE.MeshBasicMaterial({ visible: false }));
      hitbox.position.y = 1.1;
      hitbox.userData = { employeeId: emp.id };
      group.add(hitbox);
      clickableObjects.push(hitbox);

      scene.add(group);

      newMeshes[emp.id] = {
        group,
        torso,
        head,
        leftArm,
        rightArm,
        ring,
        targetPos: new THREE.Vector3(startPos.x, 0, startPos.z),
        targetRotY: startPos.rotY,
        lying: false
      };
    });

    employeeMeshesRef.current = newMeshes;

    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let dragDist = 0;

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragDist = 0;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      dragDist += Math.abs(dx) + Math.abs(dy);
      camSphericalRef.current.theta -= dx * 0.007;
      camSphericalRef.current.phi = Math.max(0.32, Math.min(1.38, camSphericalRef.current.phi - dy * 0.007));
      camDestSphericalRef.current.theta = camSphericalRef.current.theta;
      camDestSphericalRef.current.phi = camSphericalRef.current.phi;
      camDestSphericalRef.current.radius = camSphericalRef.current.radius;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (isDragging && dragDist < 6) {
        const rect = renderer.domElement.getBoundingClientRect();
        const mouseVec = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouseVec, camera);
        const hits = raycaster.intersectObjects(clickableObjects);
        if (hits.length > 0) {
          const empId = hits[0].object.userData.employeeId;
          setSelectedEmpId(empId);
          setIsDrawerOpen(true);
        }
      }
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      camSphericalRef.current.radius = Math.max(10, Math.min(52, camSphericalRef.current.radius + e.deltaY * 0.02));
      camDestSphericalRef.current.radius = camSphericalRef.current.radius;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    domElem.addEventListener('wheel', handleWheel, { passive: false });

    // Animation Loop with Smooth Camera Tweening (Lerp interpolation)
    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth camera tweening (lerp towards destination target and spherical values)
      camTargetRef.current.lerp(camDestTargetRef.current, 0.07);
      camSphericalRef.current.radius += (camDestSphericalRef.current.radius - camSphericalRef.current.radius) * 0.07;
      camSphericalRef.current.theta += (camDestSphericalRef.current.theta - camSphericalRef.current.theta) * 0.07;
      camSphericalRef.current.phi += (camDestSphericalRef.current.phi - camSphericalRef.current.phi) * 0.07;
      updateCameraPosition();

      Object.keys(employeeMeshesRef.current).forEach((id, i) => {
        const m = employeeMeshesRef.current[id];
        const emp = INITIAL_EMPLOYEES[i];
        if (!emp || !m) return;

        let spot: any = deskChairTargets[i];
        if (emp.activity === 'work') spot = deskChairTargets[i];
        else if (emp.activity === 'meeting') spot = meetingSpots[i];
        else if (emp.activity === 'coffee') spot = coffeeSpots[i];
        else if (emp.activity === 'sleep') {
          spot = sleepSpots[i];
          m.lying = !!spot.lying;
        } else if (emp.activity === 'garden') spot = gardenSpots[i];

        m.targetPos.set(spot.x, 0, spot.z);
        m.targetRotY = spot.rotY;

        const dist = m.group.position.distanceTo(m.targetPos);
        if (dist > 0.08) {
          m.group.position.lerp(m.targetPos, 0.045);
          const angle = Math.atan2(m.targetPos.x - m.group.position.x, m.targetPos.z - m.group.position.z);
          m.group.rotation.y = angle;
          m.group.position.y = Math.abs(Math.sin(elapsed * 10 + i)) * 0.12;
          m.leftArm.rotation.x = Math.sin(elapsed * 10 + i) * 0.6;
          m.rightArm.rotation.x = -Math.sin(elapsed * 10 + i) * 0.6;
          m.torso.rotation.x = 0;
        } else {
          m.group.position.y = 0;
          m.group.rotation.y += (m.targetRotY - m.group.rotation.y) * 0.1;

          if (emp.activity === 'work') {
            m.leftArm.rotation.x = -0.9 + Math.sin(elapsed * 18 + i) * 0.22;
            m.rightArm.rotation.x = -0.9 + Math.cos(elapsed * 18 + i) * 0.22;
            m.head.rotation.y = Math.sin(elapsed * 2.5 + i) * 0.18;
            m.torso.rotation.x = Math.sin(elapsed * 6 + i) * 0.04;
          } else if (emp.activity === 'meeting') {
            m.rightArm.rotation.x = -0.8 + Math.sin(elapsed * 5 + i) * 0.45;
            m.leftArm.rotation.x = -0.3;
            m.head.rotation.y = Math.sin(elapsed * 1.8 + i) * 0.28;
            m.torso.rotation.x = 0;
          } else if (emp.activity === 'coffee') {
            m.rightArm.rotation.x = -1.25 + Math.sin(elapsed * 2.5 + i) * 0.35;
            m.leftArm.rotation.x = 0.1;
            m.head.rotation.x = Math.sin(elapsed * 2 + i) * 0.08;
            m.torso.rotation.x = 0;
          } else if (emp.activity === 'sleep' && m.lying) {
            m.group.position.y = 0.85;
            m.torso.rotation.x = -Math.PI / 2;
            m.head.position.set(0, 1.0, -0.65);
            m.leftArm.rotation.x = 0;
            m.rightArm.rotation.x = 0;
          } else {
            m.leftArm.rotation.x = Math.sin(elapsed * 2 + i) * 0.15;
            m.rightArm.rotation.x = -Math.sin(elapsed * 2 + i) * 0.15;
            m.torso.rotation.x = 0;
          }
        }

        if (!(emp.activity === 'sleep' && m.lying && dist <= 0.08)) {
          m.head.position.set(0, 1.68, 0);
        }

        if (labelsLayerRef.current) {
          const bubbleEl = labelsLayerRef.current.querySelector(`#tag-${emp.id}`) as HTMLElement;
          if (bubbleEl) {
            const tempVec = new THREE.Vector3(m.group.position.x, m.group.position.y + 2.35, m.group.position.z);
            tempVec.project(camera);
            if (tempVec.z < 1) {
              const x = (tempVec.x * 0.5 + 0.5) * window.innerWidth;
              const y = (-tempVec.y * 0.5 + 0.5) * window.innerHeight;
              bubbleEl.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
              bubbleEl.style.opacity = '1';
            } else {
              bubbleEl.style.opacity = '0';
            }
          }
        }
      });

      renderer.render(scene, camera);
    };

    const animId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      domElem.removeEventListener('wheel', handleWheel);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.remove();
      }
    };
  }, []);

  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { radius, theta, phi } = camSphericalRef.current;
    const target = camTargetRef.current;
    const x = target.x + radius * Math.sin(phi) * Math.sin(theta);
    const y = target.y + radius * Math.cos(phi);
    const z = target.z + radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.position.set(x, Math.max(3, y), z);
    cameraRef.current.lookAt(target);
  };

  const focusCameraZone = (zone: string) => {
    const zones: { [key: string]: { target: [number, number, number]; radius: number; theta: number; phi: number } } = {
      overview: { target: [-1, 0, 0], radius: 34, theta: 0.25, phi: 0.92 },
      workstations: { target: [-8, 0, 0], radius: 17, theta: 0.1, phi: 0.88 },
      meeting: { target: [-10.5, 0, -9.5], radius: 14, theta: 0.0, phi: 0.85 },
      coffee: { target: [3.5, 0, -9.2], radius: 14, theta: -0.2, phi: 0.85 },
      bedroom: { target: [-12.5, 0, 10], radius: 15, theta: 0.3, phi: 0.85 },
      garden: { target: [16, 0, 0], radius: 18, theta: -0.5, phi: 0.88 }
    };
    const z = zones[zone] || zones.overview;
    camDestTargetRef.current.set(...z.target);
    camDestSphericalRef.current = { radius: z.radius, theta: z.theta, phi: z.phi };
  };

  const toggleLandscapeMode = () => {
    setIsLandscapeMode(!isLandscapeMode);
    if (!isLandscapeMode) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      showToast('🖥️ Mode Lanskap / Desktop diaktifkan!');
    } else {
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      showToast('📱 Kembali ke mode standar.');
    }
  };

  useEffect(() => {
    if (!autoMode) return;
    const interval = setInterval(() => {
      setEmployees(prev => {
        const idx = Math.floor(Math.random() * prev.length);
        const emp = prev[idx];
        const states: ('work' | 'meeting' | 'coffee' | 'garden' | 'sleep')[] = ['work', 'work', 'work', 'meeting', 'coffee', 'garden', 'sleep'];
        const nextAct = states[Math.floor(Math.random() * states.length)];
        
        const defaultTexts: Record<string, string> = {
          ilham: '🎬 Cut 2.5s, Hook Keren & Dinamis!',
          saad: '📋 Evaluasi KPI & Shift AI 24/7',
          ilyas: '✨ Render Motion 3D 60FPS!',
          hamza: '📈 FYP Trending Audio +340%!',
          abdaziz: '☕ Formula Hook AIDA Power!',
          abbas: '🚀 Auto-Upload 5 Reel Terjadwal!',
          zubair: '💬 Balas DM & Closing 4 Detik!'
        };

        const updated = [...prev];
        updated[idx] = {
          ...emp,
          activity: nextAct,
          customBubble: '',
          statusText: defaultTexts[emp.id] || 'Sedang bekerja...'
        };
        return updated;
      });
    }, 9000);
    return () => clearInterval(interval);
  }, [autoMode]);

  const handleSelectEmployee = (id: string) => {
    setSelectedEmpId(id);
    setIsDrawerOpen(true);
    const emp = employees.find(e => e.id === id);
    if (emp) {
      const idx = emp.deskIndex;
      const deskPositions = [
        { x: -14, z: -2.5 }, { x: -9.5, z: -2.5 }, { x: -5, z: -2.5 },
        { x: -14, z: 2.2 }, { x: -9.5, z: 2.2 }, { x: -5, z: 2.2 }, { x: 0.5, z: 1.5 }
      ];
      const p = deskPositions[idx] || { x: 0, z: 0 };
      camDestTargetRef.current.set(p.x, 1, p.z);
      camDestSphericalRef.current.radius = 15;
    }
  };

  const setEmployeeActivity = (act: 'work' | 'meeting' | 'coffee' | 'sleep' | 'garden') => {
    setEmployees(prev => prev.map(e => {
      if (e.id === selectedEmp.id) {
        const defaultTexts: Record<string, string> = {
          work: '💻 Sedang bekerja di meja...',
          meeting: '📋 Rapat koordinasi strategi',
          coffee: '☕ Ngopi santai di lounge',
          sleep: '💤 Istirahat recharge tenaga',
          garden: '🌳 Mencari ide segar di taman'
        };
        return { ...e, activity: act, customBubble: '', statusText: defaultTexts[act] };
      }
      return e;
    }));
    addLog(selectedEmp.name, `Pindah aktivitas ke mode: ${act.toUpperCase()}.`);
    showToast(`${selectedEmp.emoji} ${selectedEmp.name} sekarang: ${act}`);
  };

  const applyCustomBubble = (val: string) => {
    setEmployees(prev => prev.map(e => e.id === selectedEmp.id ? { ...e, customBubble: val, statusText: val || e.statusText } : e));
    showToast(`💬 Status ${selectedEmp.name} diperbarui!`);
  };

  const saveEmployeeBrain = (tone: string, prompt: string, temp: number) => {
    setEmployees(prev => prev.map(e => e.id === selectedEmp.id ? { ...e, tone, prompt, temp } : e));
    addLog(selectedEmp.name, `Otak AI diperbarui (${tone}).`);
    showToast(`🧠 Otak AI ${selectedEmp.name} berhasil disimpan!`);
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeKB = Math.max(12, Math.round(file.size / 1024));
    const sizeLabel = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

    setEmployees(prev => prev.map(e => {
      if (e.id === selectedEmp.id) {
        return {
          ...e,
          pdfs: [...e.pdfs, { name: file.name, size: sizeLabel, summary: `Modul PDF dipelajari oleh ${e.name} (${e.shortRole}).` }]
        };
      }
      return e;
    }));
    e.target.value = '';
    addLog(selectedEmp.name, `Mempelajari skill PDF baru: "${file.name}".`);
    showToast(`📄 Skill PDF "${file.name}" ditambahkan ke ${selectedEmp.name}!`);
  };

  const removePdfSkill = (index: number) => {
    setEmployees(prev => prev.map(e => {
      if (e.id === selectedEmp.id) {
        const newPdfs = [...e.pdfs];
        const removed = newPdfs.splice(index, 1);
        if (removed[0]) showToast(`🗑️ Skill "${removed[0].name}" dihapus.`);
        return { ...e, pdfs: newPdfs };
      }
      return e;
    }));
  };

  const toggleSocialLogin = (id: string, handleVal: string) => {
    setSocialAccounts(prev => prev.map(acc => {
      if (acc.id === id) {
        const nextConnected = !acc.connected;
        const nextUploaded = nextConnected && acc.uploadedToday === 0 ? 1 : acc.uploadedToday;
        if (nextConnected) {
          addLog('Abbas', `Login berhasil ke ${acc.name} (${handleVal}) & menjadwalkan 5 Reel/hari.`);
          showToast(`✅ Berhasil terhubung ke ${acc.name}!`);
        } else {
          showToast(`🔌 Koneksi ${acc.name} diputus.`);
        }
        return { ...acc, handle: handleVal || acc.handle, connected: nextConnected, uploadedToday: nextUploaded };
      }
      return acc;
    }));
  };

  const triggerUploadCycle = (manual = false) => {
    const connected = socialAccounts.filter(a => a.connected);
    if (connected.length === 0) {
      showToast('⚠️ Hubungkan minimal 1 akun sosial media terlebih dahulu!');
      setActiveModal('social');
      return;
    }

    setAnimCounter(c => c + 1);
    setDmCounter(d => d + Math.floor(Math.random() * 5) + 2);

    setSocialAccounts(prev => prev.map(acc => {
      if (acc.connected && acc.uploadedToday < acc.dailyTarget) {
        return { ...acc, uploadedToday: acc.uploadedToday + 1 };
      }
      return acc;
    }));

    addLog('Abbas', `Upload Reel baru ke ${connected.map(c => c.name).join(', ')}!`);
    if (manual) showToast(`🚀 Siklus AI Selesai! Reel baru diupload ke ${connected.length} akun.`);
  };

  const totalConnected = socialAccounts.filter(a => a.connected).length;
  const totalUploadedToday = socialAccounts.filter(a => a.connected).reduce((s, a) => s + a.uploadedToday, 0);
  const totalTargetToday = socialAccounts.filter(a => a.connected).reduce((s, a) => s + a.dailyTarget, 0) || 5;

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-[#090d16] text-slate-100 font-sans select-none ${isLandscapeMode ? 'scale-100 rotate-0' : ''}`}>
      {/* 3D Canvas Container */}
      <div id="canvas-container" ref={containerRef} className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing" />

      {/* Floating HTML Nameplates & Speech Bubbles over 3D */}
      <div ref={labelsLayerRef} className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {employees.map(emp => (
          <div
            key={emp.id}
            id={`tag-${emp.id}`}
            onClick={() => handleSelectEmployee(emp.id)}
            className="absolute transform -translate-x-1/2 -translate-y-full transition-opacity duration-200 pointer-events-auto cursor-pointer flex flex-col items-center"
          >
            <div className="speech-bubble mb-1 px-3 py-1.5 rounded-xl bg-slate-900/95 border border-indigo-500/50 text-[11px] font-bold text-white shadow-2xl whitespace-nowrap flex items-center gap-1.5 backdrop-blur-md">
              <span className="animate-bounce">💬</span>
              <span>{emp.statusText}</span>
            </div>
            <div className="px-3 py-0.5 rounded-full text-[11px] font-extrabold text-white shadow-lg flex items-center gap-1 border border-white/20" style={{ backgroundColor: emp.color }}>
              <span>{emp.emoji}</span>
              <span>{emp.name}</span>
              <span className="opacity-80 font-normal text-[9px]">({emp.shortRole})</span>
            </div>
          </div>
        ))}
      </div>

      {/* Toast Notification Container */}
      <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="glass px-4 py-2.5 rounded-2xl text-xs font-semibold text-white border border-indigo-400/40 shadow-xl transition-all duration-300">
            {t.text}
          </div>
        ))}
      </div>

      {/* TOP HUD BAR */}
      <header className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Brand */}
        <div className="glass rounded-2xl px-4 py-2.5 flex items-center gap-3 pointer-events-auto">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-lg shadow-lg shadow-indigo-500/30">
            🏢
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-white">Kantor AI Studio 3D</h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> 7 AI Aktif
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Klik karyawan 3D untuk atur Otak AI & Skill PDF</p>
          </div>
        </div>

        {/* Real-time Clock & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          <button onClick={() => setActiveModal('clock')} className="glass hover:bg-purple-600/30 border-purple-500/40 rounded-2xl px-3.5 py-2.5 flex items-center gap-2 transition text-xs sm:text-sm font-semibold text-white shadow-lg">
            <span>⏰</span>
            <span className="hidden md:inline">Jam Real-Time</span>
          </button>

          <button onClick={toggleLandscapeMode} className={`glass px-3.5 py-2.5 rounded-2xl flex items-center gap-2 transition text-xs sm:text-sm font-semibold shadow-lg ${isLandscapeMode ? 'bg-indigo-600 text-white border-indigo-400' : 'hover:bg-indigo-600/30 text-slate-200 border-slate-700'}`}>
            <span>🖥️</span>
            <span className="hidden sm:inline">{isLandscapeMode ? 'Normal Mode' : 'Mode Lanskap'}</span>
          </button>

          <div className="glass rounded-2xl px-3.5 py-2 flex items-center gap-2.5">
            <span className="text-base">🕒</span>
            <div>
              <div className="mono text-xs sm:text-sm font-bold text-indigo-300 leading-none">{clockStr}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{dateStr}</div>
            </div>
          </div>

          <button onClick={() => setActiveModal('dashboard')} className="glass hover:bg-indigo-600/30 border-indigo-500/40 rounded-2xl px-3.5 py-2.5 flex items-center gap-2 transition text-xs sm:text-sm font-semibold text-white shadow-lg">
            <span>📊</span>
            <span>Dashboard Kerja</span>
            <span className="px-1.5 py-0.5 text-[10px] rounded-md bg-indigo-500 text-white font-bold">{totalUploadedToday}/{totalTargetToday} Reel</span>
          </button>

          <button onClick={() => setActiveModal('social')} className="glass hover:bg-pink-600/30 border-pink-500/40 rounded-2xl px-3.5 py-2.5 flex items-center gap-2 transition text-xs sm:text-sm font-semibold text-white shadow-lg">
            <span>🔗</span>
            <span className="hidden md:inline">Akun Sosmed</span>
            <span className="px-1.5 py-0.5 text-[10px] rounded-md bg-pink-500/80 text-white font-bold">{totalConnected} Aktif</span>
          </button>

          <button onClick={() => triggerUploadCycle(true)} className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 rounded-2xl px-3.5 py-2.5 flex items-center gap-1.5 transition text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-600/25">
            <span>🚀</span>
            <span className="hidden sm:inline">Upload Reel</span>
          </button>
        </div>
      </header>

      {/* ROOM CAMERA TELEPORT PILLS (Left) */}
      <div className="absolute left-3 top-20 z-30 flex flex-col gap-1.5 pointer-events-auto">
        <div className="glass rounded-2xl p-1.5 flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pt-1">Area Kantor</span>
          <button onClick={() => focusCameraZone('overview')} className="text-left px-2.5 py-1.5 rounded-xl text-xs font-medium hover:bg-white/10 transition flex items-center gap-2">🗺️ <span>Semua Ruang</span></button>
          <button onClick={() => focusCameraZone('workstations')} className="text-left px-2.5 py-1.5 rounded-xl text-xs font-medium hover:bg-white/10 transition flex items-center gap-2">💻 <span>Meja Kerja (7)</span></button>
          <button onClick={() => focusCameraZone('meeting')} className="text-left px-2.5 py-1.5 rounded-xl text-xs font-medium hover:bg-white/10 transition flex items-center gap-2">📋 <span>Ruang Rapat</span></button>
          <button onClick={() => focusCameraZone('coffee')} className="text-left px-2.5 py-1.5 rounded-xl text-xs font-medium hover:bg-white/10 transition flex items-center gap-2">☕ <span>Ruang Ngopi</span></button>
          <button onClick={() => focusCameraZone('bedroom')} className="text-left px-2.5 py-1.5 rounded-xl text-xs font-medium hover:bg-white/10 transition flex items-center gap-2">🛏️ <span>Ruang Tidur</span></button>
          <button onClick={() => focusCameraZone('garden')} className="text-left px-2.5 py-1.5 rounded-xl text-xs font-medium hover:bg-white/10 transition flex items-center gap-2">🌳 <span>Taman Kantor</span></button>
        </div>

        <div className="glass rounded-2xl p-2.5 flex flex-col gap-1.5 max-w-[165px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-200">Mode Otomatis</span>
            <button onClick={() => setAutoMode(!autoMode)} className={`w-10 h-5 rounded-full relative transition p-0.5 ${autoMode ? 'bg-emerald-500' : 'bg-slate-600'}`}>
              <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${autoMode ? 'translate-x-5' : 'translate-x-0'}`}></span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">Karyawan AI otomatis kerja, rapat, ngopi & istirahat.</p>
        </div>
      </div>

      {/* BOTTOM EMPLOYEE DOCK */}
      <div className="absolute bottom-3 left-3 right-3 z-30 flex justify-center pointer-events-none">
        <div className="glass rounded-2xl p-2 flex items-center gap-2 overflow-x-auto max-w-full pointer-events-auto">
          {employees.map(emp => {
            const isSelected = emp.id === selectedEmpId;
            return (
              <button
                key={emp.id}
                onClick={() => handleSelectEmployee(emp.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition shrink-0 border ${isSelected ? 'bg-indigo-600/40 border-indigo-400 shadow-lg' : 'bg-slate-800/70 border-slate-700/70 hover:bg-slate-700/70'}`}
              >
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shadow" style={{ backgroundColor: emp.color }}>{emp.emoji}</span>
                <div className="text-left">
                  <div className="text-xs font-bold text-white leading-none">{emp.name}</div>
                  <div className="text-[10px] text-slate-300 mt-0.5">{emp.shortRole}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT DRAWER: AI BRAIN, ACTIVITY & PDF SKILL CONFIG */}
      <aside className={`absolute top-20 right-3 bottom-20 w-[92vw] sm:w-[400px] glass rounded-3xl z-40 transition-transform duration-300 flex flex-col overflow-hidden ${isDrawerOpen ? 'translate-x-0' : 'translate-x-[120%]'}`}>
        <div className="p-4 border-b border-slate-700/60 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl font-bold shadow-inner" style={{ backgroundColor: selectedEmp.color }}>
              {selectedEmp.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{selectedEmp.name}</h2>
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">{selectedEmp.role}</span>
              </div>
              <p className="text-xs text-emerald-400 mt-0.5">{selectedEmp.statusText}</p>
            </div>
          </div>
          <button onClick={() => setIsDrawerOpen(false)} className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300">✕</button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          <div className="glass-card rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <span>🎮</span> Pengaturan Aktivitas & Lokasi
              </label>
              <span className="text-[10px] text-slate-400">Real-time 3D</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {(['work', 'meeting', 'coffee', 'sleep'] as const).map(act => (
                <button
                  key={act}
                  onClick={() => setEmployeeActivity(act)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-medium border text-left flex items-center gap-1.5 transition ${selectedEmp.activity === act ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-800 border-slate-700 hover:bg-indigo-600/40 text-slate-200'}`}
                >
                  {act === 'work' && '💻 Bekerja di Meja'}
                  {act === 'meeting' && '📋 Ruang Rapat'}
                  {act === 'coffee' && '☕ Ruang Ngopi'}
                  {act === 'sleep' && '🛏️ Tidur / Istirahat'}
                </button>
              ))}
              <button
                onClick={() => setEmployeeActivity('garden')}
                className={`col-span-2 px-2.5 py-2 rounded-xl text-xs font-medium border text-left flex items-center gap-1.5 transition ${selectedEmp.activity === 'garden' ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-800 border-slate-700 hover:bg-indigo-600/40 text-slate-200'}`}
              >
                🌳 Jalan & Cari Ide di Taman
              </button>
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Status Kustom (Bubble):</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  defaultValue={selectedEmp.customBubble}
                  placeholder="Contoh: 🔥 Lagi render video viral!"
                  id="custom-bubble-input"
                  className="flex-1 bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('custom-bubble-input') as HTMLInputElement;
                    if (input) applyCustomBubble(input.value);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold"
                >
                  Set
                </button>
              </div>
            </div>
          </div>

          <DrawerBrainConfig emp={selectedEmp} onSave={saveEmployeeBrain} />

          <div className="glass-card rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <span>📄</span> Skill Karyawan AI (Upload PDF)
              </label>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">{selectedEmp.pdfs.length} PDF</span>
            </div>
            <p className="text-[11px] text-slate-400">Unggah SOP, panduan editing, katalog produk, atau materi riset (.pdf) agar dipelajari langsung oleh karyawan AI ini.</p>
            
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-600 hover:border-emerald-400 rounded-2xl p-3 cursor-pointer bg-slate-900/40 transition">
              <span className="text-xl mb-1">📥</span>
              <span className="text-xs font-semibold text-slate-200">Pilih File PDF Skill Baru</span>
              <span className="text-[10px] text-slate-400">Klik untuk unggah dokumen .PDF</span>
              <input type="file" accept=".pdf,application/pdf" className="hidden" onChange={handlePdfUpload} />
            </label>

            <div className="space-y-1.5">
              {selectedEmp.pdfs.map((pdf, i) => (
                <div key={i} className="flex items-center justify-between gap-2 bg-slate-900/80 border border-slate-700/80 rounded-xl px-3 py-2">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-emerald-300 truncate">📕 {pdf.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{pdf.size} • {pdf.summary}</div>
                  </div>
                  <button onClick={() => removePdfSkill(i)} className="text-xs text-rose-400 hover:text-rose-300 px-1.5 py-1 rounded-lg bg-rose-500/10">✕</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* REAL-TIME CLOCK FULLSCREEN WIDGET MODAL */}
      {activeModal === 'clock' && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass rounded-3xl w-full max-w-xl p-8 flex flex-col items-center text-center border border-purple-500/40 shadow-2xl relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300">✕</button>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-3xl shadow-xl shadow-purple-500/30 mb-4 animate-pulse">
              ⏰
            </div>
            <h2 className="text-xl font-extrabold text-white mb-1">Mode Jam Real-Time</h2>
            <p className="text-xs text-slate-400 mb-6">Waktu aktif sistem operasional otomatis Kantor AI</p>

            <div className="w-full bg-slate-900/90 border border-purple-500/30 rounded-3xl p-6 shadow-inner mb-6">
              <div className="mono text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400 tracking-wider">
                {currentTimeObj.toLocaleTimeString('id-ID')}
              </div>
              <div className="text-sm font-semibold text-indigo-300 mt-2">
                {currentTimeObj.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="glass-card rounded-2xl p-3 text-left">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Zona Waktu</div>
                <div className="text-sm font-bold text-white mt-0.5">WIB (UTC+7)</div>
              </div>
              <div className="glass-card rounded-2xl p-3 text-left">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Status Sinkronisasi</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">🟢 Live Real-Time</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD MODAL */}
      {activeModal === 'dashboard' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="glass rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden border border-indigo-500/40 shadow-2xl">
            <div className="p-4 sm:p-6 border-b border-slate-700/70 flex items-center justify-between bg-slate-900/80">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30">
                  📊
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">Katalog & Dashboard Pemantauan Tim AI</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Pusat kontrol operasional & target <strong className="text-emerald-400">5 Upload Reel / Hari</strong> di setiap akun sosmed</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <button onClick={() => triggerUploadCycle(true)} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition flex items-center gap-2">
                  <span>⚡</span>
                  <span>Jalankan Siklus Konten</span>
                </button>
                <button onClick={() => setActiveModal(null)} className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 font-bold transition">✕</button>
              </div>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-3 flex items-center gap-2">
                  <span>📈</span> 1. Ringkasan Kinerja Utama (KPI)
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div className="glass-card rounded-2xl p-4 border border-indigo-500/20 shadow-md">
                    <div className="text-xs font-medium text-slate-400">Total Upload Hari Ini</div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 mt-1.5">{totalUploadedToday} / {totalTargetToday}</div>
                    <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium"><span>✨</span> Target 5 Reel/Akun Aktif</div>
                  </div>
                  <div className="glass-card rounded-2xl p-4 border border-purple-500/20 shadow-md">
                    <div className="text-xs font-medium text-slate-400">Animasi 30s (Ilyas)</div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 mt-1.5">{animCounter} Video</div>
                    <div className="text-[11px] text-slate-300 mt-1 flex items-center gap-1 font-medium"><span>🎬</span> Siap diproses Ilham</div>
                  </div>
                  <div className="glass-card rounded-2xl p-4 border border-amber-500/20 shadow-md">
                    <div className="text-xs font-medium text-slate-400">Balasan CS (Zubair)</div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1.5">{dmCounter} DM</div>
                    <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium"><span>⚡</span> Respon kilat 4 detik</div>
                  </div>
                  <div className="glass-card rounded-2xl p-4 border border-pink-500/20 shadow-md">
                    <div className="text-xs font-medium text-slate-400">Skor Tren (Hamza)</div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-pink-400 mt-1.5">94.8%</div>
                    <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium"><span>🔥</span> 12 Audio FYP Aktif</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-pink-300 flex items-center gap-2">
                    <span>🎯</span> 2. Progres Target 5 Reel per Platform Sosial Media
                  </h3>
                  <button onClick={() => { setActiveModal(null); setActiveModal('social'); }} className="text-xs text-pink-400 hover:underline font-semibold">Kelola Akun Sosmed ➔</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {socialAccounts.map(acc => {
                    const pct = Math.min(100, Math.round((acc.uploadedToday / acc.dailyTarget) * 100));
                    return (
                      <div key={acc.id} className="glass-card rounded-2xl p-4 border border-slate-700/70">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-bold text-white flex items-center gap-2 text-sm">{acc.icon} {acc.name} <span className="text-slate-400 font-normal text-xs">({acc.handle})</span></span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${acc.connected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
                            {acc.connected ? `${acc.uploadedToday} / 5 Reel` : 'Nonaktif'}
                          </span>
                        </div>
                        <div className="w-full h-3 bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                          <div className={`h-full rounded-full bg-gradient-to-r ${acc.color} transition-all duration-500`} style={{ width: `${acc.connected ? pct : 0}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 glass-card rounded-2xl p-4 sm:p-5 border border-slate-700/70">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-3 flex items-center gap-2">
                    <span>👥</span> 3. Katalog 7 Karyawan AI & Performa
                  </h3>
                  <div className="space-y-2.5">
                    {employees.map(emp => (
                      <div
                        key={emp.id}
                        onClick={() => { setActiveModal(null); handleSelectEmployee(emp.id); }}
                        className="flex items-center justify-between gap-3 bg-slate-900/70 hover:bg-slate-800/90 border border-slate-700/70 rounded-2xl px-4 py-3 cursor-pointer transition shadow-sm group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow shrink-0" style={{ backgroundColor: emp.color }}>{emp.emoji}</div>
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-bold text-white truncate flex items-center gap-2">
                              <span>{emp.name}</span>
                              <span className="text-slate-400 font-normal text-xs">— {emp.role}</span>
                            </div>
                            <div className="text-[11px] text-emerald-400 truncate mt-0.5">{emp.statusText}</div>
                          </div>
                        </div>
                        <div className="text-right shrink-0 flex items-center gap-3">
                          <div>
                            <div className="text-xs font-bold text-indigo-300">{emp.tasksCompleted} Output</div>
                            <div className="text-[10px] text-slate-400">{emp.pdfs.length} Skill PDF</div>
                          </div>
                          <span className="text-slate-500 group-hover:text-white transition">➔</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-700/70 flex flex-col">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-3 flex items-center gap-2">
                    <span>📜</span> 4. Log Aktivitas Real-Time
                  </h3>
                  <div className="space-y-2.5 overflow-y-auto max-h-[340px] text-xs pr-1">
                    {activityLogs.map((item, i) => (
                      <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 shadow-sm">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                          <span className="font-bold text-indigo-300 flex items-center gap-1"><span>🤖</span> {item.actor}</span>
                          <span className="mono">{item.time}</span>
                        </div>
                        <p className="text-slate-200 leading-snug">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SOCIAL ACCOUNTS MODAL */}
      {activeModal === 'social' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
          <div className="glass rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-pink-500/30">
            <div className="p-4 sm:p-5 border-b border-slate-700/70 flex items-center justify-between bg-slate-900/70">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔗</span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">Hubungkan Akun Sosial Media</h2>
                  <p className="text-xs text-slate-400">Abbas (Pengupload AI) akan otomatis mengunggah <strong className="text-pink-400">5 Reel per hari</strong> ke tiap akun aktif.</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300">✕</button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
              {socialAccounts.map(acc => (
                <SocialAccountRow key={acc.id} account={acc} onToggle={toggleSocialLogin} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DrawerBrainConfig({ emp, onSave }: { emp: Employee; onSave: (tone: string, prompt: string, temp: number) => void }) {
  const [tone, setTone] = useState(emp.tone);
  const [prompt, setPrompt] = useState(emp.prompt);
  const [temp, setTemp] = useState(emp.temp);

  useEffect(() => {
    setTone(emp.tone);
    setPrompt(emp.prompt);
    setTemp(emp.temp);
  }, [emp.id]);

  return (
    <div className="glass-card rounded-2xl p-3.5 space-y-2.5">
      <label className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
        <span>🧠</span> Otak Karyawan AI (Instruksi Inti)
      </label>
      <div>
        <label className="text-[11px] text-slate-400 block mb-1">Gaya Bahasa & Kepribadian AI</label>
        <select
          value={tone}
          onChange={e => setTone(e.target.value)}
          className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
        >
          <option value="Profesional, Cepat & Berorientasi Viral">Profesional, Cepat & Berorientasi Viral</option>
          <option value="Santai, Gen-Z & Penuh Hook Menarik">Santai, Gen-Z & Penuh Hook Menarik</option>
          <option value="Ramah, Empatik & Persuasif (Soft Selling)">Ramah, Empatik & Persuasif (Soft Selling)</option>
          <option value="Analitis, Berbasis Data & Tren Terkini">Analitis, Berbasis Data & Tren Terkini</option>
        </select>
      </div>
      <div>
        <label className="text-[11px] text-slate-400 block mb-1">Prompt Otak AI (Dapat Anda Ubah Sendiri)</label>
        <textarea
          rows={4}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-purple-500"
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1">
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>Kreativitas AI</span>
            <span className="text-purple-300 font-bold">{temp}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.1"
            value={temp}
            onChange={e => setTemp(parseFloat(e.target.value))}
            className="w-full accent-purple-500"
          />
        </div>
        <button
          onClick={() => onSave(tone, prompt, temp)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white shadow"
        >
          💾 Simpan Otak
        </button>
      </div>
    </div>
  );
}

function SocialAccountRow({ account, onToggle }: { account: SocialAccount; onToggle: (id: string, handle: string) => void }) {
  const [handle, setHandle] = useState(account.handle);

  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${account.color} flex items-center justify-center text-2xl shadow-lg`}>
          {account.icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">{account.name}</h3>
            {account.connected ? (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Terhubung</span>
            ) : (
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-700 text-slate-300">Belum Login</span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="text"
              value={handle}
              onChange={e => setHandle(e.target.value)}
              className="bg-slate-900/90 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 w-44 focus:outline-none focus:border-pink-500"
            />
            <span className="text-[11px] text-slate-400">Target: <strong className="text-white">{account.uploadedToday}/{account.dailyTarget} Reel</strong></span>
          </div>
        </div>
      </div>
      <div>
        <button
          onClick={() => onToggle(account.id, handle)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow ${account.connected ? 'bg-slate-800 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30' : 'bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white'}`}
        >
          {account.connected ? 'Putuskan Akun' : '🔑 Login & Hubungkan'}
        </button>
      </div>
    </div>
  );
}
