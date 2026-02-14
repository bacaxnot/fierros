"use client";

import { Settings } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "~/components/ui/sheet";
import { SettingsForm } from "./settings-form";
import { useState } from "react";

export function SettingsSheet() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="pointer-events-auto"
        onClick={() => setOpen(true)}
      >
        <Settings className="size-5" />
        <span className="sr-only">Settings</span>
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Settings</SheetTitle>
            <SheetDescription>
              Configure your AI assistant preferences.
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-4">
            <SettingsForm />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
