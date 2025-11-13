<script setup lang="ts">
const heroStats = [
  { value: '45+', label: '实用片段' },
  { value: '全栈覆盖', label: '前端 / 后端 / DevOps' },
  { value: '持续迭代', label: '来自真实项目' }
]

const quickStarts = [
  {
    href: '/backend/nodejs/file-operations',
    icon: '📁',
    title: 'Node.js 文件操作',
    desc: '读写/流/批处理统一封装',
    tag: 'Node.js'
  },
  {
    href: '/frontend/javascript/async',
    icon: '⚡',
    title: '异步编程范式',
    desc: 'Promise、Async/Await、并发控制',
    tag: 'JavaScript'
  },
  {
    href: '/frontend/typescript/utility-types',
    icon: '🧮',
    title: 'TypeScript 工具类型',
    desc: '常用 Utility Type 解释与示例',
    tag: 'TypeScript'
  }
]

const categories = [
  {
    href: '/snippets/commands/',
    icon: '⚡',
    title: '常用命令',
    desc: 'Docker、Git、Shell 运维指令速查',
    accent: 'accent-1'
  },
  {
    href: '/snippets/configs/',
    icon: '🧩',
    title: '配置模板',
    desc: 'Nginx、Systemd 等生产可用模板',
    accent: 'accent-2'
  },
  {
    href: '/snippets/tricks/',
    icon: '💡',
    title: '实用技巧',
    desc: '性能优化、调试、效率工作流',
    accent: 'accent-3'
  },
  {
    href: '/frontend/javascript/',
    icon: '🎯',
    title: '前端开发',
    desc: 'JavaScript、TypeScript、React、Vue',
    accent: 'accent-4'
  },
  {
    href: '/backend/nodejs/',
    icon: '⚙️',
    title: '后端开发',
    desc: 'Node.js、Go、PHP 常见场景',
    accent: 'accent-5'
  },
  {
    href: '/devops/docker/',
    icon: '🛠️',
    title: 'DevOps',
    desc: 'Docker、Git、CI/CD 自动化',
    accent: 'accent-6'
  }
]

const pillars = [
  {
    title: '结构化导航',
    desc: '按技术栈、场景与任务维度组织内容，快速定位需要的片段。'
  },
  {
    title: '真实可用',
    desc: '所有条目来自真实项目沉淀，并附加注意事项与推荐实践。'
  },
  {
    title: '易于扩展',
    desc: '统一化主题与卡片样式，便于后续补充新的分类。'
  }
]

