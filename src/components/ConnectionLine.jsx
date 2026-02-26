import { useContext, useEffect, useState } from 'react'
import Xarrow from 'react-xarrows'
import { ResumeContext } from '../App'
import './ConnectionLine.css'

function ConnectionLine() {
  const { activeModule, activeItemIndex } = useContext(ResumeContext)
  const [updateKey, setUpdateKey] = useState(0)

  // 根据当前激活的模块返回连接线
  const sidebarId = `sidebar-${activeModule}`
  
  // 对于列表类型的模块，连接到具体的项目；否则连接到整个区域
  const getPreviewId = () => {
    if (['工作经历', '教育背景', '项目经历'].includes(activeModule)) {
      const itemId = `preview-${activeModule}-item-${activeItemIndex}`
      // 如果具体项目存在，使用它；否则使用整个区域
      return document.getElementById(itemId) ? itemId : `preview-${activeModule}`
    }
    return `preview-${activeModule}`
  }
  
  const previewId = getPreviewId()
  const editorId = `editor-${activeModule}`

  // 监听滚动事件，强制更新连接线位置
  useEffect(() => {
    const handleScroll = () => {
      setUpdateKey(prev => prev + 1)
    }

    // 监听所有可能的滚动容器
    const scrollContainers = [
      document.querySelector('.resume-preview'),
      document.querySelector('.editor'),
      document.querySelector('.sidebar'),
      window
    ]

    scrollContainers.forEach(container => {
      if (container) {
        container.addEventListener('scroll', handleScroll, { passive: true })
      }
    })

    // 使用 ResizeObserver 监听元素大小变化
    const resizeObserver = new ResizeObserver(() => {
      setUpdateKey(prev => prev + 1)
    })

    // 动态获取目标元素
    const getPreviewElement = () => {
      if (['工作经历', '教育背景', '项目经历'].includes(activeModule)) {
        const itemId = `preview-${activeModule}-item-${activeItemIndex}`
        return document.getElementById(itemId) || document.getElementById(`preview-${activeModule}`)
      }
      return document.getElementById(`preview-${activeModule}`)
    }

    // 观察目标元素
    const sidebarEl = document.getElementById(sidebarId)
    const previewEl = getPreviewElement()
    const editorEl = document.getElementById(editorId)

    if (sidebarEl) resizeObserver.observe(sidebarEl)
    if (previewEl) resizeObserver.observe(previewEl)
    if (editorEl) resizeObserver.observe(editorEl)

    // 使用 MutationObserver 监听 DOM 变化
    const mutationObserver = new MutationObserver(() => {
      setUpdateKey(prev => prev + 1)
    })

    if (sidebarEl) {
      mutationObserver.observe(sidebarEl, {
        attributes: true,
        attributeFilter: ['style', 'class'],
        childList: false,
        subtree: false
      })
    }
    if (previewEl) {
      mutationObserver.observe(previewEl, {
        attributes: true,
        attributeFilter: ['style', 'class'],
        childList: false,
        subtree: false
      })
    }
    if (editorEl) {
      mutationObserver.observe(editorEl, {
        attributes: true,
        attributeFilter: ['style', 'class'],
        childList: false,
        subtree: false
      })
    }

    return () => {
      scrollContainers.forEach(container => {
        if (container) {
          container.removeEventListener('scroll', handleScroll)
        }
      })
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [activeModule, activeItemIndex, sidebarId, previewId, editorId])

  // 当模块或项目索引改变时，延迟更新以确保 DOM 已渲染
  useEffect(() => {
    // 立即更新一次
    setUpdateKey(prev => prev + 1)
    
    // 延迟更新以确保 DOM 完全渲染
    const timer = setTimeout(() => {
      setUpdateKey(prev => prev + 1)
    }, 150)
    
    return () => clearTimeout(timer)
  }, [activeModule, activeItemIndex])

  // 确保 previewId 是动态计算的
  const currentPreviewId = getPreviewId()

  return (
    <>
      <Xarrow
        key={`line1-${activeModule}-${activeItemIndex}-${updateKey}`}
        start={sidebarId}
        end={currentPreviewId}
        color="#9c27b0"
        strokeWidth={2}
        dashness={{ strokeLen: 5, nonStrokeLen: 5 }}
        curveness={0.5}
        headSize={0}
        startAnchor="right"
        endAnchor="left"
        zIndex={1000}
        path="smooth"
        animateDrawing={false}
      />
      <Xarrow
        key={`line2-${activeModule}-${activeItemIndex}-${updateKey}`}
        start={currentPreviewId}
        end={editorId}
        color="#9c27b0"
        strokeWidth={2}
        dashness={{ strokeLen: 5, nonStrokeLen: 5 }}
        curveness={0}
        headSize={0}
        startAnchor="right"
        endAnchor="left"
        zIndex={1000}
        path="smooth"
        animateDrawing={false}
      />
    </>
  )
}

export default ConnectionLine
