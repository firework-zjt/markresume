import { useState, useEffect } from 'react'
import { 
  FaUser, FaBriefcase, FaGraduationCap, FaCode, FaFolder,
  FaHeart, FaTrophy, FaLanguage, FaCertificate, FaAward,
  FaStar, FaLightbulb, FaBook, FaMusic, FaGamepad,
  FaCamera, FaPalette, FaRunning, FaUtensils, FaPlane
} from 'react-icons/fa'
import './ModuleEditDialog.css'

const iconOptions = [
  { name: '用户', icon: FaUser, value: '👤' },
  { name: '工作', icon: FaBriefcase, value: '💼' },
  { name: '教育', icon: FaGraduationCap, value: '🎓' },
  { name: '技能', icon: FaCode, value: '⚡' },
  { name: '项目', icon: FaFolder, value: '📁' },
  { name: '爱好', icon: FaHeart, value: '❤️' },
  { name: '奖项', icon: FaTrophy, value: '🏆' },
  { name: '语言', icon: FaLanguage, value: '🌐' },
  { name: '证书', icon: FaCertificate, value: '📜' },
  { name: '荣誉', icon: FaAward, value: '🎖️' },
  { name: '星星', icon: FaStar, value: '⭐' },
  { name: '想法', icon: FaLightbulb, value: '💡' },
  { name: '书籍', icon: FaBook, value: '📚' },
  { name: '音乐', icon: FaMusic, value: '🎵' },
  { name: '游戏', icon: FaGamepad, value: '🎮' },
  { name: '相机', icon: FaCamera, value: '📷' },
  { name: '艺术', icon: FaPalette, value: '🎨' },
  { name: '运动', icon: FaRunning, value: '🏃' },
  { name: '美食', icon: FaUtensils, value: '🍴' },
  { name: '旅行', icon: FaPlane, value: '✈️' }
]

function ModuleEditDialog({ isOpen, moduleName, moduleIcon, onSave, onCancel }) {
  const [editedName, setEditedName] = useState(moduleName || '')
  const [selectedIcon, setSelectedIcon] = useState(moduleIcon || '📝')

  useEffect(() => {
    if (isOpen) {
      setEditedName(moduleName || '')
      setSelectedIcon(moduleIcon || '📝')
    }
  }, [isOpen, moduleName, moduleIcon])

  if (!isOpen) return null

  const handleSave = () => {
    if (editedName.trim()) {
      onSave(editedName.trim(), selectedIcon)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div className="module-edit-overlay" onClick={onCancel}>
      <div className="module-edit-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="edit-dialog-header">
          <h3>编辑模块</h3>
        </div>
        <div className="edit-dialog-body">
          <div className="form-group">
            <label>模块名称</label>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="输入模块名称"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>选择图标</label>
            <div className="icon-grid">
              {iconOptions.map(({ name, icon: Icon, value }) => (
                <div
                  key={value}
                  className={`icon-option ${selectedIcon === value ? 'selected' : ''}`}
                  onClick={() => setSelectedIcon(value)}
                  title={name}
                >
                  <span className="icon-emoji">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="edit-dialog-footer">
          <button className="btn-cancel" onClick={onCancel}>
            取消
          </button>
          <button className="btn-save" onClick={handleSave}>
            保存
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModuleEditDialog
