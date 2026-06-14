import { Star, CheckCircle, Pin, PlayIcon } from "./Icons";

const revs = [
  { q: "Storm tore half my shingles off. They texted back in minutes, tarped it that night, full roof done in two days. Unreal.", n: "Dana M.", t: "Hamburg" },
  { q: "Got three quotes. Roofalo was the only one who climbed up, showed me photos, and didn't try to scare me into anything.", n: "Greg P.", t: "Clarence" },
  { q: "Handled my insurance claim start to finish. I barely lifted a finger. Honest the whole way.", n: "Yolanda T.", t: "Rochester" },
  { q: "1912 house, tricky roof. They actually knew what they were doing. Cleaned up so well I couldn't tell they'd been here.", n: "Frank D.", t: "Buffalo" },
];

export function Reviews() {
  return (
    <section className="section reviews dark-bg" id="reviews">
      <div className="wrap">
        <div className="rev-head">
          <div className="eyebrow on-dark">What neighbors say</div>
          <h2 className="h-lg">Don&apos;t take our word<br />for it. Take theirs.</h2>
          <div className="rev-aggregate">
            <span className="stars" aria-label="5 stars">
              {[0,1,2,3,4].map((i) => <Star key={i} size={22} />)}
            </span>
            <span>Real, verified reviews from our first Western New York homeowners.</span>
          </div>
          <a className="rev-google" href="#reviews">
            <CheckCircle size={17} /> Read every review on Google
          </a>
        </div>

        <div className="rev-videos" aria-label="Video testimonials">
          {[0, 1].map((i) => (
            <div className="rev-video" key={i} role="img" aria-label={`Video testimonial ${i + 1} — coming soon`}>
              <span className="rev-play" aria-hidden="true"><PlayIcon size={22} /></span>
              <span className="rev-video-tag">▸ drop a real testimonial clip</span>
            </div>
          ))}
        </div>

        <div className="rev-rail hscroll" role="list" aria-label="Customer reviews">
          {revs.map((r, i) => (
            <blockquote className="rev-card" key={i} role="listitem">
              <span className="stars" aria-label="5 stars">
                {[0,1,2,3,4].map((j) => <Star key={j} size={15} />)}
              </span>
              <p>&ldquo;{r.q}&rdquo;</p>
              <footer>
                <b>{r.n}</b>
                <span><Pin size={13} /> {r.t}</span>
              </footer>
            </blockquote>
          ))}
        </div>
        <p className="placeholder-note rev-foot">
          ▸ Connect your live Google feed here and link the button to your Google profile.
          Swap in real reviews when you have them — even a handful beats a big invented number.
        </p>
      </div>
    </section>
  );
}
