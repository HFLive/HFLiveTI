import { GROUP_KEYS } from "./scoring.js";
import { results } from "../data/results.js";

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const pad = (value) => String(value).padStart(2, "0");

export function renderHome(totalQuestions) {
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
          <img src="/assets/hflive-round.png" alt="" />
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

export function renderQuestion({
  question,
  optionOrder,
  currentIndex,
  total,
  selectedOptionId,
}) {
  const orderedOptions = optionOrder.map((optionId) =>
    question.options.find((option) => option.id === optionId),
  );
  const progress = ((currentIndex + 1) / total) * 100;

  return `
    <main class="screen quiz-screen" data-screen="quiz" data-question-id="${question.id}">
      <header class="topbar">
        <button class="wordmark wordmark-button" type="button" data-action="home" aria-label="返回首页">
          <span class="live-dot" aria-hidden="true"></span>
          HFLIVE
        </button>
        <span class="question-count">${pad(currentIndex + 1)} / ${pad(total)}</span>
      </header>

      <div class="progress-track" aria-label="答题进度 ${currentIndex + 1} / ${total}">
        <span style="width: ${progress}%"></span>
      </div>

      <section class="question-card">
        <p class="eyebrow">QUESTION ${pad(currentIndex + 1)}</p>
        <h1>${escapeHtml(question.text)}</h1>
        <div class="option-list" role="radiogroup" aria-label="请选择一个答案">
          ${orderedOptions
            .map((option, index) => {
              const selected = option.id === selectedOptionId;
              return `
                <button
                  class="option-button${selected ? " is-selected" : ""}"
                  type="button"
                  role="radio"
                  aria-checked="${selected}"
                  data-action="answer"
                  data-option-id="${option.id}"
                >
                  <span class="option-index">${String.fromCharCode(65 + index)}</span>
                  <span class="option-text">${escapeHtml(option.text)}</span>
                  <span class="option-mark" aria-hidden="true">${selected ? "●" : "○"}</span>
                </button>
              `;
            })
            .join("")}
        </div>
      </section>

      <footer class="quiz-footer">
        ${
          currentIndex > 0
            ? '<button class="text-button" type="button" data-action="back">← 上一题</button>'
            : "<span></span>"
        }
        <span>跟着第一感觉选择</span>
      </footer>
    </main>
  `;
}

export function renderLoading() {
  return `
    <main class="screen loading-screen" data-screen="loading" aria-live="polite">
      <div class="loading-signal" aria-hidden="true">
        <span></span><span></span><span></span><span></span>
      </div>
      <p class="eyebrow">SIGNAL MATCHING</p>
      <h1>正在接入你的现场频道</h1>
      <p>整理选择 · 匹配倾向 · 生成结果</p>
    </main>
  `;
}

export function renderResult({
  primaryKey,
  secondaryKey,
  scores,
  leadScore = 0,
  leadPrimaryCount = 0,
  leadMaxScore = 1,
}) {
  const primary = results[primaryKey];
  const secondary = results[secondaryKey];
  const topScore = Math.max(...Object.values(scores), 1);
  const isLeadResult = primaryKey === "lead";

  return `
    <main
      class="screen result-screen"
      data-screen="result"
      data-result="${primaryKey}"
      style="--result-color: ${primary.color}"
    >
      <header class="topbar">
        <button class="wordmark wordmark-button" type="button" data-action="home" aria-label="返回首页">
          <span class="live-dot" aria-hidden="true"></span>
          HFLIVE
        </button>
        <span class="edition">MATCH COMPLETE</span>
      </header>

      <section class="result-layout">
        <article class="result-card">
          <div class="result-stamp">
            <span>YOUR TEAM SIGNAL</span>
            <strong>${escapeHtml(primary.group)}</strong>
          </div>
          <p class="eyebrow">HFLIVE PERSONALITY RESULT</p>
          <h1>${escapeHtml(primary.title)}</h1>
          <p class="result-description">${escapeHtml(primary.description)}</p>

          <div class="role-block">
            <span class="section-label">优先体验</span>
            <div class="role-tags">
              ${primary.roles.map((role) => `<span>${escapeHtml(role)}</span>`).join("")}
            </div>
          </div>

          <div class="starter-block">
            <span class="section-label">入场提示</span>
            <p>${escapeHtml(primary.starter)}</p>
          </div>
        </article>

        <aside class="result-details">
          <div class="secondary-card">
            <span class="section-label">交叉信号</span>
            <h2>${isLeadResult ? "专业侧重" : "第二倾向"}：${escapeHtml(secondary.group)}</h2>
            <p>${
              isLeadResult
                ? "这是你在跨组统筹之外最突出的专业方向。"
                : "团队岗位彼此相连，这份倾向也会成为你的加成。"
            }</p>
          </div>

          <div class="score-card">
            <span class="section-label">信号分布</span>
            ${
              isLeadResult
                ? `
                  <div class="lead-meter">
                    <div><span>总责信号</span><b>${leadScore} / ${leadMaxScore}</b></div>
                    <div class="score-bar"><span style="width: ${(leadScore / leadMaxScore) * 100}%; background: ${primary.color}"></span></div>
                    <small>${leadPrimaryCount} 次主动接手全局决策</small>
                  </div>
                `
                : ""
            }
            <div class="score-list">
              ${GROUP_KEYS.map((key) => {
                const item = results[key];
                const width = Math.max((scores[key] / topScore) * 100, 6);
                return `
                  <div class="score-row">
                    <div><span>${escapeHtml(item.group)}</span><b>${scores[key]}</b></div>
                    <div class="score-bar"><span style="width: ${width}%; background: ${item.color}"></span></div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <div class="result-actions">
            <button class="primary-button" type="button" data-action="share">
              分享结果 <span aria-hidden="true">↗</span>
            </button>
            <button class="secondary-button" type="button" data-action="restart">重新测试</button>
          </div>
          <p class="share-status" data-share-status aria-live="polite"></p>
        </aside>
      </section>

      <footer class="result-footer">
        <span>结果代表适合优先体验的方向</span>
        <span>所有感兴趣的岗位都值得尝试</span>
      </footer>

      <dialog class="share-dialog" data-share-dialog aria-labelledby="share-dialog-title">
        <div class="share-dialog-panel">
          <div class="share-dialog-header">
            <div>
              <p class="section-label">SHARE YOUR SIGNAL</p>
              <h2 id="share-dialog-title">分享图片已生成</h2>
            </div>
            <button
              class="share-dialog-close"
              type="button"
              data-action="close-share"
              aria-label="关闭分享图片"
            >×</button>
          </div>
          <img
            class="share-preview-image"
            data-share-image
            alt="HFLive 人格测试结果分享图片"
          />
          <p class="share-save-hint">长按图片保存或分享</p>
        </div>
      </dialog>

      <button
        class="primary-button mobile-share-cta"
        type="button"
        data-action="share"
      >
        分享我的结果 <span aria-hidden="true">↗</span>
      </button>
    </main>
  `;
}