const workflow = [
  {
    step: '01',
    title: '定位场景',
    desc: '通过导航或搜索聚焦专题，几秒内抵达正确页面。'
  },
  {
    step: '02',
    title: '复制改造',
    desc: '复制片段或配置模板，根据提示替换变量落地。'
  },
  {
    step: '03',
    title: '沉淀分享',
    desc: '将实践经验补充到仓库，持续完善知识体系。'
  }
]
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero__backdrop" aria-hidden="true" />
      <div class="shell hero__grid">
        <div class="hero__content">
          <p class="hero__eyebrow">全栈代码速查手册</p>
          <h1>
            <span>随取随用的</span>
            <span>开发知识基座</span>
          </h1>
          <p class="hero__lead">
            聚焦真实项目的最佳实践，从命令行到全栈开发再到 DevOps，任何时候都能快速找到可复制的代码片段与模板。
          </p>
          <div class="hero__actions">
            <a class="btn btn--primary" href="/snippets/commands/">立即开始</a>
            <a class="btn btn--ghost" href="/snippets/tricks/">浏览技巧</a>
          </div>
          <div class="hero__stats">
            <div class="stat-card" v-for="stat in heroStats" :key="stat.label">
              <p class="stat-card__value">{{ stat.value }}</p>
              <p class="stat-card__label">{{ stat.label }}</p>
            </div>
          </div>
        </div>
        <div class="hero__panel">
          <div class="panel-card">
            <p class="panel-card__title">热门专题</p>
            <div class="panel-card__list">
              <a
                v-for="link in quickStarts"
                :key="link.href"
                :href="link.href"
                class="panel-link"
              >
                <span class="panel-link__icon">{{ link.icon }}</span>
                <div class="panel-link__body">
                  <strong>{{ link.title }}</strong>
                  <p>{{ link.desc }}</p>
                </div>
                <span class="panel-link__tag">{{ link.tag }}</span>
              </a>
            </div>
          </div>
          <div class="hero__note">
            <span>✨ 实践优先</span>
            <p>所有条目都经过项目验证，并持续跟进新版本。提出改进将第一时间同步首页。</p>
          </div>
        </div>
      </div>
    </section>

    <section class="pillars shell">
      <div class="pillar-card" v-for="pillar in pillars" :key="pillar.title">
        <h3>{{ pillar.title }}</h3>
        <p>{{ pillar.desc }}</p>
      </div>
    </section>

    <section class="categories shell" id="categories">
      <div class="section-heading">
        <div>
          <p class="section-eyebrow">分类导航</p>
          <h2>按主题浏览所有知识块</h2>
        </div>
        <p class="section-desc">卡片式分组方式，聚焦每个知识域的典型场景，避免在冗长目录中迷失。</p>
      </div>
      <div class="category-grid">
        <a
          v-for="cat in categories"
          :key="cat.href"
          :href="cat.href"
          :class="['category-card', cat.accent]"
        >
          <div class="category-card__icon">{{ cat.icon }}</div>
          <div class="category-card__body">
            <h3>{{ cat.title }}</h3>
            <p>{{ cat.desc }}</p>
          </div>
        </a>
      </div>
    </section>

    <section class="workflow shell">
      <div class="section-heading">
        <div>
          <p class="section-eyebrow">使用方式</p>
          <h2>三步完成一次知识沉淀</h2>
        </div>
      </div>
      <div class="workflow-grid">
        <div class="workflow-card" v-for="item in workflow" :key="item.step">
          <span class="workflow-card__step">{{ item.step }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  margin: 0;
  padding-bottom: 4rem;
  color: var(--vp-c-text-1);
}

.shell {
  width: min(1200px, 100%);
  margin: 0 auto;
  padding: 0 1.5rem;
}

.hero {
  position: relative;
  margin: -2rem -1.5rem 3rem;
  padding: 5rem 0 4rem;
  overflow: hidden;
}

.hero__backdrop {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 10% 20%, rgba(90, 162, 255, 0.45), transparent 55%),
    radial-gradient(circle at 90% 0, rgba(244, 137, 255, 0.35), transparent 60%),
    linear-gradient(135deg, #eef3ff, #fbf2ff);
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
}

:global(.dark) .hero__backdrop {
  background: radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.2), transparent 55%),
    radial-gradient(circle at 80% 0, rgba(236, 72, 153, 0.15), transparent 60%),
    linear-gradient(135deg, #0f172a, #1e1b4b);
  border-color: rgba(148, 163, 184, 0.2);
}

.hero__grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2.5rem;
  z-index: 1;
}

