import { useContext, useState } from 'react'
import { ResumeContext } from '../App'
import './Editor.css'

function Editor() {
  const {
    activeModule,
    activeItemIndex,
    resumeData,
    updateResumeData,
    updateListItem,
    addListItem,
    deleteListItem
  } = useContext(ResumeContext)

  const [newHighlight, setNewHighlight] = useState('')

  // 获取当前编辑的数据
  const getCurrentData = () => {
    if (['工作经历', '教育背景', '项目经历'].includes(activeModule)) {
      return resumeData[activeModule][activeItemIndex] || {}
    }
    return resumeData[activeModule] || {}
  }

  const currentData = getCurrentData()

  // 处理输入变化
  const handleInputChange = (field, value) => {
    if (['工作经历', '教育背景', '项目经历'].includes(activeModule)) {
      updateListItem(activeModule, activeItemIndex, { [field]: value })
    } else {
      updateResumeData(activeModule, { ...resumeData[activeModule], [field]: value })
    }
  }

  // 添加亮点
  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return
    const highlights = [...(currentData.亮点 || []), newHighlight]
    handleInputChange('亮点', highlights)
    setNewHighlight('')
  }

  // 删除亮点
  const handleDeleteHighlight = (index) => {
    const highlights = currentData.亮点.filter((_, i) => i !== index)
    handleInputChange('亮点', highlights)
  }

  // 添加新项目
  const handleAddItem = () => {
    const template = {
      工作经历: {
        职位: '',
        公司: '',
        开始时间: '',
        结束时间: '',
        地点: '',
        职责: '',
        亮点: []
      },
      教育背景: {
        学校: '',
        开始时间: '',
        结束时间: '',
        学历: '',
        专业: '',
        GPA: '',
        亮点: []
      },
      项目经历: {
        项目名称: '',
        角色: '',
        描述: '',
        亮点: []
      }
    }
    addListItem(activeModule, template[activeModule])
  }

  // 渲染基本信息编辑器
  const renderBasicInfoEditor = () => {
    return (
      <div className="editor-form">
        <div className="form-group">
          <label>姓名</label>
          <input
            type="text"
            value={currentData.姓名 || ''}
            onChange={(e) => handleInputChange('姓名', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>职位</label>
          <input
            type="text"
            value={currentData.职位 || ''}
            onChange={(e) => handleInputChange('职位', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>电话</label>
          <input
            type="text"
            value={currentData.电话 || ''}
            onChange={(e) => handleInputChange('电话', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>邮箱</label>
          <input
            type="email"
            value={currentData.邮箱 || ''}
            onChange={(e) => handleInputChange('邮箱', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>地址</label>
          <input
            type="text"
            value={currentData.地址 || ''}
            onChange={(e) => handleInputChange('地址', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>个人网站</label>
          <input
            type="text"
            value={currentData.个人网站 || ''}
            onChange={(e) => handleInputChange('个人网站', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>GitHub</label>
          <input
            type="text"
            value={currentData.GitHub || ''}
            onChange={(e) => handleInputChange('GitHub', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>自我介绍</label>
          <textarea
            value={currentData.自我介绍 || ''}
            onChange={(e) => handleInputChange('自我介绍', e.target.value)}
            rows="4"
          />
        </div>
      </div>
    )
  }

  // 渲染工作经历编辑器
  const renderWorkExperienceEditor = () => {
    return (
      <div className="editor-form">
        <div className="editor-item-header">
          <h3>经历{activeItemIndex + 1}</h3>
          {resumeData.工作经历.length > 1 && (
            <button
              className="btn-delete"
              onClick={() => deleteListItem(activeModule, activeItemIndex)}
            >
              删除
            </button>
          )}
        </div>
        <div className="form-group">
          <label>职位</label>
          <input
            type="text"
            value={currentData.职位 || ''}
            onChange={(e) => handleInputChange('职位', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>公司</label>
          <input
            type="text"
            value={currentData.公司 || ''}
            onChange={(e) => handleInputChange('公司', e.target.value)}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>开始时间</label>
            <input
              type="text"
              value={currentData.开始时间 || ''}
              onChange={(e) => handleInputChange('开始时间', e.target.value)}
              placeholder="2022-06"
            />
          </div>
          <div className="form-group">
            <label>结束时间</label>
            <input
              type="text"
              value={currentData.结束时间 || ''}
              onChange={(e) => handleInputChange('结束时间', e.target.value)}
              placeholder="至今"
            />
          </div>
        </div>
        <div className="form-group">
          <label>地点</label>
          <input
            type="text"
            value={currentData.地点 || ''}
            onChange={(e) => handleInputChange('地点', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>职责</label>
          <textarea
            value={currentData.职责 || ''}
            onChange={(e) => handleInputChange('职责', e.target.value)}
            rows="3"
          />
        </div>
        <div className="form-group">
          <label>主要亮点(项目成果等)</label>
          <div className="highlights-list">
            {currentData.亮点?.map((highlight, index) => (
              <div key={index} className="highlight-item">
                <span>{highlight}</span>
                <button onClick={() => handleDeleteHighlight(index)}>×</button>
              </div>
            ))}
            <div className="highlight-input">
              <input
                type="text"
                placeholder="输入亮点并按回车..."
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddHighlight()}
              />
              <button onClick={handleAddHighlight}>+</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 渲染教育背景编辑器
  const renderEducationEditor = () => {
    return (
      <div className="editor-form">
        <div className="editor-item-header">
          <h3>教育{activeItemIndex + 1}</h3>
          {resumeData.教育背景.length > 1 && (
            <button
              className="btn-delete"
              onClick={() => deleteListItem(activeModule, activeItemIndex)}
            >
              删除
            </button>
          )}
        </div>
        <div className="form-group">
          <label>学校</label>
          <input
            type="text"
            value={currentData.学校 || ''}
            onChange={(e) => handleInputChange('学校', e.target.value)}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>开始时间</label>
            <input
              type="text"
              value={currentData.开始时间 || ''}
              onChange={(e) => handleInputChange('开始时间', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>结束时间</label>
            <input
              type="text"
              value={currentData.结束时间 || ''}
              onChange={(e) => handleInputChange('结束时间', e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>学历</label>
            <input
              type="text"
              value={currentData.学历 || ''}
              onChange={(e) => handleInputChange('学历', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>专业</label>
            <input
              type="text"
              value={currentData.专业 || ''}
              onChange={(e) => handleInputChange('专业', e.target.value)}
            />
          </div>
        </div>
        <div className="form-group">
          <label>GPA</label>
          <input
            type="text"
            value={currentData.GPA || ''}
            onChange={(e) => handleInputChange('GPA', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>主要亮点</label>
          <div className="highlights-list">
            {currentData.亮点?.map((highlight, index) => (
              <div key={index} className="highlight-item">
                <span>{highlight}</span>
                <button onClick={() => handleDeleteHighlight(index)}>×</button>
              </div>
            ))}
            <div className="highlight-input">
              <input
                type="text"
                placeholder="输入亮点并按回车..."
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddHighlight()}
              />
              <button onClick={handleAddHighlight}>+</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 渲染技能清单编辑器
  const renderSkillsEditor = () => {
    const skills = resumeData.技能清单 || {}
    return (
      <div className="editor-form">
        {Object.entries(skills).map(([category, items]) => (
          <div key={category} className="form-group">
            <label>{category}</label>
            <input
              type="text"
              value={Array.isArray(items) ? items.join(', ') : items}
              onChange={(e) => {
                const newItems = e.target.value.split(',').map(s => s.trim()).filter(s => s)
                updateResumeData('技能清单', {
                  ...skills,
                  [category]: newItems
                })
              }}
            />
          </div>
        ))}
      </div>
    )
  }

  // 渲染项目经历编辑器
  const renderProjectEditor = () => {
    return (
      <div className="editor-form">
        <div className="editor-item-header">
          <h3>项目{activeItemIndex + 1}</h3>
          {resumeData.项目经历.length > 1 && (
            <button
              className="btn-delete"
              onClick={() => deleteListItem(activeModule, activeItemIndex)}
            >
              删除
            </button>
          )}
        </div>
        <div className="form-group">
          <label>项目名称</label>
          <input
            type="text"
            value={currentData.项目名称 || ''}
            onChange={(e) => handleInputChange('项目名称', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>角色</label>
          <input
            type="text"
            value={currentData.角色 || ''}
            onChange={(e) => handleInputChange('角色', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>描述</label>
          <textarea
            value={currentData.描述 || ''}
            onChange={(e) => handleInputChange('描述', e.target.value)}
            rows="3"
          />
        </div>
        <div className="form-group">
          <label>主要亮点</label>
          <div className="highlights-list">
            {currentData.亮点?.map((highlight, index) => (
              <div key={index} className="highlight-item">
                <span>{highlight}</span>
                <button onClick={() => handleDeleteHighlight(index)}>×</button>
              </div>
            ))}
            <div className="highlight-input">
              <input
                type="text"
                placeholder="输入亮点并按回车..."
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddHighlight()}
              />
              <button onClick={handleAddHighlight}>+</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderEditor = () => {
    switch (activeModule) {
      case '基本信息':
        return renderBasicInfoEditor()
      case '工作经历':
        return renderWorkExperienceEditor()
      case '教育背景':
        return renderEducationEditor()
      case '技能清单':
        return renderSkillsEditor()
      case '项目经历':
        return renderProjectEditor()
      default:
        return null
    }
  }

  return (
    <aside id={`editor-${activeModule}`} className={`editor active-editor`}>
      <div className="editor-header">
        <h2>正在编辑 {activeModule}</h2>
        {['工作经历', '教育背景', '项目经历'].includes(activeModule) && (
          <button className="btn-add-item" onClick={handleAddItem}>
            +添加项目
          </button>
        )}
      </div>
      <div className="editor-content">
        {renderEditor()}
      </div>
    </aside>
  )
}

export default Editor
