"use client"

import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"

export default function Page() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Button
            variant="outline"
            onClick={() =>
              toast("Event has been created", {
                description: "Sunday, December 03, 2023 at 9:00 AM",
                action: {
                  label: "Undo",
                  onClick: () => console.log("Undo"),
                },
              })
            }
          >
            Show Toast
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
