import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Layers, Archive, User, LogOut, Plus, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';

const tabs = [
  { id: 'canvases', label: 'Canvases', icon: Layers, path: '/dashboard' },
  { id: 'vault', label: 'Vault', icon: Archive, path: '/dashboard/vault' },
  { id: 'profile', label: 'Profile', icon: User, path: '/dashboard/profile' },
];

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onNewCanvas?: () => void;
  isGuest?: boolean;
}

const AppLayout = ({ children, activeTab = 'canvases', onNewCanvas, isGuest = false }: AppLayoutProps) => {
  const navigate = useNavigate();
  const { signOut, exitGuestMode } = useAuth();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    if (isGuest) {
      exitGuestMode();
      navigate('/');
      return;
    }
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop top nav */}
      <header className="hidden md:block sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 pt-4">
          <div className="flex items-center justify-between h-14 px-5 rounded-2xl bg-card/80 backdrop-blur-xl border border-border shadow-[0_1px_3px_hsl(228_20%_10%/0.04)]">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-bold tracking-tight text-sm">EasyContext</span>
              {isGuest && <span className="text-[10px] px-2 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary">Preview mode</span>}
            </Link>

            <nav className="flex items-center gap-1 bg-muted/60 rounded-xl p-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => !isGuest || tab.id !== 'profile' ? navigate(tab.path) : null}
                    className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-card rounded-lg shadow-sm border border-border"
                        transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                      />
                    )}
                    <tab.icon className="h-3.5 w-3.5 relative z-10" />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              {onNewCanvas && (
                <Button size="sm" className="rounded-full px-4 gap-1.5 h-8 text-xs" onClick={onNewCanvas}>
                  <Plus className="h-3 w-3" />
                  New
                </Button>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg"
              >
                <LogOut className="h-3 w-3" />
                {isGuest && <span>Exit preview</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile header */}
      <header className="md:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-5 h-14">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-bold tracking-tight text-sm">EasyContext</span>
          </Link>
          <div className="flex items-center gap-2">
            {onNewCanvas && (
              <Button size="sm" className="rounded-full px-3 gap-1 h-8 text-xs" onClick={onNewCanvas}>
                <Plus className="h-3 w-3" />
              </Button>
            )}
            <button
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground transition-colors p-2"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-5 md:px-6 py-6 md:py-8 pb-24 md:pb-8">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40">
        <div className="mx-4 mb-4">
          <div className="flex items-center justify-around h-14 rounded-2xl bg-card/90 backdrop-blur-xl border border-border shadow-[0_-1px_3px_hsl(228_20%_10%/0.04),0_4px_16px_hsl(228_20%_10%/0.08)]">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => !isGuest || tab.id !== 'profile' ? navigate(tab.path) : null}
                  className={`relative flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="text-[10px] font-medium">{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="mobileTab"
                      className="absolute -top-0.5 w-5 h-0.5 rounded-full bg-primary"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