.hero__content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hero__eyebrow {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.hero h1 {
  margin: 0;
  font-size: clamp(2.4rem, 4vw, 3.4rem);
  line-height: 1.1;
  letter-spacing: -0.04em;
  word-break: keep-all;
}

.hero h1 span {
  display: block;
}

.hero__lead {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.7;
  max-width: 40rem;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 1.8rem;
  border-radius: 999px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid transparent;
}

.btn--primary {
  background: linear-gradient(135deg, var(--vp-c-brand-1), #8b5cf6);
  color: #fff;
  box-shadow: 0 12px 30px rgba(59, 130, 246, 0.35);
}

.btn--primary:hover {
  transform: translateY(-2px);
}

.btn--ghost {
  border-color: rgba(99, 102, 241, 0.4);
  color: var(--vp-c-brand-1);
  background: rgba(255, 255, 255, 0.6);
}

:global(.dark) .btn--ghost {
  background: rgba(30, 41, 59, 0.4);
}

.btn--ghost:hover {
  transform: translateY(-2px);
}

.hero__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.stat-card {
  padding: 1.1rem 1.25rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(10px);
}

:global(.dark) .stat-card {
  background: rgba(15, 23, 42, 0.65);
  border-color: rgba(148, 163, 184, 0.2);
}

.stat-card__value {
  margin: 0 0 0.35rem;
  font-size: 1.4rem;
  font-weight: 700;
}

.stat-card__label {
  margin: 0;
  color: var(--vp-c-text-2);
}

.hero__panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel-card {
  padding: 1.5rem;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 25px 55px rgba(15, 23, 42, 0.15);
  backdrop-filter: blur(16px);
}

:global(.dark) .panel-card {
  background: rgba(15, 23, 42, 0.6);
  border-color: rgba(148, 163, 184, 0.15);
}

.panel-card__title {
  margin: 0 0 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.panel-card__list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.panel-link {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.9rem 1rem;
  border-radius: 16px;
  text-decoration: none;
  background: var(--vp-c-bg-soft);
  border: 1px solid rgba(99, 102, 241, 0.15);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.panel-link:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateX(4px);
}

.panel-link__icon {
  font-size: 1.5rem;
}

.panel-link__body {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.panel-link__body strong {
  color: var(--vp-c-text-1);
}

.panel-link__body p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.panel-link__tag {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.hero__note {
  padding: 1.25rem 1.5rem;
  border-radius: 20px;
  border: 1px dashed rgba(99, 102, 241, 0.5);
  background: rgba(255, 255, 255, 0.7);
  color: var(--vp-c-text-1);
}

:global(.dark) .hero__note {
  background: rgba(15, 23, 42, 0.55);
  border-color: rgba(99, 102, 241, 0.3);
}

.hero__note span {
  font-weight: 600;
}

.hero__note p {
  margin: 0.35rem 0 0;
  color: var(--vp-c-text-2);
}

.pillars {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
}

.pillar-card {
  padding: 1.5rem;
  border-radius: 20px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
}

.pillar-card h3 {
  margin: 0 0 0.4rem;
}

.pillar-card p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
}

.section-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.section-eyebrow {
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.15em;
  color: var(--vp-c-brand-1);
  margin-bottom: 0.35rem;
}

.section-heading h2 {
  margin: 0;
  font-size: 2rem;
}

.section-desc {
  margin: 0;
  max-width: 460px;
  color: var(--vp-c-text-2);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}

.category-card {
  display: flex;
  gap: 1.25rem;
  padding: 1.75rem 1.5rem;
  border-radius: 22px;
  border: 1px solid transparent;
  text-decoration: none;
  color: inherit;
  background: var(--vp-c-bg-soft);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.category-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 30px rgba(15, 23, 42, 0.12);
}

.category-card__icon {
  font-size: 2rem;
}

.category-card__body h3 {
  margin: 0 0 0.35rem;
  font-size: 1.2rem;
}

.category-card__body p {
  margin: 0;
  color: var(--vp-c-text-2);
}

.accent-1 {
  border-color: rgba(59, 130, 246, 0.4);
}

.accent-2 {
  border-color: rgba(14, 165, 233, 0.35);
}

.accent-3 {
  border-color: rgba(245, 158, 11, 0.35);
}

.accent-4 {
  border-color: rgba(147, 51, 234, 0.4);
}

.accent-5 {
  border-color: rgba(34, 197, 94, 0.4);
}

.accent-6 {
  border-color: rgba(248, 113, 113, 0.4);
}

.workflow {
  margin-top: 4rem;
}

.workflow-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.workflow-card {
  padding: 1.75rem 1.5rem;
  border-radius: 20px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.workflow-card__step {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.workflow-card h3 {
  margin: 0.75rem 0 0.5rem;
}

.workflow-card p {
  margin: 0;
  color: var(--vp-c-text-2);
}

@media (max-width: 960px) {
  .hero {
    margin-left: -1rem;
    margin-right: -1rem;
    padding: 3.5rem 0;
  }

  .hero__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .shell {
    padding: 0 1rem;
  }

  .hero h1 {
    font-size: 2.1rem;
  }

  .btn {
    width: 100%;
  }

  .section-heading h2 {
    font-size: 1.5rem;
  }
}
</style>
