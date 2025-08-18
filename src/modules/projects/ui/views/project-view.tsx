"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { MessagesContainer } from "../components/messages-container";
import { Fragment } from "@/generated/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectHeader } from "../components/project-header";
import { FragmentWeb } from "../components/fragment-web";
import { Code, Crown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileExplorer } from "@/components/file-explorer";
import { UserControl } from "@/components/user-control";
import { useAuth } from "@clerk/nextjs";
import { ErrorBoundary } from "react-error-boundary";
import { useIsMobile } from "@/hooks/use-mobile";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const { has } = useAuth();
  const hasProAccess = has?.({ plan: "pro" });
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("preview");
  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <Tabs
        className="flex flex-col h-screen"
        defaultValue="preview"
        value={tabState}
        onValueChange={(v) => setTabState(v as "preview" | "code")}
      >
        <ErrorBoundary fallback={<p>Project Header Error</p>}>
          <Suspense fallback={<p className="p-2">Loading project…</p>}>
            <ProjectHeader projectId={projectId}>
              <div className="order-1 ml-auto flex items-center gap-2">
                {!hasProAccess && (
                  <Button asChild size="sm" variant="tertiary" className="gap-2">
                    <Link href="/pricing">
                      <Crown /> Upgrade
                    </Link>
                  </Button>
                )}
                <UserControl />
              </div>
              <TabsList className="order-2 basis-full flex items-center justify-center gap-1 rounded-md border bg-muted/50 p-1">
                <TabsTrigger
                  value="preview"
                  className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-muted-foreground data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>Demo</span>
                </TabsTrigger>
                <TabsTrigger
                  value="code"
                  className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-muted-foreground data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-colors"
                >
                  <Code className="h-4 w-4" />
                  <span>Code</span>
                </TabsTrigger>
              </TabsList>
            </ProjectHeader>
          </Suspense>
        </ErrorBoundary>
        <div className="flex flex-col flex-1 overflow-hidden">
          <ErrorBoundary fallback={<p>Messages Container Error</p>}>
            <Suspense fallback={<div className="p-2">Loading messages…</div>}>
              <MessagesContainer
                projectId={projectId}
                activeFragment={activeFragment}
                setActiveFragment={setActiveFragment}
              />
            </Suspense>
          </ErrorBoundary>
          <TabsContent value="preview" className="flex-1 overflow-auto border-t">
            {activeFragment ? (
              <FragmentWeb data={activeFragment} />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a fragment to preview
              </div>
            )}
          </TabsContent>
          <TabsContent value="code" className="flex-1 overflow-auto border-t">
            {!!activeFragment?.files && (
              <FileExplorer files={activeFragment.files as { [path: string]: string }} />
            )}
          </TabsContent>
        </div>
      </Tabs>
    );
  }
  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={35} className="flex flex-col min-h-0">
          <ErrorBoundary fallback={<p>Project Header Error</p>}>
            <Suspense fallback={<p className="p-2">Loading project…</p>}>
              <ProjectHeader projectId={projectId} />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary fallback={<p>Messages Container Error</p>}>
            <Suspense fallback={<div className="p-2">Loading messages…</div>}>
              <MessagesContainer
                projectId={projectId}
                activeFragment={activeFragment}
                setActiveFragment={setActiveFragment}
              />
            </Suspense>
          </ErrorBoundary>
        </ResizablePanel>

        <ResizableHandle className="hover:bg-primary transition-colors" />

        <ResizablePanel defaultSize={65} minSize={50}>
          <Tabs
            className="h-full"
            defaultValue="preview"
            value={tabState}
            onValueChange={(v) => setTabState(v as "preview" | "code")}
          >
            {/* Header: tabs left, Upgrade right */}
            <div className="w-full flex items-center gap-2 border-b px-2 py-2">
              <TabsList className="flex items-center gap-1 rounded-md border bg-muted/50 p-1">
                <TabsTrigger
                  value="preview"
                  className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-muted-foreground data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>Demo</span>
                </TabsTrigger>

                <TabsTrigger
                  value="code"
                  className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-muted-foreground data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-colors"
                >
                  <Code className="h-4 w-4" />
                  <span>Code</span>
                </TabsTrigger>
              </TabsList>

              <div className="ml-auto flex items-center gap-x-2">
                {!hasProAccess && (
                  <Button asChild size="sm" variant="tertiary" className="gap-2">
                    <Link href="/pricing">
                      <Crown /> Upgrade
                    </Link>
                  </Button>
                )}
                <UserControl />
              </div>
            </div>

            <TabsContent value="preview" className="h-[calc(100%-49px)]">
              {activeFragment ? (
                <FragmentWeb data={activeFragment} />
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Select a fragment to preview
                </div>
              )}
            </TabsContent>

            <TabsContent value="code" className="min-h-0">
              {!!activeFragment?.files && (
                <FileExplorer files={activeFragment.files as { [path: string]: string }} />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
