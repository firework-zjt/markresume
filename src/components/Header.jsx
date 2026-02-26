import { useState, useContext, useRef, useEffect } from 'react'
import { ResumeContext } from '../App'
import { exportToPDF, exportToWord, exportToMarkdown, exportToJSON, exportToPNG } from '../utils/exportUtils'
import './Header.css'

function Header() {
  const { resumeData } = useContext(ResumeContext)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const exportMenuRef = useRef(null)

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false)
      }
    }

    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showExportMenu])

  const handleExport = async (type) => {
    setShowExportMenu(false)
    
    switch (type) {
      case 'pdf':
        await exportToPDF(resumeData)
        break
      case 'word':
        await exportToWord(resumeData)
        break
      case 'markdown':
        exportToMarkdown(resumeData)
        break
      case 'json':
        exportToJSON(resumeData)
        break
      case 'png':
        await exportToPNG()
        break
      default:
        break
    }
  }

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo">LUCKYONE RESUME ENGINE</h1>
      </div>
      <div className="header-center">
        <span className="resume-title">我的简历</span>
        <span className="auto-save">已自动保存</span>
      </div>
      <div className="header-right">
        <select className="zoom-select">
          <option>100%</option>
          <option>自适应</option>
        </select>
        <div className="export-dropdown" ref={exportMenuRef}>
          <button 
            className={`btn ${showExportMenu ? 'active' : ''}`}
            onClick={() => setShowExportMenu(!showExportMenu)}
          >
            <span>📥</span> 导出
          </button>
          {showExportMenu && (
            <div className="export-menu">
              <div className="export-menu-item" onClick={() => handleExport('pdf')}>
                <span className="export-icon">📄</span>
                <span>PDF 文档</span>
              </div>
              <div className="export-menu-item" onClick={() => handleExport('word')}>
                <span className="export-icon">📝</span>
                <span>Word 文档</span>
              </div>
              <div className="export-menu-item" onClick={() => handleExport('markdown')}>
                <span className="export-icon">📋</span>
                <span>Markdown</span>
              </div>
              <div className="export-menu-item" onClick={() => handleExport('json')}>
                <span className="export-icon">📊</span>
                <span>JSON 数据</span>
              </div>
              <div className="export-menu-item" onClick={() => handleExport('png')}>
                <span className="export-icon">🖼️</span>
                <span>PNG 图片</span>
              </div>
            </div>
          )}
        </div>
        <button className="btn">保存</button>
        <button className="btn-icon">⚙️</button>
        <button className="btn-icon">☁️</button>
      </div>
    </header>
  )
}

export default Header
