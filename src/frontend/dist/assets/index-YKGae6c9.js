import { r as reactExports, i as React } from "./index-CebTjiTu.js";
import { e as useLayoutEffect2 } from "./index-BIROJ8_8.js";
var useReactId = React[" useId ".trim().toString()] || (() => void 0);
var count = 0;
function useId(deterministicId) {
  const [id, setId] = reactExports.useState(useReactId());
  useLayoutEffect2(() => {
    setId((reactId) => reactId ?? String(count++));
  }, [deterministicId]);
  return id ? `radix-${id}` : "";
}
export {
  useId as u
};
