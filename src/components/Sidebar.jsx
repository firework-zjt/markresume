import { useContext } from 'react'
import { ResumeContext } from '../App'
import './Sidebar.css'

const modules = ['基本信息', '工作经历', '教育背景', '技能清单', '项目经历']

function Sidebar() {
  const { activeModule, setActiveModule, setActiveItemIndex } = useContext(ResumeContext)

  const handleModuleClick = (module) => {
    setActiveModule(module)
    setActiveItemIndex(0) // 切换模块时重置到第一项
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>简历模块</h2>
        <button className="btn-add">+</button>
      </div>
      <ul className="module-list">
        {modules.map(module => (
          <li
            key={module}
            id={`sidebar-${module}`}
            className={`module-item ${activeModule === module ? 'active' : ''}`}
            onClick={() => handleModuleClick(module)}
          >
            {module}
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar
