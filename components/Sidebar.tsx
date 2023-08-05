import React from "react";
import NewDocumentButton from "./NewDocumentButton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";

const Sidebar = () => {
  const menuOptions = (
    <>
      <NewDocumentButton />

      {/* My docs */}
    </>
  );
  return (
    <div className="p-2 md:p-5 bg-gray-200 relative">
      <div className="hidden md:inline">{menuOptions}</div>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <MenuIcon className="hover:opacity-30 rounded-lg" />
          </SheetTrigger>
          <SheetContent side={"left"}>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <div> {menuOptions} </div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Sidebar;
