<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import VPLocalSearchBox from 'vitepress/dist/client/theme-default/components/VPLocalSearchBox.vue'

const input = ref('')
const activeTag = ref('all')
const showDocSearch = ref(false)
const hasLocalSearch = __VP_LOCAL_SEARCH__

const tags = [
  { label: '全部', key: 'all' },
  { label: '常用命令', key: 'commands' },
  { label: '配置模板', key: 'configs' },
  { label: '实用技巧', key: 'tricks' },
  { label: '前端', key: 'frontend' },
  { label: '后端', key: 'backend' },
  { label: 'DevOps', key: 'devops' }
]

const cards = [
  {
    title: 'Docker 换源',
    desc: '常用 Docker Registry 与替换脚本。',
    tag: '常用命令',
    key: 'commands',
    href: '/snippets/commands/docker-mirror'
  },
  {
    title: '清理 Docker 镜像',
    desc: '批量移除 none 镜像与缓存。',
    tag: '常用命令',
    key: 'commands',
    href: '/snippets/commands/docker-clean'
  },
  {
    title: 'Git 清除 Tag',
    desc: '脚本式移除远程 & 本地 Tag。',
    tag: '常用命令',
    key: 'commands',
    href: '/snippets/commands/git-tags'
  },
  {
    title: 'Nginx 反向代理',
    desc: 'TLS、负载均衡、路径转发模板。',
    tag: '配置模板',
    key: 'configs',
    href: '/snippets/configs/nginx-proxy'
  },
  {
    title: 'Systemd 服务',
    desc: '服务守护与自启配置示例。',
    tag: '配置模板',
    key: 'configs',
    href: '/snippets/configs/systemd'
  },
  {
    title: '下载工具函数',
    desc: '前端文件下载工具集合。',
    tag: '实用技巧',
    key: 'tricks',
    href: '/snippets/tricks/download-file'
  },
  {
    title: 'JavaScript 异步',
    desc: 'Promise / Async / 并发控制。',
    tag: '前端',
    key: 'frontend',
    href: '/frontend/javascript/async'
  },
  {
    title: 'TypeScript 工具类型',
    desc: '实用 Utility Type 速查。',
    tag: '前端',
    key: 'frontend',
    href: '/frontend/typescript/utility-types'
  },
  {
    title: 'React Hooks',
    desc: '常见自定义 Hook 实例。',
    tag: '前端',
    key: 'frontend',
    href: '/frontend/react/hooks'
  },
  {
    title: 'Node.js 文件操作',
    desc: '读写、流、目录批处理。',
    tag: '后端',
    key: 'backend',
    href: '/backend/nodejs/file-operations'
  },
  {
    title: 'Go 并发笔记',
    desc: 'goroutine、channel、context。',
    tag: '后端',
    key: 'backend',
    href: '/backend/go/concurrency'
  },
  {
    title: 'PHP Laravel 入门',
    desc: '常见 Artisan 命令与注意事项。',
    tag: '后端',
    key: 'backend',
    href: '/backend/php/laravel'
  },
  {
    title: 'Docker Compose 模板',
    desc: '一键启动常见服务的模板。',
    tag: 'DevOps',
    key: 'devops',
    href: '/devops/docker/compose'
  },
  {
    title: 'Shell 常用脚本',
    desc: '批量处理与系统管理脚本。',
    tag: 'DevOps',
    key: 'devops',
    href: '/devops/shell/'
  },
  {
    title: 'Git 分支管理',
    desc: '提交规范、分支策略与脚本。',
    tag: 'DevOps',
    key: 'devops',
    href: '/devops/git/branching'
  }
]

const filteredCards = computed(() => {
  return cards.filter(card => {
    return activeTag.value === 'all' || card.key === activeTag.value
  })
})

function openDocSearch() {
  if (!hasLocalSearch) return
  if (typeof window !== 'undefined') {
    try {
      window.sessionStorage.setItem('vitepress:local-search-filter', input.value)
    } catch (_) {}
  }
  showDocSearch.value = true
}

function handleInputFocus() {
  if (!hasLocalSearch) return
  openDocSearch()
}

onMounted(() => {
  if (typeof document !== 'undefined') {
    document.body.classList.add('home-hide-search')
  }
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.classList.remove('home-hide-search')
  }
})
</script>

<template>
  <div class="home">
    <section class="search-bar shell">
      <div class="search-input">
        <input
          v-model="input"
          :readonly="!hasLocalSearch"
          type="text"
          placeholder="输入关键字即可打开全文搜索"
          aria-label="全文搜索"
          @focus="handleInputFocus"
          @keydown.enter.prevent="openDocSearch"
        />
      </div>
    </section>

    <section class="tag-filter shell">
      <div class="tag-list">
        <button
          v-for="tag in tags"
          :key="tag.key"
          type="button"
          :class="['tag', { active: activeTag === tag.key }]"
          @click="activeTag = tag.key"
        >
          {{ tag.label }}
        </button>
      </div>
    </section>

    <section class="card-grid shell">
      <article v-for="card in filteredCards" :key="card.title">
        <div class="card__body">
          <p class="card__tag">{{ card.tag }}</p>
          <h3><a :href="card.href">{{ card.title }}</a></h3>
          <p class="card__desc">{{ card.desc }}</p>
        </div>
      </article>
      <p v-if="!filteredCards.length" class="empty">暂无匹配内容</p>
    </section>

    <section class="motto shell">
      不积跬步，无以至千里；不积小流，无以成江海。
    </section>
    <VPLocalSearchBox
      v-if="hasLocalSearch && showDocSearch"
      @close="showDocSearch = false"
    />
  </div>
</template>

<style scoped>
.home {
  padding: 2rem 0 3rem;
  color: var(--vp-c-text-1);
}

.shell {
  width: min(1200px, 100%);
  margin: 0 auto;
  padding: 0 1.5rem;
}

.search-bar {
  margin-bottom: 1rem;
}

.search-bar input {
  width: 100%;
  border: 1px solid var(--vp-panel-border);
  border-radius: 12px;
  padding: 0.85rem 1.2rem;
  font-size: 1rem;
  background: var(--vp-c-bg);
}

.search-hint {
  margin: 0.5rem 0 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
}

.tag-filter {
  margin-bottom: 1.5rem;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  border: 1px solid var(--vp-panel-border);
  border-radius: 999px;
  background: var(--vp-c-bg);
  padding: 0.4rem 0.95rem;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
  transition: background 0.2s, border-color 0.2s;
}

.tag.active {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}

.card-grid article {
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 18px;
  background: var(--vp-c-bg-soft);
  padding: 1.25rem 1.4rem;
}

.card__tag {
  margin: 0 0 0.35rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.card__body h3 {
  margin: 0 0 0.4rem;
  font-size: 1.1rem;
}

.card__body h3 a {
  text-decoration: none;
  color: var(--vp-c-text-1);
}

.card__body h3 a:hover {
  color: var(--vp-c-brand-1);
}

.card__desc {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
}

.empty {
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem 0;
  color: var(--vp-c-text-2);
}

.motto {
  margin-top: 2rem;
  text-align: center;
  color: var(--vp-c-text-2);
  letter-spacing: 0.04em;
}
</style>
