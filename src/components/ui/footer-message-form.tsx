"use client";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import MessageForm from "@/modules/projects/ui/components/message-form";

export function FooterMessageForm({ projectId }: { projectId: string }) {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "w-full border-t bg-background",
        isMobile &&
          "sticky bottom-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 pb-[env(safe-area-inset-bottom)]"
      )}
    >
      {isMobile && (
        <div className="h-6 -mt-6 bg-gradient-to-b from-transparent to-background pointer-events-none" />
      )}
      <div className="mx-auto w-full max-w-5xl p-3 pt-1">
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
}