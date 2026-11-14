import Image from "next/image";

/** Desktop community copy with decorative editor controls and paint streaks. */
export default function HomeCommunityStatement() {
  return (
    <div className="home-community-statement">
      <div className="home-community-composition">
        <div className="home-community-meta" aria-hidden="true">
          <span className="home-community-caption">Our community, in focus</span>
          <div className="home-community-notes">
            <span className="home-community-note">
              <Image src="/home-redesign/community/review.svg" alt="" width={12.3983} height={12.3983} />
              Review Content
            </span>
            <span className="home-community-note">
              <Image src="/home-redesign/community/calendar.svg" alt="" width={8.79878} height={10.0257} />
              Student-led
            </span>
          </div>
        </div>

        <div className="home-community-copy">
          {(["left", "right"] as const).map(side => (
            <svg key={side} aria-hidden="true" focusable="false" viewBox="0 0 600 160" preserveAspectRatio="none"
              className={`home-community-stream home-community-stream-${side}`}>
              <path d="M0 18C90 0 178 26 260 66C340 104 416 100 478 89C530 80 568 82 600 88C558 93 540 109 488 122C407 144 343 152 254 130C165 107 93 95 0 116Z" />
              <path opacity=".3" d="M0 131C135 106 196 146 275 149C340 151 407 131 458 125C376 154 338 166 265 159C165 149 95 133 0 147Z" />
            </svg>
          ))}

          <Image
            src="/home-redesign/community/misty-painting.svg"
            alt=""
            aria-hidden="true"
            width={2048}
            height={2048}
            sizes="(min-width: 1490px) 276px, (min-width: 1280px) calc(34.5vw - 238px), 1px"
            className="home-community-misty"
            draggable={false}
          />

          <div className="home-community-toolbar" aria-hidden="true">
            <span className="home-community-tool home-community-tool-icon">
              <Image src="/home-redesign/community/bookmark.svg" alt="" width={15.8316} height={15.8316} />
            </span>
            <span className="home-community-tool home-community-formatting">
              <b>B</b><i>I</i><u>U</u>
              <Image src="/home-redesign/community/divider.svg" alt="" width={0.399945} height={14.9979} />
              <span>40px</span>
            </span>
            <span className="home-community-tool home-community-tool-icon">
              <Image src="/home-redesign/community/backup.svg" alt="" width={15.8316} height={15.8316} />
            </span>
            <span className="home-community-tool home-community-refine">
              <Image src="/home-redesign/community/refine.svg" alt="" width={15.8316} height={15.8316} />
              <span>Refine messaging</span>
            </span>
          </div>

          <p className="home-community-text">
            <span className="home-community-line">We&apos;re a community of 500+</span>{" "}
            <span className="home-community-line">students turning curiosity into</span>{" "}
            <span className="home-community-line">capability — through hands-on</span>{" "}
            <span className="home-selection home-community-selection"><span className="home-community-selected-text">projects, research, workshops</span></span>{" "}
            <span className="home-community-line">and conferences that prepare</span>{" "}
            <span className="home-community-line">the next generation of AI/ML</span>{" "}
            <span className="home-community-line">leaders.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
