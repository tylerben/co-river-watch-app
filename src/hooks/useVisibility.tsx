import { useState } from "react";

export type HookReturn = [boolean, (value: boolean) => void];

function useVisibility(defaultVisibility = false): HookReturn {
  const [visibility, setVisibility] = useState<boolean>(defaultVisibility);

  const handleVisibility = (value?: boolean) => {
    if (value && typeof value === "boolean") {
      setVisibility(value);
    } else {
      setVisibility((state) => !state);
    }
  };

  return [visibility, handleVisibility];
}

export default useVisibility;
