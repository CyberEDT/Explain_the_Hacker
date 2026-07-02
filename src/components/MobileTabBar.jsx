import { Link, useLocation } from 'react-router-dom';
import { Home, Terminal, GitMerge, Shield, Search } from 'lucide-react';
import useDevice from '@/hooks/useDevice';

export default function MobileTabBar() {
    const location = useLocation();
    const { isIOS } = useDevice();

    const tabs = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/lab', label: 'Engine', icon: Terminal },
        { path: '/killchain', label: 'Kill Chain', icon: GitMerge },
        { path: '/tactics', label: 'Tactics', icon: Shield },
        { path: '/threat-intel', label: 'Intel', icon: Search },
    ];

    return (
        <div 
            className="fixed bottom-0 w-full z-50 flex justify-around items-center backdrop-blur-md border-t"
            style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.85)', 
                borderColor: 'var(--color-border)',
                // iOS safe area padding
                paddingBottom: isIOS ? 'env(safe-area-inset-bottom)' : '0px',
                height: isIOS ? 'calc(60px + env(safe-area-inset-bottom))' : '60px'
            }}
        >
            {tabs.map((tab) => {
                const isActive = location.pathname === tab.path || (tab.path !== '/' && location.pathname.startsWith(tab.path));
                const Icon = tab.icon;
                
                return (
                    <Link
                        key={tab.path}
                        to={tab.path}
                        className="flex flex-col items-center justify-center w-full h-full"
                        style={{
                            color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                            textDecoration: 'none',
                            transition: 'color 0.2s ease'
                        }}
                    >
                        <Icon 
                            size={20} 
                            style={{ 
                                marginBottom: '4px',
                                strokeWidth: isActive ? 2.5 : 2,
                                color: isActive ? 'var(--color-accent)' : 'inherit'
                            }} 
                        />
                        <span style={{ 
                            fontSize: '0.65rem', 
                            fontFamily: 'var(--font-mono)', 
                            fontWeight: isActive ? 600 : 400 
                        }}>
                            {tab.label}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
}
