import { useContext } from 'react'
import { ResumeContext } from '../App'
import './ResumePreview.css'

function ResumePreview() {
  const { resumeData, activeModule, activeItemIndex, setActiveItemIndex } = useContext(ResumeContext)

  const handleItemClick = (index) => {
    setActiveItemIndex(index)
  }

  const renderBasicInfo = () => {
    const data = resumeData.基本信息
    return (
      <div 
        id="preview-基本信息"
        className={`resume-section basic-info ${activeModule === '基本信息' ? 'active-section' : ''}`}
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
        className={`resume-section ${activeModule === '工作经历' ? 'active-section' : ''}`}
      >
        <h2 className="section-title">工作经历</h2>
        {resumeData.工作经历.map((item, index) => (
          <div
            key={index}
            id={activeModule === '工作经历' && activeItemIndex === index ? `preview-工作经历-item-${index}` : undefined}
            className={`experience-item ${activeModule === '工作经历' ? 'clickable' : ''} ${activeModule === '工作经历' && activeItemIndex === index ? 'active-item' : ''}`}
            onClick={() => activeModule === '工作经历' && handleItemClick(index)}
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
        className={`resume-section ${activeModule === '教育背景' ? 'active-section' : ''}`}
      >
        <h2 className="section-title">教育背景</h2>
        {resumeData.教育背景.map((item, index) => (
          <div
            key={index}
            id={activeModule === '教育背景' && activeItemIndex === index ? `preview-教育背景-item-${index}` : undefined}
            className={`education-item ${activeModule === '教育背景' ? 'clickable' : ''} ${activeModule === '教育背景' && activeItemIndex === index ? 'active-item' : ''}`}
            onClick={() => activeModule === '教育背景' && handleItemClick(index)}
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
        className={`resume-section ${activeModule === '技能清单' ? 'active-section' : ''}`}
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
        className={`resume-section ${activeModule === '项目经历' ? 'active-section' : ''}`}
      >
        <h2 className="section-title">项目经历</h2>
        {resumeData.项目经历.map((item, index) => (
          <div
            key={index}
            id={activeModule === '项目经历' && activeItemIndex === index ? `preview-项目经历-item-${index}` : undefined}
            className={`project-item ${activeModule === '项目经历' ? 'clickable' : ''} ${activeModule === '项目经历' && activeItemIndex === index ? 'active-item' : ''}`}
            onClick={() => activeModule === '项目经历' && handleItemClick(index)}
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
