import type { Guide } from "./canvas-drag-context";

type Props = {
  guides: Guide[];
};

export function AlignmentGuides({ guides }: Props) {
  if (!guides.length) return null;

  return (
    <>
      {guides.map((guide, i) => (
        <div
          key={i}
          className="pointer-events-none absolute"
          style={
            guide.orientation === "h"
              ? {
                  top: guide.position,
                  left: Math.min(guide.from, guide.to),
                  width: Math.abs(guide.to - guide.from),
                  height: 1,
                  background: "#E84F3D",
                  zIndex: 200,
                }
              : {
                  left: guide.position,
                  top: Math.min(guide.from, guide.to),
                  width: 1,
                  height: Math.abs(guide.to - guide.from),
                  background: "#E84F3D",
                  zIndex: 200,
                }
          }
        />
      ))}
    </>
  );
}
