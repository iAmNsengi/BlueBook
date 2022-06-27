import React from "react";
import { useThemeStore } from "../store/useThemeStore";

const SettingsPage = () => {
  const PREVIEW_MESSAGES = [
    { id: 1, content: "Hey! How's it going mhen!?", isSent: false },
    {
      id: 2,
      content: "Doing great man, Just working on some features",
      isSent: true,
    },
  ];
  const { theme, setTheme } = useThemeStore();
  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70">
            Choose a theme of your preference
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
