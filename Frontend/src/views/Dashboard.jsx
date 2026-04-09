import {
  ArrowUpRightIcon,
  Bars3Icon,
  BellIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  PlusIcon,
  SunIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import ActiveMember from '../components/page/ActiveMember';
import { useTheme } from '../context/ThemeContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchDashboardData } from '../store/slices/projectSlice';

const EASE = [0.22, 1, 0.36, 1];

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { stats, projects, teamMembers } = useAppSelector(state => state.projects);
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const socketConnected = useAppSelector(state => state.socket.connected);

  const [searchQuery, setSearchQuery] = useState('');
  const { isDarkMode, toggleTheme } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() =>
    window.matchMedia('(min-width: 1024px)').matches
  );
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(
    window.matchMedia('(min-width: 1024px)').matches
  );
  const recentProjectsRef = useRef(null);
  const activeTeamRef = useRef(null);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const listener = () => setIsLargeScreen(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, []);

  useEffect(() => {
    if (isLargeScreen && isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  }, [isLargeScreen, isMobileSidebarOpen]);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated || !socketConnected) return;
    dispatch(fetchDashboardData());
  }, [dispatch, isAuthenticated, socketConnected]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch({ type: 'socket/init' });
    }
  }, [isAuthenticated, dispatch]);

  const expandSidebar = () => setIsSidebarCollapsed(false);
  const collapseSidebar = () => setIsSidebarCollapsed(true);
  const openMobileSidebar = () => setIsMobileSidebarOpen(true);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  useEffect(() => {
    if (isLargeScreen) {
      setIsSidebarCollapsed(true);
    } else {
      setIsSidebarCollapsed(false);
    }
  }, [isLargeScreen]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: EASE },
    },
  };

  const isMemberOnline = member => {
    if (member?.isActive === true) return true;
    const status = (member?.status || '').toString().trim().toLowerCase();
    return ['online', 'active', 'active now', 'available'].includes(status);
  };

  const activeMemberCount = useMemo(() => {
    const members = Array.isArray(teamMembers) ? teamMembers : [];
    return members.filter(isMemberOnline).length;
  }, [teamMembers]);

  const scrollToSection = ref => {
    ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-500 relative ${
        isDarkMode ? 'bg-[#0B0E11] text-[#E6E8E5]' : 'bg-[#E6E8E5] text-[#0B0E11]'
      }`}
    >
      {/* Noise Texture Overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-[1]"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
      />

      {/* Subtle Grid Background */}
      <div
        className={`fixed inset-0 pointer-events-none opacity-[0.02] z-[1] ${
          isDarkMode ? 'opacity-[0.02]' : 'opacity-[0.01]'
        }`}
        style={{
          backgroundImage: isDarkMode
            ? 'linear-gradient(#E6E8E5 1px, transparent 1px), linear-gradient(90deg, #E6E8E5 1px, transparent 1px)'
            : 'linear-gradient(#0B0E11 1px, transparent 1px), linear-gradient(90deg, #0B0E11 1px, transparent 1px)',
          backgroundSize: '100px 100px',
        }}
      />

      {/* Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#17E1FF]/10 rounded-full blur-[200px] opacity-30 pointer-events-none z-[1]" />

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-0 z-50 ${
          isMobileSidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div
          onClick={closeMobileSidebar}
          className={`absolute inset-0 z-40 transition-opacity backdrop-blur-sm ${
            isMobileSidebarOpen ? 'opacity-100' : 'opacity-0'
          } ${isDarkMode ? 'bg-[#0B0E11]/60' : 'bg-[#0B0E11]/40'}`}
        />
        <Sidebar
          isCollapsed={false}
          isMobile
          isOpen={isMobileSidebarOpen}
          onClose={closeMobileSidebar}
        />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-40">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onHoverExpand={expandSidebar}
          onHoverCollapse={collapseSidebar}
        />
      </div>

      {/* Main Content Area */}
      <motion.main
        animate={{
          marginLeft: isLargeScreen ? (isSidebarCollapsed ? 80 : 256) : 0,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 p-4 sm:p-6 lg:p-12 min-h-screen"
      >
        {/* Header */}
        <header className="mb-12 lg:mb-16">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-8 lg:mb-12">
            {/* Search Bar with Glass Effect */}
            <div className="flex items-center gap-3 flex-1 max-w-xl">
              <motion.button
                onClick={openMobileSidebar}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`lg:hidden p-3 rounded-2xl transition-all backdrop-blur-xl border ${
                  isDarkMode
                    ? 'hover:bg-white/5 border-white/5'
                    : 'hover:bg-white/95 border-[#0B0E11]/15'
                }`}
                aria-label="Open sidebar"
              >
                <Bars3Icon className="w-6 h-6" />
              </motion.button>

              <div className="relative flex-1 group">
                <MagnifyingGlassIcon
                  className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                    isDarkMode
                      ? 'text-[#E6E8E5]/40 group-focus-within:text-[#17E1FF]'
                      : 'text-[#0B0E11]/80 group-focus-within:text-[#17E1FF]'
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search projects, tasks, people..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className={`w-full pl-14 pr-6 py-4 rounded-3xl text-sm font-medium outline-none transition-all backdrop-blur-xl border ${
                    isDarkMode
                      ? 'bg-white/5 text-[#E6E8E5] placeholder-[#E6E8E5]/30 border-white/10 focus:border-[#17E1FF]/30 focus:bg-white/10'
                      : 'bg-white/90 text-[#0B0E11] placeholder-[#0B0E11]/30 border-[#0B0E11]/15 focus:border-[#17E1FF]/30 focus:bg-white'
                  }`}
                />
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => navigate('/notifications')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-3 rounded-full transition-all backdrop-blur-xl border-2 ${
                  isDarkMode
                    ? 'hover:bg-white/5 border-white/5'
                    : 'hover:bg-white/95 border-[#0B0E11]/15'
                }`}
              >
                <BellIcon className="w-6 h-6" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#17E1FF] rounded-full animate-pulse" />
              </motion.button>

              <motion.button
                onClick={toggleTheme}
                whileHover={{ scale: 1.05, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`p-3 rounded-full transition-all backdrop-blur-xl border-2 ${
                  isDarkMode
                    ? 'hover:bg-white/5 border-white/5'
                    : 'hover:bg-white/95 border-[#0B0E11]/15'
                }`}
              >
                {isDarkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
              </motion.button>

              <motion.button
                onClick={() => navigate('/meeting')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-3 rounded-full transition-all backdrop-blur-xl border-2 ${
                  isDarkMode
                    ? 'hover:bg-white/5 border-white/5'
                    : 'hover:bg-white/95 border-[#0B0E11]/15'
                }`}
                aria-label="Open meeting chat"
              >
                <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />
              </motion.button>

              <div
                onClick={() => navigate('/settings')}
                className={`flex items-center gap-3 pl-4 ml-4 border-l cursor-pointer ${
                  isDarkMode ? 'border-white/10' : 'border-[#0B0E11]/15'
                }`}
              >
                <img
                  src={
                    user?.avatar ||
                    (isDarkMode
                      ? 'https://img.icons8.com/?size=100&id=Wfmeg9dVsvca&format=png&color=FFFFFF'
                      : 'https://img.icons8.com/?size=100&id=Wfmeg9dVsvca&format=png&color=000000')
                  }
                  alt="Profile"
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-[#17E1FF]/30"
                />
                <div className="block">
                  <p className="text-sm font-bold">{user?.username || 'Guest User'}</p>
                  <p
                    className={`text-xs hidden sm:block ${
                      isDarkMode ? 'text-[#E6E8E5]/50' : 'text-[#0B0E11]/70'
                    }`}
                  >
                    {user?.email || 'guest@example.com'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Page Title - Kinetic Typography */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div>
              <motion.h1
                initial={{ opacity: 0, letterSpacing: '0.2em' }}
                animate={{ opacity: 1, letterSpacing: '-0.04em' }}
                transition={{ duration: 1.2, ease: EASE }}
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 tracking-tighter leading-none uppercase"
              >
                Dashboard
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className={`text-base sm:text-lg lg:text-xl font-light ${
                  isDarkMode ? 'text-[#E6E8E5]/40' : 'text-[#0B0E11]/80'
                }`}
              >
                High-performance workspace for distributed teams
              </motion.p>
            </div>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              onClick={() => navigate('/create-project')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-[#E6E8E5] text-[#0B0E11] rounded-2xl border font-black uppercase tracking-wide flex items-center gap-2 text-sm shadow-[0_0_40px_rgba(23,225,255,0.3)] transition-all"
            >
              <PlusIcon className="w-5 h-5" /> Initialize Project
            </motion.button>
          </div>
        </header>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 lg:space-y-8"
        >
          {/* KPI Grid - Glass Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3, ease: EASE } }}
              onClick={() => scrollToSection(recentProjectsRef)}
              role="button"
              tabIndex={0}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  scrollToSection(recentProjectsRef);
                }
              }}
              className={`rounded-3xl p-8 relative overflow-hidden group backdrop-blur-2xl border ${
                isDarkMode
                  ? 'bg-[#17E1FF]/10 border-[#17E1FF]/20'
                  : 'bg-[#17E1FF]/5 border-[#17E1FF]/10'
              } cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17E1FF]/60`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#17E1FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#17E1FF] rounded-full blur-3xl opacity-20 -mr-16 -mt-16 group-hover:opacity-40 transition-opacity duration-700" />

              <div className="relative z-10">
                <p
                  className={`text-xs font-mono uppercase tracking-widest mb-2 ${
                    isDarkMode ? 'text-[#E6E8E5]/50' : 'text-[#0B0E11]/70'
                  }`}
                >
                  Total Projects
                </p>
                <h2 className="text-6xl font-black mb-6">{stats?.totalProjects || 0}</h2>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#17E1FF]/20 backdrop-blur-sm">
                  <span className="text-xs font-bold text-[#17E1FF]">+12%</span>
                </div>
              </div>
            </motion.div>

            {[
              {
                label: 'Completed',
                value: stats?.endedProjects || 0,
                trend: '+6%',
                onClick: () => scrollToSection(recentProjectsRef),
              },
              {
                label: 'Active Team',
                value: activeMemberCount,
                trend: `${activeMemberCount} Online`,
                onClick: () => scrollToSection(activeTeamRef),
              },
              { label: 'Pending', value: stats?.pendingProjects || 0, trend: '—' },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3, ease: EASE } }}
                onClick={card.onClick}
                role={card.onClick ? 'button' : undefined}
                tabIndex={card.onClick ? 0 : undefined}
                onKeyDown={
                  card.onClick
                    ? event => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          card.onClick();
                        }
                      }
                    : undefined
                }
                className={`rounded-3xl p-8 relative group backdrop-blur-2xl border transition-all ${
                  isDarkMode
                    ? 'bg-white/5 border-white/10 hover:border-white/20'
                    : 'bg-white/90 border-[#0B0E11]/15 hover:border-[#0B0E11]/20'
                } ${card.onClick ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17E1FF]/60' : ''}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative z-10">
                  <p
                    className={`text-xs font-mono uppercase tracking-widest mb-2 ${
                      isDarkMode ? 'text-[#E6E8E5]/50' : 'text-[#0B0E11]/70'
                    }`}
                  >
                    {card.label}
                  </p>
                  <h2 className="text-5xl font-black mb-6">{card.value}</h2>
                  <span
                    className={`text-xs font-medium ${
                      isDarkMode ? 'text-[#E6E8E5]/60' : 'text-[#0B0E11]/80'
                    }`}
                  >
                    {card.trend}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Recent Projects */}
            <motion.div
              variants={itemVariants}
              ref={recentProjectsRef}
              className={`lg:col-span-8 lg:h-[520px] rounded-3xl p-10 backdrop-blur-2xl border flex flex-col min-h-0 ${
                isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/90 border-[#0B0E11]/15'
              }`}
            >
              <div className="flex justify-between items-center mb-6 shrink-0">
                <h3 className="text-3xl font-black uppercase tracking-tighter">Recent Projects</h3>
                <button
                  className={`px-5 py-2 rounded-2xl font-bold text-xs uppercase tracking-wide transition-all ${
                    isDarkMode
                      ? 'bg-white/5 text-[#E6E8E5] hover:bg-white/10'
                      : 'bg-[#0B0E11]/10 text-[#0B0E11] hover:bg-[#0B0E11]/15'
                  }`}
                >
                  View All
                </button>
              </div>
              <div className="space-y-4 flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1">
                {(projects || []).slice(0, 4).map((proj, i) => (
                  <motion.div
                    key={proj._id || i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1, ease: EASE }}
                    onClick={() => navigate(`/project/${proj._id}`)}
                    whileHover={{ x: 8 }}
                    className={`group flex items-center justify-between p-2 sm:p-3 rounded-xl transition-all cursor-pointer border ${
                      isDarkMode
                        ? 'hover:bg-white/5 border-[#17E1FF]/30 hover:border-[#17E1FF]/20'
                        : 'hover:bg-white border-[#0B0E11]/30 hover:border-[#0B0E11]/15'
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                          isDarkMode
                            ? 'bg-[#17E1FF]/10 group-hover:bg-[#17E1FF]/20'
                            : 'bg-[#0B0E11]/10 group-hover:bg-[#0B0E11]/15'
                        }`}
                      >
                        <FolderIcon className="w-7 h-7 text-[#17E1FF]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold mb-1">
                          {proj.name || 'Untitled Project'}
                        </h4>
                        <p
                          className={`text-sm ${
                            isDarkMode ? 'text-[#E6E8E5]/50' : 'text-[#0B0E11]/70'
                          }`}
                        >
                          Due:{' '}
                          {proj.createdAt
                            ? new Date(proj.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRightIcon className="w-6 h-6 opacity-0 group-hover:opacity-100 text-[#17E1FF] transition-all" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Active Team */}
            <motion.div
              variants={itemVariants}
              ref={activeTeamRef}
              className="lg:col-span-4 lg:h-[520px]"
            >
              <ActiveMember className="h-full" onClick={() => navigate('/active-members')} />
            </motion.div>
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default Dashboard;
