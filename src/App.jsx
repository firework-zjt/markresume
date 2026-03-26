import { useState, createContext, useContext } from 'react'
import { Xwrapper } from 'react-xarrows'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ResumePreview from './components/ResumePreview'
import Editor from './components/Editor'
import ConnectionLine from './components/ConnectionLine'
import './App.css'

// 创建上下文用于状态管理
export const ResumeContext = createContext()

function App() {
  // 当前选中的模块
  const [activeModule, setActiveModule] = useState('基本信息')
  // 当前选中的项目索引（用于工作经历、项目经历等列表项）
  const [activeItemIndex, setActiveItemIndex] = useState(0)
  // 自定义模块列表
  const [customModules, setCustomModules] = useState([])
  // 模块顺序（包含默认模块和自定义模块）
  const [moduleOrder, setModuleOrder] = useState(['基本信息', '工作经历', '教育背景', '技能清单', '项目经历'])
  // 模块图标映射
  const [moduleIcons, setModuleIcons] = useState({
    '基本信息': '👤',
    '工作经历': '💼',
    '教育背景': '🎓',
    '技能清单': '⚡',
    '项目经历': '📁'
  })

  // 简历样式配置
  const [resumeStyles, setResumeStyles] = useState({
    primaryColor: '#9c27b0',
    fontSize: 'medium',
    lineHeight: 'normal'
  })
  
  // 简历数据
  const [resumeData, setResumeData] = useState({
    基本信息: {
      姓名: '张三',
      职位: '高级前端工程师',
      电话: '138-0000-0000',
      邮箱: 'zhangsan@example.com',
      地址: '北京',
      个人网站: 'zhangsan.dev',
      GitHub: 'zhangsan',
      自我介绍: '5年前端开发经验,擅长Vue/React生态与工程化建设。',
      头像: ''
    },
    工作经历: [
      {
        职位: '高级前端工程师',
        公司: '字节跳动',
        开始时间: '2022-06',
        结束时间: '至今',
        地点: '北京',
        职责: '负责抖音创作者平台前端架构设计与核心功能开发',
        亮点: [
          '主导前端微服务架构升级,页面加载速度提升 40%',
          '搭建组件库,覆盖 90% 业务场景',
          '推动 TypeScript 全量迁移'
        ]
      },
      {
        职位: '前端工程师',
        公司: '阿里巴巴',
        开始时间: '2020-03',
        结束时间: '2022-05',
        地点: '杭州',
        职责: '参与淘宝商家后台的前端重构与性能优化',
        亮点: [
          '重构商品管理模块,代码量减少35%',
          '实现 SSR 方案,首屏时间缩短60%',
          '开发可视化搭建平台'
        ]
      },
      {
        职位: '前端开发',
        公司: '美团',
        开始时间: '2019-07',
        结束时间: '2020-02',
        地点: '北京',
        职责: '负责美团外卖商家端H5页面开发',
        亮点: [
          '开发离线缓存方案,弱网环境下可用性达95%',
          '参与前端监控体系建设'
        ]
      }
    ],
    教育背景: [
      {
        学校: '北京大学',
        开始时间: '2017-09',
        结束时间: '2019-06',
        学历: '硕士',
        专业: '计算机科学与技术',
        GPA: '3.8/4.0',
        亮点: [
          '校级优秀毕业论文',
          '发表SCI论文1篇'
        ]
      }
    ],
    技能清单: {
      前端框架: ['Vue 3', 'React', 'Svelte', 'Next.js', 'Nuxt'],
      工程化: ['Vite', 'Webpack', 'Rollup']
    },
    项目经历: [
      {
        项目名称: '低代码可视化搭建平台',
        角色: '核心开发者',
        描述: '企业级拖拽式页面搭建工具',
        亮点: [
          '设计插件化架构,支持50+组件扩展',
          '实现实时协同编辑功能',
          '月活用户2000+'
        ]
      }
    ]
  })

  // 更新简历数据
  const updateResumeData = (module, data) => {
    setResumeData(prev => ({
      ...prev,
      [module]: data
    }))
  }

  // 更新列表项数据（工作经历、项目经历等）
  const updateListItem = (module, index, data) => {
    setResumeData(prev => ({
      ...prev,
      [module]: prev[module].map((item, i) => i === index ? { ...item, ...data } : item)
    }))
  }

  // 添加列表项
  const addListItem = (module, newItem) => {
    setResumeData(prev => ({
      ...prev,
      [module]: [...prev[module], newItem]
    }))
  }

  // 删除列表项
  const deleteListItem = (module, index) => {
    setResumeData(prev => ({
      ...prev,
      [module]: prev[module].filter((_, i) => i !== index)
    }))
    // 如果删除的是当前选中的项，切换到第一项
    if (index === activeItemIndex && prev[module].length > 1) {
      setActiveItemIndex(0)
    }
  }

  // 添加自定义模块
  const addCustomModule = (moduleName, icon = '📝') => {
    if (!moduleName || moduleName.trim() === '') return
    const trimmedName = moduleName.trim()
    
    // 检查是否已存在
    if (moduleOrder.includes(trimmedName)) {
      alert('该模块已存在')
      return
    }

    // 添加到自定义模块列表
    setCustomModules(prev => [...prev, trimmedName])
    
    // 添加到模块顺序列表
    setModuleOrder(prev => [...prev, trimmedName])
    
    // 设置模块图标
    setModuleIcons(prev => ({
      ...prev,
      [trimmedName]: icon
    }))
    
    // 初始化模块数据（文本类型）
    setResumeData(prev => ({
      ...prev,
      [trimmedName]: {
        内容: ''
      }
    }))

    // 切换到新添加的模块
    setActiveModule(trimmedName)
    setActiveItemIndex(0)
  }

  // 删除自定义模块（不再需要确认，由组件处理）
  const deleteCustomModule = (moduleName) => {
    setCustomModules(prev => prev.filter(name => name !== moduleName))
    setModuleOrder(prev => prev.filter(name => name !== moduleName))
    setModuleIcons(prev => {
      const newIcons = { ...prev }
      delete newIcons[moduleName]
      return newIcons
    })
    setResumeData(prev => {
      const newData = { ...prev }
      delete newData[moduleName]
      return newData
    })
    
    // 如果删除的是当前选中的模块，切换到基本信息
    if (activeModule === moduleName) {
      setActiveModule('基本信息')
      setActiveItemIndex(0)
    }
  }

  // 更新模块顺序
  const updateModuleOrder = (newOrder) => {
    setModuleOrder(newOrder)
  }

  // 更新模块信息（名称和图标）
  const updateModuleInfo = (oldName, newName, icon) => {
    // 如果名称改变，需要更新所有相关数据
    if (oldName !== newName) {
      // 更新模块顺序
      setModuleOrder(prev => prev.map(name => name === oldName ? newName : name))

      // 更新自定义模块列表
      if (customModules.includes(oldName)) {
        setCustomModules(prev => prev.map(name => name === oldName ? newName : name))
      }

      // 更新图标映射
      setModuleIcons(prev => {
        const newIcons = { ...prev }
        newIcons[newName] = icon
        delete newIcons[oldName]
        return newIcons
      })

      // 更新简历数据
      setResumeData(prev => {
        const newData = { ...prev }
        if (newData[oldName]) {
          newData[newName] = newData[oldName]
          delete newData[oldName]
        }
        return newData
      })

      // 如果当前选中的是旧名称，切换到新名称
      if (activeModule === oldName) {
        setActiveModule(newName)
      }
    } else {
      // 只更新图标
      setModuleIcons(prev => ({
        ...prev,
        [oldName]: icon
      }))
    }
  }

  // 更新简历样式
  const updateResumeStyles = (newStyles) => {
    setResumeStyles(newStyles)
  }

  const contextValue = {
    activeModule,
    setActiveModule,
    activeItemIndex,
    setActiveItemIndex,
    resumeData,
    updateResumeData,
    updateListItem,
    addListItem,
    deleteListItem,
    customModules,
    addCustomModule,
    deleteCustomModule,
    moduleOrder,
    updateModuleOrder,
    moduleIcons,
    updateModuleInfo,
    resumeStyles,
    updateResumeStyles
  }

  return (
    <ResumeContext.Provider value={contextValue}>
      <Xwrapper>
        <div className="app">
          <Header />
          <div className="app-body">
            <Sidebar />
            <ResumePreview />
            <Editor />
            <ConnectionLine />
          </div>
        </div>
      </Xwrapper>
    </ResumeContext.Provider>
  )
}

export default App
