import React from "react";
import { Container } from "@sanity/ui";
import { QueryClientProvider } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";

type EventLayoutProps = {
  queryClient: QueryClient;
  children: React.ReactNode;
};

export default function EventLayout({ queryClient, children }: EventLayoutProps) {
  const minHeight = "calc(100% + 1px)"; // Used to trigger a scroll overflow

  return (
    <QueryClientProvider client={queryClient}>
      <Container
        sizing={"border"}
        width={1}
        paddingX={4}
        paddingTop={5}
        paddingBottom={9}
        style={{ minHeight }}
      >
        <div style={{ position: "sticky", height: "1px" }}></div>
        {children}
      </Container>
    </QueryClientProvider>
  );
}
