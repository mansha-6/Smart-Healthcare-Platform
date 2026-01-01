import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

export function TooltipWrapper({ text, children }) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {children}
        </Tooltip.Trigger>
        <Tooltip.Portal>
            <Tooltip.Content 
                side="top" 
                align="center" 
                className="z-50 rounded-md bg-slate-900 text-white text-xs px-2 py-1 shadow-md animate-slideUpAndFade"
                sideOffset={5}
            >
            {text}
            <Tooltip.Arrow className="fill-slate-900" />
            </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
