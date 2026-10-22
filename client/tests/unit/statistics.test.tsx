import { act, render } from "@testing-library/react";

import Statistics from "@/features/public-site/components/stats";

jest.mock("react-intersection-observer", () => ({
  useInView: () => ({ ref: jest.fn(), inView: true }),
}));

it("animates supplied statistics and cancels pending frames when content changes or unmounts", () => {
  const initial = { number: "7+", description: "Synthetic" };
  const edited = { number: "12", description: "Synthetic edited" };
  let nextFrame: FrameRequestCallback = () => {};
  const request = jest.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    nextFrame = callback;
    return 42;
  });
  const cancel = jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  const now = jest.spyOn(performance, "now").mockReturnValue(0);
  try {
    const { container, rerender, unmount } = render(<Statistics items={[initial]} />);
    act(() => nextFrame(1500));
    // Verify animation reaches the supplied target, independent of site content.
    expect(container.querySelector("p")?.textContent).toBe(initial.number);
    rerender(<Statistics items={[edited]} />);
    expect(cancel).toHaveBeenCalledWith(42);
    act(() => nextFrame(1500));
    expect(container.querySelector("p")?.textContent).toBe(edited.number);
    cancel.mockClear();
    unmount();
    expect(cancel).toHaveBeenCalledWith(42);
  } finally {
    request.mockRestore();
    cancel.mockRestore();
    now.mockRestore();
  }
});
