import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, LogIn, Search, Upload, User, Settings, LogOut, Moon, Sun, Table, Info, HelpCircle, Code, Menu, X } from 'lucide-react';
import { useRippleEffect } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import AuthModal from '@/components/AuthModal';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TooltipProvider } from '@/components/ui/tooltip';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  hasSubmenu?: boolean;
  children?: React.ReactNode;
  isMobileMenu?: boolean;
}

const NavItem = ({ to, icon, label, active, onClick, hasSubmenu, children, isMobileMenu }: NavItemProps) => {
  const handleRipple = useRippleEffect();
  const isMobile = useIsMobile();
  
  if (isMobileMenu && hasSubmenu) {
    return (
      <div className="mb-2">
        <div className="font-medium mb-1 px-2">{label}</div>
        <div className="pl-4 space-y-1">
          {children}
        </div>
      </div>
    );
  }
  
  if (hasSubmenu && !isMobile) {
    return (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger 
              className={cn(
                "relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
                "hover:bg-primary/10 hover:text-primary", 
                active ? "bg-primary/10 text-primary" : "text-foreground/80"
              )}
            >
              <span className={cn(
                "transition-all duration-300",
                active ? "text-primary" : "text-foreground/60"
              )}>
                {icon}
              </span>
              <span className="font-medium">{label}</span>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[200px] gap-1 p-2">
                {children}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  }

  if (isMobileMenu) {
    return (
      <Link 
        to={to} 
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
          "hover:bg-primary/10 hover:text-primary", 
          active ? "bg-primary/10 text-primary" : "text-foreground/80"
        )}
        onClick={() => {
          onClick();
        }}
      >
        <span className={cn(
          "transition-all duration-300",
          active ? "text-primary" : "text-foreground/60"
        )}>
          {icon}
        </span>
        <span className="font-medium">{label}</span>
      </Link>
    );
  }
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link 
          to={to} 
          className={cn(
            "relative flex items-center justify-center px-4 py-3 rounded-lg transition-all duration-300",
            "hover:bg-primary/10 hover:text-primary",
            "overflow-hidden",
            active ? "bg-primary/10 text-primary" : "text-foreground/80"
          )}
          onClick={(e) => {
            handleRipple(e);
            onClick();
          }}
        >
          <span className={cn(
            "transition-all duration-300",
            active ? "text-primary" : "text-foreground/60"
          )}>
            {icon}
          </span>
          {active && (
            <span className="ml-2 font-medium hidden sm:inline">{label}</span>
          )}
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const SubMenuItem = ({ to, icon, label, active, onClick, isMobileMenu }: NavItemProps) => {
  if (isMobileMenu) {
    return (
      <Link 
        to={to} 
        className={cn(
          "flex items-center gap-2 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-all duration-300",
          active ? "text-primary" : ""
        )}
        onClick={onClick}
      >
        <span className={cn(
          "transition-all duration-300",
          active ? "text-primary" : "text-foreground/60"
        )}>
          {icon}
        </span>
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-2 p-2 rounded-md hover:bg-primary/10 hover:text-primary transition-all duration-300",
        active ? "bg-primary/10 text-primary" : ""
      )}
      onClick={onClick}
    >
      <span className={cn(
        "transition-all duration-300",
        active ? "text-primary" : "text-foreground/60"
      )}>
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
};

export const Navbar = () => {
  const [active, setActive] = useState('what');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  
  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleNavItemClick = (id: string) => {
    setActive(id);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const cortexSubmenu = [
    { to: '/', icon: <Info size={18} />, label: 'What', id: 'what' },
    { to: '/why', icon: <HelpCircle size={18} />, label: 'Why', id: 'why' },
    { to: '/how', icon: <Code size={18} />, label: 'How', id: 'how' },
  ];
  
  const authNavItems = [
    { to: '/manage', icon: <Table size={20} />, label: 'Manage', id: 'manage' },
    { to: '/search', icon: <Search size={20} />, label: 'Search', id: 'search' },
    { to: '/import', icon: <Upload size={20} />, label: 'Import', id: 'import' },
    { to: '/profile', icon: <User size={20} />, label: 'Profile', id: 'profile' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings', id: 'settings' },
  ];

  const navItems = isAuthenticated ? authNavItems : [];

  // Mobile menu
  const MobileMenu = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-lg md:hidden">
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="max-w-[280px] sm:max-w-[320px]">
        <div className="flex flex-col gap-6 pt-6">
          <div className="flex items-center gap-2">
            <Brain size={24} className="text-primary" />
            <span className="font-bold text-xl">Cortex</span>
          </div>
          
          <div className="flex flex-col gap-1">
            <NavItem
              to="#"
              icon={<Brain size={20} />}
              label="Cortex"
              active={['what', 'why', 'how'].includes(active)}
              onClick={() => {}}
              hasSubmenu={true}
              isMobileMenu={true}
            >
              {cortexSubmenu.map((item) => (
                <SubMenuItem
                  key={item.id}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={active === item.id}
                  onClick={() => handleNavItemClick(item.id)}
                  isMobileMenu={true}
                />
              ))}
            </NavItem>
            
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                to={item.to}
                icon={item.icon}
                label={item.label}
                active={active === item.id}
                onClick={() => handleNavItemClick(item.id)}
                isMobileMenu={true}
              />
            ))}
            
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-lg"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                <span className="ml-2">Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
              </Button>
            </div>
            
            {isAuthenticated ? (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
              >
                <LogOut size={18} className="mr-2" />
                Logout
              </Button>
            ) : (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  handleOpenAuthModal();
                  setIsMobileMenuOpen(false);
                }}
              >
                <LogIn size={18} className="mr-2" />
                Login
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      <TooltipProvider>
        <header className="glass-panel fixed top-6 left-1/2 transform -translate-x-1/2 z-40 rounded-lg px-1 py-1 w-[95%] md:w-auto">
          <nav className="flex items-center justify-between">
            {/* Mobile menu button */}
            {isMobile && <MobileMenu />}
            
            {/* Desktop navigation */}
            <div className={cn("flex items-center", isMobile ? "hidden" : "")}>
              {/* Cortex with submenu */}
              <NavItem
                to="#"
                icon={<Brain size={20} />}
                label="Cortex"
                active={['what', 'why', 'how'].includes(active)}
                onClick={() => {}}
                hasSubmenu={true}
              >
                {cortexSubmenu.map((item) => (
                  <SubMenuItem
                    key={item.id}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    active={active === item.id}
                    onClick={() => handleNavItemClick(item.id)}
                  />
                ))}
              </NavItem>
              
              {/* Other nav items */}
              {navItems.map((item) => (
                <NavItem
                  key={item.id}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={active === item.id}
                  onClick={() => handleNavItemClick(item.id)}
                />
              ))}
            </div>
            
            <div className="flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-lg"
                    onClick={toggleTheme}
                  >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle {theme === 'dark' ? 'light' : 'dark'} mode</p>
                </TooltipContent>
              </Tooltip>
              
              {isAuthenticated ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-primary hover:text-primary-foreground"
                      onClick={logout}
                    >
                      <LogOut size={20} />
                      <span className="font-medium hidden md:inline">Logout</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Logout</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-primary hover:text-primary-foreground"
                      onClick={handleOpenAuthModal}
                    >
                      <LogIn size={20} />
                      <span className="font-medium hidden md:inline">Login</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Login</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </nav>
        </header>
      </TooltipProvider>
      
      <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseAuthModal} />
    </>
  );
};

export default Navbar;
