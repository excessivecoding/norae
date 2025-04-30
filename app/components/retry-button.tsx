"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export function RetryButton() {
  const router = useRouter();

  const handleRetry = () => {
    // Refresh the current page
    router.refresh();
  };

  return (
    <Button
      onClick={handleRetry}
      variant="outline"
      className="mt-2 flex items-center gap-2 bg-white hover:bg-gray-50"
    >
      <RefreshCw className="h-4 w-4" />
      Retry
    </Button>
  );
}
