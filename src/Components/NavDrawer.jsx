/* eslint-disable react/prop-types */
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { THEME } from '@pages/Theme';
import Scroll from '@components/Scroll';
import { RiLogoutBoxFill } from 'react-icons/ri';

const NavDrawer = ({ open, onClose, links = [], di }) => {
  return (
    <Sheet open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <SheetContent
        side="left"
        showCloseButton={false}
        overlayClassName="!inset-x-0 !top-0 !bottom-16 bg-black/25 !backdrop-blur-sm"
        className="retroui-scope !top-0 !bottom-16 !h-auto !w-[26rem] sm:!max-w-[26rem] p-4 flex flex-col gap-4 [clip-path:inset(-24px_-24px_0_-24px)] data-[side=left]:data-starting-style:!translate-x-[-26rem] data-[side=left]:data-ending-style:!translate-x-[-26rem]"
        style={{
          '--popover': THEME.SECONDARY.bg,
          '--popover-foreground': THEME.SECONDARY.textColor,
          '--border': THEME.SECONDARY.borderColor,
          '--sidebar-foreground': THEME.SECONDARY.textColor,
          '--secondary': THEME.ACTIVE.bg,
          '--secondary-foreground': THEME.ACTIVE.textColor,
          '--secondary-hover': THEME.ACTIVE_BUTTON.bg,
          '--destructive': THEME.DANGER.bg,
          '--card': THEME.ACTIVE.bg,
          '--card-foreground': THEME.ACTIVE.textColor,
        }}
      >
        <SheetHeader className="p-0">
          <SheetTitle className="text-center text-2xl text-sidebar-foreground" style={{ fontFamily: "'VT323', sans-serif" }}>Navigation</SheetTitle>
          <SheetDescription className="sr-only">Application navigation menu</SheetDescription>
        </SheetHeader>
        <Separator className="bg-border" />
        <Scroll className="w-full grow !pr-1">
          <div className="w-full grid grid-cols-2 gap-3">
            {links.map((e, i) => {
              const uniconUrl = di?.hosts?.UNICON?.url ?? '';
              const isLocal = di?.hosts?.UNICON?.type?.toLowerCase() === 'local' || uniconUrl.includes('.local.');
              if (!e.show || (e.local_only && !isLocal)) return null;
              const isActive = '#' + e.url === window.location.hash;
              if (isActive) {
                return (
                  <Button
                    key={i}
                    variant="default"
                    className="w-full !py-3"
                    style={{ '--primary': THEME.SUCCESS.bg, '--primary-foreground': THEME.SUCCESS.textColor, '--primary-hover': THEME.SUCCESS_DARK.bg }}
                  >
                    {e.text}
                  </Button>
                );
              }
              return (
                <Button
                  key={i}
                  variant="secondary"
                  className="w-full !py-3"
                  onClick={() => {
                    localStorage.setItem('tip', e.tip ?? 'Have a nice day!');
                    onClose();
                    di.navigate(e.url);
                  }}
                >
                  {e.text}
                </Button>
              );
            })}
          </div>
        </Scroll>
        <Separator className="bg-border" />
        <Card className="flex flex-row items-center justify-between p-2 gap-2">
          <div
            className="grow flex items-center gap-3 cursor-pointer min-w-0"
            onClick={() => { onClose(); di.navigate('/profile'); }}
          >
            <div className="shrink-0 rounded-xl flex items-center justify-center text-2xl w-14 h-14 bg-black/50">
              {(localStorage.getItem('business_name') ?? 'Unknown Business').charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col grow min-w-0">
              <p className="text-lg w-full text-start overflow-hidden text-ellipsis whitespace-nowrap">
                {localStorage.getItem('business_name') ?? 'Unknown Business'}
              </p>
              <span className="text-sm opacity-50 w-full text-start">Profile</span>
            </div>
          </div>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => {
              di.clearLocalStorage();
              onClose();
              di.navigate('/login');
            }}
          >
            <RiLogoutBoxFill className="text-xl" />
          </Button>
        </Card>
      </SheetContent>
    </Sheet>
  );
};

export default NavDrawer;
