import { useState, useContext, useRef, useEffect } from 'react'
import { ResumeContext } from '../App'
import { exportToPDF, exportToWord, exportToMarkdown, exportToJSON, exportToPNG } from '../utils/exportUtils'
import './Header.css'

function Header() {
  const { resumeData, resumeStyles, updateResumeStyles } = useContext(ResumeContext)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showStyleMenu, setShowStyleMenu] = useState(false)
  const exportMenuRef = useRef(null)
  const styleMenuRef = useRef(null)

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false)
      }
      if (styleMenuRef.current && !styleMenuRef.current.contains(event.target)) {
        setShowStyleMenu(false)
      }
    }

    if (showExportMenu || showStyleMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showExportMenu, showStyleMenu])

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

  const handleStyleChange = (key, value) => {
    updateResumeStyles({
      ...resumeStyles,
      [key]: value
    })
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
        <div className="style-dropdown" ref={styleMenuRef}>
          <button
            className={`btn-icon ${showStyleMenu ? 'active' : ''}`}
            onClick={() => setShowStyleMenu(!showStyleMenu)}
            title="样式设置"
          >
            🎨
          </button>
          {showStyleMenu && (
            <div className="style-menu">
              <div className="style-menu-section">
                <h3>颜色方案</h3>
                <div className="color-grid">
                  {[
                    { name: '紫色', value: '#9c27b0' },
                    { name: '蓝色', value: '#2196F3' },
                    { name: '绿色', value: '#4CAF50' },
                    { name: '红色', value: '#f44336' },
                    { name: '橙色', value: '#ff9800' },
                    { name: '黑色', value: '#333333' }
                  ].map(color => (
                    <div
                      key={color.value}
                      className={`color-option ${resumeStyles.primaryColor === color.value ? 'active' : ''}`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => handleStyleChange('primaryColor', color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              <div className="style-menu-divider"></div>
              <div className="style-menu-section">
                <h3>字体大小</h3>
                <div className="font-size-options">
                  {['small', 'medium', 'large'].map(size => (
                    <button
                      key={size}
                      className={`font-size-btn ${resumeStyles.fontSize === size ? 'active' : ''}`}
                      onClick={() => handleStyleChange('fontSize', size)}
                    >
                      {size === 'small' ? '小' : size === 'medium' ? '中' : '大'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="style-menu-divider"></div>
              <div className="style-menu-section">
                <h3>行间距</h3>
                <div className="line-height-options">
                  {['compact', 'normal', 'loose'].map(height => (
                    <button
                      key={height}
                      className={`line-height-btn ${resumeStyles.lineHeight === height ? 'active' : ''}`}
                      onClick={() => handleStyleChange('lineHeight', height)}
                    >
                      {height === 'compact' ? '紧凑' : height === 'normal' ? '标准' : '宽松'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <button className="btn-icon">☁️</button>
      </div>
    </header>
  )
}

export default Header
