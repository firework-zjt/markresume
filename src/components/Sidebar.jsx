import { useContext, useState, useRef, useEffect } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ResumeContext } from '../App'
import ConfirmDialog from './ConfirmDialog'
import './Sidebar.css'

const defaultModules = ['基本信息', '工作经历', '教育背景', '技能清单', '项目经历']

// 常用模块模板
const commonModules = [
  { name: '工作经历', icon: '💼' },
  { name: '教育背景', icon: '🎓' },
  { name: '专业技能', icon: '⚡' },
  { name: '项目经验', icon: '🏆' }
]

// 可拖拽的模块项组件
function SortableModuleItem({ module, isCustom, activeModule, onModuleClick, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: module })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      id={`sidebar-${module}`}
      className={`module-item ${activeModule === module ? 'active' : ''} ${isCustom ? 'custom-module' : ''} ${isDragging ? 'dragging' : ''}`}
    >
      <div className="module-item-content" onClick={() => onModuleClick(module)}>
        <span 
          className="drag-handle" 
          {...attributes} 
          {...listeners}
          onClick={(e) => e.stopPropagation()}
        >
          ⋮⋮
        </span>
        <span className="module-name">{module}</span>
      </div>
      {isCustom && (
        <button
          className="btn-delete-module"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(module)
          }}
          title="删除模块"
        >
          ×
        </button>
      )}
    </li>
  )
}

function Sidebar() {
  const { 
    activeModule, 
    setActiveModule, 
    setActiveItemIndex,
    customModules,
    addCustomModule,
    deleteCustomModule,
    moduleOrder,
    updateModuleOrder
  } = useContext(ResumeContext)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const [showAddMenu, setShowAddMenu] = useState(false)
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [newModuleName, setNewModuleName] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, moduleName: '' })
  const menuRef = useRef(null)

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowAddMenu(false)
        setShowCustomInput(false)
      }
    }

    if (showAddMenu || showCustomInput) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showAddMenu, showCustomInput])

  const handleModuleClick = (module) => {
    setActiveModule(module)
    setActiveItemIndex(0) // 切换模块时重置到第一项
  }

  const handleAddCommonModule = (moduleName) => {
    // 检查是否已存在
    const allModules = [...defaultModules, ...customModules]
    if (allModules.includes(moduleName)) {
      alert('该模块已存在')
      return
    }
    addCustomModule(moduleName)
    setShowAddMenu(false)
  }

  const handleAddCustomModule = () => {
    if (newModuleName.trim()) {
      addCustomModule(newModuleName.trim())
      setNewModuleName('')
      setShowCustomInput(false)
      setShowAddMenu(false)
    }
  }

  const handleDeleteModule = (moduleName) => {
    setDeleteConfirm({ isOpen: true, moduleName })
  }

  const confirmDelete = () => {
    deleteCustomModule(deleteConfirm.moduleName)
    setDeleteConfirm({ isOpen: false, moduleName: '' })
  }

  // 处理拖拽结束
  const handleDragEnd = (event) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = moduleOrder.indexOf(active.id)
      const newIndex = moduleOrder.indexOf(over.id)
      const newOrder = arrayMove(moduleOrder, oldIndex, newIndex)
      updateModuleOrder(newOrder)
    }
  }

  // 使用moduleOrder来渲染，保持顺序
  const allModules = moduleOrder

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>简历模块</h2>
          <button 
            className="btn-add" 
            onClick={() => setShowAddMenu(!showAddMenu)}
            title="添加新模块"
          >
            +
          </button>
        </div>
        {showAddMenu && (
          <div className="add-module-menu" ref={menuRef}>
            <div className="menu-section">
              <h3 className="menu-title">常用模块</h3>
              <ul className="menu-list">
                {commonModules.map(({ name, icon }) => (
                  <li
                    key={name}
                    className="menu-item"
                    onClick={() => handleAddCommonModule(name)}
                  >
                    <span className="menu-icon">{icon}</span>
                    <span>{name}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="menu-divider"></div>
            <div className="menu-section">
              <h3 className="menu-title">其他</h3>
              {!showCustomInput ? (
                <div
                  className="menu-item"
                  onClick={() => setShowCustomInput(true)}
                >
                  <span className="menu-icon">📝</span>
                  <span>自定义文本</span>
                </div>
              ) : (
                <div className="custom-input-wrapper">
                  <input
                    type="text"
                    placeholder="输入模块名称..."
                    value={newModuleName}
                    onChange={(e) => setNewModuleName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddCustomModule()
                      } else if (e.key === 'Escape') {
                        setShowCustomInput(false)
                        setNewModuleName('')
                      }
                    }}
                    autoFocus
                    className="custom-input"
                  />
                  <div className="custom-input-actions">
                    <button onClick={handleAddCustomModule}>确定</button>
                    <button onClick={() => {
                      setShowCustomInput(false)
                      setNewModuleName('')
                    }}>取消</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={allModules}
            strategy={verticalListSortingStrategy}
          >
            <ul className="module-list">
              {allModules.map(module => {
                const isCustom = customModules.includes(module)
                return (
                  <SortableModuleItem
                    key={module}
                    module={module}
                    isCustom={isCustom}
                    activeModule={activeModule}
                    onModuleClick={handleModuleClick}
                    onDelete={handleDeleteModule}
                  />
                )
              })}
            </ul>
          </SortableContext>
        </DndContext>
      </aside>
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="删除模块"
        message={`确定要删除模块"${deleteConfirm.moduleName}"吗？此操作不可恢复。`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, moduleName: '' })}
      />
    </>
  )
}

export default Sidebar
