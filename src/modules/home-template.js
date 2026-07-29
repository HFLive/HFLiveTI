export function renderHome() {
  return `
    <main class="screen home-screen" data-screen="home">
      <header class="topbar">
        <a class="wordmark" href="#" data-action="home" aria-label="HFLive 首页">
          <span class="live-dot" aria-hidden="true"></span>
          HFLIVE
        </a>
        <span class="edition">TEAM SIGNAL / 01</span>
      </header>

      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">HFLIVE PERSONALITY INDEX</p>
          <h1>你在直播现场，<br /><span>会是哪种角色？</span></h1>
          <p class="lead">
            回答一组轻松选择题，生成一份属于你的团队信号。
            跟着直觉回答就好。
          </p>
          <div class="hero-actions">
            <button class="primary-button" type="button" data-action="start">
              开始测试
              <span aria-hidden="true">↗</span>
            </button>
            <span class="duration">约 2 分钟</span>
          </div>
        </div>

        <div class="signal-poster" aria-hidden="true">
          <div class="poster-grid"></div>
          <img
            src="/assets/hflive-round.webp"
            alt=""
            width="400"
            height="400"
            decoding="async"
            fetchpriority="high"
          />
          <span class="poster-code">HF / LIVE</span>
          <span class="poster-state">ON AIR</span>
        </div>
      </section>

      <footer class="home-footer">
        <span>CAMERA</span><span>TECH</span><span>AUDIO</span><span>LIGHT</span>
      </footer>
    </main>
  `;
}
