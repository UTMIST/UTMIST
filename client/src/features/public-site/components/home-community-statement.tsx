import Image from "next/image";

/** Selectable community copy with a decorative editor overlay. */
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
          <span aria-hidden="true" className="home-community-guide home-community-guide-left" />
          <span aria-hidden="true" className="home-community-guide home-community-guide-right" />

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
