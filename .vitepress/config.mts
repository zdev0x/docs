import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "代码片段",
  description: "收集一些平时工作中常用的代码片段",
  // Git 命令在部署环境中不可用时关闭 lastUpdated，避免构建失败
  lastUpdated: false,
  
  // 启用深色模式切换
  appearance: true,
  
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    
    // 搜索配置
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    },
    
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      {
        text: '代码片段',
        items: [
          { text: '常用命令', link: '/snippets/commands/' },
          { text: '配置模板', link: '/snippets/configs/' },
          { text: '实用技巧', link: '/snippets/tricks/' }
        ]
      },
      { 
        text: '前端', 
        items: [
          { text: 'JavaScript', link: '/frontend/javascript/' },
          { text: 'TypeScript', link: '/frontend/typescript/' },
          { text: 'React', link: '/frontend/react/' },
          { text: 'Vue', link: '/frontend/vue/' },
          { text: 'CSS', link: '/frontend/css/' }
        ]
      },
      { 
        text: '后端', 
        items: [
          { text: 'Node.js', link: '/backend/nodejs/' },
          { text: 'Go', link: '/backend/go/' },
          { text: 'PHP', link: '/backend/php/' }
        ]
      },
      {
        text: 'DevOps',
        items: [
          { text: 'Git', link: '/devops/git/' },
          { text: 'Docker', link: '/devops/docker/' },
          { text: 'Shell', link: '/devops/shell/' }
        ]
      },
      { text: '关于', link: '/about' }
    ],
    
    sidebar: {
      '/snippets/commands/': [
        {
          text: '常用命令',
          items: [
            { text: 'Docker 换源', link: '/snippets/commands/docker-mirror' },
            { text: '清理 Docker 镜像', link: '/snippets/commands/docker-clean' },
            { text: 'Git 清除 Tag', link: '/snippets/commands/git-tags' },
            { text: 'Ubuntu 换源', link: '/snippets/commands/ubuntu-mirror' }
          ]
        }
      ],
      '/snippets/configs/': [
        {
          text: '配置模板',
          items: [
            { text: 'Nginx 反向代理', link: '/snippets/configs/nginx-proxy' },
            { text: 'Systemd 服务', link: '/snippets/configs/systemd' }
          ]
        }
      ],
      '/snippets/tricks/': [
        {
          text: '实用技巧',
          items: [
            { text: '防抖和节流', link: '/snippets/tricks/debounce-throttle' },
            { text: '前端文件下载', link: '/snippets/tricks/download-file' },
            { text: 'CSS 常用技巧', link: '/snippets/tricks/css-tricks' }
          ]
        }
      ],
      '/frontend/javascript/': [
        {
          text: 'JavaScript',
          items: [
            { text: '数组操作', link: '/frontend/javascript/array' },
            { text: '对象处理', link: '/frontend/javascript/object' },
            { text: '异步编程', link: '/frontend/javascript/async' },
            { text: 'DOM 操作', link: '/frontend/javascript/dom' }
          ]
        }
      ],
      '/frontend/typescript/': [
        {
          text: 'TypeScript',
          items: [
            { text: '类型工具', link: '/frontend/typescript/utility-types' },
            { text: '泛型技巧', link: '/frontend/typescript/generics' },
            { text: '装饰器', link: '/frontend/typescript/decorators' }
          ]
        }
      ],
      '/frontend/react/': [
        {
          text: 'React',
          items: [
            { text: 'Hooks 技巧', link: '/frontend/react/hooks' },
            { text: '性能优化', link: '/frontend/react/performance' },
            { text: '状态管理', link: '/frontend/react/state-management' }
          ]
        }
      ],
      '/frontend/vue/': [
        {
          text: 'Vue',
          items: [
            { text: 'Composition API', link: '/frontend/vue/composition-api' },
            { text: '响应式原理', link: '/frontend/vue/reactivity' },
            { text: '组件通信', link: '/frontend/vue/component-communication' }
          ]
        }
      ],
      '/frontend/css/': [
        {
          text: 'CSS',
          items: [
            { text: '布局技巧', link: '/frontend/css/layout' },
            { text: '动画效果', link: '/frontend/css/animation' },
            { text: '响应式设计', link: '/frontend/css/responsive' }
          ]
        }
      ],
      '/backend/nodejs/': [
        {
          text: 'Node.js',
          items: [
            { text: '文件操作', link: '/backend/nodejs/file-operations' },
            { text: 'HTTP 服务', link: '/backend/nodejs/http-server' },
            { text: '中间件', link: '/backend/nodejs/middleware' }
          ]
        }
      ],
      '/backend/go/': [
        {
          text: 'Go',
          items: [
            { text: '基础语法', link: '/backend/go/basics' },
            { text: '并发编程', link: '/backend/go/concurrency' },
            { text: 'Web 开发', link: '/backend/go/web-development' }
          ]
        }
      ],
      '/backend/php/': [
        {
          text: 'PHP',
          items: [
            { text: '常用函数', link: '/backend/php/functions' },
            { text: 'Laravel', link: '/backend/php/laravel' },
            { text: '数据库操作', link: '/backend/php/database' }
          ]
        }
      ],
      '/devops/git/': [
        {
          text: 'Git',
          items: [
            { text: '常用命令', link: '/devops/git/commands' },
            { text: '分支管理', link: '/devops/git/branching' },
            { text: '冲突解决', link: '/devops/git/conflict-resolution' }
          ]
        }
      ],
      '/devops/docker/': [
        {
          text: 'Docker',
          items: [
            { text: 'Dockerfile', link: '/devops/docker/dockerfile' },
            { text: '容器管理', link: '/devops/docker/container-management' },
            { text: 'Docker Compose', link: '/devops/docker/compose' }
          ]
        }
      ],
      '/devops/shell/': [
        {
          text: 'Shell',
          items: [
            { text: 'Bash 脚本', link: '/devops/shell/bash-scripting' },
            { text: '文本处理', link: '/devops/shell/text-processing' },
            { text: '系统管理', link: '/devops/shell/system-admin' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    // GitHub 风格配置
    outline: {
      level: [2, 3],
      label: '目录'
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    darkModeSwitchLabel: '外观',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    
    lastUpdated: {
      text: '最后更新',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    }
  }
})
