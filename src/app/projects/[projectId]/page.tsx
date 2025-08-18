// app/(whatever)/[projectId]/page.tsx (or your current path)
import { ProjectView } from "@/modules/projects/ui/views/project-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { FooterMessageForm } from "@/components/ui/footer-message-form";

interface Props {
  params: Promise<{ projectId: string }>;
}

const Page = async ({ params }: Props) => {
  const { projectId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.messages.getMany.queryOptions({ projectId })
  );
  void queryClient.prefetchQuery(
    trpc.projects.getOne.queryOptions({ id: projectId })
  );
  // Prefetch usage for the footer form
  void queryClient.prefetchQuery(trpc.usage.status.queryOptions());

  // page.tsx
return (
  <div className="min-h-[100svh] flex flex-col">  {/* full-page */}
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={<p>Error!</p>}>
        <Suspense fallback={<div>Loading...</div>}>
          <main className="flex-1 min-h-0">       {/* CRITICAL */}
            <ProjectView projectId={projectId} />
          </main>
        </Suspense>

        <FooterMessageForm projectId={projectId} /> {/* lives outside */}
      </ErrorBoundary>
    </HydrationBoundary>
  </div>
);

};

export default Page;
