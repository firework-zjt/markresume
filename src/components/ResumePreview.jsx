import { useContext } from 'react'
import { ResumeContext } from '../App'
import './ResumePreview.css'

function ResumePreview() {
  const { resumeData, activeModule, activeItemIndex, setActiveModule, setActiveItemIndex } = useContext(ResumeContext)

  // 处理模块区域点击
  const handleSectionClick = (moduleName) => {
    setActiveModule(moduleName)
    // 如果是列表类型模块，选中第一项
    if (['工作经历', '教育背景', '项目经历'].includes(moduleName)) {
      setActiveItemIndex(0)
    }
  }

  // 处理列表项点击
  const handleItemClick = (moduleName, index) => {
    setActiveModule(moduleName)
    setActiveItemIndex(index)
  }

  const renderBasicInfo = () => {
    const data = resumeData.基本信息
    return (
      <div 
        id="preview-基本信息"
        className={`resume-section basic-info clickable-section ${activeModule === '基本信息' ? 'active-section' : ''}`}
        onClick={() => handleSectionClick('基本信息')}
      >
        <div className="profile-header">
          {data.头像 && <img src={data.头像} alt="头像" className="avatar" />}
          <div className="profile-info">
            <h1>{data.姓名}</h1>
            <p className="title">{data.职位}</p>
            <div className="contact-info">
              <span>📞 {data.电话}</span>
              <span>✉️ {data.邮箱}</span>
              <span>📍 {data.地址}</span>
              <span>🌐 {data.个人网站}</span>
              <span>💻 {data.GitHub}</span>
            </div>
            <p className="intro">{data.自我介绍}</p>
          </div>
        </div>
      </div>
    )
  }

  const renderWorkExperience = () => {
    return (
      <div 
        id="preview-工作经历"
        className={`resume-section clickable-section ${activeModule === '工作经历' ? 'active-section' : ''}`}
        onClick={() => handleSectionClick('工作经历')}
      >
        <h2 className="section-title">工作经历</h2>
        {resumeData.工作经历.map((item, index) => (
          <div
            key={index}
            id={`preview-工作经历-item-${index}`}
            className={`experience-item clickable ${activeModule === '工作经历' && activeItemIndex === index ? 'active-item' : ''}`}
            onClick={(e) => {
              e.stopPropagation() // 阻止事件冒泡到父元素
              handleItemClick('工作经历', index)
            }}
          >
            <div className="item-header">
              <h3>{item.职位}</h3>
              <span className="company">{item.公司}</span>
              <span className="date">{item.开始时间} - {item.结束时间}</span>
              <span className="location">{item.地点}</span>
            </div>
            <p className="responsibility">{item.职责}</p>
            <ul className="highlights">
              {item.亮点.map((highlight, i) => (
                <li key={i}>{highlight}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )
  }

  const renderEducation = () => {
    return (
      <div 
        id="preview-教育背景"
        className={`resume-section clickable-section ${activeModule === '教育背景' ? 'active-section' : ''}`}
        onClick={() => handleSectionClick('教育背景')}
      >
        <h2 className="section-title">教育背景</h2>
        {resumeData.教育背景.map((item, index) => (
          <div
            key={index}
            id={`preview-教育背景-item-${index}`}
            className={`education-item clickable ${activeModule === '教育背景' && activeItemIndex === index ? 'active-item' : ''}`}
            onClick={(e) => {
              e.stopPropagation() // 阻止事件冒泡到父元素
              handleItemClick('教育背景', index)
            }}
          >
            <div className="item-header">
              <h3>{item.学校}</h3>
              <span className="date">{item.开始时间} - {item.结束时间}</span>
            </div>
            <p>{item.学历}, {item.专业}</p>
            <p>GPA: {item.GPA}</p>
            <ul className="highlights">
              {item.亮点.map((highlight, i) => (
                <li key={i}>{highlight}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )
  }

  const renderSkills = () => {
    const skills = resumeData.技能清单
    return (
      <div 
        id="preview-技能清单"
        className={`resume-section clickable-section ${activeModule === '技能清单' ? 'active-section' : ''}`}
        onClick={() => handleSectionClick('技能清单')}
      >
        <h2 className="section-title">技能清单</h2>
        {Object.entries(skills).map(([category, items]) => (
          <div key={category} className="skills-category">
            <strong>{category}:</strong> {items.join(', ')}
          </div>
        ))}
      </div>
    )
  }

  const renderProjects = () => {
    return (
      <div 
        id="preview-项目经历"
        className={`resume-section clickable-section ${activeModule === '项目经历' ? 'active-section' : ''}`}
        onClick={() => handleSectionClick('项目经历')}
      >
        <h2 className="section-title">项目经历</h2>
        {resumeData.项目经历.map((item, index) => (
          <div
            key={index}
            id={`preview-项目经历-item-${index}`}
            className={`project-item clickable ${activeModule === '项目经历' && activeItemIndex === index ? 'active-item' : ''}`}
            onClick={(e) => {
              e.stopPropagation() // 阻止事件冒泡到父元素
              handleItemClick('项目经历', index)
            }}
          >
            <div className="item-header">
              <h3>{item.项目名称}</h3>
              <span className="role">{item.角色}</span>
            </div>
            <p className="description">{item.描述}</p>
            <ul className="highlights">
              {item.亮点.map((highlight, i) => (
                <li key={i}>{highlight}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )
  }

  return (
    <main className="resume-preview">
      {renderBasicInfo()}
      {renderWorkExperience()}
      {renderEducation()}
      {renderSkills()}
      {renderProjects()}
    </main>
  )
}

export default ResumePreview
